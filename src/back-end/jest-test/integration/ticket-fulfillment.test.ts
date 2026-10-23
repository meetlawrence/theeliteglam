import { describe, expect, test, beforeAll, afterAll, beforeEach, jest } from "@jest/globals";

const mockSendEmail = jest.fn(
  (_to: string, _payload: Record<string, unknown>): Promise<{ success: boolean }> =>
    Promise.resolve({ success: true }),
);

const mockUploadQRCode = jest.fn((_base64: string): Promise<string> =>
  Promise.resolve("https://cdn.example.com/qr.png"),
);

jest.unstable_mockModule("@/back-end/lib/email/resend", () => ({
  sendEmail: (to: string, payload: Record<string, unknown>) => mockSendEmail(to, payload),
}));

jest.unstable_mockModule("@/back-end/db/cloudinary", () => ({
  uploadQRCode: (base64: string) => mockUploadQRCode(base64),
}));

jest.unstable_mockModule("qrcode", () => ({
  default: {
    toDataURL: () => Promise.resolve("data:image/png;base64,AAA"),
  },
}));

const { prisma, resetPaymentTables, seedMinimalEvent, cleanupSeed } = await import("./helpers/db");
const { paymentModel } = await import("@/back-end/models/payment-model");
const { ticketService } = await import("@/back-end/services/ticket-service");

let eventId = "";
let ticketTypeId = "";

async function createSuccessPayment(quantity = 2) {
  const tx = await paymentModel.create({
    reference: `TIK-ITEST-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    purpose: "TICKET",
    gateway: "PAYSTACK",
    amount: 1500 * quantity,
    email: "itest-ticket@example.com",
    name: "Itest",
    eventId,
    ticketTypeId,
    quantity,
  });

  await paymentModel.markSuccess(tx.reference, "gw_test");
  const found = await paymentModel.findByReference(tx.reference);
  if (!found) throw new Error("payment missing");
  return found;
}

describe("ticket fulfillment (real DB)", () => {
  beforeAll(async () => {
    const seeded = await seedMinimalEvent();
    eventId = seeded.event.id;
    ticketTypeId = seeded.ticketType.id;
  });

  beforeEach(async () => {
    await resetPaymentTables(eventId);
    mockSendEmail.mockImplementation(() => Promise.resolve({ success: true }));
    mockUploadQRCode.mockImplementation(() => Promise.resolve("https://cdn.example.com/qr.png"));
  });

  afterAll(async () => {
    await cleanupSeed(eventId);
    await prisma.$disconnect();
  });

  test("fulfill creates exactly quantity tickets", async () => {
    const payment = await createSuccessPayment(2);

    const result = await ticketService.fulfill(payment);

    expect(result.success).toBe(true);

    const tickets = await prisma.ticket.findMany({
      where: { paymentTransactionId: payment.id },
    });

    expect(tickets).toHaveLength(2);
    expect(new Set(tickets.map((t) => t.ticket)).size).toBe(2);
    expect(tickets.every((t) => t.eventId === eventId)).toBe(true);
    expect(tickets.every((t) => t.ticketTypeId === ticketTypeId)).toBe(true);
    expect(mockSendEmail).toHaveBeenCalledTimes(1);
  });

  test("second fulfill does not create extra tickets", async () => {
    const payment = await createSuccessPayment(2);

    await ticketService.fulfill(payment);
    await ticketService.fulfill(payment);

    const tickets = await prisma.ticket.findMany({
      where: { paymentTransactionId: payment.id },
    });

    expect(tickets).toHaveLength(2);
  });

  test("duplicate ticket code hits P2002", async () => {
    const payment = await createSuccessPayment(1);

    await prisma.ticket.create({
      data: {
        reference: `${payment.reference}-1`,
        status: "PENDING",
        paymentTransactionId: payment.id,
        ticketTypeId,
        eventId,
        ticket: "TIK-DUPCODE",
      },
    });

    await expect(
      prisma.ticket.create({
        data: {
          reference: `${payment.reference}-2`,
          status: "PENDING",
          paymentTransactionId: payment.id,
          ticketTypeId,
          eventId,
          ticket: "TIK-DUPCODE",
        },
      }),
    ).rejects.toMatchObject({ code: "P2002" });
  });

  test("duplicate paymentTransactionId + reference hits P2002", async () => {
    const payment = await createSuccessPayment(1);

    await prisma.ticket.create({
      data: {
        reference: `${payment.reference}-1`,
        status: "PENDING",
        paymentTransactionId: payment.id,
        ticketTypeId,
        eventId,
        ticket: "TIK-AAAA1111",
      },
    });

    await expect(
      prisma.ticket.create({
        data: {
          reference: `${payment.reference}-1`,
          status: "PENDING",
          paymentTransactionId: payment.id,
          ticketTypeId,
          eventId,
          ticket: "TIK-BBBB2222",
        },
      }),
    ).rejects.toMatchObject({ code: "P2002" });
  });

  test("capacity exceeded returns 409 and creates no tickets", async () => {
    await prisma.ticketType.update({
      where: { id: ticketTypeId },
      data: { capacity: 1 },
    });

    const payment = await createSuccessPayment(2);
    const result = await ticketService.fulfill(payment);

    expect(result.success).toBe(false);
    expect(result.status).toBe(409);

    const tickets = await prisma.ticket.findMany({
      where: { paymentTransactionId: payment.id },
    });
    expect(tickets).toHaveLength(0);

    await prisma.ticketType.update({
      where: { id: ticketTypeId },
      data: { capacity: 10 },
    });
  });

  test("ticket type from another event returns 400", async () => {
    const other = await seedMinimalEvent();

    const payment = await paymentModel.create({
      reference: `TIK-ITEST-${Date.now()}-mismatch`,
      purpose: "TICKET",
      gateway: "PAYSTACK",
      amount: 1500,
      email: "itest-ticket@example.com",
      name: "Itest",
      eventId,
      ticketTypeId: other.ticketType.id,
      quantity: 1,
    });
    await paymentModel.markSuccess(payment.reference, "gw_test");
    const found = await paymentModel.findByReference(payment.reference);

    const result = await ticketService.fulfill(found!);

    expect(result.success).toBe(false);
    expect(result.status).toBe(400);
    expect(result.message).toMatch(/does not belong/i);

    await cleanupSeed(other.event.id);
  });

  test("email failure keeps created tickets", async () => {
    mockSendEmail.mockImplementation(() => Promise.resolve({ success: false }));

    const payment = await createSuccessPayment(2);
    const result = await ticketService.fulfill(payment);

    expect(result.success).toBe(false);
    expect(result.status).toBe(500);

    const tickets = await prisma.ticket.findMany({
      where: { paymentTransactionId: payment.id },
    });
    expect(tickets).toHaveLength(2);
    expect(tickets.every((t) => t.status === "PENDING")).toBe(true);
  });
});

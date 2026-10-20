import { prisma } from "@/back-end/database/db-connect";

export const TEST_IDEM_PREFIX = "itest-";

export function suiteIdemPrefix(eventId: string) {
  return `${TEST_IDEM_PREFIX}${eventId}-`;
}

export async function resetPaymentTables(eventId: string) {
  await prisma.ticket.deleteMany({ where: { eventId } });
  await prisma.contestant.deleteMany({ where: { eventId } });
  await prisma.paymentTransaction.deleteMany({ where: { eventId } });
  await prisma.idempotencyKey.deleteMany({
    where: { key: { startsWith: suiteIdemPrefix(eventId) } },
  });
}

export async function seedMinimalEvent() {
  const event = await prisma.event.create({
    data: {
      name: `Jest Event ${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
      description: "Integration test event",
      startDate: new Date("2030-01-01"),
      endDate: new Date("2030-01-02"),
      location: "Lagos",
      contestantFee: 5000,
      status: "UPCOMING",
      categories: ["FEMALE"],
    },
  });

  const ticketType = await prisma.ticketType.create({
    data: {
      name: "VIP",
      price: 1500,
      capacity: 10,
      benefits: ["Entry"],
      eventId: event.id,
    },
  });

  return { event, ticketType };
}

export async function cleanupSeed(eventId: string) {
  await resetPaymentTables(eventId);
  await prisma.ticketType.deleteMany({ where: { eventId } });
  await prisma.event.delete({ where: { id: eventId } }).catch(() => {});
}

export { prisma };
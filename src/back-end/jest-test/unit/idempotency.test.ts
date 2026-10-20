import { describe, expect, test, jest, beforeEach } from "@jest/globals";

type IdempotencyKeyRecord = {
  id: string;
  key: string;
  method: string;
  path: string;
  statusCode: number;
  response: Record<string, unknown> | null;
  createdAt: Date;
  expiresAt: Date;
};

type CreateIdempotencyArgs = {
  data: {
    key: string;
    method: string;
    path: string;
    statusCode: number;
    response: Record<string, unknown>;
    expiresAt: Date;
  };
};

type FindUniqueArgs = {
  where: { key: string };
};

type UpdateIdempotencyArgs = {
  where: { key: string };
  data: {
    statusCode: number;
    response: Record<string, unknown>;
  };
};

type DeleteArgs = {
  where: { key: string };
};

const mockCreate = jest.fn(
  (_args: CreateIdempotencyArgs): Promise<IdempotencyKeyRecord> =>
    Promise.resolve({} as IdempotencyKeyRecord)
);

const mockFindUnique = jest.fn(
  (_args: FindUniqueArgs): Promise<IdempotencyKeyRecord | null> =>
    Promise.resolve(null)
);

const mockUpdate = jest.fn(
  (_args: UpdateIdempotencyArgs): Promise<IdempotencyKeyRecord> =>
    Promise.resolve({} as IdempotencyKeyRecord)
);

const mockDelete = jest.fn(
  (_args: DeleteArgs): Promise<IdempotencyKeyRecord> =>
    Promise.resolve({} as IdempotencyKeyRecord)
);

jest.unstable_mockModule("@/back-end/database/db-connect", () => ({
  prisma: {
    idempotencyKey: {
      create: (args: CreateIdempotencyArgs) => mockCreate(args),
      findUnique: (args: FindUniqueArgs) => mockFindUnique(args),
      update: (args: UpdateIdempotencyArgs) => mockUpdate(args),
      delete: (args: DeleteArgs) => mockDelete(args),
    },
  },
}));

const {
  validateIdempotencyKey,
  claimIdempotencyKey,
  getIdempotentResponse,
  completeIdempotentResponse,
} = await import( "@/back-end/lib/utils/idempotency");

function makeRecord(
  overrides: Partial<IdempotencyKeyRecord> = {}
): IdempotencyKeyRecord {
  return {
    id: "id_1",
    key: "abc12345",
    method: "POST",
    path: "/api/payments/initialize",
    statusCode: 0,
    response: {},
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 60_000),
    ...overrides,
  };
}

describe("validateIdempotencyKey", () => {
  test("rejects null", () => {
    expect(validateIdempotencyKey(null)).toBeNull();
  });

  test("rejects short key", () => {
    expect(validateIdempotencyKey("short")).toBeNull();
  });

  test("rejects key longer than 128 chars", () => {
    expect(validateIdempotencyKey("x".repeat(129))).toBeNull();
  });

  test("accepts valid key and trims it", () => {
    expect(validateIdempotencyKey("  valid-key-12345  ")).toBe(
      "valid-key-12345"
    );
  });
});

describe("claimIdempotencyKey", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns claimed true on first insert", async () => {
    mockCreate.mockImplementation(() => Promise.resolve(makeRecord()));

    const result = await claimIdempotencyKey({
      key: "abc12345",
      method: "POST",
      path: "/api/payments/initialize",
    });

    expect(result).toEqual({ claimed: true });
    expect(mockCreate).toHaveBeenCalledTimes(1);
  });

  test("returns claimed false on unique conflict", async () => {
    mockCreate.mockImplementation(() =>
      Promise.reject({ code: "P2002" })
    );

    const result = await claimIdempotencyKey({
      key: "abc12345",
      method: "POST",
      path: "/api/payments/initialize",
    });

    expect(result).toEqual({ claimed: false });
  });

  test("rethrows unexpected errors", async () => {
    mockCreate.mockImplementation(() =>
      Promise.reject(new Error("db down"))
    );

    await expect(
      claimIdempotencyKey({
        key: "abc12345",
        method: "POST",
        path: "/api/payments/initialize",
      })
    ).rejects.toThrow("db down");
  });
});

describe("getIdempotentResponse", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns null when key does not exist", async () => {
    mockFindUnique.mockImplementation(() => Promise.resolve(null));

    const result = await getIdempotentResponse("missing-key");
    expect(result).toBeNull();
  });

  test("returns pending when statusCode is 0", async () => {
    mockFindUnique.mockImplementation(() =>
      Promise.resolve(
        makeRecord({
          statusCode: 0,
          response: {},
          expiresAt: new Date(Date.now() + 60_000),
        })
      )
    );

    const result = await getIdempotentResponse("abc12345");
    expect(result).toEqual({ pending: true });
  });

  test("returns stored response when completed", async () => {
    mockFindUnique.mockImplementation(() =>
      Promise.resolve(
        makeRecord({
          statusCode: 200,
          response: { success: true },
          expiresAt: new Date(Date.now() + 60_000),
        })
      )
    );

    const result = await getIdempotentResponse("abc12345");
    expect(result).toEqual({
      pending: false,
      statusCode: 200,
      response: { success: true },
    });
  });

  test("deletes and returns null when expired", async () => {
    mockFindUnique.mockImplementation(() =>
      Promise.resolve(
        makeRecord({
          statusCode: 200,
          response: { success: true },
          expiresAt: new Date(Date.now() - 1000),
        })
      )
    );

    mockDelete.mockImplementation(() => Promise.resolve(makeRecord()));

    const result = await getIdempotentResponse("abc12345");
    expect(result).toBeNull();
    expect(mockDelete).toHaveBeenCalledWith({ where: { key: "abc12345" } });
  });
});

describe("completeIdempotentResponse", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("updates statusCode and response", async () => {
    mockUpdate.mockImplementation(() =>
      Promise.resolve(
        makeRecord({
          statusCode: 200,
          response: { success: true },
        })
      )
    );

    await completeIdempotentResponse({
      key: "abc12345",
      statusCode: 200,
      response: { success: true },
    });

    expect(mockUpdate).toHaveBeenCalledWith({
      where: { key: "abc12345" },
      data: {
        statusCode: 200,
        response: { success: true },
      },
    });
  });
});
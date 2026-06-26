import request from "supertest";
import { createServer } from "http";
import next from "next";
import { prisma } from "../src/back-end/db/db-connect";

const timestamp = Date.now();
const uniqueEmail = `testuser-${timestamp}@pageantpro.com`;

let cookie;
let adminId;

describe("Authentication APIs", () => {
  let app: any;
  let server: any;
  beforeAll(async () => {
    app = next({ dev: true });
    await app.prepare();
    server = createServer((req, res) => app.getRequestHandler()(req, res));
    await prisma.$connect();
  });

  afterAll(async () => {
    server.close();
    await prisma.$disconnect();
  });

  // ====================== REGISTER ======================
  describe("POST /api/auth/signup", () => {
    test("should register a new contestant successfully", async () => {
      const res = await request(app).post("/api/auth/signup").send({
        name: "Test Contestant",
        email: uniqueEmail,
        password: "TestPass123!",
        gender: "FEMALE",
      });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.user.email).toBe(uniqueEmail);
      expect(res.body.user.role).toBe("SUPER_ADMIN");
    });

    test("should fail if email already exists", async () => {
      const res = await request(app).post("/api/auth/register").send({
        name: "Duplicate User",
        email: uniqueEmail, // already used above
        password: "TestPass123!",
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  // ====================== LOGIN ======================
  describe("POST /api/auth/login", () => {
    test("should login successfully", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: uniqueEmail,
        password: "TestPass123!",
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
      expect(res.body.user.email).toBe(uniqueEmail);
    });

    test("should fail with wrong password", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: uniqueEmail,
        password: "WrongPassword123!",
      });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  // ====================== GET CURRENT USER ======================
  describe("GET /api/auth/me", () => {
    let token: string;

    beforeAll(async () => {
      const loginRes = await request(app).post("/api/auth/login").send({
        email: uniqueEmail,
        password: "TestPass123!",
      });
      token = loginRes.body.token;
    });

    test("should return current user data", async () => {
      const res = await request(app).get("/api/auth/me").set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.user.email).toBe(uniqueEmail);
    });

    test("should fail without token", async () => {
      const res = await request(app).get("/api/auth/me");

      expect(res.status).toBe(401);
    });
  });
});

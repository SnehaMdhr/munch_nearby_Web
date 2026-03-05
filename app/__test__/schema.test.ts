import { loginSchema, registerSchema } from "../(auth)/schema";

describe("auth schema validation", () => {
  it("accepts valid login payload", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
      password: "secret123",
    });

    expect(result.success).toBe(true);
  });

  it("rejects login with short password", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
      password: "123",
    });

    expect(result.success).toBe(false);
  });

  it("rejects register when passwords do not match", () => {
    const result = registerSchema.safeParse({
      name: "Jane",
      email: "jane@example.com",
      role: "Customer",
      password: "secret123",
      confirmPassword: "different123",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some((i) => i.path[0] === "confirmPassword"),
      ).toBe(true);
    }
  });
});

import { describe, it, expect, vi } from "vitest";
import { withTransaction } from "../../src/db/transaction.js";

describe("Database Transaction Helper", () => {
  it("should execute BEGIN, callback, and COMMIT on success", async () => {
    const mockClient = {
      query: vi.fn().mockResolvedValue({ rows: [] }),
      release: vi.fn(),
    };
    const mockPool = {
      connect: vi.fn().mockResolvedValue(mockClient),
    };

    const result = await withTransaction(async (client) => {
      expect(client).toBe(mockClient);
      return { success: true, count: 42 };
    }, mockPool);

    expect(result).toEqual({ success: true, count: 42 });
    expect(mockClient.query).toHaveBeenCalledWith("BEGIN");
    expect(mockClient.query).toHaveBeenCalledWith("COMMIT");
    expect(mockClient.release).toHaveBeenCalled();
  });

  it("should execute ROLLBACK and rethrow on callback failure", async () => {
    const mockClient = {
      query: vi.fn().mockResolvedValue({ rows: [] }),
      release: vi.fn(),
    };
    const mockPool = {
      connect: vi.fn().mockResolvedValue(mockClient),
    };

    const testError = new Error("Unique constraint violation");

    await expect(
      withTransaction(async () => {
        throw testError;
      }, mockPool)
    ).rejects.toThrow("Unique constraint violation");

    expect(mockClient.query).toHaveBeenCalledWith("BEGIN");
    expect(mockClient.query).toHaveBeenCalledWith("ROLLBACK");
    expect(mockClient.release).toHaveBeenCalled();
  });
});

import { describe, it, expect, vi } from "vitest";
import * as userRepo from "../../src/db/repositories/userRepository.js";
import * as workspaceRepo from "../../src/db/repositories/workspaceRepository.js";
import * as memberRepo from "../../src/db/repositories/workspaceMemberRepository.js";
import * as subscriptionRepo from "../../src/db/repositories/subscriptionRepository.js";
import * as repositoryRepo from "../../src/db/repositories/repositoryRepository.js";
import * as releaseRepo from "../../src/db/repositories/releaseRepository.js";
import * as activityRepo from "../../src/db/repositories/activityRepository.js";
import * as oauthRepo from "../../src/db/repositories/oauthAccountRepository.js";

describe("Database Repositories Parameterization & Interface", () => {
  const createMockDbClient = (mockRow = { id: 1 }) => ({
    query: vi.fn().mockResolvedValue({ rows: [mockRow] }),
  });

  describe("userRepository", () => {
    it("should query with parameterized values for createUser", async () => {
      const mockClient = createMockDbClient({ id: 1, email: "alex@revio.app" });
      const user = await userRepo.createUser(
        { name: "Alex Krause", email: "alex@revio.app", passwordHash: "hashed_pwd" },
        mockClient
      );

      expect(user).toEqual({ id: 1, email: "alex@revio.app" });
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO users"),
        ["Alex Krause", "alex@revio.app", "hashed_pwd", null]
      );
    });

    it("should query with parameterized values for findUserById", async () => {
      const mockClient = createMockDbClient({ id: 10, email: "alex@revio.app" });
      const user = await userRepo.findUserById(10, mockClient);

      expect(user.id).toBe(10);
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining("SELECT id, name, email"),
        [10]
      );
    });
  });

  describe("workspaceRepository", () => {
    it("should insert workspace with serialized widget settings", async () => {
      const mockClient = createMockDbClient({ id: 5, slug: "northwind" });
      const workspace = await workspaceRepo.createWorkspace(
        {
          ownerId: 1,
          name: "Northwind Platform",
          slug: "northwind",
          url: "https://northwind.dev",
          apiKey: "rev_live_123",
          webhookSecret: "whsec_abc",
          widgetSettings: { theme: "dark", accentColor: "#FF7442", mode: "floating" },
        },
        mockClient
      );

      expect(workspace.slug).toBe("northwind");
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO workspaces"),
        [
          1,
          "Northwind Platform",
          "northwind",
          "https://northwind.dev",
          "rev_live_123",
          "whsec_abc",
          JSON.stringify({ theme: "dark", accentColor: "#FF7442", mode: "floating" }),
        ]
      );
    });

    it("should find workspaces by member user ID", async () => {
      const mockClient = {
        query: vi.fn().mockResolvedValue({
          rows: [{ id: 1, name: "Northwind", role: "admin" }],
        }),
      };
      const workspaces = await workspaceRepo.findWorkspacesByUserId(1, mockClient);

      expect(workspaces).toHaveLength(1);
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining("INNER JOIN workspace_members"),
        [1]
      );
    });
  });

  describe("workspaceMemberRepository", () => {
    it("should upsert member role", async () => {
      const mockClient = createMockDbClient({ workspace_id: 1, user_id: 2, role: "admin" });
      const member = await memberRepo.addMember(
        { workspaceId: 1, userId: 2, role: "admin" },
        mockClient
      );

      expect(member.role).toBe("admin");
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO workspace_members"),
        [1, 2, "admin"]
      );
    });
  });

  describe("subscriptionRepository", () => {
    it("should create subscription record", async () => {
      const mockClient = createMockDbClient({ id: 1, plan: "pro", status: "active" });
      const sub = await subscriptionRepo.createSubscription(
        { workspaceId: 1, plan: "pro" },
        mockClient
      );

      expect(sub.plan).toBe("pro");
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO subscriptions"),
        [1, "pro", "active", expect.any(Date), null]
      );
    });
  });

  describe("repositoryRepository", () => {
    it("should create repository with default branch", async () => {
      const mockClient = createMockDbClient({ id: 1, full_name: "northwind/platform" });
      const repo = await repositoryRepo.createRepository(
        {
          workspaceId: 1,
          githubRepoId: 987654,
          name: "platform",
          fullName: "northwind/platform",
          defaultBranch: "main",
        },
        mockClient
      );

      expect(repo.full_name).toBe("northwind/platform");
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO repositories"),
        [1, 987654, "platform", "northwind/platform", "main"]
      );
    });
  });

  describe("releaseRepository", () => {
    it("should fetch release along with its categorized release_changes", async () => {
      const mockClient = {
        query: vi
          .fn()
          .mockResolvedValueOnce({
            rows: [{ id: 1, version: "v2.14.0", title: "Granular Permissions" }],
          })
          .mockResolvedValueOnce({
            rows: [
              { id: 101, release_id: 1, category: "new", title: "Workspace access controls" },
              { id: 102, release_id: 1, category: "improved", title: "Release speed 6x" },
            ],
          }),
      };

      const release = await releaseRepo.findReleaseById(1, mockClient);

      expect(release.version).toBe("v2.14.0");
      expect(release.changes).toHaveLength(2);
      expect(release.changes[0].category).toBe("new");
      expect(mockClient.query).toHaveBeenCalledTimes(2);
    });
  });

  describe("activityRepository", () => {
    it("should support noise filtering and trust classification", async () => {
      const mockClient = createMockDbClient({ id: 1, is_ignored: false, trust_badge: "High confidence" });
      const activity = await activityRepo.createActivity(
        {
          repositoryId: 1,
          type: "pull_request",
          externalId: "1842",
          title: "feat: granular workspace RBAC",
          isIgnored: false,
          trustBadge: "High confidence",
          branch: "feat/workspace-rbac",
          commitsCount: 8,
        },
        mockClient
      );

      expect(activity.trust_badge).toBe("High confidence");
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO activities"),
        expect.arrayContaining([1, "pull_request", "1842", "feat: granular workspace RBAC"])
      );
    });

    it("should query unreleased activities with release_id IS NULL and is_ignored = false", async () => {
      const mockClient = {
        query: vi.fn().mockResolvedValue({
          rows: [{ id: 1, title: "PR #1842" }],
        }),
      };

      const unreleased = await activityRepo.findUnreleasedActivities(1, mockClient);

      expect(unreleased).toHaveLength(1);
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining("WHERE repository_id = $1 AND release_id IS NULL AND is_ignored = false"),
        [1]
      );
    });
  });

  describe("oauthAccountRepository", () => {
    it("should create/upsert OAuth account for GitHub identity", async () => {
      const mockClient = createMockDbClient({ id: 1, provider: "github", username: "alexkrause" });
      const account = await oauthRepo.createOAuthAccount(
        {
          userId: 1,
          provider: "github",
          providerUserId: 1234567,
          username: "alexkrause",
          avatarUrl: "https://avatars.githubusercontent.com/u/1234567",
        },
        mockClient
      );

      expect(account.provider).toBe("github");
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO oauth_accounts"),
        [1, "github", "1234567", "alexkrause", "https://avatars.githubusercontent.com/u/1234567", null]
      );
    });
  });
});

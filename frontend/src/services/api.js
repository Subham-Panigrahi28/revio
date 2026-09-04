const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

let authToken = localStorage.getItem("revio_auth_token") || null;

export function setAuthToken(token) {
  authToken = token;
  if (token) {
    localStorage.setItem("revio_auth_token", token);
  } else {
    localStorage.removeItem("revio_auth_token");
  }
}

export function getAuthToken() {
  return authToken;
}

async function request(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const error = new Error(data?.error?.message || "API request failed");
    error.status = res.status;
    error.code = data?.error?.code || "API_ERROR";
    error.details = data?.error?.details || null;
    throw error;
  }

  return data;
}

export const api = {
  auth: {
    register: (credentials) =>
      request("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(credentials),
      }).then((res) => {
        if (res.data?.token) setAuthToken(res.data.token);
        return res.data;
      }),

    login: (credentials) =>
      request("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      }).then((res) => {
        if (res.data?.token) setAuthToken(res.data.token);
        return res.data;
      }),

    logout: () =>
      request("/api/auth/logout", { method: "POST" }).finally(() => {
        setAuthToken(null);
      }),

    getMe: () => request("/api/auth/me").then((res) => res.data?.user),
  },

  workspaces: {
    list: () => request("/api/workspaces").then((res) => res.data?.workspaces),
    get: (id) => request(`/api/workspaces/${id}`).then((res) => res.data?.workspace),
    create: (data) =>
      request("/api/workspaces", {
        method: "POST",
        body: JSON.stringify(data),
      }).then((res) => res.data?.workspace),
    update: (id, data) =>
      request(`/api/workspaces/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }).then((res) => res.data?.workspace),
    getMembers: (id) =>
      request(`/api/workspaces/${id}/members`).then((res) => res.data?.members),
    addMember: (id, data) =>
      request(`/api/workspaces/${id}/members`, {
        method: "POST",
        body: JSON.stringify(data),
      }).then((res) => res.data?.member),
    updateMemberRole: (id, userId, role) =>
      request(`/api/workspaces/${id}/members/${userId}`, {
        method: "PATCH",
        body: JSON.stringify({ role }),
      }).then((res) => res.data?.member),
    removeMember: (id, userId) =>
      request(`/api/workspaces/${id}/members/${userId}`, {
        method: "DELETE",
      }),
  },

  repositories: {
    list: (workspaceId) =>
      request(`/api/workspaces/${workspaceId}/repositories`).then(
        (res) => res.data?.repositories
      ),
    get: (id) => request(`/api/repositories/${id}`).then((res) => res.data?.repository),
    create: (workspaceId, data) =>
      request(`/api/workspaces/${workspaceId}/repositories`, {
        method: "POST",
        body: JSON.stringify(data),
      }).then((res) => res.data?.repository),
    delete: (id) =>
      request(`/api/repositories/${id}`, {
        method: "DELETE",
      }),
  },

  activities: {
    list: (repoId) =>
      request(`/api/repositories/${repoId}/activities`).then(
        (res) => res.data?.activities
      ),
    listUnreleased: (repoId) =>
      request(`/api/repositories/${repoId}/activities/unreleased`).then(
        (res) => res.data?.activities
      ),
    listIgnored: (repoId) =>
      request(`/api/repositories/${repoId}/activities/ignored`).then(
        (res) => res.data?.activities
      ),
    create: (repoId, data) =>
      request(`/api/repositories/${repoId}/activities`, {
        method: "POST",
        body: JSON.stringify(data),
      }).then((res) => res.data?.activity),
    update: (id, data) =>
      request(`/api/activities/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }).then((res) => res.data?.activity),
    assign: (id, releaseId) =>
      request(`/api/activities/${id}/assign`, {
        method: "POST",
        body: JSON.stringify({ releaseId }),
      }).then((res) => res.data?.activity),
    unassign: (id) =>
      request(`/api/activities/${id}/unassign`, {
        method: "POST",
      }).then((res) => res.data?.activity),
  },

  releases: {
    list: (repoId, status) =>
      request(
        `/api/repositories/${repoId}/releases${status ? `?status=${status}` : ""}`
      ).then((res) => res.data?.releases),
    get: (id) => request(`/api/releases/${id}`).then((res) => res.data?.release),
    create: (repoId, data) =>
      request(`/api/repositories/${repoId}/releases`, {
        method: "POST",
        body: JSON.stringify(data),
      }).then((res) => res.data?.release),
    update: (id, data) =>
      request(`/api/releases/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }).then((res) => res.data?.release),
    publish: (id) =>
      request(`/api/releases/${id}/publish`, {
        method: "POST",
      }).then((res) => res.data?.release),
    delete: (id) =>
      request(`/api/releases/${id}`, {
        method: "DELETE",
      }),
    batchAssignActivities: (id, activityIds) =>
      request(`/api/releases/${id}/assign-activities`, {
        method: "POST",
        body: JSON.stringify({ activityIds }),
      }).then((res) => res.data?.assigned),
    addChange: (releaseId, data) =>
      request(`/api/releases/${releaseId}/changes`, {
        method: "POST",
        body: JSON.stringify(data),
      }).then((res) => res.data?.change),
    updateChange: (releaseId, changeId, data) =>
      request(`/api/releases/${releaseId}/changes/${changeId}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }).then((res) => res.data?.change),
    deleteChange: (releaseId, changeId) =>
      request(`/api/releases/${releaseId}/changes/${changeId}`, {
        method: "DELETE",
      }),
  },
};

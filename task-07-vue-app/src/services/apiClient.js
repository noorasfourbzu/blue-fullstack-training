import { getToken } from "./tokenStore";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export class ApiError extends Error {
  constructor(message, status, errors = null) {
    super(message);
    this.status = status;
    this.name = "ApiError";
    this.errors = errors;
  }
}

function buildQueryString(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      query.append(key, value);
    }
  });
  const qs = query.toString();
  return qs ? `?${qs}` : "";
}

async function request(path, options = {}) {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    if (response.status === 401 && path !== "/login") {
      window.dispatchEvent(new CustomEvent("auth:unauthorized"));
    }

    throw new ApiError(
      errorData?.message || `Request to ${path} failed`,
      response.status,
      errorData?.errors || null
    );
  }

  return response.json();
}

export function getPosts(page = 1, categoryId = null, search = "") {
  const query = buildQueryString({ page, category_id: categoryId, search });
  return request(`/posts${query}`);
}

export function getMyPosts(page = 1, categoryId = null, search = "", status = "") {
  const query = buildQueryString({ page, category_id: categoryId, search, status });
  return request(`/posts/my${query}`);
}

export function getPost(id) {
  return request(`/posts/${id}`);
}

export function createPost(newPost) {
  return request("/posts", { method: "POST", body: JSON.stringify(newPost) });
}

export function updatePost(id, updatedPost) {
  return request(`/posts/${id}`, { method: "PUT", body: JSON.stringify(updatedPost) });
}

export function deletePost(id) {
  return request(`/posts/${id}`, { method: "DELETE" });
}

export function login(credentials) {
  return request("/login", { method: "POST", body: JSON.stringify(credentials) });
}

export function getAuthenticatedUser() {
  return request("/me");
}

export function logout() {
  return request("/logout", { method: "POST" });
}

export function getCategories() {
  return request("/categories");
}
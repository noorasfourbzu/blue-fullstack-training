import { describe, it, expect, beforeEach, vi } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { usePostsStore } from "../stores/posts";
import { getPosts as getPostsMock } from "../services/apiClient";

vi.mock("../services/apiClient", () => ({
  getPosts: vi.fn(),
  getMyPosts: vi.fn(),
  getCategories: vi.fn(),
  createPost: vi.fn(),
  updatePost: vi.fn(),
  deletePost: vi.fn(),
}));

describe("posts store - fetch error and retry", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    getPostsMock.mockReset();
  });

  it("sets an error state and keeps posts empty when the fetch fails", async () => {
    getPostsMock.mockRejectedValueOnce(new Error("Network down"));

    const store = usePostsStore();
    await store.fetchPosts();

    expect(store.error).toBe(true);
    expect(store.loading).toBe(false);
    expect(store.posts).toEqual([]);
  });

  it("recovers from an error state when retryFetch succeeds", async () => {
    const store = usePostsStore();

    getPostsMock.mockRejectedValueOnce(new Error("Network down"));
    await store.fetchPosts();
    expect(store.error).toBe(true);

    getPostsMock.mockResolvedValueOnce({
      data: [{ id: 1, title: "Post 1", body: "Body 1" }],
      meta: { current_page: 1, last_page: 1, per_page: 7, total: 1 },
    });
    await store.retryFetch();

    expect(store.error).toBe(false);
    expect(store.loading).toBe(false);
    expect(store.posts).toEqual([{ id: 1, title: "Post 1", body: "Body 1" }]);
  });
});
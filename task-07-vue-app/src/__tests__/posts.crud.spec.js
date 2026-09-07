import { describe, it, expect, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { usePostsStore } from "../stores/posts";
import {
  deletePost as deletePostMock,
  updatePost as updatePostMock,
} from "../services/apiClient";
import { vi } from "vitest";

vi.mock("../services/apiClient", () => ({
  getPosts: vi.fn(),
  getMyPosts: vi.fn(),
  getCategories: vi.fn(),
  createPost: vi.fn(),
  updatePost: vi.fn(),
  deletePost: vi.fn(),
}));

describe("posts store - CRUD side effects", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    deletePostMock.mockReset();
    updatePostMock.mockReset();
  });

  it("removes the post from posts and myPosts after a successful delete", async () => {
    const store = usePostsStore();
    store.posts = [
      { id: 1, title: "Post 1" },
      { id: 2, title: "Post 2" },
    ];
    store.myPosts = [{ id: 1, title: "Post 1" }];
    deletePostMock.mockResolvedValue({ message: "Post deleted successfully" });

    await store.deletePost(1);

    expect(store.posts).toEqual([{ id: 2, title: "Post 2" }]);
    expect(store.myPosts).toEqual([]);
    expect(store.deleting).toBe(false);
    expect(store.deleteError).toBe(false);
  });

  it("replaces the matching post in the list after a successful update", async () => {
    const store = usePostsStore();
    store.posts = [{ id: 1, title: "Old Title", status: "draft" }];
    updatePostMock.mockResolvedValue({
      data: { id: 1, title: "New Title", status: "published" },
    });

    const updated = await store.updatePost(1, {
      title: "New Title",
      status: "published",
    });

    expect(updated).toEqual({ id: 1, title: "New Title", status: "published" });
    expect(store.posts).toEqual([
      { id: 1, title: "New Title", status: "published" },
    ]);
    expect(store.updating).toBe(false);
  });

  it("sets deleteForbidden when the API responds with a 403", async () => {
    const store = usePostsStore();
    store.posts = [{ id: 1, title: "Post 1" }];
    const forbiddenError = new Error("Forbidden");
    forbiddenError.status = 403;
    deletePostMock.mockRejectedValue(forbiddenError);

    await expect(store.deletePost(1)).rejects.toThrow();

    expect(store.deleteForbidden).toBe(true);
    expect(store.posts).toEqual([{ id: 1, title: "Post 1" }]); // unchanged
  });
});
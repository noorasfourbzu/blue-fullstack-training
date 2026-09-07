import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { setActivePinia, createPinia } from "pinia";
import CreatePostView from "../views/CreatePostView.vue";
import { usePostsStore } from "../stores/posts";
import { createPost as createPostMock } from "../services/apiClient";

vi.mock("../services/apiClient", () => ({
  getPosts: vi.fn(),
  getMyPosts: vi.fn(),
  getCategories: vi.fn(),
  createPost: vi.fn(),
  updatePost: vi.fn(),
  deletePost: vi.fn(),
}));

describe("CreatePostView - success path (mocked API)", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    createPostMock.mockReset();
  });

  it("submits valid data, calls the mocked API, and shows a success message", async () => {
    createPostMock.mockResolvedValue({
      data: {
        id: 101,
        title: "A Valid Title",
        body: "A sufficiently long body for validation to pass.",
        status: "published",
        category: { id: 1, name: "Technology" },
      },
    });

    const store = usePostsStore();
    store.categories = [{ id: 1, name: "Technology" }];
    const wrapper = mount(CreatePostView);

    await wrapper.find("#title").setValue("A Valid Title");
    await wrapper
      .find("#body")
      .setValue("A sufficiently long body for validation to pass.");
    await wrapper.find("#category").setValue("1");
    await wrapper.find("#create-post-form").trigger("submit");
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(createPostMock).toHaveBeenCalledWith({
      title: "A Valid Title",
      body: "A sufficiently long body for validation to pass.",
      category_id: 1,
      status: "draft",
    });

    expect(wrapper.find("#form-status").text()).toContain(
      "Post created successfully",
    );
    expect(wrapper.find("#form-status").text()).toContain("101");

    expect(wrapper.find("#title").element.value).toBe("");
    expect(wrapper.find("#body").element.value).toBe("");
  });
});
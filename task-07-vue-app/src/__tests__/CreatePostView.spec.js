import { describe, it, expect, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { setActivePinia, createPinia } from "pinia";
import CreatePostView from "../views/CreatePostView.vue";
import { usePostsStore } from "../stores/posts";

describe("CreatePostView - validation", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  function mountWithCategory() {
    const store = usePostsStore();
    store.categories = [{ id: 1, name: "Technology" }];
    return { wrapper: mount(CreatePostView), store };
  }

  it("blocks submission and shows field errors when the form is empty", async () => {
    const { wrapper, store } = mountWithCategory();

    await wrapper.find("#create-post-form").trigger("submit");

    expect(wrapper.find("#title-error").text()).toBe("Title is required.");
    expect(wrapper.find("#body-error").text()).toBe("Body is required.");
    expect(wrapper.find("#category-error").text()).toBe(
      "Please select a category",
    );
    expect(wrapper.find("#form-status").text()).toContain(
      "Please check the highlighted fields above",
    );
    expect(store.submitting).toBe(false);
  });

  it("shows a specific error when the title is too short", async () => {
    const { wrapper } = mountWithCategory();

    const titleInput = wrapper.find("#title");
    await titleInput.setValue("Hi");
    await titleInput.trigger("blur");

    expect(wrapper.find("#title-error").text()).toBe(
      "Title must be at least 5 characters",
    );
  });

  it("does not show an error before the user has touched a field", () => {
    const { wrapper } = mountWithCategory();

    expect(wrapper.find("#title-error").text()).toBe("");
    expect(wrapper.find("#body-error").text()).toBe("");
    expect(wrapper.find("#category-error").text()).toBe("");
  });
});
import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { setActivePinia, createPinia } from "pinia";
import LoginView from "../views/LoginView.vue";
import { useAuthStore } from "../stores/auth";
import router from "../router";
import { login as loginMock } from "../services/apiClient";

vi.mock("../services/apiClient", () => ({
  login: vi.fn(),
  getAuthenticatedUser: vi.fn(),
  logout: vi.fn(),
  ApiError: class ApiError extends Error {
    constructor(message, status) {
      super(message);
      this.status = status;
    }
  },
}));

describe("LoginView - validation and authentication state", () => {
  beforeEach(async () => {
    setActivePinia(createPinia());
    loginMock.mockReset();
    await router.push("/login");
    await router.isReady();
  });

  it("shows validation errors and does not call the API when the form is empty", async () => {
    const wrapper = mount(LoginView, { global: { plugins: [router] } });

    await wrapper.find("#login-form").trigger("submit");

    expect(wrapper.find(".error-message").exists()).toBe(true);
    expect(loginMock).not.toHaveBeenCalled();
  });

  it("authenticates the user in the store after a successful login", async () => {
    loginMock.mockResolvedValue({
      token: "fake-token",
      user: { id: 1, name: "Test User", email: "test@example.com" },
    });

    const wrapper = mount(LoginView, { global: { plugins: [router] } });
    const authStore = useAuthStore();

    await wrapper.find("#email").setValue("test@example.com");
    await wrapper.find("#password").setValue("password123");
    await wrapper.find("#login-form").trigger("submit");
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(loginMock).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
    });
    expect(authStore.isAuthenticated).toBe(true);
    expect(authStore.user).toEqual({
      id: 1,
      name: "Test User",
      email: "test@example.com",
    });
  });
});
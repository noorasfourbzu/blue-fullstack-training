<script setup>
import {ref} from "vue";
import FormStatusBanner from "../components/FormStatusBanner.vue";
import {useRouter} from "vue-router";
import {useAuthStore} from "../stores/auth";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_PASSWORD_LENGTH = 20; 
const MIN_PASSWORD_LENGTH = 8;

const email = ref("");
const password = ref("");
const authStore = useAuthStore();
const router = useRouter();

const errors = ref({
    email: "",
    password: "",
});

const formStatus = ref("");

function validateEmail() {
  const value = email.value.trim();
  if (value === "") {
    errors.value.email = "Please enter your email address";
  } else if (!EMAIL_PATTERN.test(value)) {
    errors.value.email = "Please enter a valid email address like: name@example.com";
  } else {
    errors.value.email = "";
  }
  return errors.value.email === "";
}

// validate password 
function validatePassword() {
  const value = password.value.trim();
  if (value === "") {
    errors.value.password = "Please enter your password";
  } else if (value.length < MIN_PASSWORD_LENGTH) {
    errors.value.password = `Password must contain at least ${MIN_PASSWORD_LENGTH} characters`;
  } else if (value.length > MAX_PASSWORD_LENGTH) {
    errors.value.password = `Password must not exceed ${MAX_PASSWORD_LENGTH} characters`;
  } else {
    errors.value.password = "";
  }
  return errors.value.password === "";
}

function recheckIfInvalid(field, validateFn) {
  if (errors.value[field]) validateFn();
}


async function handleLogin(){
     const isEmailValid = validateEmail();
  const isPasswordValid = validatePassword();

  const isValid = isPasswordValid && isEmailValid ;


  if (!isValid) {
    formStatus.value = "error";
    return;
  }

  try{
    await authStore.login({email: email.value, password: password.value});
    router.push({name: 'account'});
  } catch (error) {
    formStatus.value = "error";
  }


}
</script>

<template>
  <section id="login" class="section">
    <div class="container">
      <h2 class="section-title">Login</h2>
      <form @submit.prevent="handleLogin" novalidate>
        <div class="form-group">
          <label for="email">Email:</label>
          <input
            type="email"
            id="email"
            v-model="email"
            @blur="recheckIfInvalid('email', validateEmail)"
            required
          />
          <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
        </div>

        <div class="form-group">
          <label for="password">Password:</label>
          <input
            type="password"
            id="password"
            v-model="password"
            @blur="recheckIfInvalid('password', validatePassword)"
            required
          />
          <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
        </div>

        <button type="submit">Login</button>

        <p v-if="formStatus === 'error'" class="form-status form-status--error">
          Please recheck your credentials and try again
        </p>
      </form>
    </div>
  </section>
  </template>
<script setup>
import { ref, computed } from "vue";

// validation rules (same as Task 01)
const NAME_MIN_LENGTH = 2;
const NAME_MAX_LENGTH = 60;
const PHONE_MIN_DIGITS = 8;
const PHONE_MAX_DIGITS = 15;
const PHONE_ALLOWED_CHARACTERS = /^[0-9+\-\s()]*$/;
const SUBJECT_MIN_LENGTH = 3;
const SUBJECT_MAX_LENGTH = 100;
const MESSAGE_MIN_LENGTH = 10;
const MESSAGE_MAX_LENGTH = 500;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// form field values
const name = ref("");
const email = ref("");
const phone = ref("");
const subject = ref("");
const message = ref("");

// error messages per field (empty string = no error)
const errors = ref({
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
});

// submit result banner: "success" | "error" | ""
const formStatus = ref("");

const messageCount = computed(() => message.value.length);
const isOverMessageLimit = computed(() => messageCount.value > MESSAGE_MAX_LENGTH);

function countDigits(value) {
  return value.replace(/\D/g, "").length;
}

function validateName() {
  const value = name.value.trim();
  if (value === "") {
    errors.value.name = "Please enter your full name";
  } else if (value.length < NAME_MIN_LENGTH) {
    errors.value.name = `Full name must contain at least ${NAME_MIN_LENGTH} characters`;
  } else if (value.length > NAME_MAX_LENGTH) {
    errors.value.name = `Full name must not exceed ${NAME_MAX_LENGTH} characters`;
  } else {
    errors.value.name = "";
  }
  return errors.value.name === "";
}

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

function validatePhone() {
  const value = phone.value.trim();
  // phone is optional, empty is valid
  if (value === "") {
    errors.value.phone = "";
    return true;
   }
    if (!PHONE_ALLOWED_CHARACTERS.test(value)) {
 errors.value.phone = "Phone number can only contain digits, spaces, +, -, ( and )";
    return false;
  }
  const digitCount = countDigits(value);
  if (digitCount < PHONE_MIN_DIGITS || digitCount > PHONE_MAX_DIGITS) {
    errors.value.phone = `Phone number must contain between ${PHONE_MIN_DIGITS} and ${PHONE_MAX_DIGITS} digits`;
    return false;
  }
  errors.value.phone = "";
  return true;
}

function validateSubject() {
  const value = subject.value.trim();
  if (value === "") {
    errors.value.subject = "Please enter the subject";
  } else if (value.length < SUBJECT_MIN_LENGTH) {
    errors.value.subject = `Subject must contain at least ${SUBJECT_MIN_LENGTH} characters`;
    } else if (value.length > SUBJECT_MAX_LENGTH) {
         errors.value.subject = `Subject must not exceed ${SUBJECT_MAX_LENGTH} characters`;
 } else {
    errors.value.subject = "";
     }
return errors.value.subject === "";
}

function validateMessage() {
  const value = message.value.trim();
  if (value === "") {
    errors.value.message = "Please enter your message";
  } else if (value.length < MESSAGE_MIN_LENGTH) {
    errors.value.message = `Message must contain at least ${MESSAGE_MIN_LENGTH} characters`;
  } else if (value.length > MESSAGE_MAX_LENGTH) {
    
    errors.value.message = `Message must not exceed ${MESSAGE_MAX_LENGTH} characters`;
  } else 
    errors.value.message = "";
  
  return errors.value.message === "";
}

// re check a field only after it already has an error, while the user fixes it
function recheckIfInvalid(field, validateFn) {
  if (errors.value[field]) validateFn();
}

function handleSubmit() {
  const isNameValid = validateName();
  const isEmailValid = validateEmail();
  const isPhoneValid = validatePhone();
  const isSubjectValid = validateSubject();
  const isMessageValid = validateMessage();

  const isValid = isNameValid && isEmailValid && isPhoneValid && isSubjectValid && isMessageValid;

  if (!isValid) {
    formStatus.value = "error";
    return;
  }

  formStatus.value = "success";

  // reset the form after a successful "send"
  name.value = "";
  email.value = "";
  phone.value = "";
  subject.value = "";
  message.value = "";
}
</script>

<template>
  <section id="contact" class="section">
    <div class="container">
      <h2 class="section-title">Contact</h2>

      <p>
        Have a question, a strange game idea, or a project you want
        to build with us? Send us a message and tell us about it.
      </p>

      <form id="contact-form" novalidate @submit.prevent="handleSubmit">
        <label for="name">Full Name</label>
        <input
          id="name"
          v-model="name"
          type="text"
          name="name"
          placeholder="Enter your full name"
          autocomplete="name"
          required
          class="form-control"
          :class="{ 'is-invalid': errors.name }"
          :aria-invalid="errors.name ? 'true' : 'false'"
          aria-describedby="name-error"
          maxlength="60"
          @input="recheckIfInvalid('name', validateName)"
          @blur="validateName"
        />
        <small id="name-error" class="error-message">{{ errors.name }}</small>

        <label for="email">Email Address</label>
        <input
          id="email"
          v-model="email"
          type="email"
          name="email"
          placeholder="Enter your email address"
          autocomplete="email"
          required
          class="form-control"
          :class="{ 'is-invalid': errors.email }"
          :aria-invalid="errors.email ? 'true' : 'false'"
          aria-describedby="email-error"
          maxlength="254"
          @input="recheckIfInvalid('email', validateEmail)"
          @blur="validateEmail"
        />
        <small id="email-error" class="error-message">{{ errors.email }}</small>

        <label for="phone">Phone Number (Optional)</label>
        <input
          id="phone"
          v-model="phone"
          type="tel"
          name="phone"
          placeholder="Enter your phone number"
          autocomplete="tel"
          class="form-control"
          :class="{ 'is-invalid': errors.phone }"
          :aria-invalid="errors.phone ? 'true' : 'false'"
          aria-describedby="phone-error"
          maxlength="20"
          @input="recheckIfInvalid('phone', validatePhone)"
          @blur="validatePhone"
        />
        <small id="phone-error" class="error-message">{{ errors.phone }}</small>

        <label for="subject">Subject</label>
        <input
          id="subject"
          v-model="subject"
          type="text"
          name="subject"
          placeholder="Enter the message subject"
          required
          class="form-control"
          :class="{ 'is-invalid': errors.subject }"
          :aria-invalid="errors.subject ? 'true' : 'false'"
          aria-describedby="subject-error"
          maxlength="100"
          @input="recheckIfInvalid('subject', validateSubject)"
          @blur="validateSubject"
        />
        <small id="subject-error" class="error-message">{{ errors.subject }}</small>

        <label for="message">Message</label>
        <textarea
          id="message"
          v-model="message"
          name="message"
          rows="5"
          placeholder="Write your message here"
          required
          class="form-control"
          :class="{ 'is-invalid': errors.message }"
          :aria-invalid="errors.message ? 'true' : 'false'"
          aria-describedby="message-error message-counter"
          maxlength="500"
          @input="recheckIfInvalid('message', validateMessage)"
          @blur="validateMessage"
        ></textarea>
        <small id="message-error" class="error-message">{{ errors.message }}</small>
        <small
          id="message-counter"
          class="character-counter"
          :class="{ 'counter-warning': isOverMessageLimit }"
        >
          {{ messageCount }} / {{ MESSAGE_MAX_LENGTH }} characters used
        </small>

        <button type="submit" class="button">Send</button>

        <p
          id="form-status"
          class="form-status"
          :class="{
            'form-status--success': formStatus === 'success',
            'form-status--error': formStatus === 'error',
          }"
          role="status"
          aria-live="polite"
        >
          <span v-if="formStatus === 'success'">Your message has been sent. We'll get back to you soon.</span>
          <span v-else-if="formStatus === 'error'">Please fix the highlighted fields and try again.</span>
        </p>
      </form>
    </div>
  </section>
</template>
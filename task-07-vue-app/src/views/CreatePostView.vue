<script setup>
import {reactive,computed, ref} from 'vue'
import { usePostsStore } from '../stores/posts'
import FormStatusBanner from '../components/FormStatusBanner.vue'

//  form state 
const form =  reactive({
title: '',
body: '',
userId:''
})


// track which field user interacted with 

const touched = reactive({
    title: false,
    body: false,
    userId:false
})

const postsStore = usePostsStore()

function  markTouched (field){
touched[field] = true
}

// validation rules

const MIN_TITLE_LENGTH = 5
const MIN_BODY_LENGTH = 10 
const MAX_TITLE_LENGTH = 100 
const MAX_BODY_LENGTH = 500   

const titleError = computed(() => {
  const value = form.title.trim()
  if (!value) return 'Title is required.'
  if (value.length < MIN_TITLE_LENGTH) {
    return `Title must be at least ${MIN_TITLE_LENGTH} characters`
  }
  return ''
})


const bodyError = computed(() => {
  const value = form.body.trim()
  if (!value) return 'Body is required.'
  if (value.length < MIN_BODY_LENGTH) {
    return `Body must be at least ${MIN_BODY_LENGTH} characters`
  }

  if (value.length > MAX_BODY_LENGTH) {
    return `Body must be under ${MAX_BODY_LENGTH} characters`
  }
  return ''
})



const userIdError = computed(() => {
  const value = form.userId
  if (value === '' || value === null) return 'User ID is required.'
  const numericValue = Number(value)
  if (!Number.isInteger(numericValue) || numericValue <= 0) {
    return 'User ID must be a positive whole number'
  }
  return ''
})


// character counters 
 //const titleRemaining = computed(()=> MAX_TITLE_LENGTH - form.title.length)
 
 const bodyRemaining = computed(() => MAX_BODY_LENGTH - form.body.length)
 const bodyCount = computed(() => form.body.length)
const isOverBodyLimit = computed(() => bodyCount.value > MAX_BODY_LENGTH)

// ---- overall form validity ----
const isFormValid = computed(() => {
  return !titleError.value && !bodyError.value && !userIdError.value
})



// ---- submission state----
const isSubmitting = computed(() => postsStore.submitting)
const formStatus = ref('')
const createdPostId = ref(null)


const bannerVariant = computed(() => {
  if (formStatus.value === 'success') return 'success'
  if (formStatus.value === 'validation-error' || formStatus.value === 'submit-error') return 'error'
  return ''
})

const statusMessage = computed(() => {
  if (formStatus.value === 'success') {
    return `Post created successfully. Returned ID: ${createdPostId.value}`
  }
  if (formStatus.value === 'validation-error') {
    return 'Please check the highlighted fields above and make sure they match the required rules.'
  }
  if (formStatus.value === 'submit-error') {
    return 'Something went wrong. Please check your connection and try again.'
  }
  return ''
})
async function handleSubmit() {
  // mark all fields touched so all errors show if user tries to submit early
  touched.title = true
  touched.body = true
  touched.userId = true

  if (!isFormValid.value) {
    formStatus.value = 'validation-error'
    return
}

    formStatus.value = ''
try {
    const created = await postsStore.createPost({
      title: form.title.trim(),
      body: form.body.trim(),
      userId: Number(form.userId)
    })

    formStatus.value = 'success'
    createdPostId.value = created.id

    // reset the form only after success
    form.title = ''
    form.body = ''
    form.userId = ''
    touched.title = false
    touched.body = false
    touched.userId = false
  } catch (err) {
    // keep form values on failure do not reset here
    formStatus.value = 'submit-error'
  }


}

function recheckIfInvalid(field) {
  touched[field] = touched[field] || false
}

</script>

<template>
    <section  id = "create-post" class="section">

<div class ="container">
        <h2 class="section-title">Create New Post </h2>


        <form  id= "create-post-form" novalidate @submit.prevent="handleSubmit">

      <!-- title field -->
      
        <label for="title">Title</label>
  <input
  id="title"
  v-model="form.title"
  type="text"
  name="title"
  placeholder="Enter the post title"
  required
  class="form-control"
  :class="{ 'is-invalid': touched.title && titleError }"
  :aria-invalid="touched.title && titleError ? 'true' : 'false'"
  aria-describedby="title-error title-counter"
  :maxlength="MAX_TITLE_LENGTH"
  @input="recheckIfInvalid('title')"
  @blur="markTouched('title')"
/>

 <small id="title-error" class="error-message">
          {{ touched.title ? titleError : '' }}
        </small>
        <small id ="title-counter" class="character-counter">
  {{ form.title.length }} / {{ MAX_TITLE_LENGTH }} characters used
        </small>


      <!-- body field -->
        <label for="body">Body</label>
        <textarea
          id="body"
          v-model="form.body"
          name="body"
          rows="5"
          placeholder="Write the post content here"
          required
          class="form-control"
          :class="{ 'is-invalid': touched.body && bodyError }"
          :aria-invalid="touched.body && bodyError ? 'true' : 'false'"
          aria-describedby="body-error body-counter"
:maxlength="MAX_BODY_LENGTH"
          @input="recheckIfInvalid('body')"
          @blur="markTouched('body')"
        ></textarea>
        <small id="body-error" class="error-message">
          {{ touched.body ? bodyError : '' }}
        </small>
        <small
          id="body-counter"
          class="character-counter"
          :class="{ 'counter-warning': isOverBodyLimit }"
        >
          {{ bodyCount }} / {{ MAX_BODY_LENGTH }} characters used
        </small>

        <label for="userId">User ID</label>
        <input
          id="userId"
          v-model="form.userId"
          type="number"
          name="userId"
          placeholder="Enter your user ID"
          min="1"
          required
          class="form-control"
          :class="{ 'is-invalid': touched.userId && userIdError }"
          :aria-invalid="touched.userId && userIdError ? 'true' : 'false'"
          aria-describedby="userId-error"
          @input="recheckIfInvalid('userId')"
          @blur="markTouched('userId')"
        />
        <small id="userId-error" class="error-message">
          {{ touched.userId ? userIdError : '' }}
        </small>

  <button type="submit" class="button" :disabled="isSubmitting">
          {{ isSubmitting ? 'Submitting...' : (formStatus === 'submit-error' ? 'Retry' : 'Create Post') }}
        </button>
<FormStatusBanner :status="bannerVariant" :message="statusMessage" />
        <button
  v-if="formStatus === 'error'"
  type="button"
  class="button"
  @click="handleSubmit"
>
  Retry
</button>
      </form>
      </div>
  </section>
</template>



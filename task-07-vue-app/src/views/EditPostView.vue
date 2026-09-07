<script setup>
import { reactive, computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePostsStore } from '../stores/posts.js'
import { useAuthStore } from '../stores/auth.js'
import { usePost } from '../composables/usePost.js'
import FormStatusBanner from '../components/FormStatusBanner.vue'

const route = useRoute()
const router = useRouter()
const postsStore = usePostsStore()
const authStore = useAuthStore()

const { post, loading, error, notFound, fetchPost } = usePost()

const form = reactive({
    title: '',
    body: '',
    category_id: '',
    status: 'draft'
})

const formStatus = ref('') // '', 'success', 'validation-error', 'submit-error', 'forbidden'
const backendErrors = ref({})

const isOwner = computed(() => {
    if (!post.value || !authStore.user) return false
    return post.value.user?.id === authStore.user.id
})

onMounted(async () => {
    if (!postsStore.categories.length) postsStore.fetchCategories()
    await fetchPost(route.params.id)
    if (post.value) {
        form.title = post.value.title
        form.body = post.value.body
        form.category_id = post.value.category?.id ?? ''
        form.status = post.value.status
    }
})

const MIN_TITLE_LENGTH = 5
const MIN_BODY_LENGTH = 10
const MAX_TITLE_LENGTH = 100
const MAX_BODY_LENGTH = 500

const titleError = computed(() => {
    const value = form.title.trim()
    if (!value) return 'Title is required.'
    if (value.length < MIN_TITLE_LENGTH) return `Title must be at least ${MIN_TITLE_LENGTH} characters`
    return ''
})

const bodyError = computed(() => {
    const value = form.body.trim()
    if (!value) return 'Body is required.'
    if (value.length < MIN_BODY_LENGTH) return `Body must be at least ${MIN_BODY_LENGTH} characters`
    if (value.length > MAX_BODY_LENGTH) return `Body must be under ${MAX_BODY_LENGTH} characters`
    return ''
})

const categoryError = computed(() => (!form.category_id ? 'Please select a category' : ''))

const isFormValid = computed(() =>
    !titleError.value && !bodyError.value && !categoryError.value
)

const titleCount = computed(() => form.title.length)
const bodyCount = computed(() => form.body.length)
const isOverBodyLimit = computed(() => bodyCount.value > MAX_BODY_LENGTH)

const statusMessage = computed(() => {
    if (formStatus.value === 'success') return 'Post updated successfully.'
    if (formStatus.value === 'validation-error') return 'Please check the highlighted fields above.'
    if (formStatus.value === 'forbidden') return 'You are not allowed to edit this post. It belongs to another user.'
    if (formStatus.value === 'submit-error') return 'Something went wrong while updating the post. Please try again.'
    return ''
})

const bannerVariant = computed(() => (formStatus.value === 'success' ? 'success' : formStatus.value ? 'error' : ''))

function goBack() {
    router.push(`/posts/${route.params.id}`)
}

async function handleSubmit() {
    if (!isFormValid.value) {
        formStatus.value = 'validation-error'
        return
    }

    formStatus.value = ''
    backendErrors.value = {}
       try {
        await postsStore.updatePost(route.params.id, {
            title: form.title.trim(),
            body: form.body.trim(),
            category_id: Number(form.category_id),
            status: form.status
        })
        formStatus.value = 'success'
        setTimeout(() => router.push(`/posts/${route.params.id}`), 800)
    }catch (err) {
        if (err.status === 403) {
            formStatus.value = 'forbidden'
        } else if (err.status === 422) {
            formStatus.value = 'validation-error'
            backendErrors.value = err.errors || {}
        } else if (err.status === 401) {
            formStatus.value = 'submit-error'
        } else {
            formStatus.value = 'submit-error'
        }
    }
}
</script>


<template>
    <section id="edit-post" class="section">
        <div class="container">
            <p v-if="loading" class="posts-status">Loading post...</p>

            <div v-else-if="error" class="posts-status posts-status--error">
                <p>Something went wrong while loading the post.</p>
                <button type="button" :disabled="loading" @click="fetchPost(route.params.id)">
                    {{ loading ? "Retrying..." : "Retry" }}
                </button>
            </div>

            <div v-else-if="notFound" class="posts-status posts-status--empty">
                <p>We couldn't find a post with id "{{ route.params.id }}".</p>
                <button type="button" @click="goBack">Back</button>
            </div>

            <div v-else-if="!isOwner" class="posts-status posts-status--error">
                <p>You are not allowed to edit this post. It belongs to another user.</p>
                <button type="button" @click="goBack">Back to Post</button>
            </div>

            <template v-else>
                <h2 class="section-title">Edit Post</h2>
                <form   id="edit-post-form"  novalidate @submit.prevent="handleSubmit">
                    <label for="edit-title">Title</label>
                    <input id="edit-title" v-model="form.title" type="text" class="form-control"
                        :maxlength="MAX_TITLE_LENGTH" />
                    <small class="error-message">{{ titleError }}</small>
                    <small v-if="backendErrors.title" class="error-message">{{ backendErrors.title[0] }}</small>
                    <small id="edit-title-counter" class="character-counter">
  {{ titleCount }} / {{ MAX_TITLE_LENGTH }} characters used
</small>

                    <label for="edit-body">Body</label>
                    <textarea id="edit-body" v-model="form.body" rows="5" class="form-control"
                        :maxlength="MAX_BODY_LENGTH"></textarea>
                    <small class="error-message">{{ bodyError }}</small>
                    <small v-if="backendErrors.body" class="error-message">{{ backendErrors.body[0] }}</small>
<small id="edit-body-counter" class="character-counter" :class="{ 'counter-warning': isOverBodyLimit }">
  {{ bodyCount }} / {{ MAX_BODY_LENGTH }} characters used
</small>
                    <label for="edit-category">Category</label>
                     <label for="edit-category">Category</label>
                    <p v-if="postsStore.categoriesLoading" class="posts-status">Loading categories...</p>
                    <p v-else-if="postsStore.categoriesError" class="posts-status posts-status--error">
                      Couldn't load categories.
                      <button type="button" :disabled="postsStore.categoriesLoading" @click="postsStore.fetchCategories">
                        {{ postsStore.categoriesLoading ? "Retrying..." : "Retry" }}
                      </button>
                    </p>
                    
                    <select id="edit-category" v-model="form.category_id" class="form-control">
                        <option value="" disabled>Select a category</option>
                        <option v-for="c in postsStore.categories" :key="c.id" :value="c.id">{{ c.name }}</option>
                    </select>
                    <small class="error-message">{{ categoryError }}</small>
                    <small v-if="backendErrors.category_id" class="error-message">{{ backendErrors.category_id[0] }}</small>
                    <fieldset>
                        <legend>Save as</legend>
                        <label><input type="radio" value="draft" v-model="form.status" /> Draft</label>
                        <label><input type="radio" value="published" v-model="form.status" /> Publish</label>
                    </fieldset>

                    <button type="submit" class="button" :disabled="postsStore.updating">
                        {{ postsStore.updating ? 'Saving...' : 'Save Changes' }}
                    </button>
                    <button type="button" class="button" @click="goBack">Cancel</button>

                    <FormStatusBanner :status="bannerVariant" :message="statusMessage" />
                </form>
            </template>
        </div>
    </section>
</template>
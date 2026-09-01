import {defineStore} from 'pinia'
import {ref , computed} from 'vue'
import {getPosts, createPost as createPostRequest} from '../services/apiClient'
export const usePostsStore = defineStore('posts', () =>{

// state  
// this is composition api style 
// i could also use the option api style 
const posts = ref([])
const loading = ref(false)
const error = ref(false)

const pagination = ref({
  currentPage:1,
  lastPage: 1,
  perPage: 0,
  total: 0
})
const notFound  = ref(null)
const favoriteIds = ref([])
const savedIds = ref([])
const submitting = ref(false)
const submitError = ref(false)
const lastCreatedPost = ref(null)


// getters
const favoritePosts = computed(() =>
  posts.value.filter(p => favoriteIds.value.includes(p.id))
)
const favoriteCount = computed(() => favoriteIds.value.length)
// const savedPosts = computed(() =>{})
// const savedCount  = computed(() => {savedIds.value.length})



 // actions
async function fetchPosts(page = 1){
  
  loading.value = true
  error.value = false

  try{
    const response = await getPosts(page)
    posts.value = response.data
    pagination.value = {
      currentPage: response.meta.current_page,
      lastPage: response.meta.last_page,
      perPage: response.meta.per_page,
      total: response.meta.total
    }
  }
  catch(err){
    console.error('failed to fetch posts', err)
    error.value = true
    posts.value = []
  }
  finally{
    loading.value = false
  }
}

function retryFetch(){
    fetchPosts()
}


function goToPage(page){
  fetchPosts(page)
}
function toggleFavorite(postId){
  if(favoriteIds.value.includes(postId))
    favoriteIds.value = favoriteIds.value.filter(id => id !== postId)
  else
    favoriteIds.value.push(postId)
  persistFavorites()
}

function persistFavorites(){
  localStorage.setItem('favoriteIds', JSON.stringify(favoriteIds.value)
)
}

function restoreFavorites(){
  const saved = localStorage.getItem('favoriteIds')
  if(saved) favoriteIds.value = JSON.parse(saved)
}

async function createPost(newPost){
submitting.value = true
  submitError.value = false

  try {
    const created = await createPostRequest(newPost)
    lastCreatedPost.value = created
    return created
  } catch (err) {
    submitError.value = true
    throw err
  } finally {
    submitting.value = false
  }

}

return {
  posts, loading, error, pagination, favoriteIds,
  submitting,submitError,lastCreatedPost,
  favoritePosts, favoriteCount,
  fetchPosts, retryFetch, goToPage, toggleFavorite,
  persistFavorites, restoreFavorites, createPost
}


})



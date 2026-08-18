import {defineStore} from 'pinia'
import {ref , computed} from 'vue'
import {getPosts} from '../services/postsApi'
export const usePostsStore = defineStore('posts', () =>{

// state  
// this is composition api style 
// i could also use the option api style 
const posts = ref([])
const loading = ref(false)
const error = ref(false)
const notFound  = ref(null)
const favoriteIds = ref([])
const savedIds = ref([])


// getters
const favoritePosts = computed(() =>
  posts.value.filter(p => favoriteIds.value.includes(p.id))
)
const favoriteCount = computed(() => favoriteIds.value.length)
// const savedPosts = computed(() =>{})
// const savedCount  = computed(() => {savedIds.value.length})



 // actions
async function fetchPosts(){
  loading.value = true
  error.value = false

  try{
    posts.value = await getPosts()
  }
  catch(err){
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
}

return {
  posts, loading, error, favoriteIds,
  favoritePosts, favoriteCount,
  fetchPosts, retryFetch, toggleFavorite,
  persistFavorites, restoreFavorites, createPost
}


})



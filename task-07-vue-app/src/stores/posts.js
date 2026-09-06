import { defineStore } from "pinia";
import { ref, computed } from "vue";
import {
  getPosts,
  getMyPosts,
  getCategories,
  createPost as createPostRequest,
  updatePost as updatePostRequest,
  deletePost as deletePostRequest,
} from "../services/apiClient";
import { useAuthStore } from "./auth";

export const usePostsStore = defineStore("posts", () => {
  // state
  // this is composition api style
  // i could also use the option api style
  const posts = ref([]);

  const categories = ref([]);
  const selectedCategory = ref(null);
  const searchTerm = ref('')
  const myPostsStatus = ref('')
  const loading = ref(false);
  const error = ref(false);

  const viewingMyPosts = ref(false);
  const pagination = ref({
    currentPage: 1,
    lastPage: 1,
    perPage: 0,
    total: 0,
  });

  const myPosts = ref([]);
  const myPostsLoading = ref(false);
  const myPostsError = ref(false);
  const myPostsPagination = ref({
    currentPage: 1,
    lastPage: 1,
    perPage: 0,
    total: 0,
  });
  const notFound = ref(null);
  const favoriteIds = ref([]);
  const savedIds = ref([]);
  const submitting = ref(false);
  const submitError = ref(false);
  const lastCreatedPost = ref(null);

  // update state
  const updating = ref(false);
  const updateError = ref(false);
  const updateForbidden = ref(false);

  // delete state
  const deleting = ref(false);
  const deleteError = ref(false);
  const deleteForbidden = ref(false);

  // getters
  const favoritePosts = computed(() =>
    posts.value.filter((p) => favoriteIds.value.includes(p.id)),
  );
  const favoriteCount = computed(() => favoriteIds.value.length);
  // const savedPosts = computed(() =>{})
  // const savedCount  = computed(() => {savedIds.value.length})

  // actions

  async function fetchCategories() {
    try {
      const response = await getCategories();
      categories.value = response.data;
    } catch (err) {
      console.error("failed to fetch categories", err);
      categories.value = [];
    }
  }

  async function selectCategory(categoryId) {
    selectedCategory.value = categoryId;
  }

  function setSearchTerm(term) {
  searchTerm.value = term
}

function setMyPostsStatus(status) {
  myPostsStatus.value = status
}

  async function fetchPosts(page = 1, mine = false) {
    if (mine) {
      return fetchMyPosts(page);
    }
    loading.value = true;
    error.value = false;

    try {
      const response = await getPosts(page, selectedCategory.value, searchTerm.value);
      posts.value = response.data;
      pagination.value = {
        currentPage: response.meta.current_page,
        lastPage: response.meta.last_page,
        perPage: response.meta.per_page,
        total: response.meta.total,
      };
    } catch (err) {
      console.error("failed to fetch posts", err);
      error.value = true;
      posts.value = [];
    } finally {
      loading.value = false;
    }
  }

  async function fetchMyPosts(page = 1) {
    myPostsLoading.value = true;
    myPostsError.value = false;

    try {
      const response = await getMyPosts(page, selectedCategory.value, searchTerm.value,  myPostsStatus.value);
      myPosts.value = response.data;
      myPostsPagination.value = {
        currentPage: response.meta.current_page,
        lastPage: response.meta.last_page,
        perPage: response.meta.per_page,
        total: response.meta.total,
      };
    } catch (err) {
      console.error("failed to fetch my posts", err);
      myPostsError.value = true;
      myPosts.value = [];
    } finally {
      myPostsLoading.value = false;
    }
  }

  function retryFetch(mine = false) {
    fetchPosts(1, mine);
  }

    function getFavoritesKey() {
    const authStore = useAuthStore();
    return authStore.user ? `favoriteIds_user_${authStore.user.id}` : "favoriteIds";
  }

  function toggleFavorite(postId) {
    if (favoriteIds.value.includes(postId))
      favoriteIds.value = favoriteIds.value.filter((id) => id !== postId);
    else favoriteIds.value.push(postId);
    persistFavorites();
  }

  function persistFavorites() {
    localStorage.setItem(getFavoritesKey(), JSON.stringify(favoriteIds.value));  }

  function restoreFavorites() {
    const saved = localStorage.getItem(getFavoritesKey());
    favoriteIds.value = saved ? JSON.parse(saved) : [];
    }

  async function createPost(newPost) {
    submitting.value = true;
    submitError.value = false;

    try {
      const created = await createPostRequest(newPost);
      lastCreatedPost.value = created;
      return created;
    } catch (err) {
      submitError.value = true;
      throw err;
    } finally {
      submitting.value = false;
    }
  }

  

async function updatePost(id, changes){
  updating.value = true
  updateError.value = false
  updateForbidden.value = false

  try {
    const response = await updatePostRequest(id, changes)
    const updated = response.data

    const index = posts.value.findIndex(post => post.id === id)
    const myIndex = myPosts.value.findIndex(post => post.id === id)

    if (index !== -1) {
      posts.value[index] = updated
    }
    if (myIndex !== -1) {
      myPosts.value[myIndex] = updated
    }

    return updated
  } catch (err) {
    if (err.status === 403) {
      updateForbidden.value = true
    } else {
      updateError.value = true
    }
    throw err
  } finally {
    updating.value = false
  }
}



async function deletePost(id){
  deleting.value = true
  deleteError.value = false
  deleteForbidden.value = false

  try {
    await deletePostRequest(id)
    posts.value = posts.value.filter(post => post.id !== id)
    myPosts.value = myPosts.value.filter(post => post.id !== id)
  } catch (err) {
    if (err.status === 403) {
      deleteForbidden.value = true
    } else {
      deleteError.value = true
    }
    throw err
  } finally {
    deleting.value = false
  }
}

  return {
    posts,
    loading,
    error,
    pagination,
    favoriteIds,
    myPosts,
    myPostsLoading,
    myPostsError,
    myPostsPagination,
    categories,
    selectedCategory,
    submitting,
    submitError,
    lastCreatedPost,
    favoritePosts,
    favoriteCount,
    updating, 
    updateError,
    updateForbidden,
    deleting,
    deleteError,
    deleteForbidden,
    searchTerm,
    myPostsStatus,
     setMyPostsStatus,
    setSearchTerm,
    selectCategory,
    retryFetch,
    toggleFavorite,
    fetchPosts,
    fetchMyPosts,
    fetchCategories,
    persistFavorites,
    restoreFavorites,
    createPost,
    updatePost,
    deletePost,
  };
});

import {defineStore} from "pinia";
import {ref } from "vue";

import {
    getPage,
    getPages,
    createPage as createPageRequest,
    updatePage as updatePageRequest,
    deletePage as deletePageRequest,
    getPublicPage,
} from "../services/apiClient";


export const usePagesStore = defineStore("pages", () => {
    
    const pages = ref([]);
const currentPage = ref(null);
const loading = ref(false);
const error = ref(false);
const pageLoading = ref(false );
const pageError = ref(false);
const notFound = ref(false);
const submitting = ref(false);
const submitError = ref(false);
const updating = ref(false);
const updateError = ref(false);
const updateForbidden = ref(false);
const deleting = ref(false);
const deleteError = ref(false);
const deleteForbidden = ref(false);
const pageForbidden = ref(false);

// actions 

 async function fetchPages() {
    loading.value = true;
    error.value = false;

    try {
      const response = await getPages();

      pages.value = response.data;
    } catch (err) {
      console.error("Failed to fetch pages", err);

      pages.value = [];
      error.value = true;
    } finally {
      loading.value = false;
    }
  }

  async function fetchPage(id) {
    pageLoading.value = true;
    pageError.value = false;
    notFound.value = false;
    pageForbidden.value = false;
       try {
      const response = await getPage(id);

      currentPage.value = response.data;

      return response.data;
    } catch (err) {
      console.error("Failed to fetch page", err);

      currentPage.value = null;

      if (err.status === 404) {
        notFound.value = true;
      } else if (err.status === 403) {
        pageForbidden.value = true;
      } else {
        pageError.value = true;
      }

      throw err;
    } finally {
      pageLoading.value = false;
    }
  }

  async function fetchPublicPage(slug) {
    pageLoading.value = true;
    pageError.value = false;
    notFound.value = false;

    try {
      const response = await getPublicPage(slug);

      currentPage.value = response.data;

      return response.data;
    } catch (err) {
      console.error("Failed to fetch public page", err);

      currentPage.value = null;
      pageError.value = true;

      if (err.status === 404) {
        notFound.value = true;
      }

      throw err;
    } finally {
      pageLoading.value = false;
    }
  }

  async function createPage(newPage) {
    submitting.value = true;
    submitError.value = false;

    try {
      const response = await createPageRequest(newPage);

      const created = response.data;

      pages.value.unshift(created);

      currentPage.value = created;

      return created;
    } catch (err) {
      console.error("Failed to create page", err);

      submitError.value = true;

      throw err;
    } finally {
      submitting.value = false;
    }
  }

  async function updatePage(id, changes) {
    updating.value = true;
    updateError.value = false;
    updateForbidden.value = false;

    try {
      const response = await updatePageRequest(id, changes);

      const updated = response.data;

      const index = pages.value.findIndex(
        (page) => page.id === id
      );

      if (index !== -1) {
        pages.value[index] = updated;
      }

      if (currentPage.value?.id === id) {
        currentPage.value = updated;
      }

      return updated;
    } catch (err) {
      console.error("Failed to update page", err);

      if (err.status === 403) {
        updateForbidden.value = true;
      } else {
        updateError.value = true;
      }

      throw err;
    } finally {
      updating.value = false;
    }
  }

  async function deletePage(id) {
    deleting.value = true;
    deleteError.value = false;
    deleteForbidden.value = false;

    try {
      await deletePageRequest(id);

      pages.value = pages.value.filter(
        (page) => page.id !== id
      );

      if (currentPage.value?.id === id) {
        currentPage.value = null;
      }
    } catch (err) {
      console.error("Failed to delete page", err);

      if (err.status === 403) {
        deleteForbidden.value = true;
      } else {
        deleteError.value = true;
      }

      throw err;
    } finally {
      deleting.value = false;
    }
  }

  function retryFetch() {
    fetchPages();
  }



  // return 
  return {
    // state 
    pages, currentPage,loading,error,pageLoading,pageError,notFound,pageForbidden,
    submitting,submitError,updating,updateError,updateForbidden,
    deleting,deleteError,deleteForbidden,
    // actions 
    fetchPage,fetchPages,fetchPublicPage,createPage,
    updatePage,deletePage,retryFetch,

  };
});

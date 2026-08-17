import {ref} from "vue";
import {POSTS_API_URL} from "./api";

export function usePosts(){
const posts = ref([]);
const loading = ref(false);
const error = ref(false);

async function fetchPosts(){
    loading.value = true; 
    error.value = false; 
    try{

        const response = await fetch(POSTS_API_URL);
        if(!response.ok)
            throw new Error ("Failed to fetch posts");
        posts.value = await response.json();
    }
    catch(err){
error.value = true; 
posts.value = [];
    }
    finally {
        loading.value= false ; 
    }
}
return {posts, loading , error , fetchPosts};
}
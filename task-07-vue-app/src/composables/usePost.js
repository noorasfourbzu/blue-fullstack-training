import{ref, watch, onMounted} from "vue";
import { useRoute, useRouter } from "vue-router";
import {POSTS_API_URL } from "./api";


const post = ref(null);
const loading = ref(false);
const error = ref(false);
const notFound = ref(false);
export function usePost(){

async function fetchPost(id){
  loading.value= true;
  error.value = false ;
  notFound.value = false; 
  post.value = null; 
try{
  const response = await fetch(`${POSTS_API_URL}/${id}`);

  if(!response.ok){

    if(response.status == 404)
    notFound.value = true; 
  else error.value = true; 
  return ; 

  }

  const data = await response.json();

// incase an empty object with 200 code instead of 400
  if(!data || !data.id){
    notFound.value = true; 
    return ; 
  }

  post.value = data; 
}

catch(err){
  error.value = true;
  
}
finally{
  loading.value = false; 
}

}
return {post, loading, error,  notFound, fetchPost};

}

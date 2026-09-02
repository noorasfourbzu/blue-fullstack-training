import{ref} from "vue";

import { getPost, ApiError } from "../services/apiClient";

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

  const response = await getPost(id);

    if (!response || !response.data || !response.data.id) {
      notFound.value = true;
      return;
    }


  post.value = response.data; 
}

catch(err){
if (err instanceof ApiError && err.status === 404) {
      notFound.value = true;
    } else {
      error.value = true;
    }  
}
finally{
  loading.value = false; 
}

}
return {post, loading, error,  notFound, fetchPost};

}

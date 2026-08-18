
//service model
// pure reqeust function
// request logic only no state logic here 
import {POSTS_API_URL} from "../composables/api";
export  async function getPosts(){

    const response = await fetch(POSTS_API_URL)
    if(!response.ok){
        throw new Error("Failed to fetch posts")
      }  return response.json()
}
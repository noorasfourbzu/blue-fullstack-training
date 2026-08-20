
//service model
// pure reqeust function
// request logic only no state logic here 
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export async function getPosts() {
  const response = await fetch(`${API_BASE_URL}/posts`)
  if (!response.ok) {
    throw new Error('Failed to fetch posts')
  }

  return response.json()
}

export async function createPost(newPost){
    const response = await fetch (`${API_BASE_URL}/posts`,{
        method:"POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify(newPost)
    })

    if(!response.ok){throw new Error("Failed to create a post")}
    return response.json()
}
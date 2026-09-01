const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
 export class ApiError  extends Error {
    constructor(message,status){
        super(message)
        this.status = status
        this.name = 'ApiError'
    }
 }


 async function request(path, options ={}){
    const response = await fetch (`${API_BASE_URL}${path}`, {
        headers: {'Content-Type': 'application/json', ...options.headers},
        ...options
    })
    if (!response.ok) {
    throw new ApiError(`Request to ${path} failed`, response.status)
  }

  return response.json()
 }

export function getPosts() {
  return request('/posts')
}

export function getPost(id) {
  return request(`/posts/${id}`)
}

export function createPost(newPost) {
  return request('/posts', {
    method: 'POST',
    body: JSON.stringify(newPost)
  })
}

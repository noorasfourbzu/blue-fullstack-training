const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
 export class ApiError  extends Error {
    constructor(message,status){
        super(message)
        this.status = status
        this.name = 'ApiError'
    }
 }


 async function request(path, options ={}){
    const token = localStorage.getItem(`authToken`)



    const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }


    const response = await fetch (`${API_BASE_URL}${path}`, {
     ...options,
     headers
    })


    if (!response.ok) {

        consterrorData = await response.json().catch(() => null)
        throw new ApiError(errorData?.message || `Request to ${path} failed`, response.status)
      }

  return response.json()
 }



export function getPosts(page = 1) {
  return request(`/posts?page=${page}`)
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


export function login(credentials) {
  return request('/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  })
}

export function getAuthenticatedUser() {
  return request('/me')
}

export function logout() {
  return request('/logout', {
    method: 'POST'
  })
}

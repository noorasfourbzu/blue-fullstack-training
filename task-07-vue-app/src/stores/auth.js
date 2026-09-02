import {defineStore} from "pinia";
import {ref, computed} from "vue";

import {
  login as loginRequest,
  getAuthenticatedUser,
  logout as logoutRequest
} from '../services/apiClient'


export const useAuthStore = defineStore('auth', () => {

    // state 
      const token = ref(sessionStorage.getItem('authToken'))
      const user = ref(null)
      const loading = ref(false)
      const error = ref(null)


      // getters
       const isAuthenticated = computed(() => !!token.value)

       // login 
       async function login(credentials) {

    loading.value = true
    error.value = null

    try {

      const response = await loginRequest(credentials)
      token.value = response.token
      sessionStorage.setItem('authToken', response.token)
      user.value = response.user
      return response
      } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }


  // get authenticated user
  async function fetchUser(){
    try{
        const response = await getAuthenticatedUser()
        user.value = response.user
        return response.user
    }

    catch(err){
        clearSession()
        throw err
    }

  }

  // restore session after refresh 
  async function restoreSession(){
    const savedToken = sessionStorage.getItem('authToken')
    if (!savedToken) return
    token.value = savedToken
    try{
        await fetchUser()
    }
    catch(err){
        clearSession()
    }
  }


  // logout 
  async function logout(){
    try{
        await logoutRequest()
    }

 finally{
    clearSession()
 }
  }



    function clearSession(){
        token.value = null
        user.value = null
        sessionStorage.removeItem('authToken')
    }

    return {
        token, user, loading, error, isAuthenticated,
        login, fetchUser, restoreSession, logout, clearSession
    }}
)
<script setup>
import { onMounted } from "vue";
import {useRouter} from "vue-router";
import {useAuthStore} from "../stores/auth";


const authStore = useAuthStore();
const router = useRouter();

onMounted(async() => {
 

    try{
        await authStore.fetchUser();

    }
    catch(error){
        router.push({name: "login"});
    }
});


async function handleLogout(){
    await authStore.logout();
    router.push({name: "login"});
}

</script>


<template> 
<section id="account" class="section"> 
    <div class="container">
         <h2 class="section-title">My Account</h2>
          <div v-if="authStore.user">
             <p> Welcome, <strong>{{ authStore.user.name }}</strong>! </p> 
             <p> Email: <strong>{{ authStore.user.email }}</strong> </p> 
             <p> You are successfully logged in to your account. </p> 
             <button @click="handleLogout"> Logout </button>
              </div>
               <p v-else> Loading your account... </p> 
               </div> 
               </section> 
               </template>
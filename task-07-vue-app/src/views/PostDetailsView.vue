<script setup>
import{ref, watch, onMounted} from "vue";
import { useRoute, useRouter } from "vue-router";
import {usePost} from "../composables/usePost";
const route = useRoute();
const router = useRouter();

const {post, loading , error , notFound , fetchPost} = usePost();

function goBackToPosts(){
  router.push("/posts");
}

// load the post for the current id as soon as the view mounts
onMounted(() => {
  fetchPost(route.params.id);
});


watch(() => route.params.id,
 (newId) => {

  fetchPost(newId);
});
</script>

<template>

  <section id = "post-details"  class = "section">
    <div class = "container">
      <!--
      loading state 
      -->

      <p v-if = "loading" class = "posts-status">
        Loading post ... 
        </p>

        <!-- API Error-->
      <div v-else-if = "error" class = "posts-status posts-status--error">
          <p>Something went wrong while loading the post</p>
          <button type = "button" @click = "fetchPost(route.params.id)">
            Retry
          </button>
          <button type = "button" @click ="goBackToPosts()">
            Back to Posts
            </button>

    </div>


    <!-- Invalid  or Not found ID -->
     <div  v-else-if = "notFound" class ="posts-status posts-status--empty">
      <p> we couldnt find a post with id "{{ route.params.id}} "</p>
      <button type = "button" @click = "goBackToPosts" >  Back to Posts</button>
      </div>

       <!-- Success: post loaded -->
      <article v-else-if="post" class="post-details-content">
        <p class="post-details-id">Post #{{ post.id }}</p>
        <h2 class="post-details-title">{{ post.title }}</h2>
        <p class="post-details-body">{{ post.body }}</p>

        <button type="button" class="back-to-posts" @click="goBackToPosts">
          &larr; Back to Posts
        </button>
      </article>

    </div>
  </section>
 
</template>
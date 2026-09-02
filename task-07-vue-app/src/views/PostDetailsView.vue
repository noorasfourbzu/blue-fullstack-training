<script setup>
import{ref,computed,watch, onMounted} from "vue";
import { useRoute, useRouter } from "vue-router";
import {usePost} from "../composables/usePost";
import { usePostsStore } from "../stores/posts";
import heartOutline from "../assets/heart-outline.png";
import heartFilled from "../assets/heart-filled.png";
import { previousRouteName } from "../router";

const route = useRoute();
const router = useRouter();
const postsStore = usePostsStore();

const {post, loading , error , notFound , fetchPost} = usePost();


const backTarget = computed(() =>
  previousRouteName.value === "favorites" ? "/favorites" : "/posts"
);
const backLabel = computed(() =>
  previousRouteName.value === "favorites" ? "Back to Favorites" : "Back to Posts"
);

function goBackToPosts(){
  router.push(backTarget.value);
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
      <button type = "button" @click = "goBackToPosts" >  {{ backLabel }}</button>
      </div>

       <!-- Success: post loaded -->
      <article v-else-if="post" class="post-details-content">
        <p class="post-details-id">Post #{{ post.id }}</p>

        <button
      type="button"
    class="favorite-heart favorite-heart--details"
     :aria-label="postsStore.favoriteIds.includes(post.id) ? 'Remove from favorites' : 'Add to favorites'"
      @click="postsStore.toggleFavorite(post.id)"
>
  <img
    :src="postsStore.favoriteIds.includes(post.id) ? heartFilled : heartOutline"
     :alt="postsStore.favoriteIds.includes(post.id) ? 'Favorited' : 'Not favorited'"
    class="heart-icon"
  />
</button>
        <h2 class="post-details-title">{{ post.title }}</h2>
        <p class="post-details-body">{{ post.body }}</p>
        <div class = "post-meta">
          <p> Status: {{ post.status }} </p>
          <p> Category: {{ post.category?.name || "Unknown" }} </p>
          <p> Author: {{post.user?.name || "Unknown" }} </p>
          </div>

        <button type="button" class="back-to-posts" @click="goBackToPosts">
          &larr; {{ backLabel }}
        </button>

      </article>

    </div>
  </section>
 
</template>
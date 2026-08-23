<script setup>

defineProps({

    status:{
        type:String,
        defualt: "",
    },

    message:{
        type:String,
        defualt:"",
    },
})

</script>
<template>
    <p
    id="form-status"
    class="form-status"
    :class="{
        'form-status--success': status === 'success',
      'form-status--error': status === 'error',
    }"

role = "status"
aria-live="polite">
    {{ message }}
</p>
</template>
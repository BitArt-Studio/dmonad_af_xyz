<template>
    <div v-if="isVisible" :class="['toast', `toast-${variant}`]">
      <h3 class="toast-title">{{ title }}</h3>
      <p class="toast-description">{{ description }}</p>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const isVisible = ref(false)
  const title = ref('')
  const description = ref('')
  const variant = ref('default')
  
  const toast = ({ variant: v, title: t, description: d }) => {
    variant.value = v
    title.value = t
    description.value = d
    isVisible.value = true
    setTimeout(() => {
      isVisible.value = false
    }, 3000)
  }
  

  </script>
  <script>
  export default {
    name: 'Toast',
  }
  </script>
  <style scoped>
  .toast {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 15px;
    border-radius: 5px;
    color: white;
    text-align: center;
    z-index: 1000;
  }
  
  .toast-default {
    background-color: #333;
  }
  
  .toast-destructive {
    background-color: #ff4136;
  }
  
  .toast-title {
    font-weight: bold;
    margin-bottom: 5px;
  }
  
  .toast-description {
    font-size: 14px;
  }
  </style>
<script setup>
import Navbar from './Navbar.vue';
import { ref, onMounted, onUnmounted, watch } from 'vue';
import {  imgLink } from './utils';
const images = ref([]);
const currentImageIndex = ref(0);
const isTransitioning = ref(false);
const isHovering = ref(false);
let intervalId = null;
const refreshKey = ref(0);


function openLinkInNewTab() {
  window.open(imgLink.value, '_blank');
}

onMounted(() => {
  // 设置30秒间隔
  intervalId = setInterval(() => {
    refreshKey.value++; // 增加key值触发组件重新渲染
  }, 10000);
});

onUnmounted(() => {
  // 清除定时器
  clearInterval(intervalId);
});

function startSlideshow() {
  stopSlideshow(); // 确保没有正在运行的定时器
  intervalId = setInterval(() => {
    if (!isTransitioning.value) {
      isTransitioning.value = true;
      setTimeout(() => {
        currentImageIndex.value = (currentImageIndex.value + 1) % images.value.length;
        isTransitioning.value = false;
      }, 1000); // 1秒后更新当前图片索引
    }
  }, 4000); // 3秒静止时间 + 1秒过渡时间
}

function stopSlideshow() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

function handleMouseEnter() {
  isHovering.value = true;
}

function handleMouseLeave() {
  isHovering.value = false;
}
</script>

<template>
  <div class="relative h-screen flex flex-col items-center justify-center bg-gray-900 text-white">

    <div 
      class="relative w-[600px] h-[600px]"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    >
      <transition name="fade">
        <iframe   
          :src="imgLink"
          :key="refreshKey"
          :class="[
            'absolute top-0 left-0 w-full h-full object-cover rounded-lg transition-shadow duration-300',
            isHovering ? 'shadow-bright' : 'shadow-normal'
          ]"
        ></iframe>
      </transition>
      <!-- 添加一个覆盖层来处理点击事件 -->
      <!-- <div 
        class="absolute top-0 left-0 w-full h-full cursor-pointer"
        @click="openLinkInNewTab"
      ></div> -->
    </div>
    <div class="absolute inset-x-0 bottom-0 flex justify-center pb-[20px]">
    <Navbar />
  </div>
  </div>

</template>
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}

.shadow-normal {
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
}

.shadow-bright {
  box-shadow: 0 0 30px rgba(255, 255, 255, 0.5);
}
</style>
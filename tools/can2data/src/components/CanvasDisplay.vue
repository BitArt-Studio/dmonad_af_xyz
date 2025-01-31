<template>
  <div class="canvas-container">
    <div ref="p5Container"></div>
    <button 
      @click="saveCanvas" 
      class="px-4 py-2 mt-4 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      保存图片
    </button>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { initData, renderMain } from './image.js'
import Hashids from 'hashids'

const p5Container = ref(null)
let p5Canvas = null

onMounted(() => {
  // 创建新的 p5 实例
  new p5((p) => {
    // 将p5实例方法和变量绑定到全局
    Object.assign(window, {
      createCanvas: (...args) => p.createCanvas(...args),
      background: (...args) => p.background(...args),
      random: (...args) => p.random(...args),
      createVector: (...args) => p.createVector(...args),
      push: (...args) => p.push(...args),
      pop: (...args) => p.pop(...args),
      translate: (...args) => p.translate(...args),
      color: (...args) => p.color(...args),
      noStroke: (...args) => p.noStroke(...args),
      fill: (...args) => p.fill(...args),
      triangle: (...args) => p.triangle(...args),
      createGraphics: (...args) => p.createGraphics(...args),
      blendMode: (...args) => p.blendMode(...args),
      SOFT_LIGHT: p.SOFT_LIGHT,
      image: (...args) => p.image(...args),
      cos: Math.cos,
      sin: Math.sin,
      atan2: Math.atan2,
      TAU: Math.PI * 2,
      PI: Math.PI,
      constrain: (...args) => p.constrain(...args),
      randomSeed: (...args) => p.randomSeed(...args),
      noLoop: (...args) => p.noLoop(...args),
      get width() { return p.width },
      get height() { return p.height },
      get drawingContext() { return p.drawingContext },
      Hashids: Hashids
    })

    p.setup = () => {
      console.log('P5 setup running...')
      p5Canvas = p.createCanvas(500, 500)
      p5Canvas.parent(p5Container.value)
      
      // 确保 width 和 height 已经设置
      window.width = p.width
      window.height = p.height
      console.log(window.width);
      console.log(window.height);

      
      // 设置绘图上下文
      window.drawingContext = p.drawingContext
      
      console.log('Canvas size:', p.width, p.height)
      initData()
    }

    p.draw = () => {
      // 空的draw函数，因为我们使用了noLoop()
      renderMain()

    }
  })
})

const saveCanvas = () => {
  if (p5Canvas) {
    const dataUrl = p5Canvas.canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.download = `artwork_${Date.now()}.png`
    link.href = dataUrl
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}
</script>

<style scoped>
.canvas-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

canvas {
  border: 1px solid #ccc;
  background: white;
}
</style> 
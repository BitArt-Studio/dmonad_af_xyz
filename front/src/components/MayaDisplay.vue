<template>
  <div class="flex flex-col items-center justify-center min-h-[200px] gap-6">
    <div class="relative w-[500px] h-[500px]">
      <div class="scale-[0.5] origin-top-left transform-gpu">
        <div ref="p5Container" class="absolute inset-0"></div>
      </div>
    </div>
    <!-- <button 
      @click="saveCanvas"
      class="w-32 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      保存图片
    </button> -->
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { renderMain, initData } from './umaya.js'
import { hSeed } from './utils.js'
import p5 from 'p5'
window.p5 = p5

const p5Container = ref(null)
let p5Canvas = null

const getCanvasBase64 = () => {
  if (p5Canvas) {
    return p5Canvas.canvas.toDataURL('image/png')
  }
  return null
}

const getCanvasBase64_500 = () => {
  if (p5Canvas) {
    // 创建一个新的 canvas 元素，设置其尺寸为 500x500
    const canvas = document.createElement('canvas');
    canvas.width = 500;
    canvas.height = 500;
    const ctx = canvas.getContext('2d');

    // 将 p5Canvas 的内容绘制到新的 canvas 上，并进行缩放以适应 500x500 的尺寸
    ctx.drawImage(p5Canvas.canvas, 0, 0, 500, 500);

    // 将新的 canvas 内容转换为 PNG 格式的 Base64 编码数据并返回
    return canvas.toDataURL('image/png');
  }
  return null; // 如果 p5Canvas 不存在，则返回 null
};

onMounted(() => {
  new p5((p) => {
    // 将p5实例方法和变量绑定到全局
    Object.assign(window, {
      createCanvas: (...args) => p.createCanvas(...args),
      background: (...args) => p.background(...args),
      random: (...args) => p.random(...args),
      fill: (...args) => p.fill(...args),
      noFill: (...args) => p.noFill(...args),
      stroke: (...args) => p.stroke(...args),
      noStroke: (...args) => p.noStroke(...args),
      strokeWeight: (...args) => p.strokeWeight(...args),
      strokeCap: (...args) => p.strokeCap(...args),
      strokeJoin: (...args) => p.strokeJoin(...args),
      rectMode: (...args) => p.rectMode(...args),
      rect: (...args) => p.rect(...args),
      scale: (...args) => p.scale(...args),
      shuffle: (...args) => p.shuffle(...args),
      CENTER: p.CENTER,
      translate: (...args) => p.translate(...args),
      rotate: (...args) => p.rotate(...args),
      triangle: (...args) => p.triangle(...args),
      color: (...args) => p.color(...args),
      circle: (...args) => p.circle(...args),
      point: (...args) => p.point(...args),
      ellipse: (...args) => p.ellipse(...args),
      line: (...args) => p.line(...args),
      rect: (...args) => p.rect(...args),
      createVector: (...args) => p.createVector(...args),
      HALF_PI: p.HALF_PI,
      cos: Math.cos,
      sin: Math.sin,
      atan2: Math.atan2,
      TAU: Math.PI * 2,
      PI: Math.PI,
      randomSeed: (...args) => p.randomSeed(...args),
      noLoop: (...args) => p.noLoop(...args),
      get width() { return p.width },
      get height() { return p.height },
      push: (...args) => p.push(...args),
      pop: (...args) => p.pop(...args),
      createGraphics: (...args) => p.createGraphics(...args),
      blendMode: (...args) => p.blendMode(...args),
      SOFT_LIGHT: p.SOFT_LIGHT,
      image: (...args) => p.image(...args),
      get drawingContext() { return p.drawingContext },
    })

    p.setup = () => {
      console.log('P5 setup running...')
      p5Canvas = p.createCanvas(1000, 1000)
      p5Canvas.parent(p5Container.value)
      
      window.width = p.width
      window.height = p.height
      console.log('Canvas size:', p.width, p.height)
      
      initData(hSeed.value);
      p.noLoop()
    }

    p.draw = () => {
      renderMain()
      window.artworkBase64 = getCanvasBase64_500()
    }
  })
})

const saveCanvas = () => {
  if (p5Canvas) {
    const dataUrl = p5Canvas.canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.download = `maya_${Date.now()}.png`
    link.href = dataUrl
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

defineExpose({
  getCanvasBase64_500,
  getCanvasBase64
})
</script>

<style scoped>
canvas {
  border: 1px solid #ccc;
  background: white;
}
</style> 
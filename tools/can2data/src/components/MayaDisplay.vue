<template>
  <div class="flex flex-col items-center justify-center min-h-[200px] gap-6">
    <div class="relative w-[500px] h-[500px]">
      <div ref="p5Container" class="absolute inset-0"></div>
    </div>
    <div class="flex gap-4">
      <button 
        @click="saveCanvas"
        class="w-32 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        保存图片
      </button>
      <button 
        @click="uploadToIPFS"
        :disabled="isUploading"
        class="w-32 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
      >
        {{ isUploading ? '上传中...' : '上传到IPFS' }}
      </button>
    </div>
    
    <div v-if="ipfsUrl" class="text-sm text-gray-600">
      IPFS链接：<a :href="ipfsUrl" target="_blank" class="text-blue-500 hover:underline">{{ ipfsUrl }}</a>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { renderMain, initData } from './maya.js'
import axios from 'axios'

const p5Container = ref(null)
let p5Canvas = null

const PINATA_API_KEY = import.meta.env.PINATA_API_KEY
const PINATA_SECRET_KEY = import.meta.env.PINATA_SECRET_KEY // 推荐使用 JWT
const PINATA_JWT = import.meta.env.PINATA_JWT
const isUploading = ref(false)
const ipfsUrl = ref('')

onMounted(() => {
  console.log(PINATA_JWT)
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
      p5Canvas = p.createCanvas(500, 500)
      p5Canvas.parent(p5Container.value)
      
      window.width = p.width
      window.height = p.height
      console.log('Canvas size:', p.width, p.height)
      
      initData()
      p.noLoop()
    }

    p.draw = () => {
      renderMain()
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

const uploadToIPFS = async () => {
  if (!p5Canvas || isUploading.value) return
  
  try {
    isUploading.value = true
    ipfsUrl.value = ''
    
    // 获取canvas数据并转换为文件
    const dataUrl = p5Canvas.canvas.toDataURL('image/png')
    const fetchRes = await fetch(dataUrl)
    const blob = await fetchRes.blob()
    const file = new File([blob], `maya_${Date.now()}.png`, { type: 'image/png' })
    
    // 创建 FormData
    const formData = new FormData()
    formData.append('file', file)
    
    // 上传到 Pinata
    const res = await axios.post(
      'https://api.pinata.cloud/pinning/pinFileToIPFS',
      formData,
      {
        headers: {
          //'Authorization': `Bearer ${PINATA_JWT}`,
          // 如果使用 API KEY 方式，则使用以下头部
          'pinata_api_key': PINATA_API_KEY,
          'pinata_secret_api_key': PINATA_SECRET_KEY,
        },
      }
    )
    
    // 构建 IPFS URL
    ipfsUrl.value = `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`
    console.log('上传成功！IPFS Hash:', res.data.IpfsHash)
    
  } catch (error) {
    console.error('上传到IPFS时出错:', error)
    alert('上传失败，请重试')
  } finally {
    isUploading.value = false
  }
}
</script>

<style scoped>
canvas {
  border: 1px solid #ccc;
  background: white;
}
</style> 
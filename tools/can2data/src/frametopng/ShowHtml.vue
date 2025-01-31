<template>
<div>
    <iframe ref="myIframe" :src="`/maya_v3.html?hashseed=${hashseedValue}`" width="550" height="550"></iframe>
    <!-- <iframe ref="myIframe" :src="`${imgURL}?hashseed=${hashseedValue}`" width="550" height="550"></iframe> -->

    <button @click="captureAndSave">截图并保存</button>
    <button @click="updateHash">修改 Hash 值</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { saveAs } from 'file-saver';

const imgURL = 'https://ordinals-testnet.fractalbitcoin.io/preview/9a0977d6425247026a1963347ca188aff0303dad25499aef60d942ac0cb0d590i0'
const hashs = ['MEr26mgKLRQoB6rL', 'znG7gJLZ0Kn7nkG4'];
let counter = 0;

const myIframe = ref(null);
const hashseedValue = ref('MEr26mgKLRQoB6rL'); // 这里是你想要传递的值

const saveToPNG = () => {
  const iframe = myIframe.value;
  //const canvas = iframe.contentWindow.document.getElementById('canvas'); // 获取 p5.js 绘制的 canvas
  const canvases = iframe.contentWindow.document.getElementsByClassName('p5Canvas');
  const canvas = canvases[0];
  console.log(canvas);

  if (canvas) {
    const dataURL = canvas.toDataURL(); // 获取 canvas 的数据 URL
    console.log(dataURL);
    saveAs(dataURL, 'test.png'); // 保存为 PNG
    console.log('截图成功');
  } else {
    console.error('未找到 canvas 元素');
  }
};

const captureAndSave = () => {
  const iframe = myIframe.value;
  if (iframe.contentWindow.document.readyState === 'complete') {
    saveToPNG();
  } else {
    setTimeout(() => {
      saveToPNG();
    }, 1000); // 确保 p5.js 绘制完成
  }
};

const updateHash = () => {
  const iframe = myIframe.value;
  if (iframe.contentWindow) {
    // 修改 hash 值
    counter++;
    hashseedValue.value = hashs[counter % 2];
    console.log('Hash 值已更新为:', hashseedValue.value);
    iframe.src = iframe.src; // 重新设置 src 以确保 onload 事件被触发
  } else {
    console.error('无法访问 iframe 的 contentWindow');
  }
};

</script setup>
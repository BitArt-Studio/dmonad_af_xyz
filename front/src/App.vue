<script setup>
import { onMounted } from 'vue';

import Mint from './components/Mint.vue'
import Home2 from './components/Home2.vue';
import ArtShow from './components/ArtShow.vue';
import Footer from './components/Footer.vue';
import FAQ from './components/FAQ.vue';
import Error from './components/Error.vue';
import Tips from './components/Tips.vue';
import { startFeeRateUpdateTimer } from './components/utils';
import { isShowError, isWalletNotInstalled } from './components/utils';

onMounted(() => {
  startFeeRateUpdateTimer();
});
</script>

<template>
  <div class="bg-gray-900 text-white h-screen overflow-hidden">
    <div class="h-full overflow-y-auto smooth-scroll snap-y snap-mandatory">
      <Home2 id="home" class="snap-start h-screen" />
      <Mint id="mint" class="snap-start h-screen"/>
      <FAQ id="faq" class="snap-start min-h-screen" />
      <ArtShow id="art-show" class="snap-start h-screen" />
      <Footer id="footer" class="snap-start min-h-screen" />
    </div>
    <Error id="error" class="snap-start min-h-screen" 
    v-if="isShowError"  v-model:isShowError="isShowError"
    message="Please use Taproot address. Such as bc1p......"
    title="Only Taproot Address is supported!"
    buttonText="OK"
    />
    <Tips v-if="isWalletNotInstalled" @close="isWalletNotInstalled = false" />

  </div>
</template>

<style>
html, body {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

.smooth-scroll {
  scroll-behavior: smooth;
  scroll-snap-type: y mandatory;
}

.snap-start {
  scroll-snap-align: start;
}

@media (prefers-reduced-motion: no-preference) {
  .smooth-scroll {
    scroll-behavior: smooth;
    transition: scroll-behavior 1.5s;
  }
}
</style>

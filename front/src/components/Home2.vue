<script setup>
import * as Api from '@/api/server';
import { ref, onMounted } from 'vue';
import { useBlockchainStore } from '@/stores/blockchain';
import { storeToRefs } from 'pinia';
import { reGenerate} from './utils';


const blockchainStore = useBlockchainStore();
const { account, loading, errorMsg } = storeToRefs(blockchainStore);

const startBtnText = ref('Connect Wallet');
const isMainnet = ref(import.meta.env.VITE_MODE === 'mainnet');

onMounted(() => {
  if(account.value) {
    startBtnText.value = 'Get Started';
  }
  else {
    startBtnText.value = 'Connect Wallet';
  }
});

async function startConnectWallet() {
  if(!account.value) {
    await connectWalletClick();
    if(!account.value) {
      startBtnText.value = 'Connect Wallet';
      return;
    }

    startBtnText.value = 'Get Started';
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  const mintSection = document.getElementById('mint');
  if (mintSection) {
    mintSection.scrollIntoView({ behavior: 'smooth' });
  }
}

const connectWalletClick = async () => {
  try {
    // 检查是否安装了MetaMask
    if (typeof window.ethereum === 'undefined') {
      alert('请安装MetaMask钱包!');
      return;
    }

    // 连接钱包
    await blockchainStore.connect();

    if (account.value) {
      startBtnText.value = 'Get Started';
      
      // 签名消息以验证身份
      try {
        const signMsg = `
        Welcome to ArtFractal.xyz 
        
        Please Sign to connect your wallet.
        `;
        
        const signature = await window.ethereum.request({
          method: 'personal_sign',
          params: [signMsg, account.value]
        });

        console.log('签名成功:', signature);

        // 验证白名单
        if ((await Api.whiteListValidate(account.value)).isValid) {
          console.log('白名单验证通过');
        }

      } catch (e) {
        console.error('签名失败:', e);
        blockchainStore.disconnect();
        startBtnText.value = 'Connect Wallet';
        return;
      }
    }

    // 监听网络变化
    window.ethereum.on('chainChanged', () => {
      window.location.reload();
    });

    // 监听账户变化
    window.ethereum.on('accountsChanged', async (accounts) => {
      if (accounts.length === 0) {
        blockchainStore.disconnect();
        startBtnText.value = 'Connect Wallet';
      } else {
        blockchainStore.updateAccount(accounts[0]);
        startBtnText.value = 'Get Started';
        await reGenerate();
      }
    });

    await reGenerate();

  } catch (error) {
    console.error('连接钱包失败:', error);
    blockchainStore.disconnect();
    startBtnText.value = 'Connect Wallet';
  }
};



function gotoFaucet(){
  window.open('https://fractal-testnet.unisat.io/explorer/faucet', '_blank');
}

</script>

<template>
  <div class="relative h-full">
    <section class="bg-gray-900 text-white">
      <div class="h-screen w-full overflow-hidden bg-gray-900 flex items-center justify-center">
        <div class="mx-auto max-w-3xl text-center">
          <h1 class="bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text text-3xl font-extrabold text-transparent sm:text-5xl">
            Maya Secco 
          </h1>
          <br/>
          <h3 class="bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text text-2xl font-extrabold text-transparent sm:text-2xl">
            Algorithm Generative Art For Community
          </h3>
          <br/>

          <div class="mt-8 flex flex-wrap justify-center gap-4">
            <button
              @click="startConnectWallet"
              :disabled="loading"
              class="block w-full rounded border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-white focus:outline-none focus:ring active:text-opacity-75 sm:w-auto"
              :class="{ 'opacity-50 cursor-not-allowed': loading }"
            >
              {{ loading ? 'Connecting...' : startBtnText }}
            </button>
          </div>

          <!-- 错误提示 -->
          <div v-if="errorMsg" class="mt-4 text-red-500 text-sm">
            {{ errorMsg }}
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

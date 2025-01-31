<script setup>
import { ref, onMounted, watch, onUnmounted } from 'vue';
import { Icon } from '@iconify/vue';
import Web3 from 'web3';

import * as Api from '@/api/server';
import * as MempoolApi from '@/api/mempool';
import { check, address, reGenerate, hSeed, baseSeedUrl, price, imgLink} from './utils';
import { useContractStore } from '@/stores/contract';
import MayaDisplay from './MayaDisplay.vue'


// 初始化 contract store
const contractStore = useContractStore()

// 添加铸造数量的响应式变量
const mintCount = ref(0)

// 获取已铸造数量的函数
async function getMintCount() {
  try {
    if (contractStore.contract) {
      const count = await contractStore.contract.methods.getTokenCounter().call()
      mintCount.value = Number(count)
    }
  } catch (error) {
    console.error('获取铸造数量失败:', error)
  }
}

// 确保 address 是一个 ref
const addressRef = ref(address.value || '');

// 监听 address 的变化
watch(() => address.value, (newValue) => {
  addressRef.value = newValue || '';
});

const isDialogOpen = ref(false);

const loading = ref(false);
const reLoading = ref(false);
const searchLoading = ref(false);
const radio = ref('Normal');
// const baseMempoolUrl =
//   import.meta.env.VITE_MODE === 'testnet' ? 'https://mempool.space/testnet' : 'https://mempool.space';
const whiteListAddress = ref('');
const isValid = ref(undefined);
const collapse = ref('1');
const executeOrderResponse = ref({
  inscriptionsId: '',
  revealTxHash: '',
});
const blockHeightStart = import.meta.env.VITE_BLOCK_HEIGHT_START;
const blockHeightEnd = import.meta.env.VITE_BLOCK_HEIGHT_END;
// const blockHeightStart = 223000;//2024-11-03:1020
// const blockHeightEnd = 240000;
const timeStart = ref(new Date('2025-01-11'));
const timeEnd = ref(new Date('2025-01-20'));
const restBlock = ref(0);
let curTimeState = ref(1);
//let address = ref('');

const isDisabledRebuild = ref(false);
const rebuildSpaceTime = 2000 ;

const handleRebuild = () => {
  rebuild() // 原有的 rebuild 函数
  isDisabledRebuild.value = true
  
  setTimeout(() => {
    isDisabledRebuild.value = false
  }, rebuildSpaceTime)
}

async function whiteListSearch() {
  if (whiteListAddress.value.length <= 0) {
    // ElNotification.error({
    //   title: 'Whitelist',
    //   message: 'Please input wallet address',
    // });
  } else {
    try {
      searchLoading.value = true;
      isValid.value = (await Api.whiteListValidate(whiteListAddress.value)).isValid;
    } finally {
      searchLoading.value = false;
    }
  }
}

// 添加上传图片的函数
async function uploadImage(hseed, base64Image) {
  try {
    const response = await fetch('https://ngtest.bastudio.xyz/api/upload/image64', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        hseed,
        collectId: 'maya', // 使用 hseed 作为 collectId
        base64Image
      })
    });
    
    if (!response.ok) {
      throw new Error('上传图片失败');
    }
    
    return await response.json();
  } catch (error) {
    console.error('上传图片失败:', error);
    throw error;
  }
}

const artworkIframe = ref(null);

// 添加ref用于访问MayaDisplay组件
const mayaDisplayRef = ref(null)

async function mintClick() {
  try {
    loading.value = true
    
    if (!ethAddress.value) {
      console.error('钱包地址未连接')
      return
    }

    if (!hSeed.value) {
      console.error('请先生成艺术作品')
      return
    }
    
    // 获取最新的base64数据
    window.artworkBase64 = mayaDisplayRef.value?.getCanvasBase64_500()
    console.log(window.artworkBase64)
    
    // 准备支付金额
    const payAmount = contractStore.web3.utils.toWei(price.value.toString(), 'ether')
    
    // 检查余额
    await contractStore.checkBalance(ethAddress.value, payAmount)
    
    // 执行铸造
    const tx = await contractStore.mint(ethAddress.value, hSeed.value, payAmount)
    
    if (tx.status) {
      console.log('Mint successful!')
          // 尝试上传图片
      if (window.artworkBase64) {
        try {
          await uploadImage(hSeed.value, window.artworkBase64);
          console.log('b64数据处理成功');
        } catch (error) {
          console.error('上传图片失败:', error);
          // 继续执行铸造流程
        }
      }
      await getMintCount() // 更新铸造数量
      await reGenerate() // 重新生成新的作品
    }

  } catch (error) {
    console.error('Mint failed:', error)
    // 可以在这里添加错误提示
  } finally {
    console.log('Mint finished');
    loading.value = false
  }
}

async function rebuild(){
  console.log(ethAddress.value);
  await reGenerate();
}

function openDiaDialog() {
  isDialogOpen.value = true;
}

function closeDiaDialog() {
  isDialogOpen.value = false;
  console.log('closeDiaDialog in Mint.vue');
}

const ethAddress = ref('');

async function getEthAddress() {
  if (window.ethereum) {
    try {
      const web3 = new Web3(window.ethereum)
      const accounts = await web3.eth.requestAccounts()
      ethAddress.value = accounts[0]
      addressRef.value = accounts[0]
    } catch (error) {
      console.error('Error connecting to wallet:', error)
    }
  } else {
    console.log('Please install MetaMask!')
  }
}

// 监听钱包地址变化
if (window.ethereum) {
  window.ethereum.on('accountsChanged', function (accounts) {
    ethAddress.value = accounts[0]
    addressRef.value = accounts[0]
  })
}

// 初始化合约的函数
async function initializeContract() {
  try {
    await contractStore.initialize()
    await contractStore.validateNetwork()
  } catch (error) {
    console.error('合约初始化失败:', error)
    // 这里可以添加错误提示
  }
}

// 计算剩余时间（精确到分钟）
function calculateRemainingTime() {
  const now = new Date()
  const end = new Date(timeEnd.value)
  
  // 如果已经超过结束时间，返回0
  if (now >= end) {
    return 0
  }
  
  // 计算时间差（毫秒）
  const diffMs = end - now
  
  // 转换为分钟并向上取整
  const remainingMinutes = Math.ceil(diffMs / (1000 * 60))
  
  return remainingMinutes
}

// 创建响应式的剩余时间
const remainingMinutes = ref(calculateRemainingTime())

// 每分钟更新一次剩余时间
onMounted(() => {
  // 初始计算
  remainingMinutes.value = calculateRemainingTime()
  
  // 设置定时器，每分钟更新一次
  const timer = setInterval(() => {
    remainingMinutes.value = calculateRemainingTime()
  }, 60000) // 60000ms = 1分钟
  
  // 在组件卸载时清除定时器
  onUnmounted(() => {
    clearInterval(timer)
  })
})

// 监听钱包地址变化，重新验证网络
watch(ethAddress, async (newAddress) => {
  if (newAddress) {
    await contractStore.validateNetwork()
  }
})

watch(hSeed, (newValue, oldValue) => {
  console.log('hSeed changed:', oldValue, '->', newValue)
  // 这里可以添加额外的逻辑，比如强制更新iframe
})

// 中文格式 (2025年01月11日)
function formatDate(date) {
  const d = new Date(date)
  const year = String(d.getFullYear()).slice(2)
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}/${month}/${day}`
}

// 组件加载时初始化
onMounted(async () => {
  try {
    // 连接钱包
    await getEthAddress()
    
    // 初始化合约
    await initializeContract()
    
    // 获取铸造数量
    await getMintCount()
    
    // 定时更新铸造数量
    const mintCountTimer = setInterval(async () => {
      await getMintCount()
    }, 30000) // 每30秒更新一次
    
    // 设置定时器更新剩余时间
    remainingMinutes.value = calculateRemainingTime()
    const timer = setInterval(() => {
      remainingMinutes.value = calculateRemainingTime()
    }, 60000)
    
    onUnmounted(() => {
      clearInterval(timer)
      clearInterval(mintCountTimer)
    })
    
    console.log('Mint.vue onMounted', ethAddress.value)
  } catch (error) {
    console.error('初始化失败:', error)
  }
})

</script>

<template>
  <section class="relative min-h-screen flex flex-col bg-gray-900 text-white overflow-y-auto lg:overflow-y-hidden">
    <div class="flex-grow flex flex-col items-center justify-center p-4 mx-auto lg:p-6 lg:py-24 lg:flex-row lg:justify-between lg:items-center">
      <div :key="hSeed" class="flex items-center justify-center mt-4 lg:mt-0 lg:w-[600px] mb-6 lg:mb-0">
        <MayaDisplay ref="mayaDisplayRef" />
      </div>
      <div class="flex flex-col justify-center p-4 lg:p-6 text-center rounded-sm lg:max-w-md xl:max-w-lg lg:text-left">
        <div class="mb-8 lg:mb-8">
          <!-- 
            <h2 class="text-base lg:text-2xl font-normal leading-none text-gray-200 mb-3 lg:mb-1">Algorithm Generative Art</h2>
          -->
          <h1 class="text-2xl lg:text-4xl font-bold leading-none text-purple-600 mb-3 lg:mb-1">
            Maya Secco
          </h1>
          <h2 class="text-base lg:text-xl font-bold leading-none text-gray-500">Algorithmic Artworks by
            <a href="https://x.com/redstone_bit" target="_blank" class="text-amber-800">RedStone</a>
          </h2>
        </div>

        <div class="mb-8 lg:mb-16 text-center lg:text-left">
          <div class="font-bold flex items-center justify-center lg:justify-start text-gray-300 mt-6 mb-2">
            <Icon icon="material-symbols:price-change-rounded" class="mr-2 text-gray-100" />
            Price
          </div>
          <h4 class="text-base lg:text-xl font-normal leading-none text-violet-700 mb-3 lg:mb-1 lg:ml-4">
            <span class="text-yellow-500">{{ price }} </span>
            $DMON
          </h4>
          <div class="font-bold flex items-center justify-center lg:justify-start text-gray-300 mt-6 mb-2">
            <Icon icon="clarity:block-solid" class="mr-2 text-gray-100" />
            Time Range
          </div>
          <h4 class="text-base lg:text-xl font-normal leading-none text-violet-700 mb-3 lg:mb-1 lg:ml-4">
            {{ formatDate(timeStart) }} ~ {{ formatDate(timeEnd) }}
          </h4>
          <div class="font-bold flex items-center justify-center lg:justify-start text-gray-300 mt-6 mb-2">
            <Icon icon="game-icons:sands-of-time" class="mr-2 text-gray-100" />
            Mint Count
          </div>
          <h4 class="text-base lg:text-xl font-normal leading-none text-amber-800 ml-4">
            {{ mintCount }} / 10000
          </h4>

        </div>
        <div class="mb-4">
          <div class="flex flex-col space-y-4 sm:items-center sm:justify-center sm:flex-row sm:space-y-0 sm:space-x-4 lg:justify-start">
            <button
              v-if="ethAddress"
              @click="handleRebuild"
              :disabled="isDisabledRebuild || loading"
              class="block w-full rounded border px-12 py-3 text-sm font-medium focus:outline-none focus:ring active:text-opacity-75 sm:w-auto transition duration-300"
              :class="{ 
                'opacity-50 cursor-not-allowed': isDisabledRebuild || loading,
                'cursor-pointer hover:bg-gray-200 hover:text-gray-800': !isDisabledRebuild 
              }">
                {{ isDisabledRebuild ? 'Waiting' : loading ? 'Waiting' : 'Rebuild' }}
            </button>
            <button
              v-if="curTimeState != 1"
              class="block w-full rounded border border-gray-600 bg-gray-600 px-12 py-3 text-sm font-medium text-white cursor-not-allowed sm:w-auto">
              {{ curTimeState == 0 ? 'Waiting To Start' : 'Finished' }}
            </button>
            <button
              v-else-if="!ethAddress"
              @click="getEthAddress"
              class="block w-full rounded border border-gray-600 bg-gray-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-white focus:outline-none focus:ring active:text-opacity-75 sm:w-auto">
              Connect Wallet
            </button>
            <button
              v-else
              @click="mintClick"
              :disabled="loading"
              class="block w-full rounded border border-violet-600 bg-violet-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-white focus:outline-none focus:ring active:text-opacity-75 sm:w-auto"
              :class="{ 'opacity-50 cursor-not-allowed': loading }">
              {{ loading ? 'Minting' : 'Mint' }}
            </button>
            </div>
          </div>
      </div>
    </div>
    <div v-if="loading" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-black p-6 rounded-lg shadow-lg flex flex-col items-center gap-4">
      <svg class="animate-spin h-10 w-10 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p class="text-orange-300">Minting in progress, please wait for moment.</p>
    </div>
  </div>
  </section>

</template>

<style scoped>
@media (max-width: 1023px) {
  section {
    height: auto;
    min-height: 100vh;
  }
}
</style>

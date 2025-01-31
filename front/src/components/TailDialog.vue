<script setup>
import { ref, watch, onMounted } from 'vue';
import * as Api from '@/api/server';
import { check, address, reGenerate, sendFail ,feeRate , price, NFT_PRICE,
  baseSeedUrl, hSeed, mintFail, changeRadio, updateFeeRate, baseMempoolUrl} from './utils';
import Error from './Error.vue';

const props = defineProps({
  isOpen: Boolean,
  onClose: Function,
});

const dialogVisible = ref(false);
const tipsDialog = ref(false);
const step = ref(0);  // 将默认值设置为 0
const loading = ref(false);
const txId = ref('');

// 添加新的 ref 来跟踪选中的按钮
const selectedButton = ref('Normal');

onMounted(() => {
  updateFeeRate();
  selectedButton.value = 'Normal';
  changeRadio(selectedButton.value);
});

// 添加新的函数来处理按钮点击
function handleButtonClick(buttonName) {
  selectedButton.value = buttonName;
  changeRadio(selectedButton.value);
}

const saveOrderResponse = ref({
  payAddress: '',
  estimateFee: 1,
  orderId: '',
});

const executeOrderResponse = ref({
  inscriptionsId: '',
  revealTxHash: '',
});

// 修改 watch 函数
watch(() => props.isOpen, async (newValue) => {
  if (newValue) {
    try {
      loading.value = true;
      dialogVisible.value = true;  // 只有在 saveOrder 成功后才显示对话框

    } catch (error) {
      console.error('保存订单出错:', error);
      // 可以在这里添加错误处理逻辑
    } finally {
      loading.value = false;
    }
  } else {
    dialogVisible.value = false;
    step.value = 0;
  }
}, { immediate: true });

// 添加新的 watch 函数
watch(() => address.value, (newAddress, oldAddress) => {
  console.log('address changed:', oldAddress, newAddress);
  if (dialogVisible.value && newAddress !== oldAddress) {
    step.value = 0;
    selectedButton.value = 'Normal';
    changeRadio(selectedButton.value);
    reGenerate();

    tipsDialog.value = true;
  }
});

function handleClose() {
  dialogVisible.value = false;
  step.value = 0;  // 关闭对话框时，将 step 设置为 0
  selectedButton.value = 'Normal';

  props.onClose();
}

async function handleNext() {
  if (step.value === 0) {
    saveOrderResponse.value = await Api.saveOrder(address.value, feeRate.value);
      console.log(saveOrderResponse.value);
      if (saveOrderResponse.value) {
        step.value = 1;
      }
  } else if (step.value === 1) {
    await handleMint();
  }
}

async function handleMint() {
  console.log('Minting...');

  try {
    await check();

    try {
      loading.value = true;
      txId.value = await window.unisat.sendBitcoin(
        saveOrderResponse.value.payAddress,
        saveOrderResponse.value.estimateFee,
      );
      if (txId.value) {
        step.value = 2; // 当 txId 有效时，将 step 设置为 2
        sendFail.value = false;
      }
    } catch (e) {
      sendFail.value = true;
      throw e;
    }

    executeOrderResponse.value = await Api.executeOrder(saveOrderResponse.value.orderId);
    console.log(executeOrderResponse.value);
    console.log(executeOrderResponse.value.revealTxHash);

    if (executeOrderResponse.value.revealTxHash) {
      step.value = 3; // 当 revealTxHash 有效时，将 step 设置为 3
    }

  } catch (e) {
    console.log(e);
    // 如果发生错误，保持 step 为 0
    //step.value = 0;
  } finally {
    loading.value = false;

    if ((await Api.whiteListValidate(address.value)).isValid == false) 
    {
      price.value = NFT_PRICE;
    }
    else {
      price.value = 0;
    }
    await reGenerate();
  }
}

function getStepColor(index) {
  if (step.value === 0 && index === 0) return 'text-gray-300';
  if (step.value === 1) {
    if (index === 0) return 'text-violet-500';
    if (index === 1) return 'text-gray-300';
  }
  if (step.value === 2) {
    if (index === 0 || index === 1) return 'text-violet-500';
    if (index === 2) return 'text-gray-300';
  }
  if (step.value >= 3) {
    return 'text-violet-500';
  }
  return 'text-gray-500';
}

function getStepBgColor(index) {
  if (step.value === 0 && index === 0) return 'bg-gray-400';
  if (step.value === 1) {
    if (index === 0) return 'bg-violet-600';
    if (index === 1) return 'bg-gray-400';
  }
  if (step.value === 2) {
    if (index === 0 || index === 1) return 'bg-violet-600';
    if (index === 2) return 'bg-gray-400';
  }
  if (step.value >= 3) {
    return 'bg-violet-600';
  }
  return 'bg-gray-700';
}

// function handleVerification() {
//   //const faucetUrl = `https://faucet.artfractal.xyz?address=${encodeURIComponent(address.value)}`;

//   const faucetUrl = `http://localhost:5174/?address=${encodeURIComponent(address.value)}`;
//   window.open(faucetUrl, '_blank');
// }

</script>

<template>
  <div v-if="dialogVisible" class="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50">
    <div class="bg-gray-900 p-6 rounded-lg w-full max-w-2xl" style="height: 610px; display: flex; flex-direction: column;">
      <div class="text-blue-500 text-xs font-normal mb-4 text-left">Minting</div>
      <div class="flex-grow flex flex-col overflow-hidden">
        <div class="flex justify-center mb-6">
          <div class="w-7/12 flex items-center space-x-4">
            <div v-for="(s, index) in ['Select Fee Rate','Pay $FB', 'Finish Minting']" :key="index" class="flex-1 flex flex-col items-center">
              <div class="mb-2 text-sm" :class="getStepColor(index)">{{ s }}</div>
              <div class="w-16 h-2 rounded-sm" :class="getStepBgColor(index)"></div>
              <div class="mt-1 text-sm" :class="getStepColor(index)">{{ index + 1 }}</div>
            </div>
          </div>
        </div>
        <!-- <h3>step: {{ step }}</h3> -->
        <div class="flex-grow overflow-y-auto text-center">
          <!-- <div class="text-white text-sm mb-2">当前步骤: {{ step }}</div> -->
          <div v-if="step === 0" class="flex flex-col space-y-4">
            <iframe 
              class="w-[200px] h-[200px] object-cover mx-auto"
              :src="`${baseSeedUrl}/${hSeed}`"
            ></iframe>

            <div class="text-blue-500 text-[15px]">
              <div >Please check your art NFT and select fee rate.</div>
            </div>
            <div class="flex justify-center"> <!-- 新增的容器 -->
              <span
                class="inline-flex -space-x-px overflow-hidden rounded-md border bg-gray-900 shadow-sm border-gray-800 bg-gray-900"
              >
                <button
                  v-for="buttonName in ['Slow', 'Normal', 'Fast']"
                  :key="buttonName"
                  @click="handleButtonClick(buttonName)"
                  :class="[
                    'inline-block px-4 py-2 text-sm font-medium focus:relative',
                    selectedButton === buttonName ? 'bg-blue-600 text-white' : 'text-gray-200 hover:bg-gray-800'
                  ]"
                >
                  {{ buttonName }}
                </button>
              </span>
            </div>
            <div class="text-white">
              Fee Rate : {{ feeRate }}
              <span class="ml-2">sat/vB</span>
            </div>
          </div>
          <div v-if="step === 1" class="flex flex-col space-y-4 mt-4">
            <div class="text-blue-500 text-xl mb-8">
              <div v-if="!sendFail">Please sign transaction for your inscription.</div>
              <div v-else>Send $FB fail, you can try again.</div>
            </div>

            <div class="text-white" style="margin-bottom: 2rem;">Inscription will go to the address: {{ address }}</div>
            <div class="text-white">
              Price: {{ price }} 
              <span class="ml-2">$FB</span>
            </div>
            <div class="text-white">
              Gas Fee: {{ (saveOrderResponse.estimateFee - price*1e8) / 1e8 }} 
              <span class="ml-2">$FB</span>
            </div>
            <div class="text-white">
              Total Fee: {{ saveOrderResponse.estimateFee / 1e8 }}
              <span class="ml-2">$FB</span>
            </div>
          </div>
          <div v-else-if="step === 2" class="flex flex-col space-y-4 pt-12">
            <div class="text-violet-500 text-xl mb-8">
              <div>Payment successful.</div>
            </div>

            <div class="">
              <div class="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-violet-600 mx-auto mb-8"></div>
              <div class="text-amber-600">Inscribing ......</div>
              <div class="text-amber-600">Please wait for a moment.</div>

            </div>
          </div>
          <div v-else-if="step === 3" class="flex flex-col space-y-4 mt-12">
            <div v-if="!mintFail">
              <div class="text-violet-500 text-xl mb-8">Inscription Successful.</div>
              <div class="flex justify-center mb-8">
                <span class="text-green-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-20"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                  </svg>
                </span>
              </div>

              <div class="text-grey-500 text-[17px] mb-4">Check on-chain progress through the following link:</div>
              <div class="text-blue-600 hover:text-blue-300 block w-4/5 mx-auto text-[17px]">
                <a :href="baseMempoolUrl + executeOrderResponse.revealTxHash" 
                  target="_blank" 
                  rel="noopener noreferrer">
                  <span class="block break-all">
                    {{ baseMempoolUrl + executeOrderResponse.revealTxHash }}
                  </span>
                </a>
              </div>
            </div>
            <div v-else>
              <div class="text-amber-500 text-xl mb-12">Inscription Failed.</div>
              <div class="text-grey-500 text-xl mb-4">Please Contact the customer service:</div>
              <a href="https://t.me/colormasksat" 
                  target="_blank" 
                  rel="noopener noreferrer">
                  <span class="block break-all text-blue-600">
                    TG @colormasksat 
                  </span>
                </a>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-6 flex flex-col space-y-2">
        <button 
          v-if="step === 0" 
          @click="handleNext" 
          class="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300"
        >
          Next
        </button>
        <button 
          v-if="step === 1" 
          @click="handleNext" 
          class="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300"
        >
          Inscribe
        </button>
        <button 
          v-if="step === 0 || step === 1" 
          @click="handleClose" 
          class="w-full px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition duration-300"
        >
          Cancel
        </button>
        <!-- <button 
          v-if="step === 3" 
          @click="handleVerification" 
          class="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300"
        >
          Whitelist Verification
        </button> -->
        <button 
          v-if="step === 3" 
          @click="handleClose" 
          class="w-full px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition duration-300"
        >
          Close
        </button>
      </div>
    </div>
    <Error v-if="tipsDialog" @close="tipsDialog = false" title="Warning: Address Changed!" message="NFT has been regenerated, please check again."/>
  </div>
</template>
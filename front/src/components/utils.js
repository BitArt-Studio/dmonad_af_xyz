import { ref } from 'vue';
import * as Api from '@/api/server';
import * as MempoolApi from '@/api/mempool';

export const NFT_PRICE = 0.01;
export const address = ref('');
export const sendFail = ref(false);
export const feeRate = ref(1);
export const hSeed = ref('');
export const price = ref(NFT_PRICE);
export const mintFail = ref(false);

export const baseMempoolUrl = `${import.meta.env.VITE_MEMPOOL_BASE_URL}/zh/tx/`;

export const baseSeedUrl = `${import.meta.env.VITE_API_BASEURL}/seed/seedHTML`;
//export const baseSeedUrl = `https://t.bastudio.xyz/app/seed/seedHTML`;

export const imgLink = import.meta.env.VITE_PREVIEW_URL;

export const isShowError = ref(false);
export const isWalletNotInstalled = ref(false);

const feeRateMap = ref({
  Slow: 0,
  Normal: 0,
  Fast: 0,
});

export function changeRadio(val) {
  feeRate.value = feeRateMap.value[val];
}

export function handleAccountsChanged(accounts) {
console.log('handleAccountsChanged:', accounts);
address.value = accounts[0];
check();
}

export function checkWalletInstalled() {
  if (typeof window.unisat === 'undefined') {
    isWalletNotInstalled.value = true;
    return false;
  }
  return true;
}

export async function check() {
  try {
    if (!address.value) {
      return false;
    }
    
    if (!address.value.startsWith('bc1p')) {
      isShowError.value = true;
      return false;
    }
    
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

let arrBtcAddr = [
  'bc1psyx2u455quge797z88yrzldld2fspggqq3x0apg4vgsatzkw8tqqqzuevv', 
  'bc1pvzd4rezrvp4ngjayrt473rfnssqpqdkkavga4dkk42cem5lzkjms4ydq4g'];

let btcAddrIndex = 0;

export async function reGenerate() {
  try {
    console.log('reGenerate');
    const addressBTC = arrBtcAddr[btcAddrIndex];
    btcAddrIndex = (btcAddrIndex + 1) % arrBtcAddr.length;
    const randomUsableSeedRes = await Api.randomUsableSeed(addressBTC);
    console.log('randomUsableSeedRes', randomUsableSeedRes);
    hSeed.value = randomUsableSeedRes.hSeed;
    //console.log(hSeed.value);

    sendFail.value = false;

  } catch (e) {
    console.error(e);
  }
}

export async function updateFeeRate() {
try {
  const data = await MempoolApi.getFeeRate();
  feeRate.value = Math.ceil(data.fastestFee);
  feeRateMap.value = {
    Slow: Math.ceil(data.minimumFee),
    Normal: Math.ceil(data.halfHourFee),
    Fast: Math.ceil(data.fastestFee),
  };
  changeRadio('Normal');
  console.log('Fee rate updated:', feeRate.value);
} catch (error) {
  console.error('更新费率时出错:', error);
}
}


// 定时器函数
export function startFeeRateUpdateTimer() {
  updateFeeRate();
  setInterval(updateFeeRate, 60000); // 每分钟更新一次
}

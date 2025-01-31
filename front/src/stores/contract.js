import { defineStore } from 'pinia'
import Web3 from 'web3'

export const useContractStore = defineStore('contract', {
  state: () => ({
    web3: null,
    contract: null,
    abi: null,
    config: null,
  }),
  
  actions: {
    async initialize() {
      if (!window.ethereum) {
        throw new Error('请安装 MetaMask!')
      }
      
      this.web3 = new Web3(window.ethereum)
      
      // 获取合约ABI和配置
      const [abiResponse, configResponse] = await Promise.all([
        fetch('/config/abi.json'),
        fetch('/config/config.json')
      ])
      
      const [abi, config] = await Promise.all([
        abiResponse.json(),
        configResponse.json()
      ])
      
      this.abi = abi
      this.config = config
      this.contract = new this.web3.eth.Contract(abi, config.CONTRACT_ADDRESS)
    },
    
    async validateNetwork() {
      const chainId = await this.web3.eth.getChainId()
      const expectedChainId = this.config.NETWORK.ID
      if (chainId != expectedChainId) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: `0x${expectedChainId.toString(16)}` }],
          })
        } catch (switchError) {
          throw new Error(`请切换到正确的网络 (Chain ID: ${expectedChainId})`)
        }
      }
    },

    async mint(address, seed, payAmount) {
      try {
        // 估算gas
        const gasEstimate = await this.contract.methods.mint(seed).estimateGas({
          from: address,
          value: payAmount
        }).catch(e => {
          console.error('Gas估算失败:', e)
          throw new Error('合约调用可能会失败，请检查参数')
        })

        console.log('预估gas:', gasEstimate)
        
        // 调用合约的mint函数
        const tx = await this.contract.methods.mint(seed).send({
          from: address,
          value: payAmount,
          gas: 200000 // 设置适当的gas限制
        })
        
        console.log('Mint transaction:', tx)
        return tx
        
      } catch (error) {
        throw error
      }
    },

    async checkBalance(address, amount) {
      const balance = await this.web3.eth.getBalance(address)
      if (BigInt(balance) < BigInt(amount)) {
        throw new Error('余额不足')
      }
      return true
    }
  }
}) 
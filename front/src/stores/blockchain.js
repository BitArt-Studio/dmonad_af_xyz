import { defineStore } from 'pinia'
import Web3 from 'web3'
import { useDataStore } from './data'

export const useBlockchainStore = defineStore('blockchain', {
  state: () => ({
    loading: false,
    account: null, 
    smartContract: null,
    web3: null,
    errorMsg: ''
  }),

  actions: {
    async connect() {
      this.loading = true
      try {
        // 加载ABI
        const abiResponse = await fetch('/config/abi.json')
        const abi = await abiResponse.json()
        
        // 加载配置
        const configResponse = await fetch('/config/config.json')
        const CONFIG = await configResponse.json()

        const { ethereum } = window
        const metamaskIsInstalled = ethereum && ethereum.isMetaMask

        if (metamaskIsInstalled) {
          let web3 = new Web3(ethereum)
          
          const accounts = await ethereum.request({
            method: 'eth_requestAccounts'
          })

          const networkId = await ethereum.request({
            method: 'net_version'
          })

          if (networkId == CONFIG.NETWORK.ID) {
            const SmartContractObj = new web3.eth.Contract(
              abi,
              CONFIG.CONTRACT_ADDRESS
            )

            this.account = accounts[0]
            this.smartContract = SmartContractObj
            this.web3 = web3
            this.errorMsg = ''

            // 添加事件监听
            ethereum.on('accountsChanged', (accounts) => {
              this.updateAccount(accounts[0])
            })

            ethereum.on('chainChanged', () => {
              window.location.reload()
            })

          } else {
            this.errorMsg = `Change network to ${CONFIG.NETWORK.NAME}.`
          }
        } else {
          this.errorMsg = 'Install Metamask.'
        }
      } catch (err) {
        this.errorMsg = 'Something went wrong.'
        console.error(err)
      } finally {
        this.loading = false
      }
    },

    updateAccount(account) {
      this.account = account
      const dataStore = useDataStore()
      dataStore.fetchData()
    },

    // 添加 disconnect 方法
    disconnect() {
      this.account = null
      this.web3 = null
      this.smartContract = null
      this.errorMsg = ''
    }
  }
}) 
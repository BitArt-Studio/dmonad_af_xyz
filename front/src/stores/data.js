import { defineStore } from 'pinia'
import { useBlockchainStore } from './blockchain'

export const useDataStore = defineStore('data', {
  state: () => ({
    loading: false,
    totalSupply: 0,
    cost: 0,
    error: false,
    errorMsg: ''
  }),

  actions: {
    async fetchData() {
      this.loading = true
      try {
        const blockchainStore = useBlockchainStore()
        const contract = blockchainStore.smartContract

        if (contract) {
          const totalSupply = await contract.methods.MAX_NUM().call()  // 获取 MAX_APES

          this.totalSupply = totalSupply
          // this.cost = cost
          this.error = false
          this.errorMsg = ''
        }
      } catch (err) {
        console.error(err)
        this.error = true
        this.errorMsg = 'Could not load data from contract.'
      } finally {
        this.loading = false
      }
    }
  }
}) 
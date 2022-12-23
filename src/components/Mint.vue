<script setup lang="ts">
import { ethers, providers } from 'ethers'
import useDeployStore from '@/store/deploy'
import abi from '@/abi/activity'
import { ElMessage, ElMessageBox } from 'element-plus'
const store = useDeployStore()

const curAccount = ref('')

const txHash = ref('')

const loading = ref(false)
const mint = async () => {
  const provider = await getProvider(true)
  if (!provider) return

  loading.value = true
  try {
    const provider = new providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    let contract = new ethers.Contract(store.worldCupContractAddr, abi, signer)
    // TODO
    const result = await contract.mint()
    const wait = await result.wait()
    ElMessage.success('mint success')
    loading.value = false

    txHash.value = result.hash
  } catch (err: any) {
    logErr(err)
    loading.value = false

    if (err.code && err.code != 'ACTION_REJECTED') {
      ElMessageBox.alert(err.reason || err.message)
    }
  }
}

onMounted(async () => {
  if (!window.ethereum) return

  const provider = new providers.Web3Provider(window.ethereum)
  const accounts = await provider.send('eth_requestAccounts', [])
  console.log(
    '%c [ accounts ]-37',
    'font-size:13px; background:pink; color:#bf2c9f;',
    accounts
  )
  curAccount.value = accounts[0]

  window.ethereum.on('accountsChanged', (e: any) => {
    curAccount.value = e[0]
  })
})
</script>
<template>
  <div class="mint-wrap">
    <el-card class="box-card" :class="{ 'current-step': store.step === 'whiteList' }">
      <template #header>
        <div class="card-header">
          <h1><span v-if="store.startFrom !== 'whiteList'">5. </span>Mint</h1>
        </div>
      </template>
      <div class="card-info">
        <div class="flex-align">
          <div>Mint method</div>
          <div class="code-wrap">
            <img src="../assets/svg/mint.svg" alt="">
          </div>
        </div>
        <el-row justify="end" class="mb20">
          <el-button type="primary" :loading="loading" @click="mint" :disabled="store.step !== 'whiteList'">
            Mint
          </el-button>
        </el-row>

        <el-row v-if="txHash">
          <a :href="`${store.scanUrl}${txHash}`" target="_blank">
            <span class="contract-addr">
              txn: {{ txHash.substring(0, 10) + '......' }}
            </span>
          </a>
        </el-row>
      </div>
    </el-card>
  </div>
</template>
<style lang="scss">
.code-wrap {
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 4px;
  color: #FFFFFF;
  font-weight: 400;
  font-size: 14px;
  line-height: 32px;
  margin-left: 16px;
  img {
    display: block;
    width: 100%;
    max-width: 240px;
  }
}
@media screen and (max-width: 992px) {
  .mint-wrap {
    .card-info {
      .flex-align {
        display: block;
        .code-wrap {
          width: 100%;
          max-width: 240px;
          margin: 14px 0;
        }
      }
    }
  }
}
</style>

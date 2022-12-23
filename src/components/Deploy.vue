<script setup lang="ts">
import useDeployStore from '@/store/deploy'
import { ethers, providers } from 'ethers'
import {
  ElMessageBox,
} from 'element-plus'
import jsonStr from '../deploy/SemanticSBTV2.json'
import worldcupJsonStr from '../deploy/ActivityV2.json'
const store = useDeployStore()

var jsonInfo = jsonStr // JSON.parse(jsonStr)
var jsonAbi = jsonInfo.abi
var bytecode = jsonInfo.bytecode

const loading = ref(false)
const onDeploySeman = async () => {

  const provider = await getProvider()
  if (!provider) return

  loading.value = true
  try {
    const provider = new providers.Web3Provider(window.ethereum)
    const accounts = await provider.send('eth_requestAccounts', [])
    const signer = provider.getSigner()

    let factory = new ethers.ContractFactory(jsonAbi, bytecode, signer)
    let contractObj = await factory.deploy()

    const res = await contractObj.deployed()
    store.semanticContractAddr = contractObj.address
    store.semanticTxHash = contractObj.deployTransaction.hash
    loading.value = false
    if (store.worldCupContractAddr) {
      store.step = 'initSemantic';
    }
    
  } catch (err: any) {
    logErr(err)
    loading.value = false
    if (err.code && err.code != 'ACTION_REJECTED') {
      ElMessageBox.alert(err.reason || err.message)
    }
  }
}

const deployingWorldcup = ref(false)
const onDeployWorldcup = async () => {
  const provider = await getProvider()
  if (!provider) return

  deployingWorldcup.value = true
  try {
    const provider = new providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()

    let factory = new ethers.ContractFactory(
      worldcupJsonStr.abi,
      worldcupJsonStr.bytecode,
      signer
    )
    let contractObj = await factory.deploy()

    const res = await contractObj.deployed()
    store.worldCupContractAddr = contractObj.address
    store.worldCupTxHash = contractObj.deployTransaction.hash
    deployingWorldcup.value = false
    if (store.semanticContractAddr) {
      store.step = 'initSemantic';
    }
  } catch (err: any) {
    logErr(err)
    deployingWorldcup.value = false
    if (err.code && err.code != 'ACTION_REJECTED') {
      ElMessageBox.alert(err.reason || err.message)
    }
  }
}
</script>
<template>
  <div class="deploy-wrap">
    <el-card class="box-card" :class="{ 'current-step': store.step === 'deploy' }">
      <template #header>
        <div class="card-header">
          <h1>1. Contract deployment</h1>
        </div>
      </template>
      <div class="card-info">
        <div class="flex info-item">
          <p class="pr20">
            SBT contract is the data contract of Semantic SBT and the contract
            queried by third-party platforms (such as opensea)
          </p>
          <el-button
            type="primary"
            :loading="loading"
            :disabled="!store.owner || !!store.semanticContractAddr || store.step !== 'deploy'"
            @click="onDeploySeman"
          >
            {{ !!store.semanticContractAddr ? 'Completed' : 'Deploy SBT contract' }}
          </el-button>
        </div>

        <div v-show="store.semanticContractAddr">
          <a :href="`${store.scanUrl}${store.semanticTxHash}`" target="_blank">
            <span class="contract-addr">
              {{ store.semanticContractAddr }}
            </span>
          </a>
        </div>
        <div class="flex info-item">
          <p class="pr20">
            The verification contract is used to complete business settings. To
            add a white list, you need to deploy the contract
          </p>
          <el-button
            type="primary"
            :loading="deployingWorldcup"
            :disabled="!store.owner || !!store.worldCupContractAddr || store.step !== 'deploy'"
            @click="onDeployWorldcup"
          >
            {{ !!store.worldCupContractAddr ? 'Completed' : 'Deploy verification contract' }}
          </el-button>
        </div>

        <div v-show="store.worldCupContractAddr">
          <a :href="`${store.scanUrl}${store.worldCupTxHash}`" target="_blank">
            <span class="contract-addr">
              {{ store.worldCupContractAddr }}
            </span>
          </a>
        </div>
      </div>
    </el-card>
  </div>
</template>

<style lang="scss">
@media screen and (max-width: 992px) {
  .deploy-wrap {
    .card-info {
      .info-item {
        display: block;
      }
      .contract-addr {
        display: inline-block;
        width: 100%;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
      }
    }
  }
}
</style>
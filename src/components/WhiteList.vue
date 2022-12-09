<script setup lang="ts">
import useDeployStore from '@/store/deploy'
import { ethers, providers } from 'ethers'
import {
  ElMessage,
  ElMessageBox,
  FormInstance,
  FormRules
} from 'element-plus'
import abi from '@/abi/activity'
const store = useDeployStore()

const loading = ref(false)

const ruleFormRef = ref<FormInstance>()
const form = reactive({ whitelist: '' })
const rules = reactive<FormRules>({
  whitelist: [{ required: true, trigger: 'blur', message: '' }]
})

const formValid = async () => {
  return new Promise((r) => ruleFormRef.value?.validate(r))
}
const submit = async () => {
  const valid = await formValid()
  if (!valid) return

  const provider = await getProvider()
  if (!provider) return

  loading.value = true
  // addWhiteList
  try {
    const provider = new providers.Web3Provider(window.ethereum)
    const accounts = await provider.send('eth_requestAccounts', [])
    if (accounts[0].toLowerCase() !== store.owner.toLowerCase()) {
      ElMessageBox.alert('Please switch account to ' + store.owner)
      loading.value = false
      return
    }
    const signer = provider.getSigner()
    let contract = new ethers.Contract(store.worldCupContractAddr, abi, signer)
    const list = form.whitelist
      .replace(/\s|\n/g, ',')
      .split(',')
      .filter((e) => e)
    const res = await contract.addWhiteList(list)

    const wait = await res.wait()

    for (let index = 0; index < list.length; index++) {
      const e = list[index].toLowerCase()
      if (store.whiteList.indexOf(e) === -1) {
        store.whiteList.push(e)
      }
    }

    ElMessage.success('success')

    closeDialog()
  } catch (err: any) {
    logErr(err)
    if (err.code && err.code != 'ACTION_REJECTED') {
      ElMessageBox.alert(err.reason || err.message)
    }
  }
  loading.value = false
}

const getOldWhiteList = async () => {
  try {
    const provider = await getProvider()
    if (!provider) return
    const signer = provider.getSigner()
    let contract = new ethers.Contract(store.worldCupContractAddr, abi, signer)
    const list = await contract.whiteListRange(0, 10000)

    store.whiteList = list.map((e: any) => e.toLowerCase())
  } catch (err: any) {
    logErr(err)
    if (err.code && err.code != 'ACTION_REJECTED') {
      ElMessageBox.alert(err.reason || err.message)
    }
  }
}

onMounted(async () => {
  if (store.startFrom === 'whiteList') {
    getOldWhiteList()
  }
})

let dialogVisible = ref(false);
const openDialog = () => {
  form.whitelist = ''
  dialogVisible.value = true;
}
const closeDialog = () => {
  dialogVisible.value = false;
}
</script>
<template>
  <div>
    <el-card class="box-card" :class="{ 'current-step': store.step === 'whiteList' }">
      <template #header>
        <div class="card-header">
          <h1><span v-if="store.startFrom !== 'whiteList'">4. </span>Set Whitelist</h1>
        </div>
      </template>
      
      <div class="card-info">
        <el-row justify="space-between" align="top" class="mb20">
          <div class="pr20">
            <div class="mb20">
              设置白名单，这里允许批量输入地址，用“,”分隔即可，建议单次添加1000个地址以内，太多地址可能会上链的大小限制。 
            </div>  
            <VList v-if="store.whiteList.length" />
          </div>
          <div>
            <el-button
              :loading="loading"
              type="primary"
              @click="openDialog"
              :disabled="store.step !== 'whiteList'"
            >
              add
            </el-button>
          </div>
        </el-row>
      </div>
    </el-card>


    <el-dialog
      v-model="dialogVisible"
      title="Initialize SBT contract"
      width="950px"
      :before-close="closeDialog"
      :close-on-click-modal="false"
    >
      <el-form
        :model="form"
        label-width="82px"
        ref="ruleFormRef"
        :rules="rules"
        @submit.prevent
      >
        <el-form-item label="Whitelist" prop="whitelist">
          <div>
            <div class="flex-row whitelist-input">
              <div class="left">
                <el-input
                  :autosize="{ minRows: 16 }"
                  type="textarea"
                  v-model="form.whitelist"
                />
              </div>
              <div class="right">
                <div>Existing whitelists</div>
                <VList />
              </div>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" plain @click="closeDialog">Cancel</el-button>
          <el-button type="success" :loading="loading" @click="submit">
            Add
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss">
.whitelist-input {
  width: 810px;
  .left {
    flex: 1;
    width: 400px;
    margin-right: 24px;
  }
  .right {
    flex: 1;
    width: 400px;
    height: 312px;
    .addr-list, .container {
      height: 100%;
      box-sizing: border-box;
    }
  }
}
</style>

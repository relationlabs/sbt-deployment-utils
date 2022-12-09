<script setup lang="ts">
import { ethers, providers } from 'ethers'
import { FormInstance, FormRules } from 'element-plus'
import useDeployStore from '@/store/deploy'
import { validField } from '@/utils/validtor'
import abi from '@/abi/activity'
const store = useDeployStore()

const initSuccess = ref(false)
const disabled = computed(
  () => !store.owner || !store.worldCupContractAddr || initSuccess.value
)

const ruleFormRef = ref<FormInstance>()
const form = reactive({
  activityName: ''
})
const rules = reactive<FormRules>({
  activityName: [
    { required: true, trigger: 'blur', message: '' },
    {
      validator: (r, v, callback) => {
        if (v.includes('_')) {
          return callback('no underscore')
        }

        if (v.includes(' ')) {
          return callback('no spaces')
        }

        if (!validField(v)) {
          return callback('wrong format')
        }

        return true
      },
      trigger: 'change'
    }
  ]
})

const formValid = async () => {
  return new Promise((r) => ruleFormRef.value?.validate(r))
}
const loading = ref(false)
const initContract = async () => {
  const valid = await formValid()
  if (!valid) return

  const provider = await getProvider()
  if (!provider) return

  loading.value = true
  try {
    const provider = new providers.Web3Provider(window.ethereum)
    const accounts = await provider.send('eth_requestAccounts', [])
    const signer = provider.getSigner()
    let contract = new ethers.Contract(store.worldCupContractAddr, abi, signer)
    
    const res = await contract.initialize(
      store.owner,
      store.semanticContractAddr,
      store.predicate,
      form.activityName,
      store.className
    )

    const wait = await res.wait()
    initSuccess.value = true

    // cache
    saveUserWorldCupAddr(accounts[0], store.worldCupContractAddr)

    loading.value = false
    store.step = 'whiteList'
  } catch (err: any) {
    logErr(err)
    loading.value = false
    if (err.code && err.code != 'ACTION_REJECTED') {
      ElMessageBox.alert(err.reason || err.message)
    }
  }
}
</script>
<template>
  <div class="init-world-cup">
    <el-card class="box-card" :class="{ 'current-step': store.step === 'initWorldCup' }">
      <template #header>
        <div class="card-header">
          <h1>3. Initialize verification contract</h1>
        </div>
      </template>
      <div class="card-info">
        <el-row justify="space-between" align="bottom" class="mb20">
          <el-form
          :model="form"
          ref="ruleFormRef"
          :rules="rules"
          @submit.prevent
        >
          <el-form-item label="Object" prop="activityName">
            <div>
              <el-input v-model="form.activityName" class="activity-input" />
              <div>
                If SBT is an activity, please fill in the name of the
                activity,like"RelationlabsMembership".
              </div>
              <div>
                验证合约的初始化只需要设置Object1个参数，设置为SBT的活动名称即可，类似“RelationlabsMembership”。 
              </div>
              <div>
                完成第三步后，所有的部署及初始化工作都已经完成了，大家可以将合约地址同步给我们进行Mint的联合测试。 
              </div>
            </div>
            
          </el-form-item>
        </el-form>
          <el-button
            type="primary"
            :loading="loading"
            :disabled="disabled || store.step !== 'initWorldCup' || initSuccess"
            @click="initContract"
          >
            {{ initSuccess ? 'Completed' : 'Initialize'}}
          </el-button>
        </el-row>

        <div v-if="initSuccess">
          <div>
            <a :href="`${store.scanUrl}${store.semanticTxHash}`" target="_blank">
              <span class="contract-addr">
                SBT contract: {{ store.semanticContractAddr }}
              </span>
            </a>
          </div>

          <div>
            <a :href="`${store.scanUrl}${store.worldCupTxHash}`" target="_blank">
              <span class="contract-addr">
                Verification contract: {{ store.worldCupContractAddr }}
              </span>
            </a>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<style lang="scss">
.el-upload-list__item + .el-upload {
  width: 0;
  overflow: hidden;
  opacity: 0;
}
.activity-input {
  max-width: 400px;
  width: 100%;
}
.init-world-cup {
  .el-form-item {
    margin-bottom: 0;
  }
}

</style>

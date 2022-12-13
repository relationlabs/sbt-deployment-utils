<script setup lang="ts">
import useDeployStore from '@/store/deploy'
import { FormInstance, FormRules } from 'element-plus'
const store = useDeployStore()

const addrForm = reactive({ inputAddr: '' })
const rules = reactive<FormRules>({
  inputAddr: [{ required: true, trigger: 'blur', message: '' }],
})
const ruleFormRef = ref<FormInstance>()
const formValid = async () => {
  return new Promise((r) => ruleFormRef.value?.validate(r))
}
const confirmAddr = async () => {
  const valid = await formValid()
  if (!valid) return
  toWhiteList(addrForm.inputAddr);
}
const toWhiteList = (addr: string) => {
  store.worldCupContractAddr = addr
  closeDialog()
  startTo('whiteList')
}

const startTo = (step: 'deploy' | 'whiteList') => {
  store.step = step;
  store.startFrom = step;
}

let dialogVisible = ref(false);
const openDialog = () => {
  dialogVisible.value = true;
}
const closeDialog = () => {
  addrForm.inputAddr = '';
  dialogVisible.value = false;
}

</script>
<template>
  <div class="welcome-wrap">
    <el-card class="box-card" :class="{ 'current-step': !store.startFrom }">
      <template #header>
        <div class="card-header">
          <h1>Create New SBT Contract</h1>
        </div>
      </template>
      <div class="card-info">
        <el-row justify="space-between" align="top" class="mb20">
          <div class="pr20">
            <div class="mb20">
              Try to create a new contract according to the template of the Semantic SBT contract.
            </div>  
          </div>
          <div>
            <el-button
              type="primary"
              :disabled="!store.owner"
              @click="startTo('deploy')"
            >
              Start
            </el-button>
          </div>
        </el-row>
      </div>
    </el-card>

    <el-card class="box-card" :class="{ 'current-step': !store.startFrom }">
      <template #header>
        <div class="card-header">
          <h1>Functional Testing</h1>
        </div>
      </template>
      <div class="card-info">
        <el-row justify="space-between" align="top" class="mb20">
          <div class="pr20">
            <div class="mb20">
              Input or select a Semantic SBT contract address you deployed, and test the “addWhiteList” and “Mint” function.
            </div>  
          </div>
          <div>
            <el-button
              type="primary"
              :disabled="!store.owner"
              @click="openDialog"
            >
              Start
            </el-button>
          </div>
        </el-row>
      </div>
    </el-card>
  </div>
  <el-dialog
    v-model="dialogVisible"
    title="Functional Testing"
    width="800px"
    :before-close="closeDialog"
    :close-on-click-modal="false"
  >
    <el-form
      :model="addrForm"
      label-width="185px"
      ref="ruleFormRef"
      :rules="rules"
      @submit.prevent
      class="flex-row contract-start-form"
    >
      <el-form-item label="Input Contract Address" prop="inputAddr">
        <el-input v-model="addrForm.inputAddr" class="input-addr" />
      </el-form-item>

      <el-form-item label="Contracts">
        <div class="contract-wrap">
          <div
            class="addr-item"
            v-for="(item, index) in store.cachedDeployedAddr"
            :key="index"
          >
            <span
              @click="toWhiteList(item)"
              class="addr"
            >
              {{ item }}
            </span>
          </div>
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" plain @click="closeDialog">Cancel</el-button>
        <el-button type="success" @click="confirmAddr">
          Confirm
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<style lang="scss" scoped>
.welcome-wrap {
  .current-step {
    border-color: rgba(255, 255, 255, 0.2);
  }
}
</style>
<style lang="scss">
.contract-start-form {
  flex-wrap: wrap;
  .input-addr {
    width: 432px
  }
  .contract-wrap {
    padding: 8px;
    width: 416px;
    height: 302px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
    overflow-y: scroll;
    &::-webkit-scrollbar{
      width:3px;
    }
    &::-webkit-scrollbar-thumb{
      background: rgba($color: #FFFFFF, $alpha: 0.5);
      border-radius: 13px;
    }
    .addr-item {
      font-weight: 400;
      font-size: 14px;
      line-height: 32px;
      text-decoration-line: underline;
      color: #FF237F;
      .addr {
        cursor: pointer;
      }
    }
 
  }
}
</style>
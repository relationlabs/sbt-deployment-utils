<script setup lang="ts">
import { ethers, providers } from 'ethers'
import { FormInstance, FormRules } from 'element-plus'
import useDeployStore from '@/store/deploy'
import { validField } from '@/utils/validtor'
import abi from '@/abi/semanticPrivacy'
const store = useDeployStore()
const json = {
  name: 'the name of this token',
  image: 'image_url',
  properties: {}
}
const disabled = computed(() => !store.owner)

const ruleFormRef = ref<FormInstance>()
const form = reactive({
  contractName: '',
  contractSymbol: '',
  metadataUri: '',
  schemaURI:
    'https://mca5uhhx5gx77ykbdcewmwc5bpr3w7xnm5bjrsltktjicmfgjkja.arweave.net/YIHaHPfpr__hQRiJZlhdC-O7fu1nQpjJc1TSgTCmSpI',
  className: '',
  predicate: 'privacyData'
})

const rules = reactive<FormRules>({
  contractName: [
    { required: true, trigger: 'blur', message: '' },
    {
      validator: (r, v, callback) => {
        if (!validField(v)) {
          return callback('wrong format')
        }

        return true
      },
      trigger: 'change'
    }
  ],
  contractSymbol: [
    { required: true, trigger: 'blur', message: '' },
    {
      validator: (r, v, callback) => {
        if (!validField(v)) {
          return callback('wrong format')
        }
        return true
      },
      trigger: 'change'
    }
  ],
  metadataUri: [{ required: true, trigger: 'blur', message: '' }],
  schemaURI: [{ required: true, trigger: 'blur', message: '' }],
  predicate: [
    { required: true, trigger: 'blur', message: '' },
    {
      validator: (r, v, callback) => {
        if (v.includes(' ')) {
          return callback('no spaces')
        }
        return true
      },
      trigger: 'change'
    }
  ]
})

const formValid = async () => {
  return new Promise((r) =>
    ruleFormRef.value?.validate((valid, fields) => {
      r(valid)
    })
  )
}
const loading = ref(false)
const initSuccess = ref(false)
const initContract = async () => {
  const valid = await formValid()
  if (!valid) return

  const provider = await getProvider()
  if (!provider) return

  loading.value = true
  try {
    const signer = provider.getSigner()
    let contract = new ethers.Contract(store.semanticContractAddr, abi, signer)
    /**
     SemanticSBTV2  init
     + initialize
     - minter ：   0x4D1c5B7A09737E2230585b66AB44610211B29F5d  // WorldCupActivity Contract Address
     - name_： Relation Semantic SBT // Contract Name
     - symbol_： SBT //token symbol 
     - baseURI_: 
     - schemaURI:
     - classes_:  [] // 
     - predicates_: [["participant",3]] // Defining predicates, An array of objects，This time there's only one element in the array。An object has two properties： Name of predicate， number of enum（3）
   */
    const res = await contract.initialize(
      store.semanticContractAddr,
      form.contractName, // name_：
      form.contractSymbol, // symbol_：
      form.metadataUri, // baseURI_
      form.schemaURI, // schemaURI_
      [], // classes_
      [[form.predicate, 1]] // predicates_
    )

    const wait = await res.wait()

    store.predicate = form.predicate
    store.className = form.className

    loading.value = false
    store.step = 'mint'
    closeInitializeDialog()
    initSuccess.value = true
  } catch (err: any) {
    logErr(err)
    loading.value = false
    if (err.code && err.code != 'ACTION_REJECTED') {
      ElMessageBox.alert(err.reason || err.message)
    }
  }
}

let initializeVisible = ref(false)
const openInitializeDialog = () => {
  initializeVisible.value = true
}
const closeInitializeDialog = () => {
  initializeVisible.value = false
}

</script>
<template>
  <div class="semantic-wrap">
    <el-card
      class="box-card"
      :class="{ 'current-step': store.step === 'initSemantic' }"
    >
      <template #header>
        <div class="card-header">
          <h1>2. Initialize SBT contract</h1>
        </div>
      </template>
      <div class="card-info">
        <el-row justify="space-between" align="bottom" class="mb20">
          <div class="pr20">
            Set the basic information of the contract.
          </div>

          <el-button
            type="primary"
            :disabled="disabled || store.step !== 'initSemantic'"
            :loading="loading"
            @click="openInitializeDialog"
          >
            {{ initSuccess ? 'Completed' : 'Set' }}
          </el-button>
        </el-row>
      </div>
    </el-card>

    <el-dialog
      v-model="initializeVisible"
      title="Initialize SBT contract"
      :before-close="closeInitializeDialog"
      :close-on-click-modal="false"
      custom-class="semantic-dialog"
    >
      <el-form
        :model="form"
        label-width="140px"
        ref="ruleFormRef"
        :rules="rules"
        :disabled="loading"
      >
        <el-form-item label="Contract Name" prop="contractName">
          <el-input v-model="form.contractName" />
        </el-form-item>
        <el-form-item label="Contract Symbol" prop="contractSymbol">
          <el-input v-model="form.contractSymbol" />
        </el-form-item>
        <el-form-item label="baseURI" prop="metadataUri">
          <el-input v-model="form.metadataUri" />
          <div class="lh24 fs12">
            <div>
              You can build the baseurl like ERC721, and upload the directory
              file of the baseurl here.
            </div>
            <div class="">eg: https://sbt0.io/sbt/polygon/privacy/json/</div>
          </div>
        </el-form-item>
        <el-form-item label="schemaURI" prop="schemaURI">
          <el-input v-model="form.schemaURI" disabled />
        </el-form-item>
        <el-form-item label="predicate" prop="predicate">
          <el-input v-model="form.predicate" disabled />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" plain @click="closeInitializeDialog">
            Cancel
          </el-button>
          <el-button
            type="primary"
            :loading="loading"
            :disabled="disabled"
            @click="initContract"
          >
            Confirm
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss">
.el-upload-list__item + .el-upload {
  width: 0;
  overflow: hidden;
  opacity: 0;
}
.semantic-dialog {
  width: 800px;
}
@media screen and (max-width: 992px) {
  .semantic-wrap {
    .card-info {
      h2 {
        font-size: 14px;
      }
    }
  }
  .semantic-dialog {
    width: 80%;
    .el-form {
      .el-form-item {
        width: 100%;
        flex-direction: column;
        align-items: flex-start;
        margin-bottom: 8px;
        .el-form-item__label {
          width: auto !important;
          text-align: left;
        }
        .el-form-item__content {
          width: 100%;
        }
      }
    }
  }
}
</style>

<script setup lang="ts">
import useDeployStore from '@/store/deploy';
import { ethers, providers } from 'ethers';
import { ElMessage, ElMessageBox, FormInstance, FormRules } from 'element-plus';
import abi from '@/abi/activity';
const store = useDeployStore();

console.log(store);

const loading = ref(false);

const ruleFormRef = ref<FormInstance>();
const form = reactive({ whitelist: '' });
const rules = reactive<FormRules>({
  whitelist: [{ required: true, trigger: 'blur', message: '' }],
});

const formValid = async () => {
  return new Promise((r) => ruleFormRef.value?.validate(r));
};
const submit = async () => {
  const valid = await formValid();
  if (!valid) return;

  const provider = await getProvider();
  if (!provider) return;

  loading.value = true;
  // addWhiteList
  try {
    const provider = new providers.Web3Provider(window.ethereum);
    const accounts = await provider.send('eth_requestAccounts', []);
    if (accounts[0].toLowerCase() !== store.owner.toLowerCase()) {
      ElMessageBox.alert('Please switch account to ' + store.owner);
      loading.value = false;
      return;
    }
    const signer = provider.getSigner();
    let contract = new ethers.Contract(store.worldCupContractAddr, abi, signer);
    const list = form.whitelist
      .replace(/\s|\n/g, ',')
      .split(',')
      .filter((e) => e);
    const res = await contract.addWhiteList(list);

    const wait = await res.wait();

    for (let index = 0; index < list.length; index++) {
      const e = list[index].toLowerCase();
      if (store.whiteList.indexOf(e) === -1) {
        store.whiteList.push(e);
      }
    }

    ElMessage.success('success');

    closeDialog();
  } catch (err: any) {
    logErr(err);
    if (err.code && err.code != 'ACTION_REJECTED') {
      ElMessageBox.alert(err.reason || err.message);
    }
  }
  loading.value = false;
};

const getOldWhiteList = async () => {
  try {
    const provider = await getProvider();
    if (!provider) return;
    const signer = provider.getSigner();
    let contract = new ethers.Contract(store.worldCupContractAddr, abi, signer);
    const list = await contract.whiteListRange(0, 10000);

    store.whiteList = list.map((e: any) => e.toLowerCase());
  } catch (err: any) {
    logErr(err);
    if (err.code && err.code != 'ACTION_REJECTED') {
      ElMessageBox.alert(err.reason || err.message);
    }
  }
};

onMounted(async () => {
  if (store.startFrom === 'whiteList') {
    getOldWhiteList();
  }
});

let dialogVisible = ref(false);
const openDialog = () => {
  form.whitelist = '';
  dialogVisible.value = true;
};
const closeDialog = () => {
  dialogVisible.value = false;
};

const onSetFreeMint = async () => {
  loading.value = true;
  try {
    const provider = await getProvider();
    if (!provider) return;
    const signer = provider.getSigner();
    let contract = new ethers.Contract(store.worldCupContractAddr, abi, signer);

    const tx = await contract.setFreeMintable(true);
    await tx.wait();
    if (store.worldCupContractAddr) {
      store.step = 'mint';
    }
  } catch (error) {
  } finally {
    loading.value = false;
  }
};
</script>
<template>
  <div>
    <el-card
      class="box-card"
      :class="{ 'current-step': store.step === 'whiteList' }"
    >
      <template #header>
        <div class="card-header">
          <h1>
            <span v-if="store.startFrom !== 'whiteList'">4. </span>Add Whitelist
          </h1>
        </div>
      </template>

      <div class="card-info">
        <el-row justify="space-between" align="top" class="mb20">
          <div class="pr20">
            <div v-if="store.whiteList.length">
              <div class="mb14">Whitelist</div>
              <VList />
            </div>
          </div>
          <div class="mt14" v-if="!store.isFreeMint">
            <el-button
              :loading="loading"
              type="primary"
              @click="openDialog"
              :disabled="store.step !== 'whiteList'"
            >
              Add
            </el-button>
          </div>

          <div class="mt14" v-else>
            <el-button
              :loading="loading"
              type="primary"
              @click="onSetFreeMint"
              :disabled="store.step !== 'whiteList'"
            >
              Set Free
            </el-button>
          </div>
        </el-row>
      </div>
    </el-card>

    <el-dialog
      v-model="dialogVisible"
      title="Add Whitelist"
      width="950px"
      :before-close="closeDialog"
      :close-on-click-modal="false"
      custom-class="whitelist-dialog"
    >
      <div class="whitelist-desc">
        Please enter all whitelist address separated by “,” or “enter”.
      </div>
      <el-form
        :model="form"
        ref="ruleFormRef"
        :rules="rules"
        @submit.prevent
        class="whitelist-form"
      >
        <el-form-item label="" prop="whitelist" label-width="0px">
          <div class="flex-row whitelist-input">
            <div class="left">
              <div>Address</div>
              <el-input
                :autosize="{ minRows: 16 }"
                type="textarea"
                v-model="form.whitelist"
              />
            </div>
            <div class="right">
              <div>Whitelist</div>
              <VList />
            </div>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" plain @click="closeDialog"
            >Cancel</el-button
          >
          <el-button type="success" :loading="loading" @click="submit">
            Add
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss">
.whitelist-desc {
  margin-bottom: 14px;
}
.whitelist-form {
  .is-required {
    .el-form-item__label {
      &::before {
        display: none;
      }
    }
  }
  .whitelist-input {
    // width: 810px;
    width: 100%;
    .left {
      flex: 1;
      width: 400px;
      margin-right: 24px;
    }
    .right {
      flex: 1;
      width: 400px;
      .addr-list,
      .container {
        height: 346px;
        box-sizing: border-box;
      }
    }
  }
}
@media screen and (max-width: 992px) {
  .container {
    width: 100%;
    .item {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .whitelist-dialog {
    width: 80%;
    .whitelist-form {
      .el-form-item {
        width: 100%;
        flex-direction: column;
        align-items: flex-start;
        .el-form-item__content {
          width: 100%;
        }
      }
      .whitelist-input {
        flex-direction: column;
        align-items: flex-start;
        .left {
          width: 100%;
          .el-textarea__inner {
            height: 146px !important;
            min-height: 146px !important;
          }
        }
        .right {
          width: 100%;
          .addr-list,
          .container {
            height: 146px;
          }
        }
      }
    }
  }
}
</style>

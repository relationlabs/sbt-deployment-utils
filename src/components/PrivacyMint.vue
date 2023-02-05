<script setup lang="ts">
import { ethers, providers } from 'ethers'
import useDeployStore from '@/store/deploy'
import abi from '@/abi/semanticPrivacy'
import { ElMessage, ElMessageBox } from 'element-plus'
import { encryptSbtString } from '@/utils/litprotocol'
const store = useDeployStore()

const curAccount = ref('')
const dataToEncrypt = ref('')
const encrypted = ref(false)
const arHash = ref('1LQj3_jXnDLb9X_uui629l9lZQ5wnX1tHk5EipoETbE')

const txHash = ref('')

const loading = ref(false)

// mint to get a tokenId
const tokenId = ref()
const mintToken = async () => {
  console.log(
    '%c [ mintToken ]-21',
    'font-size:13px; background:pink; color:#bf2c9f;',
  )
  const provider = await getProvider(true)
  if (!provider) return
  loading.value = true

  try {
    const signer = provider.getSigner()
    let contract = new ethers.Contract(store.semanticContractAddr, abi, signer)

    const result = await contract.prepareTokenId()
    const wait = await result.wait()

    const id = await contract.ownedPrepareTokenId(store.owner)
    console.log(
      '%c [ id ]-29',
      'font-size:13px; background:pink; color:#bf2c9f;',
      id,
      parseInt(id)
    )
    tokenId.value = parseInt(id)
    loading.value = false
  } catch (err: any) {
    logErr(err)
    loading.value = false

    if (err.code && err.code != 'ACTION_REJECTED') {
      ElMessageBox.alert(err.reason || err.message)
    }
  }
}

// encrypt dataToEncrypt
const encrypt = async () => {
  const { base64EncryptedString, base16EncryptedSymmetricKey, accs } =
    await encryptSbtString({ strToEncrypt: dataToEncrypt.value })
  console.log(
    '%c [ base64EncryptedString, base16EncryptedSymmetricKey, accs ]-50',
    'font-size:13px; background:pink; color:#bf2c9f;',
    base64EncryptedString,
    base16EncryptedSymmetricKey,
    accs
  )

  const json = {
    encryptionBy: 'lit-protocol',
    accessCondition: accs,
    encryptedSymmetricKey: base16EncryptedSymmetricKey,
    // encrypted content
    encryptedObject: base64EncryptedString
  }

  //
  const elementA = document.createElement('a')

  elementA.download = 'toencrypt.json'
  elementA.style.display = 'none'

  const blob = new Blob([JSON.stringify(json)])

  elementA.href = URL.createObjectURL(blob)
  document.body.appendChild(elementA)
  elementA.click()
  document.body.removeChild(elementA)

  encrypted.value = true
}

const updateEncrypt = async () => {
  const provider = await getProvider(true)
  if (!provider) return

  loading.value = true
  try {
    const signer = provider.getSigner()
    let contract = new ethers.Contract(store.semanticContractAddr, abi, signer)
    // TODO
    console.log(
      '%c [ tokenId.value ]-97',
      'font-size:13px; background:pink; color:#bf2c9f;',
      tokenId.value,
      arHash.value
    )
    const result = await contract.mintPrivacy(
      tokenId.value,
      1,
      `ar://${arHash.value}`
    )
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
  curAccount.value = accounts[0]

  window.ethereum.on('accountsChanged', (e: any) => {
    curAccount.value = e[0]
  })
})
</script>
<template>
  <div class="mint-wrap">
    <el-card
      class="box-card"
      :class="{ 'current-step': store.step === 'mint' }"
    >
      <template #header>
        <div class="card-header">
          <h1>
            <span>3.</span>
            Mint
          </h1>
        </div>
      </template>
      <div class="card-info">
        <!--  -->
        <el-row justify="space-between" class="">
          <div class="l">
            <!-- <div class="flex-align">
              <div>Mint method</div>
              <div class="code-wrap">
                <img src="../assets/svg/mint.svg" alt="" />
              </div>
            </div> -->
            <div class="flex-a mt20" v-if="tokenId && !encrypted">
              <span class="mr10">Data to encrypt:</span>
              <el-input v-model="dataToEncrypt" style="width: 400px" />
            </div>
            <div class="flex-a mt20" v-if="tokenId && encrypted">
              <span class="mr10">arHash:</span>
              <el-input v-model="arHash" style="width: 400px" />
            </div>
          </div>
          <div class="r">
            <el-row justify="end" class="mb20" v-if="!tokenId">
              <el-button
                type="primary"
                :loading="loading"
                @click="mintToken"
                :disabled="store.step !== 'mint'"
              >
                Mint
              </el-button>
            </el-row>
            <el-row justify="end" class="mb20" v-if="tokenId && !encrypted">
              <el-button
                type="primary"
                :loading="loading"
                @click="encrypt"
                :disabled="store.step !== 'mint'"
              >
                EncryptData
              </el-button>
            </el-row>
            <el-row justify="end" class="mb20" v-if="tokenId && encrypted">
              <el-button
                type="primary"
                :loading="loading"
                @click="updateEncrypt"
                :disabled="store.step !== 'mint' || !arHash"
              >
                EncryptToken
              </el-button>
            </el-row>
          </div>
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
  color: #ffffff;
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

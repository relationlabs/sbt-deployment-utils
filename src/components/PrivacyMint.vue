<script setup lang="ts">
import { ethers, providers } from 'ethers'
import useDeployStore from '@/store/deploy'
import abi from '@/abi/semanticPrivacy'
import { ElMessage, ElMessageBox } from 'element-plus'
import { encryptSbtString, decryptString } from '@/utils/litprotocol'
const store = useDeployStore()

const curAccount = ref('')
const dataToEncrypt = ref('')
const encrypted = ref(false)
const arHash = ref('')

const txHash = ref('')

const loadingCreate = ref(false)

// mint to get a tokenId
const tokenId = ref()
const mintToken = async () => {
  console.log(
    '%c [ mintToken ]-21',
    'font-size:13px; background:pink; color:#bf2c9f;'
  )
  const provider = await getProvider(true)
  if (!provider) return
  loadingCreate.value = true

  try {
    const signer = provider.getSigner()
    let contract = new ethers.Contract(store.semanticContractAddr, abi, signer)

    const result = await contract.prepareToken()
    const wait = await result.wait()

    const id = await contract.ownedPrepareToken(store.owner)
    console.log(
      '%c [ id ]-29',
      'font-size:13px; background:pink; color:#bf2c9f;',
      id,
      parseInt(id)
    )
    tokenId.value = parseInt(id)
    loadingCreate.value = false
  } catch (err: any) {
    logErr(err)
    loadingCreate.value = false

    if (err.code && err.code != 'ACTION_REJECTED') {
      ElMessageBox.alert(err.reason || err.message)
    }
  }
}

// encrypt dataToEncrypt
const loadingEncrypt = ref(false)
const encryptDataLink = ref()
const disableEncrypt = computed(
  () => store.step !== 'mint' || !tokenId.value || encrypted.value
)
const encrypt = async () => {
  if (disableEncrypt.value) return
  if (!dataToEncrypt.value)
    return ElMessage.info('Please input the content to encrypto')
  loadingEncrypt.value = true
  const chain = 'mumbai'
  const evmContractConditions = [
    {
      contractAddress: store.semanticContractAddr,
      functionName: 'isViewerOf',
      functionParams: [':userAddress', `${tokenId.value}`],
      functionAbi: {
        constant: true,
        inputs: [
          {
            internalType: 'address',
            name: 'viewer',
            type: 'address'
          },
          {
            internalType: 'uint256',
            name: 'tokenId',
            type: 'uint256'
          }
        ],
        name: 'isViewerOf',
        outputs: [
          {
            internalType: 'bool',
            name: '',
            type: 'bool'
          }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
      },
      chain,
      returnValueTest: {
        key: '',
        comparator: '=',
        value: 'true'
      }
    }
  ]
  const { base64EncryptedString, base16EncryptedSymmetricKey, accs } =
    await encryptSbtString({
      strToEncrypt: dataToEncrypt.value,
      evmContractConditions,
      chain
    })

  // const checkE = await decryptString({
  //   base16EncryptedSymmetricKey,
  //   base64EncryptedString,
  //   evmContractConditions: accs || [],
  //   chain
  // })
  // console.log(
  //   '%c [ checkE ]-86',
  //   'font-size:13px; background:pink; color:#bf2c9f;',
  //   checkE
  // )

  const json = {
    encryptionBy: 'lit-protocol',
    accessCondition: accs,
    encryptedSymmetricKey: base16EncryptedSymmetricKey,
    // encrypted content
    encryptedObject: base64EncryptedString
  }

  const elementA = document.createElement('a')

  elementA.download = 'toencrypt.json'
  elementA.style.display = 'none'

  const blob = new Blob([JSON.stringify(json)])
  encryptDataLink.value = URL.createObjectURL(blob)

  // elementA.href = URL.createObjectURL(blob)
  // document.body.appendChild(elementA)
  // elementA.click()
  // document.body.removeChild(elementA)

  encrypted.value = true
  loadingEncrypt.value = false
}

const disableMint = computed(
  () => store.step !== 'mint' || !tokenId.value || !arHash.value || txHash.value
)
const loadingMint = ref(false)
const mintPrivacy = async () => {
  const provider = await getProvider(true)
  if (!provider) return

  loadingMint.value = true
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
    loadingMint.value = false

    txHash.value = result.hash
  } catch (err: any) {
    logErr(err)
    loadingMint.value = false

    if (err.code && err.code != 'ACTION_REJECTED') {
      ElMessageBox.alert(err.reason || err.message)
    }
  }
}

const addViewer = async () => {
  const provider = await getProvider(true)
  if (!provider) return

  // loading.value = true
  try {
    const signer = provider.getSigner()
    let contract = new ethers.Contract(store.semanticContractAddr, abi, signer)
    const result = await contract.addViewer(
      ['0x27b3f793656F58EB40725FFfd794F0F74999d832'],
      1
    )
    // let contract = new ethers.Contract(
    //   '0x4ce6f82Aac7bE9BC3DA6634fDa35bF61851346f0',
    //   abi,
    //   signer
    // )
    // const result = await contract.addViewer(
    //   '0x1E562aaC4BEac450aB98D379Ab0D1D1b44c325b3',
    //   '${tokenId}'
    // )
    const wait = await result.wait()
    ElMessage.success('add success')
    // loading.value = false
  } catch (err: any) {
    logErr(err)
    // loading.value = false

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
        <!-- <el-row justify="end" class="mb20">
              <el-button
                type="primary"
                :loading="loading"
                @click="addViewer"
              >
                Add Viewer
              </el-button>
            </el-row> -->
        <el-row justify="space-between" class="mb40">
          <div class="flex1">Create a new tokenID</div>
          <el-button
            type="primary"
            :loading="loadingCreate"
            @click="mintToken"
            :disabled="store.step !== 'mint' || tokenId"
          >
            Create
          </el-button>
        </el-row>
        <el-row justify="space-between" class="mb40">
          <div class="flex-row flex1">
            <div class="mr10 w120">Data to encrypt:</div>
            <div class="">
              <el-input
                type="textarea"
                v-model="dataToEncrypt"
                :disabled="store.step !== 'mint' || encrypted"
                :autosize="{ minRows: 4 }"
              />
              <div class="mt10">
                We recommend that store the encrypted file on the AR and input
                the hash below.
              </div>
            </div>
            <a
              class="download-link flex-row ml10"
              :href="encryptDataLink"
              v-if="encryptDataLink"
              download="privacyData.json"
            >
              <svg-icon name="file" />
              <span class="ml4">privacyData.json</span>
            </a>
          </div>
          <el-button
            type="primary"
            :loading="loadingEncrypt"
            @click="encrypt"
            :class="{ 'is-disabled': disableEncrypt }"
          >
            Encrypto
          </el-button>
        </el-row>
        <el-row justify="space-between" class="mb20">
          <div class="flex-row">
            <div class="mr10 w120">ArHash:</div>
            <div class="">
              <el-input v-model="arHash" style="width: 400px" />

              <el-row v-if="txHash">
                <a :href="`${store.scanUrl}${txHash}`" target="_blank">
                  <span class="contract-addr">
                    txn: {{ txHash.substring(0, 10) + '......' }}
                  </span>
                </a>
              </el-row>
            </div>
          </div>
          <el-button
            type="primary"
            :loading="loadingMint"
            @click="mintPrivacy"
            :disabled="disableMint"
          >
            Mint
          </el-button>
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
.download-link {
  text-decoration: underline;
  color: #ff237f;
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

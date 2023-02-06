// import * as LitJsSdk from '@lit-protocol/lit-node-client'
const LitJsSdk = window.LitJsSdk_litNodeClient

const litNodeClient = new LitJsSdk.LitNodeClient({
  litNetwork: 'serrano'
})


export const encryptSbtString = async ({
  strToEncrypt,
  evmContractConditions,
  chain
}: {
  strToEncrypt: string
  evmContractConditions?: any[]
  chain: string
}) => {
  await litNodeClient.connect()

  let authSig = await LitJsSdk.checkAndSignAuthMessage({
    chain
  })
  console.log('%c [ authSig ]-19', 'font-size:13px; background:pink; color:#bf2c9f;', authSig)

  const accs = evmContractConditions
  const res = await LitJsSdk.encryptString(strToEncrypt)
  if (!res) throw Error('encrypt error')
  const encryptedString = res.encryptedString
  const symmetricKey = res.symmetricKey

  const base64EncryptedString = await LitJsSdk.blobToBase64String(
    encryptedString
  )
  const encryptedSymmetricKey = await litNodeClient.saveEncryptionKey({
    evmContractConditions: accs,
    symmetricKey: symmetricKey,
    authSig: authSig,
    chain
  })

  const base16EncryptedSymmetricKey = LitJsSdk.uint8arrayToString(
    encryptedSymmetricKey,
    'base16'
  )

  return {
    base64EncryptedString,
    base16EncryptedSymmetricKey,
    accs,
    authSig
  }
}


export const decryptString = async ({
  base64EncryptedString,
  base16EncryptedSymmetricKey,
  evmContractConditions,
  cachedAuthSig,
  chain
}: {
  base64EncryptedString: string
  base16EncryptedSymmetricKey: string
  evmContractConditions: any[]
  cachedAuthSig?: any
  chain: string
}) => {
  await litNodeClient.connect()
  let authSig = cachedAuthSig
  if (!authSig) {
    authSig = await LitJsSdk.checkAndSignAuthMessage({
      chain
    })
  }

  const data = {
    evmContractConditions,
    toDecrypt: base16EncryptedSymmetricKey,
    authSig: authSig,
    chain
  }

  console.log('%c [ getEncryptionKey ]-35', 'font-size:13px; background:pink; color:#bf2c9f;', data)
  const encryptionKey = await litNodeClient.getEncryptionKey(data)
  if (!encryptionKey) return

  const blob = await LitJsSdk.base64StringToBlob(base64EncryptedString)
  const decryptedString = await LitJsSdk.decryptString(blob, encryptionKey)

  return decryptedString
}

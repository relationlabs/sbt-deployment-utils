import * as LitJsSdk from '@lit-protocol/lit-node-client'

const litNodeClient = new LitJsSdk.LitNodeClient({
  litNetwork: 'serrano'
})

export const encryptSbtString = async ({
  strToEncrypt,
  chain = 'ethereum'
}: {
  strToEncrypt: string
  chain?: string
}) => {
  await litNodeClient.connect()

  let authSig = await LitJsSdk.checkAndSignAuthMessage({
    chain
  })

  const accs = [
    {
      contractAddress: '0xA80617371A5f511Bf4c1dDf822E6040acaa63e71',
      standardContractType: 'ERC721',
      chain: 'polygon',
      method: 'isViewerOf',
      parameters: [':userAddress', '${tokenId}'],
      returnValueTest: {
        comparator: '=',
        value: 'true'
      }
    }
  ]
  const res = await LitJsSdk.encryptString(strToEncrypt)
  if (!res) throw Error('encrypt error')
  const encryptedString = res.encryptedString
  const symmetricKey = res.symmetricKey

  const base64EncryptedString = await LitJsSdk.blobToBase64String(
    encryptedString
  )
  const encryptedSymmetricKey = await litNodeClient.saveEncryptionKey({
    accessControlConditions: accs,
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

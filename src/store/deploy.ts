type Contract = {
  contractAddress: string
  chainName: string
  name: string
  imageUrl: string
  itemsCount?: number
  ownersCount: string
  contractType: number
}

type DepolyType = {
  type: 'normal' | 'privacy'
  deploying: boolean
  step:
    | 'welcome'
    | 'deploy'
    | 'initSemantic'
    | 'initWorldCup'
    | 'whiteList'
    | 'mint'
  owner: string
  mode: 'test' | 'prod'
  scanUrl: string
  userDeployedAddrList: Contract[]

  semanticContractAddr: string
  semanticTxHash: string
  predicate: string
  className: string
  worldCupContractAddr: string
  worldCupTxHash: string

  whiteList: string[]

  contractName: string
  contractSymbol: string
  metadataUri: string
  startFrom: 'deploy' | 'whiteList' | ''

  currentPrivateTokenId: number
}

const getDefaultState: () => DepolyType = () => {
  return {
    type: 'normal',
    mode: 'test',
    scanUrl: '',

    step: 'welcome',
    deploying: false,
    userDeployedAddrList: [],

    owner: '',

    // semantic
    semanticContractAddr: '',
    semanticTxHash: '',

    predicate: '',
    className: '',

    // activity contract
    worldCupContractAddr: '',
    worldCupTxHash: '',

    whiteList: [],

    contractName: '', // Relation Activity test
    contractSymbol: '', // REL_TEST
    metadataUri: '',
    startFrom: '',

    currentPrivateTokenId: 0
  }
}
const store = defineStore('deploy', {
  // persist: {
  //   enabled: true
  // },
  state: (): DepolyType => getDefaultState(),
  actions: {
    setContactState(data: any) {},
    resetDeployState(state: DepolyType) {
      let cacheTemp = {
        owner: state.owner,
        userDeployedAddrList: state.userDeployedAddrList
      }
      Object.assign(state, getDefaultState(), cacheTemp)
    }
  }
})

export default store

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
  cachedDeployedAddr: string[]

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
}

const getDefaultState: () => DepolyType = () => {
  return {
    type: 'normal',
    mode: 'test',
    scanUrl: '',

    step: 'welcome',
    deploying: false,
    cachedDeployedAddr: [],

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
    startFrom: ''
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
        cachedDeployedAddr: state.cachedDeployedAddr
      }
      Object.assign(state, getDefaultState(), cacheTemp)
    }
  }
})

export default store

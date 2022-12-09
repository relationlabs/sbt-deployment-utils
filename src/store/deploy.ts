type DepolyType = {
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
  startFrom:  'deploy' | 'whiteList' | ''
}

const getDefaultState:() => DepolyType = () => {
  return {
    mode: 'test',
    scanUrl: '',

    step: 'welcome',
    deploying: false,
    cachedDeployedAddr: [],

    owner: '', // 0x712471f5c366513dD6D25D0Ce9B41291c89bf0d6

    // semantic
    semanticContractAddr: '', // 0x1cBb3AA3337810DaFbBf9796972c667cE553872F
    semanticTxHash: '', //

    predicate: '',
    className: '',

    // activity contract
    worldCupContractAddr: '', // 0xfa2563b0c30c20b6388dd97397ccea47e4b1d086
    worldCupTxHash: '', //

    whiteList: [],

    contractName: '', // Relation Activity test
    contractSymbol: '', // REL_TEST
    metadataUri: '',
    startFrom: '',
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
        cachedDeployedAddr: state.cachedDeployedAddr,
      }
      Object.assign(state, getDefaultState(), cacheTemp)
    }
  }
})

export default store

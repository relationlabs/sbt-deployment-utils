import { ethers, providers } from 'ethers'
import useDeployStore from '@/store/deploy'
import { ElMessageBox } from 'element-plus'

const mode = import.meta.env.MODE
const limitChain = [80001, 210425, 1284, 137, 2206132]
const net = 'Polygon/Platon/Moonbeam/Mumbai/PlatON Dev Testnet2'
const scanMap: any = {
  137: 'https://polygonscan.com/tx/',
  1284: 'https://moonbeam.moonscan.io/tx/',
  210425: 'https://scan.platon.network/trade-detail?txHash=',
  2206132: 'https://devnet2scan.platon.network/trade-detail?txHash=',
  80001: 'https://mumbai.polygonscan.com/tx/'
}

export const logErr = (err: any) => {
  if (typeof err === 'string') return console.log(err)
  const keys = Object.keys(err)
  if (!keys.length) return console.log(err)
  keys.map((k: any) => {
    let info = err[k]
    try {
      info = JSON.stringify(err[k])
    } catch (error) {}
    console.log(`${k}::${info}`)
  })
}

export const getProvider = async (freeMint = false) => {
  if (!window.ethereum) {
    ElMessageBox.alert(`Metamask is not installed!`)
    return
  }
  const provider = new providers.Web3Provider(window.ethereum)
  const chainId = parseInt(await provider.send('eth_chainId', []))
  if (limitChain.indexOf(chainId) === -1) {
    ElMessageBox.alert(`Please switch network to ${net}`)
    return
  }

  const store = useDeployStore()

  store.scanUrl = scanMap[chainId] || ''

  if (store.owner) {
    const accounts = await provider.send('eth_requestAccounts', [])
    if (!freeMint && accounts[0].toLowerCase() !== store.owner.toLowerCase()) {
      ElMessageBox.alert('Please switch account to ' + store.owner)
      return
    }
  }

  return provider
}

// cache of deployed address
const key = 'relation_sbt_worldcup_list_cache'
export const getUserWorldCupAddr = (account: string) => {
  const cache = localStorage.getItem(key)
  if (!cache) return []

  return JSON.parse(cache)[account.toLowerCase()]
}
export const saveUserWorldCupAddr = (account: string, addr: string) => {
  let cache: any = JSON.parse(localStorage.getItem(key) || '{}')

  const k = account.toLowerCase()
  const v = addr.toLowerCase()
  if (!cache[k]) {
    cache[k] = [v]
  } else {
    const set = new Set(cache[k])
    set.add(v)
    cache[k] = Array.from(set)
  }

  localStorage.setItem(key, JSON.stringify(cache))
}

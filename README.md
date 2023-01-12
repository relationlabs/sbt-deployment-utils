# RELATION SBT DEPLOY UTIL

## Quick Start

### `yarn`
Install dependencies
### `yarn dev`
Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
### `yarn build`
Build the app

---

## User Guide

### ethers
Install `ethers` lib，then use th api of `ethers` to connect to `Metamask`
```bash
yarn add ethers
```
---
### Connect Metamask
Use account to buid `Signer`
```javascript
import { providers } from 'ethers'

const provider = new providers.Web3Provider(window.ethereum)
const accounts = await provider.send('eth_requestAccounts', [])
const signer = provider.getSigner()
```
---
### Deploy Contract
```javascript
import { ethers } from 'ethers'
import SBTJson from 'deploy/SemanticSBTV2.json'

const factory = new ethers.ContractFactory(SBTJson.abi, SBTJson.bytecode, signer)
let contract = await factory.deploy()

contract = await contract.deployed()
// print contract address
console.log(contract.address)
// print delpoy transaction hash
console.log(contract.deployTransaction.hash)
```

```javascript
// Deploy Verification Contract
import { ethers } from 'ethers'
import ActivityJson from 'deploy/ActivityV2.json'

const factory = new ethers.ContractFactory(ActivityJson.abi, ActivityJson.bytecode, signer)
let contract = await factory.deploy()

contract = await contract.deployed()
// print contract address
console.log(contract.address)
// print delpoy transaction hash
console.log(contract.deployTransaction.hash)
```
---
### Initialize Contract
```javascript
// Initialize SBT Contract
let contract = new ethers.Contract(semanticContractAddr, abi, signer)

const contractName = ''
const tokenSymbol = ''
const metadataURI = ''

// Below parameters value can change base on business requirements
const schemaURI = 'https://arseed.web3infra.dev/CZhHk_wk2wXYc8l3fbb7fh8EwLN1AC4lDCq7WbRiUic'
const className = 'Activity'
const predicate = 'participant'

const res = await contract.initialize(
  contractName,
  tokenSymbol,
  metadataURI,
  schemaURI,
  [className],
  [[predicate, 3]],
)

await res.wait()
```

```javascript
// Initialize Verification Contract
import { providers } from 'ethers'

const provider = new providers.Web3Provider(window.ethereum)
const accounts = await provider.send('eth_requestAccounts', [])

let contract = new ethers.Contract(verificationContractAddr, abi, signer)

const owner = accounts[0]
const semanticContractAddr = ''
const predicate = 'participant' // keep pace with the step of `Initialize SBT Contract`
const activityName = ''
const className = 'Activity'  // keep pace with the step of `Initialize SBT Contract`

const res = await contract.initialize(
  owner,
  semanticContractAddr,
  predicate,
  activityName,
  className,
)

await res.wait()
```

### Initialize the whitelist
```javascript
// Get the list of 
let contract = new ethers.Contract(verificationContractAddr, abi, signer)

const whiteList = await contract.whiteListRange(0, 10000)

// add user address to whitelist
const newWhiteList = [
  '0xaaaaa',
  '0xbbbbb',
]
const list = newWhiteList
      .replace(/\s|\n/g, ',')
      .split(',')
      .filter((e) => e)
await contract.addWhiteList(list)
```

### Mint
Mint SBT to whitelist address
```javascript
import { providers } from 'ethers'

const provider = new providers.Web3Provider(window.ethereum)
const accounts = await provider.send('eth_requestAccounts', [])
const signer = provider.getSigner()

contract = new ethers.Contract(verificationContractAddr, abi, signer)

const result = await contract.mint()
await result.wait()

// print delpoy transaction hash
console.log(result.hash)
```

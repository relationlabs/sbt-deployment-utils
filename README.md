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

## 使用指引

### ethers
安装`ethers`库，使用`ethers`提供的`api`帮助我们跟`Metamask`交互，以及部署合约/调用合约
```bash
yarn add ethers
```
---
### Connect Metamask
获取帐号（地址），签名器`Signer`
```javascript
import { providers } from 'ethers'

const provider = new providers.Web3Provider(window.ethereum)
const accounts = await provider.send('eth_requestAccounts', [])
const signer = provider.getSigner()
```
---
### 合约部署
根据合约编译生成的`abi`与`bytecode`，联合`Metamask Signer`部署合约
```javascript
// 部署 SBT Contract
import { ethers } from 'ethers'
import SBTJson from 'deploy/SemanticSBTV2.json'

const factory = new ethers.ContractFactory(SBTJson.abi, SBTJson.bytecode, signer)
let contract = await factory.deploy()

// 等待合约真正部署到链上
contract = await contract.deployed()
// 合约地址
console.log(contract.address)
// 交易hash
console.log(contract.deployTransaction.hash)
```

```javascript
// 部署 Verification Contract
import { ethers } from 'ethers'
import ActivityJson from 'deploy/ActivityV2.json'

const factory = new ethers.ContractFactory(ActivityJson.abi, ActivityJson.bytecode, signer)
let contract = await factory.deploy()

// 等待合约真正部署到链上
contract = await contract.deployed()
// 合约地址
console.log(contract.address)
// 交易hash
console.log(contract.deployTransaction.hash)
```
---
### 合约初始化
合约成功部署后，可以通过合约地址连接已有合约
```javascript
// 初始化SBT Contract
let contract = new ethers.Contract(semanticContractAddr, abi, signer)

const contractName = ''
const tokenSymbol = ''
const metadataURI = ''

// 以下三个参数固定为以下值
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

// 等待初始化成功
await res.wait()
```

```javascript
// 初始化 Verification Contract
import { providers } from 'ethers'

const provider = new providers.Web3Provider(window.ethereum)
const accounts = await provider.send('eth_requestAccounts', [])

let contract = new ethers.Contract(verificationContractAddr, abi, signer)

const owner = accounts[0]
const semanticContractAddr = ''
const predicate = 'participant' // 跟上述SBT合约初始化时的predicate保持一致
const activityName = ''
const className = 'Activity'  // 跟上述SBT合约初始化时的className保持一致

const res = await contract.initialize(
  owner,
  semanticContractAddr,
  predicate,
  activityName,
  className,
)

// 等待初始化成功
await res.wait()
```

### 获取白名单和添加白名单
```javascript
// 获取白名单列表
let contract = new ethers.Contract(verificationContractAddr, abi, signer)

const whiteList = await contract.whiteListRange(0, 10000)

// 添加白名单
// 用户地址列表，比如0xd1C688cc3856C963Aa174278C27936A9D7E59966
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
使用白名单内的用户Mint，非合约部署者
```javascript
import { providers } from 'ethers'

const provider = new providers.Web3Provider(window.ethereum)
const accounts = await provider.send('eth_requestAccounts', [])
const signer = provider.getSigner()

contract = new ethers.Contract(verificationContractAddr, abi, signer)

const result = await contract.mint()
// 等待Mint完成
await result.wait()

// 交易hash
console.log(result.hash)
```
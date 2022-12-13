<script setup lang="ts">
  import { ElMessageBox } from 'element-plus'
  import useDeployStore from '@/store/deploy'
  import { checkChain, getCurChain } from '@/utils/providers';
  import {
    polygonChain,
    platonChain,
    moonbeamChain,
    ethereumChain,
  } from '@/constants/chains'
  const store = useDeployStore()

  const errNetwork = ref(false)
  const connect = async () => {
    const provider = await getProvider()
    if (!provider) return (errNetwork.value = true)

    errNetwork.value = false
    const accounts = await provider.send('eth_requestAccounts', [])
    store.owner = accounts[0]

    store.cachedDeployedAddr = getUserWorldCupAddr(accounts[0])
  }
  const format = (str: string) => {
    return str.substring(0, 5) + '...' + str.substring(str.length - 5)
  }
  defineExpose({
    connect,
  })

  const chains = [
    { id: parseInt(ethereumChain.chainId), name: 'Ethereum', icon: 'eth' },
    { id: parseInt(polygonChain.chainId), name: 'Polygon', icon: 'polygon' },
    { id: parseInt(moonbeamChain.chainId), name: 'Moonbeam', icon: 'moonbeam' },
    { id: parseInt(platonChain.chainId), name: 'PlatON', icon: 'platon' },
  ]
  const currentSelectChain = ref()

  const onChangeChain = async (chain: any) => {
    if (chain.id === currentSelectChain.value?.id) return
    ElMessageBox.confirm(
      'Switching the network will reset the previous operation！',
      'Switching Networks',
      {
        confirmButtonText: 'Yes',
        showCancelButton: false,
      }
    )
    .then(async () => {
      try {
        const check = await checkChain(chain.id)
        if(!check) return

        currentSelectChain.value = chain
      } catch (error) {
      }
    })
    .catch(() => {
      
    })
  }

  onMounted(async () => {
    try {
      const curChainId = await getCurChain()
      const chain = chains.find((e) => e.id === curChainId)

      currentSelectChain.value = chain

      // on chain changed
      if (window.ethereum) {
        window.ethereum.on('chainChanged', (chainId: string) => {
          const id = parseInt(chainId)
          
          const chain = chains.find((e) => e.id === id)
          if (chain) {
            currentSelectChain.value = chain
            store.resetDeployState(store);
          } else {
            location.reload();
          }
        })
      }
    } catch (error) {
      // 
    }
  })

  const toHome = () => {
    store.resetDeployState(store);
  }
</script>
<template>
  <div class="head-wrap">
    <div class="part flex">
      <div class="flex-align logo-wrap" @click="toHome">
        <el-image class="logo h36 mr20" :src="$getImgUrl('logo.png')" />
      </div>
      <div class="flex-align login-btn-wrap">
        <div class="chain-select-wrap" v-if="store.owner">
          <div class="current-select flex-align">
            <div class="flex-align">
              <svg-icon :name="`chains-${currentSelectChain?.icon}`" class="icon-net" />
              <span>{{ currentSelectChain?.name }}</span>
            </div>
            <svg-icon class="icon-down" :name="`down`" />
          </div>
          <div class="option-wrap">
            <div class="option-list">
              <div
                class="option-item flex-align"
                :class="{'option-active': item.id === currentSelectChain?.id}"
                v-for="item in chains"
                :key="item.id"
                @click="onChangeChain(item)"
              >
                <svg-icon :name="`chains-${item.icon}`" class="icon-net" />
                {{ item.name }}
              </div>
            </div>
          </div>
        </div>
        <div class="owner-info" v-if="store.owner">{{ format(store.owner) }}</div>
        <el-button type="primary" @click="connect" v-else>
          Connect Wallet
        </el-button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.head-wrap {
  position: fixed;
  width: 100%;
  position: fixed;
  left: 50%;
  top: 0;
  transform: translate(-50%);
  z-index: 9;
  background: rgb(0,0,0);
  height: 100px;

  .logo-wrap {
    cursor: pointer;
  }
  .logo-name {
    font-weight: 400;
    font-size: 14px;
    line-height: 32px;
    color: #FFFFFF;

    .logo-separator {
      display: inline-block;
      width: 1px;
      height: 10px;
      background: #FFFFFF;
      opacity: 0.3;
      margin: 0 8px;
    }
  }
  .login-btn-wrap {
    .el-button {
      border-radius: 32px;
    }
    .owner-info {
      padding: 8px 20px;
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 32px;
      font-weight: 600;
      line-height: 1;
      color: #FFFFFF;
    }
  }
  .chain-select-wrap {
    position: relative;
    margin-right: 15px;
    &:hover {
      .current-select {
        .icon-down {
          transform: rotateX(180deg);
        } 
      }
      
      .option-wrap {
        visibility: visible;
      }
    }
    .option-wrap {
      padding-top: 12px;
      position: absolute;
      right: 0;
      visibility: hidden;

      .option-list {
        background: #282A2B;
        border: 1px solid #424343;
        border-radius: 4px;
        padding: 4px;
        width: 124px;

        .option-item {
          padding: 8px;
          &:hover {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 2px;
          }
          &:not(last-child) {
            margin-bottom: 4px;
          }
        }
        .option-active {
          cursor: not-allowed;
          background: rgba(255, 255, 255, 0.1);
        }
      }
    }
    .current-select, .option-item {
      cursor: pointer;
      .icon-net {
        font-size: 16px;
        border-radius: 50%;
        margin-right: 6px;
      }
      .icon-down {
        margin-left: 6px;
        font-size: 12px;
      }
    }
    
  }
}
</style>

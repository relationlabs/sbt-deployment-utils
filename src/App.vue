<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import { ethers, providers } from 'ethers'
import VueJsonPretty from 'vue-json-pretty'
import useDeployStore from '@/store/deploy'
import abi from '@/abi/semantic'
import { ElMessage } from 'element-plus'
const store = useDeployStore()
const backTo = () => {
  store.resetDeployState(store);
}
</script>
<template>
  <div class="main">
    <Header></Header>
    <div class="card-warp">
      <el-row class="mb24" v-if="!!store.startFrom">
        <svg-icon 
          name="arrow"
          class="icon-back-arrow"
          @click="backTo"
        />
      </el-row>

      <WelCome v-if="!store.startFrom" />

      <template v-if="store.startFrom === 'deploy'">
        <Deploy />
        <el-row justify="center">
          <svg-icon
            name="down"
            class="icon-step-down"
            :class="{'icon-current-step-down': store.step === 'initSemantic'}"
          />
        </el-row>
        <InitSemantic />
        <el-row justify="center">
          <svg-icon
            name="down"
            class="icon-step-down"
            :class="{'icon-current-step-down': store.step === 'initWorldCup'}"
          />
        </el-row>
        <InitWorldCup />
        <el-row justify="center">
          <svg-icon
            name="down"
            class="icon-step-down"
            :class="{'icon-current-step-down': store.step === 'whiteList'}"
          />
        </el-row>
      </template>
      
      <template v-if="!!store.startFrom">
        <WhiteList />
        <el-row justify="center">
          <svg-icon
            name="down"
            class="icon-step-down"
            :class="{'icon-current-step-down': store.step === 'whiteList'}"
          />
        </el-row>
        <Mint />
      </template>
    </div>
  </div>
</template>
<style>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  /* transform: translateX(-100%); */
  opacity: 0;
}
</style>
<style lang="scss">
img {
  max-width: 100%;
}

.main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  color: #fff;
  font-size: 14px;
  padding-top: 100px;

  .card-warp {
    max-width: 1200px;
    margin: 20px auto;

    .process-img {
      background-color: #fff;
    }
  }
  .part {
    max-width: 1200px;
    margin: 0 auto;
    height: 100%;
  }
  
}

.text-wrap {
  word-break: break-all;
}

.icon-right {
  width: 24px;
  height: 24px;
  font-size: 32px;
  font-weight: 600;
  cursor: pointer;
}
.icon-success {
  font-size: 30px;
  color: var(--el-color-success);
}

.box-card {
  // width: 580px;
  // min-height: 580px;
  margin-bottom: 20px;
  opacity: 0.5;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  h1 {
    margin: 0;
    font-weight: 600;
    font-size: 20px;
    line-height: 32px;
  }
}

.scan-link {
  text-decoration: underline;
}

.el-card__header {
  border: none;
  padding: 24px 24px 6px;
}

.el-card__body {
  padding: 0 24px 24px 48px;
}

.contract-addr {
  font-weight: 400;
  font-size: 14px;
  line-height: 32px;
  color: #FF237F;
}

.el-button {
  min-width: auto!important;;
  padding: 8px 20px;
  --el-button-bg-color: #FF237F;
  --el-button-hover-bg-color: #FF237F;
  --el-button-border-color: #FF237F;
  --el-button-hover-border-color: #FF237F;
  --el-button-text-color: #FFFFFF;
  --el-button-hover-text-color: #FFFFFF;
  --el-button-active-border-color: #FF237F;
  --el-button-active-bg-color: #FF237F;
  --el-button-outline-color: #FF237F;
}
.el-button--primary {
  --el-button-disabled-bg-color: rgba(255, 255, 255, 0.15);
  --el-button-disabled-border-color: rgba(255, 255, 255, 0.15);
  --el-button-disabled-text-color: rgba(255, 255, 255, 0.5);
}
.el-button--primary.is-plain {
  --el-button-bg-color: #1E2021;
  --el-button-hover-bg-color: #1E2021;
  --el-button-border-color: #FFFFFF;
  --el-button-hover-border-color: #FFFFFF;
  --el-button-text-color: #FFFFFF;
  --el-button-hover-text-color: #FFFFFF;
  --el-button-active-border-color: #FFFFFF;
  --el-button-active-bg-color: #1E2021;
  --el-button-outline-color: #FFFFFF;
}
.el-dialog__footer {
  text-align: center;
}
.current-step {
  border: 1px solid #FF237F;
  opacity: 1;
}

.icon-step-down {
  color: rgba($color: #FFFFFF, $alpha: 0.2);
  font-size: 24px;
  margin-bottom: 20px;
}
.icon-current-step-down {
  color: #FFFFFF;
}
.icon-back-arrow {
  color: #FFFFFF;
  transform: rotateY(180deg);
  cursor: pointer;
  &:hover {
    color: #FF237F;
  }
}
</style>

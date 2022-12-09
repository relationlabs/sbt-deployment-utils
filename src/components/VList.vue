<script setup lang="ts">
import useDeployStore from '@/store/deploy'
const store = useDeployStore()

const scrollBox = ref(null)
const items = ref(null)

const state = reactive({
  DataList: [],
  ItemBoxHeight: 0,
  Itemnum: 1,
  startIndex: 0
})

const originList = computed(() =>
  store.whiteList.map((e) => ({
    text: e,
    tid: e
  }))
)

const virtualList = computed(() => {
  let endIndex = state.startIndex + state.Itemnum
  if (endIndex >= originList.value.length) endIndex = originList.value.length
  return originList.value.slice(state.startIndex, endIndex)
})

const doscroll = () => {
  const curScrollTop = scrollBox.value.scrollTop
  if (curScrollTop > state.ItemBoxHeight) {
    const index = ~~(scrollBox.value.scrollTop / state.ItemBoxHeight)
    items.value.style.setProperty(
      'padding-top',
      `${index * state.ItemBoxHeight}px`
    )
    state.startIndex = index
  } else {
    items.value.style.setProperty('padding-top', '0px')
    state.startIndex = 0
  }
}

watchEffect(() => {
  if (originList.value.length > 0) {
    nextTick(() => {
      // Calculate the height of each row
      state.ItemBoxHeight = items.value.children[0].offsetHeight
      // Calculate the number of lines that can be displayed on the screen
      // +5 Prevent the drop-down screen from appearing white too quickly
      state.Itemnum =
        ~~(scrollBox.value.clientHeight / state.ItemBoxHeight) + 50
      // Set the total height of the list
      const ListHeight = state.ItemBoxHeight * originList.value.length
      items.value.style.setProperty('height', `${ListHeight}px`)
    })
  }
})
</script>
<template>
  <div class="addr-list">
    <div ref="scrollBox" class="container" @scroll="doscroll">
      <div ref="items" style="box-sizing: border-box">
        <div class="item" v-for="item in virtualList" :key="item.tid">
          <span>{{ item.text }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
.container {
  max-width: 884px;
  height: 136px;
  overflow-y: scroll;
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.1);
  padding: 8px;
  &::-webkit-scrollbar{
    width:3px;
  }
  &::-webkit-scrollbar-thumb{
    background: rgba($color: #FFFFFF, $alpha: 0.5);
    border-radius: 13px;
  }
}
.container .item {
  height: 30px;
  line-height: 30px;
  padding-left: 10px;
}
</style>

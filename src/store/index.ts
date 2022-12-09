import piniaPluginPersist from 'pinia-plugin-persist'
const store = createPinia()
console.log('%c [ store ]-3', 'font-size:13px; background:pink; color:#bf2c9f;', store)
store.use(piniaPluginPersist)

export default store

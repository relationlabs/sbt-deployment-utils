export { }

declare global {  
  interface Window {
    ic: any;
    BinanceChain: any;
    ethereum: any;
    relationOne: any;
    Buffer: any;
    solana: any;
    okexchain: any;
  }
}


// 自定义globalProperties类型申明
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
      $getImgUrl: (path:string) => string
  }
}
// This activity supports three chains
// The contract address and abi are different for different chains
type Contract = {
  address: string
  abi?: any[]
}

const testMap: {
  [id: number | string]: Contract
} = {
  // polygon
  137: {
    address: '0x0dCFD5BC384D3FC761dc361D7059957F101d3Be7',
    abi: []
  },
  // mumbai
  80001: {
    address: '0x458811c2B53C2BfaD9AE9c7B62E86F2EBb2F305a',
    abi: []
  },
  // platon
  210425: {
    address: '0x3E7272d415d169FD882A75AEC1aDF908973D3599',
    abi: []
  },
  // PlatON Dev Testnet2
  2206132: {
    address: '0xe6C067750c274072741A2e98b12057DD9D193Cc2',
    abi: []
  },
  // moonbeam
  1284: {
    address: '0xAD42609d77D8d374DB4ec75C5Ad7EBB14Dc0C6Ae',
    abi: []
  },
  // Moonbase Alpha
  1287: {
    address: '0x28d88DAaAf7EA42C9c02B74168a742719AEBF699',
    abi: []
  }
}

// prod contract config
const prodMap: {
  [id: number | string]: Contract
} = {
  // polygon
  137: {
    address: '0x012ec461e6A3B693B561966140C86542eEEc58a6',
    abi: []
  },
  // platon
  210425: {
    address: '0x16Cb80Ac70B2FC613179aF153fbF6E0f2b8E87a3',
    abi: []
  },
  // moonbeam
  1284: {
    address: '0x77d5460565ba65bb06f4b724aa7746589df1f628',
    abi: []
  }
}

export const contractMap = import.meta.env.MODE === 'production' ? prodMap : testMap

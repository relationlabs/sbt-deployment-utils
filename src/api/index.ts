const apiDomain = import.meta.env.VITE_API_DOMAIN

export const userDeployedContractList = async (addr: string) => {
  const res = await fetch(
    `${apiDomain}/api/v1/account/own/contract?walletAddress=` + addr
  ).then((r) => r.json())
  console.log(
    '%c [ res ]-3',
    'font-size:13px; background:pink; color:#bf2c9f;',
    res
  )
}

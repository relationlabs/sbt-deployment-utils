export const noWhiteSpace = (r: any, v: any, callback: any) => {
  if (v.includes(' ')) {
    return callback('no spaces')
  }
}

export const hasUnderscore = (r: any, v: any, callback: any) => {
  if (v.includes('_')) {
    return callback('no underscore')
  }
}

// only spaces underscore a-z 0-9
export const validField = (v: any) => {
  const regxs = [/\s/g, /[a-zA-Z]/g, /[0-9]/g, '_']
  let s = v
  for (let index = 0; index < regxs.length; index++) {
    const reg = regxs[index];
    s = s.replace(reg, '')
  }
  if (s.length) {
    return false
  }

  return true
}

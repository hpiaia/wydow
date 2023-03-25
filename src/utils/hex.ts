export function split(hex: string) {
    return hex.match(/.{1,2}/g)
}

export function reverse(hex: string) {
    return split(hex).reverse().join('')
}

export function toNumber(hex: string) {
    return parseInt(reverse(hex), 16)
}

export function toString(hex: string, removeNulls = true) {
    return split(hex)
        .map((byte) => (removeNulls && byte === '00' ? '' : String.fromCharCode(toNumber(byte))))
        .join('')
}

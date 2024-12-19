export function asNumber(n: string|undefined) {
    if (n === undefined) return undefined
    const value = parseInt(n)
    if (isNaN(value)) return undefined
    return value
}
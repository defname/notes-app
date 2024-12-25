import { useState } from "react"

export function useBubbleMenuControls(max: number, init: number = 0) {
  const [n, setN] = useState<number>(init)

  function rotate() {
    setN(n => (n+1)%max)
  }

  function setNSavely(newN: number): boolean {
    if (n >= max-1 || n < 0) {
      console.error(`Max page number is ${max}, but trying to set ${newN}.`)
      return false
    }
    setN(_ => newN)
    return true
  }

  return [n, setNSavely, rotate] as [number, (n: number) => boolean, () => void]
}
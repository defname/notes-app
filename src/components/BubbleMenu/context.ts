import { createContext, useContext } from "react"

export interface BubbleMenuContextType {
  activeMenu: number
  setActiveMenu: (n: number) => boolean
  rotateActiveMenu: () => void
}

export const BubbleMenuContext = createContext<BubbleMenuContextType>({
  activeMenu: 0,
  setActiveMenu: (_: number) => false,
  rotateActiveMenu: () => undefined
})

export function useBubbleMenuContext(): BubbleMenuContextType {
  const c = useContext(BubbleMenuContext)

  if (!c) {
    throw "useBubbleMenuContext() is only usable inside BubbleMenu/BM. It's only meant for internal use."
  }

  return c
}
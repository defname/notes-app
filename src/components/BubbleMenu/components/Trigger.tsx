import { ActionIcon } from "@mantine/core"
import { ReactNode } from "react"
import { useBubbleMenuContext } from "../context"

export interface TriggerOwnProps<C extends React.ElementType> {
  component?: C
  children: ReactNode
}


type TriggerProps<C extends React.ElementType> = TriggerOwnProps<C> & Omit<Omit<React.ComponentProps<C>, keyof TriggerOwnProps<C>>, "onClick">

const __DEFAULT_COMPONENT__ = ActionIcon<"button">

function Trigger<C extends React.ElementType = typeof __DEFAULT_COMPONENT__>({ children, component, ...compProps }: TriggerProps<C>) {
  const Component = component || __DEFAULT_COMPONENT__
  const ctx = useBubbleMenuContext()

  return (<>
    <Component onClick={ ctx.rotateActiveMenu } { ...compProps }>{ children }</Component>
  </>)
}

export default Trigger
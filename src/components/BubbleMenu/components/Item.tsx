import { ActionIcon } from "@mantine/core"

export interface ItemOwnProps<C extends React.ElementType> {
  component?: C
}

type ItemProps<C extends React.ElementType> = ItemOwnProps<C> & Omit<React.ComponentProps<C>, keyof ItemOwnProps<C>>

const __DEFAULT_COMPONENT__ = ActionIcon<"button">

function Item<C extends React.ElementType = typeof __DEFAULT_COMPONENT__>({ component, children, ...compProps }: ItemProps<C>) {
  const Component = component || __DEFAULT_COMPONENT__
  return (<>
    <Component { ...compProps }>{ children }</Component>
  </>)
}

export default Item
import { Stack } from "@mantine/core"

interface MenuOwnProps<C extends React.ElementType> {
  children: JSX.Element[]|JSX.Element
  component?: C
}

type MenuProps<C extends React.ElementType> = MenuOwnProps<C> & Omit<React.ComponentProps<C>, keyof MenuOwnProps<C>>

const __DEFAULT_COMPONENT__ = Stack

function BubbleMenu<C extends React.ElementType = typeof __DEFAULT_COMPONENT__>({ children, position, component, ...compProps }: MenuProps<C>) {
  const Component = component || __DEFAULT_COMPONENT__

  return (<>{
      <Component {...compProps}>
        { 
          children
        }
      </Component>
  }
  </>)
}

export default BubbleMenu
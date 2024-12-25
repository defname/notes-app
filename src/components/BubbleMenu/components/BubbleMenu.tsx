import { useBubbleMenuControls } from "../hooks"
import { BubbleMenuContext } from "../context"
import { Affix } from "@mantine/core"

interface BubbleMenuOwnProps<C extends React.ElementType> {
  component?: C
}

type BubbleMenuProps<C extends React.ElementType> = BubbleMenuOwnProps<C> & Omit<React.ComponentProps<C>, keyof BubbleMenuOwnProps<C>>

const __DEFAULT_COMPONENT__ = Affix

function BubbleMenu<C extends React.ElementType = typeof __DEFAULT_COMPONENT__>({ children, component, ...compProps }: BubbleMenuProps<C>) {
  const Component = component || __DEFAULT_COMPONENT__
  const [activeMenu, setActiveMenu, rotateActiveMenu] = useBubbleMenuControls(Array.isArray(children) ? children.length : 1)
  const context = {
    activeMenu,
    setActiveMenu,
    rotateActiveMenu
  }


  return (<>{
    <BubbleMenuContext.Provider value={ context }>
      <Component { ...compProps }>
        { Array.isArray(children)
            ? children[activeMenu]
            : children
        }
      </Component>
    </BubbleMenuContext.Provider>
  }
  </>)
}

export default BubbleMenu
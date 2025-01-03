import { useBubbleMenuControls } from "../hooks"
import { BubbleMenuContext } from "../context"
import { Affix } from "@mantine/core"
import { useClickOutside } from "@mantine/hooks"

interface BubbleMenuOwnProps<C extends React.ElementType> {
  component?: C
  defaultMenu?: number
}

type BubbleMenuProps<C extends React.ElementType> = BubbleMenuOwnProps<C> & Omit<React.ComponentProps<C>, keyof BubbleMenuOwnProps<C>>

const __DEFAULT_COMPONENT__ = Affix

function BubbleMenu<C extends React.ElementType = typeof __DEFAULT_COMPONENT__>({ children, component, defaultMenu, ...compProps }: BubbleMenuProps<C>) {
  const Component = component || __DEFAULT_COMPONENT__
  const filteredChildren = Array.isArray(children) ? children.filter((child: any) => child !== undefined) : [children]
  const [activeMenu, setActiveMenu, rotateActiveMenu] = useBubbleMenuControls(Array.isArray(filteredChildren) ? filteredChildren.length : 1)
  const clickOutsideRef = useClickOutside(() => {
    setActiveMenu(defaultMenu || 0)
  })
  const context = {
    activeMenu,
    setActiveMenu,
    rotateActiveMenu
  }


  return (<>{
    <BubbleMenuContext.Provider value={ context }>
      <Component ref={ clickOutsideRef } { ...compProps }>
        { filteredChildren[activeMenu] }
      </Component>
    </BubbleMenuContext.Provider>
  }
  </>)
}

export default BubbleMenu
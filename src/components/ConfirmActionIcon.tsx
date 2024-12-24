import { ActionIcon, ActionIconProps, PolymorphicComponentProps } from "@mantine/core"
import { useClickOutside } from "@mantine/hooks"
import React, { useState } from "react"

interface ConfirmActionIconProps {
  onClick: React.MouseEventHandler<HTMLButtonElement>
  onConfirm?: React.MouseEventHandler<HTMLButtonElement>
  confirmChildren: JSX.Element
  confirmProps?: PolymorphicComponentProps<"button", ActionIconProps>
}

function ConfirmActionIcon({ onClick, confirmChildren, children, onConfirm, confirmProps, ...props }: ConfirmActionIconProps & PolymorphicComponentProps<"button", ActionIconProps>) {
  const [needConfirmation, setNeedConfirmation] = useState(true)
  const clickOutsideRef = useClickOutside(() => {
    setNeedConfirmation(true)
  })

  function onClickHandler(ev: React.MouseEvent<HTMLButtonElement>) {
    if (needConfirmation) {
      setNeedConfirmation(false)
      if (onConfirm) {
        onConfirm(ev)
      }
    }
    else {
      setNeedConfirmation(true)
      onClick(ev)
    }
  }

  const additionalProps = !needConfirmation ? {...confirmProps} : {}

  return (<>
     <ActionIcon ref={ clickOutsideRef } onClick={onClickHandler} {...props} {...additionalProps}>
        {
          needConfirmation
            ? children
            : confirmChildren
        }
    </ActionIcon>
  </>)
}

export default ConfirmActionIcon
import React from "react"
import ConfirmActionIcon from "../ConfirmActionIcon"
import { IconQuestionMark, IconTrash } from "@tabler/icons-react"
import { ActionIconProps, PolymorphicComponentProps } from "@mantine/core"

interface DeleteButtonProps {
  onClick: React.MouseEventHandler<HTMLButtonElement>|(() => void)
}

function DeleteButton({ onClick, ...props }: DeleteButtonProps & PolymorphicComponentProps<"button", ActionIconProps>) {
  return (<>
    <ConfirmActionIcon
      {...props}
      onClick={onClick}
      confirmChildren={<IconQuestionMark style={{ width: '70%', height: '70%' }} stroke={1.5} />}
      confirmProps={{color: "red"}}
    >
      <IconTrash style={{ width: '70%', height: '70%' }} stroke={1.5} />
    </ConfirmActionIcon>
  </>)
}

export default DeleteButton
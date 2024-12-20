import { ActionIcon, Affix, Stack } from "@mantine/core"
import { DBItem } from "../lib/db"
import AddItemMenu from "./AddItemMenu"
import { IconEdit, IconQuestionMark, IconTrash } from "@tabler/icons-react"
import { useState } from "react"

interface FloatingButtonGroupProps {
    currentItem: DBItem|undefined
    onEditClicked?: () => void
    onDeleteClicked?: () => void
}

export default function FloatingButtonGroup({ currentItem, onEditClicked, onDeleteClicked }: FloatingButtonGroupProps) {
    const [askForDeletion, setAskForDeletion] = useState(false)

    function onDeleteClickedHandler() {
        if (!askForDeletion) {
            setAskForDeletion(true)
            return
        }
        setAskForDeletion(false)
        onDeleteClicked!()
    }

    function onDeleteBlur() {
        setAskForDeletion(false)
    }

    return(<>
        <Affix position={{ bottom: 20, right: 20 }}>
            <Stack align="center">
                { onDeleteClicked && currentItem &&
                    <ActionIcon onClick={onDeleteClickedHandler} onBlur={onDeleteBlur} color={askForDeletion ? "red" : undefined} variant="filled" size="input-md" radius="xl" aria-label="Settings">
                        { !askForDeletion
                            ? <IconTrash style={{ width: '70%', height: '70%' }} stroke={1.5} />
                            : <IconQuestionMark style={{ width: '70%', height: '70%' }} stroke={1.5} />
                        }
                    </ActionIcon>
                }
                { onEditClicked && currentItem &&
                    <ActionIcon variant="filled" size="input-md" radius="xl" aria-label="Settings">
                        <IconEdit style={{ width: '70%', height: '70%' }} stroke={1.5} />
                    </ActionIcon>
                }
                <AddItemMenu parentId={ currentItem?.id } position={{ bottom: 20, right: 20 }} />
            </Stack>
        </Affix>
        
    </>)
}
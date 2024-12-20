import { ActionIcon, Affix, Stack } from "@mantine/core"
import { DBItem } from "../lib/db"
import AddItemMenu from "./AddItemMenu"
import { IconDotsVertical, IconEdit, IconQuestionMark, IconTrash } from "@tabler/icons-react"
import { useState } from "react"
import { useClickOutside } from "@mantine/hooks"

interface FloatingButtonGroupProps {
    currentItem: DBItem|undefined
    onEditClicked?: () => void
    onDeleteClicked?: () => void
}

export default function FloatingButtonGroup({ currentItem, onEditClicked, onDeleteClicked }: FloatingButtonGroupProps) {
    const [askForDeletion, setAskForDeletion] = useState(false)
    const [expanded, setExpanded] = useState(false)
    const clickOutsideRef = useClickOutside(() => {
        setExpanded(false)
        setAskForDeletion(false)
    })

    function onDeleteClickedHandler() {
        if (!askForDeletion) {
            setAskForDeletion(true)
            return
        }
        setAskForDeletion(false)
        onDeleteClicked!()
        setExpanded(false)
    }

    function onDeleteBlur() {
        setAskForDeletion(false)
    }

    return(<>
        <Affix position={{ bottom: 20, right: 20 }}>
            { expanded &&
                <Stack align="center" ref={clickOutsideRef}>
                    { onDeleteClicked && currentItem &&
                        <ActionIcon onClick={onDeleteClickedHandler} onBlur={onDeleteBlur} color={askForDeletion ? "red" : undefined} variant="filled" size="input-md" radius="xl">
                            { !askForDeletion
                                ? <IconTrash style={{ width: '70%', height: '70%' }} stroke={1.5} />
                                : <IconQuestionMark style={{ width: '70%', height: '70%' }} stroke={1.5} />
                            }
                        </ActionIcon>
                    }
                    { onEditClicked && currentItem &&
                        <ActionIcon variant="filled" size="input-md" radius="xl" onClick={ onEditClicked }>
                            <IconEdit style={{ width: '70%', height: '70%' }} stroke={1.5} />
                        </ActionIcon>
                    }
                    <AddItemMenu parentId={ currentItem?.id } />
                </Stack>
            }
            { !expanded &&
                <ActionIcon onClick={() => setExpanded(true)} variant="filled" size="input-xl" radius="xl" aria-label="Settings">
                    <IconDotsVertical style={{ width: '70%', height: '70%' }} stroke={1.5} />
                </ActionIcon>
            }  
        </Affix>
        
    </>)
}
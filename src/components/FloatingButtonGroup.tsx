import { ActionIcon, Affix, Stack } from "@mantine/core"
import { DBItem } from "../lib/db"
import { IconDotsVertical, IconEdit, IconPlus, IconQuestionMark, IconTrash } from "@tabler/icons-react"
import { useState } from "react"
import { useClickOutside } from "@mantine/hooks"
import { NotesManager } from "../lib/notes"
import { useNavigate } from "react-router"

interface FloatingButtonGroupProps {
    currentItem: DBItem|undefined
    onEditClicked?: () => void
    onDeleteClicked?: () => void
}

export default function FloatingButtonGroup({ currentItem, onEditClicked, onDeleteClicked }: FloatingButtonGroupProps) {
    const [askForDeletion, setAskForDeletion] = useState(false)
    const [expanded, setExpanded] = useState(false)
    const [addItemMenuVisible, setAddItemMenuVisible] = useState(false)
    const parentIdUrlStr = currentItem?.id === undefined ? "" : `?parent=${currentItem.id}`
    const navigate = useNavigate()
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
                    
                    { !addItemMenuVisible && <>
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
                    </>}
                    { addItemMenuVisible && <>
                        {
                            NotesManager.supportedTypes().map(type => (
                                <ActionIcon onClick={ () => navigate(currentItem ? `/add/${currentItem.id}/${type.id}` : `/create/${type.id}${parentIdUrlStr}`)} key={type.id} variant="filled" size="input-md" radius="xl">
                                    <type.icon style={{ width: '70%', height: '70%' }} stroke={1.5} />
                                </ActionIcon>
                            ))
                        }
                    </>}
                    <ActionIcon onClick={() => setAddItemMenuVisible(!addItemMenuVisible)} variant="filled" size="input-xl" radius="xl" aria-label="Settings">
                        <IconPlus style={{ width: '70%', height: '70%' }} stroke={1.5} />
                    </ActionIcon>
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
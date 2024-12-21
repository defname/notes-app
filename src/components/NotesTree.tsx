import { List } from "@mantine/core"
import { Node } from "../hooks/graph"
import Notes from "../lib/notes"
import { Link } from "react-router"


interface NotesTreeNodeProps {
    node: Node
}

function NotesTreeNode({ node } : NotesTreeNodeProps) {
    return (<List.Item icon={<Notes.Icon item={node.item} stroke={1} />}>
        <Link to={`/item/${node.item.id}`}>
            <Notes.RenderAsText item={node.item} />
        </Link>
        { node.children.length > 0 && <List listStyleType="none">
            {
                node.children.map(child => <NotesTreeNode key={child.item.id} node={child} />)
            }
        </List>}
    </List.Item>)
}


interface NotesTreeProps {
    root: Node|Node[]|undefined
    showRoot?: boolean
    fallback?: JSX.Element
}

export default function NotesTree({ root, showRoot, fallback=<></> }: NotesTreeProps) {
    if (!root) return fallback
    return <List className="notes-tree" listStyleType="none">{
        (Array.isArray(root) ? root : showRoot ? [root] : root.children).map(node => (
           <NotesTreeNode key={node.item.id} node={node} />
        ))
    }</List>

}
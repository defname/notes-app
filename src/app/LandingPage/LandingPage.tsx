import AddItemMenu from '../../components/AddItemMenu'
import NotesList from '../../components/NotesList'
import { useAllItems } from '../../hooks/data'
import MainLayout from '../MainLayout'

export function LandingPage() {

  const allItems = useAllItems()

  return (
    <MainLayout>
      <NotesList notes={ allItems } />
      <AddItemMenu />
    </MainLayout>
  )
}

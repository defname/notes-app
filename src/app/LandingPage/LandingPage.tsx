import NotesList from '../../components/NotesList'
import { useAllItems } from '../../hooks/data'
import MainLayout from '../MainLayout'

export function LandingPage() {

  const allItems = useAllItems()

  return (
    <MainLayout showFloatingButtons={true}>
      <NotesList notes={ allItems } />
    </MainLayout>
  )
}

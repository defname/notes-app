
import { Affix, AppShell, Burger, FocusTrap, Group, UnstyledButton } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import React from 'react'
import AddItemMenu from "../components/AddItemMenu"
import { DBItem } from "../lib/db"
import { IconChevronCompactLeft, IconChevronCompactRight } from "@tabler/icons-react"


type MainLayoutProps = React.PropsWithChildren & {
    aside?: JSX.Element
    showAddItemMenu: boolean
    currentItem?: DBItem
}

export default function MainLayout({ children, aside, showAddItemMenu, currentItem } : MainLayoutProps) {
  const [ navBarOpened, navBarControl ] = useDisclosure()
  const [ asideOpened, asideControl ] = useDisclosure()

  return (
      <AppShell
        header={{ height: 60 }}
        navbar={{
          width: 300,
          breakpoint: 'md',
          collapsed: { mobile: !navBarOpened },
        }}
        aside={aside && {
            width: 300,
            breakpoint: 'sm',
            collapsed: { mobile: !asideOpened }
        }}
        padding="md"
      >
        <AppShell.Header>
          <Group h="100%">
            <Burger
              ml="md"
              opened={navBarOpened}
              onClick={navBarControl.toggle}
              hiddenFrom="md"
              size="md"
            />
            <div>Logo</div>
            { aside &&
              <Affix position={{right: 0, bottom: "50%" }}>
                <FocusTrap active={false}>
                <UnstyledButton variant="filled" size="xl" hiddenFrom="sm" onClick={asideControl.toggle}>
                  { asideOpened ? <IconChevronCompactRight style={{ width: '100%', height: '240%' }} stroke={2.5} /> : <IconChevronCompactLeft style={{ width: '100%', height: '240%' }} stroke={2.5} /> }
                </UnstyledButton>
                </FocusTrap>
              </Affix>
              
            }
          </Group>
        </AppShell.Header>

        <AppShell.Navbar p="md" zIndex={1000}>Navbar</AppShell.Navbar>

        <AppShell.Main>
            { children }

            { showAddItemMenu && <AddItemMenu parentId={currentItem?.id} position={{ bottom: 20, right: 20 }} /> }
        </AppShell.Main>

        { aside && <AppShell.Aside p="md">{ aside }</AppShell.Aside> }
      </AppShell>
  )
}

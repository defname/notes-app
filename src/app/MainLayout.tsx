
import { Affix, AppShell, Burger, FocusTrap, Group, SimpleGrid, UnstyledButton } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import React, { useEffect } from 'react'
import { DBItem } from "../lib/db"
import { IconChevronCompactLeft, IconChevronCompactRight } from "@tabler/icons-react"
import FloatingButtonGroup from "../components/FloatingButtonGroup"
import { Link, useLocation } from "react-router"
import { useSwipeable } from "react-swipeable"
import Navbar from "../components/Navbar"


type MainLayoutProps = React.PropsWithChildren & {
    aside?: JSX.Element
    showFloatingButtons: boolean
    currentItem?: DBItem

    onEditClicked?: () => void
    onDeleteClicked?: () => void
}

export default function MainLayout({ children, aside, showFloatingButtons, currentItem, onEditClicked, onDeleteClicked } : MainLayoutProps) {
  const [ navBarOpened, navBarControl ] = useDisclosure()
  const [ asideOpened, asideControl ] = useDisclosure()
  const location = useLocation()
  const swipeHandlers = useSwipeable({
    onSwipedRight: () => asideOpened ? asideControl.close() : navBarControl.open(),
    onSwipedLeft: () => navBarOpened ? navBarControl.close() : asideControl.open(),
    preventScrollOnSwipe: true
  })

  useEffect(() => {
    asideControl.close()
    navBarControl.close()
  }, [location])

  return (
      <AppShell
        { ...swipeHandlers }
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
          <SimpleGrid cols={2} h="100%">
            <Group justify="flex-start">
              <Burger
                ml="md"
                opened={navBarOpened}
                onClick={navBarControl.toggle}
                hiddenFrom="md"
                size="md"
              />
              <Link to="/">Notes</Link>
            </Group>
            <Group justify="flex-end">
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
          </SimpleGrid>
        </AppShell.Header>

        <AppShell.Navbar p="md" zIndex={1000}>
          <Navbar />
        </AppShell.Navbar>

        <AppShell.Main>
            { children }

            { showFloatingButtons &&
              <FloatingButtonGroup
                currentItem={ currentItem }
                onEditClicked={ onEditClicked }
                onDeleteClicked={ onDeleteClicked }
              /> 
            }
        </AppShell.Main>

        { aside && <AppShell.Aside p="md">{ aside }</AppShell.Aside> }
      </AppShell>
  )
}

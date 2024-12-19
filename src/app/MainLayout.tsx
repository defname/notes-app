
import { AppShell, Burger, Group } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import React from 'react'


type MainLayoutProps = React.PropsWithChildren & {
    aside?: JSX.Element
}

export default function MainLayout({ children, aside } : MainLayoutProps) {
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
          </Group>
        </AppShell.Header>

        <AppShell.Navbar p="md" zIndex={1000}>Navbar</AppShell.Navbar>

        <AppShell.Main>
            { children }
        </AppShell.Main>

        { aside && <AppShell.Aside p="md">{ aside }</AppShell.Aside> }
      </AppShell>
  )
}

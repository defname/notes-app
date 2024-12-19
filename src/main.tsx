import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import { MantineProvider, ColorSchemeScript } from '@mantine/core'
import { Notifications } from '@mantine/notifications'


import './index.scss'

import LandingPage from './app/LandingPage'
import { BrowserRouter, Routes } from 'react-router'
import { Route } from 'react-router'
import { CreatePage } from './app/CreatePage/CreatePage.tsx'
import { DisplayPage } from './app/DisplayPage/DisplayPage.tsx'



createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ColorSchemeScript defaultColorScheme='auto' />
    <MantineProvider defaultColorScheme='auto'>
      <Notifications />
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/create/:type" element={<CreatePage />} />
          <Route path="/item/:id" element={<DisplayPage />} />
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  </StrictMode>,
)

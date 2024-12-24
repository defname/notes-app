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
import { EditPage } from './app/editPage/EditPage.tsx'
import { AddPage } from './app/AddPage/AddPage.tsx'



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
          <Route path="/edit/:id" element={<EditPage />} />
          <Route path="/add/:id/:type" element={<AddPage />} />
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  </StrictMode>,
)

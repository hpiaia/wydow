import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Route, RouterProvider, createHashRouter, createRoutesFromElements } from 'react-router-dom'

import { PacketControl } from './screens/PacketControl'
import { Root } from './screens/Root'

const router = createHashRouter(
    createRoutesFromElements(
        <Route element={<Root />}>
            <Route path="/" element={<PacketControl />} />
        </Route>
    )
)

export function render() {
    createRoot(document.getElementById('root')).render(
        <StrictMode>
            <RouterProvider router={router} />
        </StrictMode>
    )
}

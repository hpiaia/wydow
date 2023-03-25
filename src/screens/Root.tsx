import { Container } from '@mantine/core'
import { Outlet } from 'react-router-dom'

export function Root() {
    return (
        <Container fluid>
            <Outlet />
        </Container>
    )
}

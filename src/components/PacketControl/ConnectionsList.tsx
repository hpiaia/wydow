import { Badge } from '@mantine/core'
import { useEffect, useState } from 'react'

import { api } from '../../lib/api'

export default function ConnectionsList() {
    const [connections, setConnections] = useState<{ id: string; isStable: boolean }[]>([])

    async function refreshConnections() {
        setConnections(await api.getConnections())
    }

    useEffect(() => {
        refreshConnections()

        return api.onConnectionsChanged((connections) => {
            console.log('connections changed', connections)
            setConnections(connections)
        })
    }, [])

    return (
        <div>
            <h1>Active connections: {connections.length}</h1>
            <ul>
                {connections.map((connection) => (
                    <li key={connection.id}>
                        {connection.id}
                        <Badge color={connection.isStable ? 'green' : 'red'} ml="sm">
                            {connection.isStable ? 'Stable' : 'Unstable'}
                        </Badge>
                    </li>
                ))}
            </ul>
        </div>
    )
}

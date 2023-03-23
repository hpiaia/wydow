import { useEffect, useState } from 'react'

import { api } from '../../lib/api'

export default function ConnectionsList() {
    const [connectionIds, setConnectionIds] = useState<string[]>([])

    async function refreshConnections() {
        setConnectionIds(await api.getConnections())
    }

    useEffect(() => {
        refreshConnections()

        return api.onConnectionsChanged((connectionIds) => {
            setConnectionIds(connectionIds)
        })
    }, [])

    return (
        <div>
            <h1>Active connections: {connectionIds.length}</h1>
            <ul>
                {connectionIds.map((connectionId) => (
                    <li key={connectionId}>{connectionId}</li>
                ))}
            </ul>
        </div>
    )
}

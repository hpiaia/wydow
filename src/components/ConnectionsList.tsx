import { useEffect, useState } from 'react'

import { api } from '../lib/api'

export default function ConnectionsList() {
    const [connectionIds, setConnectionIds] = useState<string[]>([])

    useEffect(() => {
        return api.onConnectionsChanged((connectionIds) => {
            setConnectionIds(connectionIds)
        })
    }, [])

    return (
        <div>
            <h1>Active connections</h1>

            {connectionIds.length === 0 && <p>No active connections.</p>}
            {connectionIds.length === 1 && <p>There is 1 active connection.</p>}
            {connectionIds.length > 1 && <p>There are {connectionIds.length} connections.</p>}

            <ul>
                {connectionIds.map((connectionId) => (
                    <li key={connectionId}>{connectionId}</li>
                ))}
            </ul>
        </div>
    )
}

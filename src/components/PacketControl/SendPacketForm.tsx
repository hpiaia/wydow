import { useState } from 'react'
import toast from 'react-hot-toast'

import { api } from '../../lib/api'
import Button from '../Ui/Button'

export default function SendPacketForm() {
    const [connectionId, setConnectionId] = useState<string>('')
    const [packetData, setPacketData] = useState<string>('')

    async function sendPacket(direction: 'upstream' | 'downstream') {
        if (!connectionId || !packetData) return
        const success = await api.sendPacket({ direction, connectionId, data: packetData })
        if (!success) toast.error('Fail to send packet, invalid connection ID')
    }

    return (
        <div className="mt-6">
            <div>
                <input
                    type="text"
                    placeholder="Connection ID"
                    value={connectionId}
                    onChange={(e) => setConnectionId(e.target.value)}
                />
            </div>

            <div>
                <textarea
                    placeholder="Packet data"
                    rows={5}
                    cols={70}
                    value={packetData}
                    onChange={(e) => setPacketData(e.target.value)}
                />
            </div>

            <div className="flex space-x-4 mt-6">
                <Button onClick={() => sendPacket('downstream')}>Send client packet</Button>
                <Button onClick={() => sendPacket('upstream')}>Send server packet</Button>
            </div>
        </div>
    )
}

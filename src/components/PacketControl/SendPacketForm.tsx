import { useState } from 'react'

import { api } from '../../lib/api'

export default function SendPacketForm() {
    const [connectionId, setConnectionId] = useState<string>('')
    const [packetData, setPacketData] = useState<string>('')

    function sendClientPacket() {
        api.sendClientPacket({ connectionId, packet: packetData })
    }

    function sendServerPacket() {
        api.sendServerPacket({ connectionId, packet: packetData })
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

            <div>
                <button onClick={sendClientPacket}>Send client packet</button>
                <button onClick={sendServerPacket}>Send server packet</button>
            </div>
        </div>
    )
}

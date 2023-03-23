import { api } from '../lib/api'

export function Home() {
    return (
        <button
            onClick={() =>
                api.sendPacket({
                    connectionId: '123',
                    packet: 'ff00ff',
                })
            }
        >
            Home
        </button>
    )
}

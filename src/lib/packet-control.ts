import { api } from '../lib/api'
import { toString } from '../utils/hex'
import { getHeader } from '../utils/packet'

const BASIC_PACKETS = ['36c', '181', 'd1d', '376', '364', '336', '165']
const IGNORE_PACKETS = ['107', '27b', '39d', '17c', '39d', '28b', '368']

const SEND_PARTY = '2c00ade97f033900db79972500000b00490049003900706c6b636f6e7461310000000000000000002f020000'

export function packetControl() {
    api.onPacket(({ connectionId, direction, packet }) => {
        const header = getHeader(packet)

        if (IGNORE_PACKETS.includes(header.packetId) || BASIC_PACKETS.includes(header.packetId)) return

        if (direction === 'downstream') {
            switch (header.packetId) {
                // whisper or citzen chat
                case '334': {
                    const message = toString(packet.slice(56, packet.length))
                    const isCitizenChat = message.startsWith('@@')
                    if (!isCitizenChat) console.log(message)
                    if (message === 'grupo') {
                        api.sendServerPacket({ connectionId, packet: SEND_PARTY })
                    }
                    break
                }
            }
        }
    })
}

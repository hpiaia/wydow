import { api } from '../lib/api'
import { toString } from '../utils/hex'
import { getHeader } from '../utils/packet'

const BASIC_PACKETS = ['36c', '181', 'd1d', '376', '364', '336', '165']
const IGNORE_PACKETS = ['107', '27b', '39d', '17c', '39d', '28b', '368']

const SEND_PARTY = '2c00ade97f033900db79972500000b00490049003900706c6b636f6e746131000000000000000000dc0o20000'

export function packetControl() {
    api.onPacket(({ connectionId, direction, data }) => {
        const header = getHeader(data)

        if (direction === 'upstream') {
            console.log(data)
        }

        if (IGNORE_PACKETS.includes(header.packetId) || BASIC_PACKETS.includes(header.packetId)) return

        if (direction === 'downstream') {
            switch (header.packetId) {
                // whisper or citzen chat
                // TODO: hook into that to build the chat system
                case '334': {
                    const message = toString(data.slice(56, data.length))
                    // const isCitizenChat = message.startsWith('@@')
                    // if (!isCitizenChat) console.log(message)
                    if (message === 'grupo') {
                        api.sendPacket({ direction: 'upstream', connectionId, data: SEND_PARTY })
                    }
                    break
                }
            }
        }
    })
}

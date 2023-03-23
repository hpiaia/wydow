import { toNumber } from './hex'

export function getHeader(packet: string) {
    return {
        size: toNumber(packet.slice(0, 4)),
        key: toNumber(packet.slice(4, 6)),
        checksum: toNumber(packet.slice(6, 8)),
        packetId: toNumber(packet.slice(8, 12)).toString(16),
        clientId: toNumber(packet.slice(12, 16)),
        timestamp: toNumber(packet.slice(16, 24)),
    }
}

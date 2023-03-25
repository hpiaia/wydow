import { info } from 'electron-log'
import { createConnection, createServer } from 'node:net'

import { decrypt } from '../lib/encryption'
import { Connection, createConnectionStore } from '../stores/connection'

export const connections = createConnectionStore()

function processData({
    connection,
    direction,
    data,
    onPacket,
    onConnectionsChanged,
}: {
    connection: Connection
    direction: 'upstream' | 'downstream'
    data: Buffer
    onPacket?: (packet: Buffer) => void
    onConnectionsChanged?: (connectionIds: { id: string; isStable: boolean }[]) => void
}) {
    if (data.length <= 4) return

    // Hello packet
    if (data.subarray(0, 4).toString('hex') === '11f3111f') {
        data = data.subarray(4, data.length)
    }

    connection.buffer[direction] = Buffer.concat([connection.buffer[direction], data])

    // Some packets may be split into multiple messages
    // If message has LESS data than expected, we wait for more data
    // If message has MORE data than expected, we keep the overflow for next iteration
    while (connection.buffer[direction].length) {
        const messageSize = connection.buffer[direction].readUInt16LE(0)

        // Message is incomplete, wait for more data
        if (connection.buffer[direction].length < messageSize) {
            break
        }

        const decrypted = decrypt(connection.buffer[direction].subarray(0, messageSize))

        // Check for connection stability
        if (direction === 'upstream' && !connection.isStable) {
            const key = decrypted.readUint8(2)
            const isStable = connection.checkStability(key)
            if (isStable) info(`Connection ${connection.id} is stable now`)
            onConnectionsChanged?.(connections.list())
        }

        // Ignore packets with empty ids and world creation packets
        if (decrypted.readUint16LE(4) !== 0 && decrypted.readUint16LE(4) !== 15900) {
            onPacket?.(decrypted)
        }

        // Message is complete, remove it from the buffer and keep overflow
        connection.buffer[direction] = connection.buffer[direction].subarray(messageSize)
    }
}

export function createProxyServer({
    remoteHost,
    remotePort,
    onPacketReceived,
    onConnectionsChanged,
}: {
    remoteHost: string
    remotePort: number
    onPacketReceived?: (connectionId: string, direction: 'upstream' | 'downstream', data: Buffer) => void
    onConnectionsChanged?: (connectionIds: { id: string; isStable: boolean }[]) => void
}) {
    return createServer((client) => {
        const server = createConnection(remotePort, remoteHost)

        const connection = connections.create({ client, server })
        info(`Connection created: ${connection.id}`)

        onConnectionsChanged?.(connections.list())

        client.on('data', (data) => {
            server.write(data)

            processData({
                connection,
                direction: 'upstream',
                data,
                onPacket: (packet) => onPacketReceived?.(connection.id, 'upstream', packet),
                onConnectionsChanged,
            })
        })

        server.on('data', (data) => {
            client.write(data)

            processData({
                connection,
                direction: 'downstream',
                data,
                onPacket: (packet) => onPacketReceived?.(connection.id, 'downstream', packet),
                onConnectionsChanged,
            })
        })

        client.on('close', () => {
            server.destroy()

            connections.remove(connection)
            info(`Connection closed: ${connection.id}`)

            onConnectionsChanged?.(connections.list())
        })

        server.on('close', () => {
            client.destroy()
        })

        client.on('error', () => {
            server.destroy()
        })

        server.on('error', () => {
            client.destroy()
        })
    })
}

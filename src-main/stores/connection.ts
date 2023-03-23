import { Socket } from 'node:net'
import { v4 as uuidv4 } from 'uuid'

import { encrypt } from '../lib/encryption'

function createConnection({ client, server }: { client: Socket; server: Socket }) {
    const sendClientPacket = (data: string) => {
        const buffer = encrypt(Buffer.from(data, 'hex'))
        client.write(buffer)
    }

    const sendServerPacket = (data: string) => {
        const buffer = encrypt(Buffer.from(data, 'hex'))
        server.write(buffer)
    }

    return {
        id: uuidv4(),
        buffer: {
            upstream: Buffer.alloc(0),
            downstream: Buffer.alloc(0),
        },
        socket: {
            client,
            server,
        },
        sendClientPacket,
        sendServerPacket,
    }
}

export type Connection = ReturnType<typeof createConnection>

export function createConnectionStore() {
    let connections: Connection[] = []

    function create({ client, server }: { client: Socket; server: Socket }) {
        const connection = createConnection({ client, server })
        connections = [...connections, connection]
        return connection
    }

    function remove(connection: Connection) {
        connections = connections.filter((c) => c.id !== connection.id)
    }

    function ids() {
        return connections.map((connection) => connection.id)
    }

    function sendClientPacket(connectionId: string, data: string) {
        const connection = connections.find((c) => c.id === connectionId)
        if (connection) {
            connection.sendClientPacket(data)
        }
    }

    function sendServerPacket(connectionId: string, data: string) {
        const connection = connections.find((c) => c.id === connectionId)
        if (connection) {
            connection.sendServerPacket(data)
        }
    }

    return {
        create,
        remove,
        ids,
        sendClientPacket,
        sendServerPacket,
    }
}

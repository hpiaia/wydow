import { Socket } from 'node:net'
import { v4 as uuidv4 } from 'uuid'

import { encrypt } from '../lib/encryption'

export class Connection {
    public id: string
    public isStable = false
    public buffer: {
        upstream: Buffer
        downstream: Buffer
    }

    private lastKey = 0

    constructor(
        public socket: {
            client: Socket
            server: Socket
        }
    ) {
        this.id = uuidv4()
        this.buffer = {
            upstream: Buffer.alloc(0),
            downstream: Buffer.alloc(0),
        }
    }

    public sendPacket({ direction, data }: { direction: 'upstream' | 'downstream'; data: string }) {
        const buffer = encrypt(Buffer.from(data, 'hex'))
        return direction === 'upstream' ? this.socket.server.write(buffer) : this.socket.client.write(buffer)
    }

    public checkStability(key: number) {
        if (this.lastKey === key) {
            return (this.isStable = true)
        }

        this.lastKey = key
        return (this.isStable = false)
    }
}

export function createConnectionStore() {
    let connections: Connection[] = []

    function create({ client, server }: { client: Socket; server: Socket }) {
        const connection = new Connection({ client, server })
        connections = [...connections, connection]
        return connection
    }

    function remove(connection: Connection) {
        connections = connections.filter((c) => c.id !== connection.id)
    }

    function list() {
        return connections.map((connection) => ({
            id: connection.id,
            isStable: connection.isStable,
        }))
    }

    function sendPacket({
        direction,
        connectionId,
        data,
    }: {
        direction: 'upstream' | 'downstream'
        connectionId: string
        data: string
    }) {
        const connection = connections.find((c) => c.id === connectionId)
        if (!connection) return false
        return connection.sendPacket({ direction, data })
    }

    return {
        create,
        remove,
        list,
        sendPacket,
    }
}

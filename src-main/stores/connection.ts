import { Socket } from 'node:net'
import { v4 as uuidv4 } from 'uuid'

function createConnection({ client, server }: { client: Socket; server: Socket }) {
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

    function all() {
        return connections
    }

    return {
        create,
        remove,
        all,
    }
}

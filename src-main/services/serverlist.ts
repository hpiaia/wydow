import fastify from 'fastify'

export function createSLServer() {
    return fastify().get('/', async () => {
        return '1 1 1 1 1 1 1 1 1 1'
    })
}

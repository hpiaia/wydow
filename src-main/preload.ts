// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron'

export type OnPacket = {
    direction: 'upstream' | 'downstream'
    connectionId: string
    data: string
}

export type SendPacket = {
    direction: 'upstream' | 'downstream'
    connectionId: string
    data: string
}

const api = {
    getConnections: async () => {
        return (await ipcRenderer.invoke('get_connections')) as { id: string; isStable: boolean }[]
    },

    onConnectionsChanged: (callback: (connections: { id: string; isStable: boolean }[]) => void) => {
        ipcRenderer.on('connections_changed', (_, connections: { id: string; isStable: boolean }[]) =>
            callback(connections)
        )

        return () => {
            ipcRenderer.removeAllListeners('connections_changed')
        }
    },

    onPacket: (callback: (data: OnPacket) => void) => {
        ipcRenderer.on('packet_received', (_, data: OnPacket) => callback(data))

        return () => {
            ipcRenderer.removeAllListeners('packet_received')
        }
    },

    sendPacket: async (data: SendPacket) => {
        return (await ipcRenderer.invoke('send_packet', data)) as boolean
    },
}

export type Api = typeof api

contextBridge.exposeInMainWorld('WydowAPI', api)

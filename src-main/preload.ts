// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron'

export type OnPacketData = {
    direction: 'upstream' | 'downstream'
    packet: string
}

export type SendPacket = {
    connectionId: string
    packet: string
}

const api = {
    onConnectionsChanged: (callback: (connectionIds: string[]) => void) => {
        ipcRenderer.on('connections_changed', (_, connectionIds: string[]) => callback(connectionIds))

        return () => {
            ipcRenderer.removeAllListeners('connections_changed')
        }
    },

    onPacket: (callback: (data: OnPacketData) => void) => {
        ipcRenderer.on('packet_received', (_, data: OnPacketData) => callback(data))

        return () => {
            ipcRenderer.removeAllListeners('packet_received')
        }
    },

    sendPacket: (data: SendPacket) => {
        ipcRenderer.send('send_packet', data)
    },
}

export type Api = typeof api

contextBridge.exposeInMainWorld('wydow', api)

const lastKeys: Record<string, number> = {}

// TODO: move this to the server
export function isConnectionStable(connectionId: string, key: number) {
    if (lastKeys[connectionId] === key) return true
    lastKeys[connectionId] = key
    return false
}

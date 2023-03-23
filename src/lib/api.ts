import type { Api } from '../../src-main/preload'

declare global {
    interface Window {
        wydow: Api
    }
}

export const api = window.wydow

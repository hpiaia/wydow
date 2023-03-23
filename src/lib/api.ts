import type { Api } from '../../src-main/preload'

declare global {
    interface Window {
        WydowAPI: Api
    }
}

export const api = window.WydowAPI

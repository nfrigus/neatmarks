import AppAPI from './app/api/AppAPI'

declare global {
  interface Window {
    app: typeof AppAPI
  }
}

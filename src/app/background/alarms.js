import dispatcher from './dispatcher'
import { ensureAlarm } from '../service/alarms'

dispatcher.on('app.install', async () => {
  await ensureAlarm('hourly', {
    delayInMinutes: 1,
    periodInMinutes: 60,
  }).catch(console.error)
})

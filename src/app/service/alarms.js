import { alarms } from '../api/ChromeAPI'
import promisify from '../lib/promisify'

const addAlarm = alarms.create
const getAlarm = promisify(alarms.get)
const getAlarms = promisify(alarms.getAll)

export async function ensureAlarm(hourly, alarmInfo) {
  const [alarm] = await getAlarm(hourly)
  if (!alarm) {
    addAlarm(hourly, alarmInfo)
  }
}

export async function getSchedule() {
  return getAlarms()
}

import { createBackup, getBackups } from '../service/database'
import dispatcher from './dispatcher'

dispatcher.on('app.install', runBackupSchedule)
dispatcher.on('alarm.hourly', runBackupSchedule)

async function runBackupSchedule() {
  const backups = await getBackups()
  if (!backups.length) {
    await createBackup()
  }
}

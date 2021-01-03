import { EventEmitter } from 'events'

export default class extends EventEmitter {
  emit(action, ...payoad) {
    console.debug(action, ...payoad)
    return EventEmitter.prototype.emit.call(this, action, ...payoad)
  }

  /**
   * Proxy events of EventTarget
   */
  pipe(type, emitter) {
    console.debug(`pipe.${type}`)
    emitter.addListener((...args) => this.emit(type, ...args))
  }

  /**
   * Map event into another event
   */
  map(type, mapper) {
    (this as EventEmitter).on(type, (...args) => {
      const newType = mapper(...args)
      if (newType) {
        this.emit(newType, ...args)
      }
    })
  }
}

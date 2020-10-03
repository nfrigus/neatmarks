import EventEmitter from 'events'

export default class extends EventEmitter {
  emit(action, ...payoad) {
    console.debug(action, ...payoad)
    EventEmitter.prototype.emit.call(this, action, ...payoad)
  }

  pipe(type, emitter) {
    console.debug(`pipe.${type}`)
    emitter.addListener((...args) => this.emit(type, ...args))
  }
}

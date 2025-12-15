export const eventBus = {
  events: {},

  on(event, handler) {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(handler);
  },

  off(event, handler) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter(h => h !== handler);
  },

  emit(event, payload) {
    if (!this.events[event]) return;
    for (const handler of this.events[event]) {
      handler(payload);
    }
  },
};

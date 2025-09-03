const eventBus = (function () {
  let events = {};

  return {
    on: (event, callback) => {
      if (!events[event]) {
        events[event] = [];
      }
      events[event].push(callback);
    },
    emit: (event, data) => {
      if (events[event]) {
        events[event].forEach((callback) => callback(data));
      }
    },
  };
})();

export default eventBus;

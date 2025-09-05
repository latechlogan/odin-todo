import eventBus from "./eventBus";

const storageManager = (() => {
  const STORAGE_KEY = "todoTimeline";

  const save = function (data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.warn("Storage full, clearing old data");
      this.clear();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  };

  const load = function () {
    const savedTasks = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    eventBus.emit("tasksLoaded", savedTasks);
  };

  const clear = function () {
    localStorage.removeItem(STORAGE_KEY);
  };

  eventBus.on("appStart", load);
  eventBus.on("tasksChanged", save);
})();

export default storageManager;

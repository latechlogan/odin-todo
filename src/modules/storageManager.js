import eventBus from "./eventBus";
import Task from "../models/Task";

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
    const rawData = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    const loadedTasks = rawData.map((obj) => Task.fromObject(obj));
    console.log("Loaded tasks: ", loadedTasks);
    eventBus.emit("tasksLoaded", loadedTasks);
  };

  const clear = function () {
    localStorage.removeItem(STORAGE_KEY);
  };

  eventBus.on("appStart", load);
  eventBus.on("tasksChanged", save);
})();

export default storageManager;

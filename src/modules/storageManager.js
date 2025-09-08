import eventBus from "./eventBus";
import Task from "../models/Task";
import TaskGroup from "../models/TaskGroup";
import todoManager from "./todoManager";

const storageManager = (() => {
  const STORAGE_KEY = "todoTimeline";

  const save = function () {
    const tasks = todoManager.getTasks();
    const taskGroups = todoManager.getTaskGroups();

    const data = {
      tasks: tasks,
      taskGroups: taskGroups,
    };

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
    const loadedTasks = rawData["tasks"].map((obj) => Task.fromObject(obj));
    const loadedTaskGroups = rawData["taskGroups"].map((obj) =>
      TaskGroup.fromObject(obj)
    );
    eventBus.emit("tasksLoaded", loadedTasks);
    eventBus.emit("taskGroupsLoaded", loadedTaskGroups);
  };

  const clear = function () {
    localStorage.removeItem(STORAGE_KEY);
  };

  eventBus.on("inboxReady", load);
  eventBus.on("tasksChanged", save);
  eventBus.on("taskGroupsChanged", save);
})();

export default storageManager;

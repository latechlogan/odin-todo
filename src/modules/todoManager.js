import eventBus from "./eventBus.js";
import Task from "../models/Task.js";

const todoManager = (function () {
  const tasks = [];

  const createTask = function (object) {
    const task = new Task(
      object.title,
      object.dueDateString,
      object.description,
      object.importance
    );
    addTask(task);
  };

  const addTask = function (task) {
    tasks.push(task);
    eventBus.emit("tasksChanged", tasks);
  };

  const loadTasks = function (loadedTasks) {
    loadedTasks.forEach((task) => {
      tasks.push(task);
      eventBus.emit("tasksChanged", tasks);
    });
  };

  eventBus.on("tasksLoaded", loadTasks);
  eventBus.on("formSubmitted", createTask);
})();

export default todoManager;

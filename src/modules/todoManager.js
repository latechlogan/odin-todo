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
    console.log(task);
    return task;
  };

  const addTask = function (task) {
    tasks.push(task);
    console.log(tasks);
    eventBus.emit("taskAdded", tasks);
  };

  const handleFormSubmit = function (object) {
    const task = createTask(object);
    addTask(task);
  };

  eventBus.on("formSubmitted", handleFormSubmit);
})();

export default todoManager;

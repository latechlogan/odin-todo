import eventBus from "./eventBus.js";
import Task from "../models/Task.js";

const todoManager = (function () {
  const createTask = function (object) {
    const task = new Task(
      object.title,
      object.dueDateString,
      object.description,
      object.importance
    );
    eventBus.emit("taskAdded", task);
    console.log(task);
  };
  eventBus.on("formSubmitted", createTask);
})();

export default todoManager;

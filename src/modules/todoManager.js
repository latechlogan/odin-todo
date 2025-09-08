import eventBus from "./eventBus.js";
import Task from "../models/Task.js";
import TaskGroup from "../models/TaskGroup.js";

const todoManager = (function () {
  const tasks = [];
  const groups = [];

  const createTask = function (object) {
    const task = new Task(
      object.title,
      object.dueDateString,
      object.description,
      object.importance,
      object.groupId
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

  const createTaskGroup = function (name) {
    const group = new TaskGroup(name);
    addTaskGroup(group);
  };

  const addTaskGroup = function (group) {
    groups.push(group);
    eventBus.emit("groupsChanged", groups);
  };

  const loadTaskGroups = function (loadedTaskGroups) {
    loadedTaskGroups.forEach((group) => {
      groups.push(group);
      eventBus.emit("groupsChanged", groups);
    });
  };

  eventBus.on("tasksLoaded", loadTasks);
  eventBus.on("formSubmitted", createTask);
})();

export default todoManager;

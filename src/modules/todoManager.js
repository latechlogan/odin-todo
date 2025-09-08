import eventBus from "./eventBus.js";
import Task from "../models/Task.js";
import TaskGroup from "../models/TaskGroup.js";

const todoManager = (function () {
  const tasks = [];
  const taskGroups = [];

  const initializeInbox = function () {
    const inbox = new TaskGroup("Inbox", "inbox");
    taskGroups.push(inbox);
    eventBus.emit("inboxReady");
  };

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
    });
    eventBus.emit("tasksChanged", tasks);
  };

  const createTaskGroup = function (name) {
    const group = new TaskGroup(name);
    addTaskGroup(group);
  };

  const addTaskGroup = function (group) {
    taskGroups.push(group);
    eventBus.emit("taskGroupsChanged", taskGroups);
  };

  const loadTaskGroups = function (loadedTaskGroups) {
    loadedTaskGroups.forEach((group) => {
      taskGroups.push(group);
      eventBus.emit("taskGroupsChanged", taskGroups);
    });
  };

  const getTasks = function () {
    return tasks;
  };

  const getTaskGroups = function () {
    return taskGroups;
  };

  eventBus.on("appStart", initializeInbox);
  eventBus.on("tasksLoaded", loadTasks);
  eventBus.on("formSubmitted", createTask);

  return { getTasks, getTaskGroups };
})();

export default todoManager;

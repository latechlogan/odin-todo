import eventBus from "./eventBus.js";
import Task from "../models/Task.js";
import TaskGroup from "../models/TaskGroup.js";

const todoManager = (function () {
  const tasks = [];
  const taskGroups = [];

  const initializeInbox = function () {
    let inbox = taskGroups.find((el) => el.id === "inbox");
    if (!inbox) {
      inbox = new TaskGroup("Inbox", "inbox");
      taskGroups.push(inbox);
    }
    eventBus.emit("inboxReady");
  };

  const createTask = function (object) {
    const task = new Task(
      object.title,
      object.dueDateString,
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
      if (group.id !== "inbox") {
        taskGroups.push(group);
      }
    });
    eventBus.emit("taskGroupsChanged", taskGroups);
  };

  const getTasks = function () {
    return tasks;
  };

  const getTaskGroups = function () {
    return taskGroups;
  };

  eventBus.on("appStart", initializeInbox);
  eventBus.on("tasksLoaded", loadTasks);
  eventBus.on("taskGroupsLoaded", loadTaskGroups);
  eventBus.on("newTaskSubmitted", createTask);
  eventBus.on("newGroupSubmitted", createTaskGroup);

  return { getTasks, getTaskGroups };
})();

export default todoManager;

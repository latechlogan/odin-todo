import "./styles.css";

import Task from "./models/Task";
import TaskGroup from "./models/TaskGroup";

import eventBus from "./modules/eventBus";
import storageManager from "./modules/storageManager";
import timelineManager from "./modules/timelineManager";
import todoManager from "./modules/todoManager";
import uiController from "./modules/uiController";

// attached to window for testing in browser console
window.TaskGroup = TaskGroup;
window.uiController = uiController;

const initApp = (function () {
  console.log("Initializing Todo Timeline App...");
  eventBus.emit("appStart");
})();

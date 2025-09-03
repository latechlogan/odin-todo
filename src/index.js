import "./styles.css";
import eventBus from "./modules/eventBus";
import storageManager from "./modules/storageManager";
import timelineManager from "./modules/timelineManager";
import todoManager from "./modules/todoManager";
import uiController from "./modules/uiController";

eventBus.logger();
storageManager.logger();
timelineManager.logger();
todoManager.logger();
uiController.logger();

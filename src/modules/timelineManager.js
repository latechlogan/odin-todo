import dateManager from "./dateManager";
import eventBus from "./eventBus";

const timelineManager = (function () {
  const groupTasksByDate = function (tasks) {
    const groups = new Map();

    tasks.forEach((task) => {
      const dateKey = new Date(task.dueDate).toISOString().split("T")[0];

      if (!groups.has(dateKey)) {
        groups.set(dateKey, new TaskGroup(task.dueDate));
      }

      groups.get(dateKey).tasks.push(task);
    });

    syncTimeline(groups);
  };

  const syncTimeline = function (groups) {
    const timelineDates = dateManager.generateTimelineDates();

    for (const key of groups.keys()) {
      if (timelineDates.has(key)) {
        timelineDates.set(key, groups.get(key).tasks);
      }
    }

    console.log(timelineDates);
  };

  eventBus.on("tasksLoaded", groupTasksByDate);
  eventBus.on("tasksChanged", groupTasksByDate);
})();

export default timelineManager;

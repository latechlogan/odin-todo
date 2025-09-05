import eventBus from "./eventBus";

const timelineManager = (function () {
  const groupTasksByDate = function (tasks) {
    const groups = new Map();

    tasks.forEach((task) => {
      const dateKey = task.dueDate.toDateString();

      if (!groups.has(dateKey)) {
        groups.set(dateKey, new TaskGroup(task.dueDate));
      }

      groups.get(dateKey).tasks.push(task);
    });

    console.log("Grouped tasks array: ", Array.from(groups.values()));
    return Array.from(groups.values());
  };

  eventBus.on("taskAdded", groupTasksByDate);
})();

export default timelineManager;

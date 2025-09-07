import eventBus from "./eventBus";

const uiController = (function () {
  const getSubmission = function (options = {}) {
    const defaults = {
      title: "Pickup Dry Cleaning",
      dueDateString: new Date(),
      description: "",
      importance: 1,
    };
    const testSubmission = { ...defaults, ...options };
    eventBus.emit("formSubmitted", testSubmission);
  };

  const displayTasks = function (tasks) {
    document.querySelector(".tasks-container").innerHTML = "";
    tasks.forEach((task) => {
      const taskDiv = document.createElement("div");
      taskDiv.classList.add("task-item");
      taskDiv.dataset.id = task.id;

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.completed;

      const title = document.createElement("span");
      title.textContent = task.title;

      const editBtn = document.createElement("button");
      editBtn.textContent = "Edit";

      taskDiv.append(checkbox, title, editBtn);

      document.querySelector(".tasks-container").appendChild(taskDiv);
    });
  };

  eventBus.on("tasksChanged", displayTasks);

  return { getSubmission };
})();

export default uiController;

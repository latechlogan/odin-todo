import eventBus from "./eventBus";
import todoManager from "./todoManager";
import TaskGroup from "../models/TaskGroup";
import feather from "feather-icons";

const uiController = (function () {
  const createEditableTaskRow = function () {
    const row = document.createElement("div");
    row.className = "task-row editing";
    row.innerHTML = `
      <input type="text" class="task-title-input" placeholder="Task title..." />
      <button class="save-task-btn">Save</button>
      <button class="cancel-task-btn">Cancel</button>
    `;

    if (!document.querySelector(".task-row.editing")) {
      document.querySelector('[data-id="inbox"]').appendChild(row);
      document.querySelector(".task-title-input").focus();
    }

    setupRowHandlers(row);
  };

  const setupRowHandlers = function (row) {
    row
      .querySelector(".save-task-btn")
      .addEventListener("click", () => handleSaveTask(row));
    row
      .querySelector(".cancel-task-btn")
      .addEventListener("click", () => handleCancelTask(row));

    row.querySelector(".task-title-input").addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        handleSaveTask(row);
      }
      if (e.key === "Escape") {
        handleCancelTask(row);
      }
    });
  };

  const handleSaveTask = function (row) {
    const taskData = {
      title: row.querySelector(".task-title-input").value,
      dueDateString: new Date().toDateString,
      description: "",
      importance: 1,
    };

    if (!taskData.title) {
      alert("Title is required!");
      return;
    }

    eventBus.emit("formSubmitted", taskData);
  };

  const handleCancelTask = function (row) {
    row.remove();
  };

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

  const displayTasks = function () {
    const tasks = todoManager.getTasks();
    const taskGroups = todoManager.getTaskGroups();
    const tasksContainer = document.querySelector(".tasks-container");

    tasksContainer.innerHTML = "";

    taskGroups.forEach((group) => {
      const taskGroupDiv = document.createElement("div");
      taskGroupDiv.classList.add("task-group");
      taskGroupDiv.dataset.id = group.id;

      const taskGroupHeader = document.createElement("p");
      taskGroupHeader.classList.add("task-group__header");
      taskGroupHeader.textContent = group.groupName;

      const taskGroupWrapper = document.createElement("div");
      taskGroupWrapper.classList.add("task-group__wrapper");

      const taskSubset = group.getTasksFromArray(tasks);
      taskSubset.forEach((task) => {
        const taskWrapper = document.createElement("div");
        taskWrapper.classList.add("task-div");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;

        const title = document.createElement("span");
        title.textContent = task.title;

        const editBtn = document.createElement("button");
        editBtn.classList.add("task-edit-btn");
        editBtn.innerHTML = `<span data-feather="edit-2"></span>`;

        taskWrapper.append(checkbox, title, editBtn);
        taskGroupWrapper.append(taskWrapper);
      });

      taskGroupDiv.append(taskGroupHeader, taskGroupWrapper);
      tasksContainer.append(taskGroupDiv);
    });

    feather.replace();
  };

  eventBus.on("tasksChanged", displayTasks);

  document
    .querySelector(".add-task-btn")
    .addEventListener("click", createEditableTaskRow);

  return { getSubmission };
})();

export default uiController;

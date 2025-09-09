import eventBus from "./eventBus";
import todoManager from "./todoManager";
import TaskGroup from "../models/TaskGroup";
import feather from "feather-icons";

const uiController = (function () {
  // VARIABLES
  const tasksContainer = document.querySelector(".tasks-container");

  // FUNCTIONS
  const createEditableTaskRow = function () {
    const row = document.createElement("div");
    row.className = "task-row editing";
    row.innerHTML = `
      <input type="text" class="task-title-input" placeholder="Task..." />
      <button class="save-task-btn">Save</button>
      <button class="cancel-task-btn">Cancel</button>
    `;

    if (!document.querySelector(".task-row.editing")) {
      document
        .querySelector('[data-id="inbox"]')
        .querySelector(".task-group__wrapper")
        .appendChild(row);
      document.querySelector(".task-title-input").focus();
    }

    setupNewTaskHandlers(row);
  };

  const setupNewTaskHandlers = function (row) {
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
      importance: 1,
    };

    if (!taskData.title) {
      alert("Title is required!");
      return;
    }

    eventBus.emit("newTaskSubmitted", taskData);
  };

  const handleCancelTask = function (row) {
    row.remove();
  };

  const createEditableGroupRow = function () {
    const row = document.createElement("div");
    row.className = "group-row editing";
    row.innerHTML = `
      <input type="text" class="group-name-input" placeholder="Group name..." />
      <button class="save-group-btn">Save</button>
      <button class="cancel-group-btn">Cancel</button>
    `;

    if (!document.querySelector(".group-row.editing")) {
      document.querySelector(".tasks-container").appendChild(row);
      document.querySelector(".group-name-input").focus();
    }

    setupNewGroupHandlers(row);
  };

  const setupNewGroupHandlers = function (row) {
    row
      .querySelector(".save-group-btn")
      .addEventListener("click", () => handleSaveGroup(row));
    row
      .querySelector(".cancel-group-btn")
      .addEventListener("click", () => handleCancelGroup(row));

    row.querySelector(".group-name-input").addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        handleSaveGroup(row);
      }
      if (e.key === "Escape") {
        handleCancelGroup(row);
      }
    });
  };

  const handleSaveGroup = function (row) {
    const groupData = {
      groupName: row.querySelector(".group-name-input").value,
    };

    if (!groupData.groupName) {
      alert("Group name is required!");
      return;
    }

    eventBus.emit("newGroupSubmitted", groupData.groupName);
  };

  const handleCancelGroup = function (row) {
    row.remove();
  };

  const displayTasks = function () {
    const tasks = todoManager.getTasks();
    const taskGroups = todoManager.getTaskGroups();
    let taskGroupsAsOptions = "";
    taskGroups.forEach((group) => {
      taskGroupsAsOptions += `<option value="${group.id}">${group.groupName}</option>`;
    });
    const tasksContainer = document.querySelector(".tasks-container");

    tasksContainer.innerHTML = "";

    taskGroups.forEach((group) => {
      const taskGroupDiv = document.createElement("div");
      taskGroupDiv.classList.add("task-group");
      taskGroupDiv.classList.add("group-row");
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
        taskWrapper.dataset.id = task.id;

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;

        const title = document.createElement("span");
        title.textContent = task.title;

        const selectLabel = document.createElement("label");
        selectLabel.setAttribute("for", "groupSelect");
        selectLabel.classList.add("sr-only");
        selectLabel.textContent =
          "Select the group you would like to move this task to:";
        const select = document.createElement("select");
        select.setAttribute("id", "groupSelect");
        select.setAttribute("name", "groupSelect");
        select.innerHTML = `${taskGroupsAsOptions}`;

        const editBtn = document.createElement("button");
        editBtn.classList.add("task-edit-btn");
        editBtn.innerHTML = `<span data-feather="edit-2"></span>`;

        taskWrapper.append(checkbox, title, selectLabel, select, editBtn);
        taskGroupWrapper.append(taskWrapper);
      });

      taskGroupDiv.append(taskGroupHeader, taskGroupWrapper);
      tasksContainer.append(taskGroupDiv);
    });

    feather.replace();
  };

  // BUS LISTENERS
  eventBus.on("tasksChanged", displayTasks);
  eventBus.on("taskGroupsChanged", displayTasks);

  // EVENT LISTENERS
  document.querySelector(".add-btns").addEventListener("click", function (e) {
    e.target.dataset.object === "task"
      ? createEditableTaskRow()
      : createEditableGroupRow();
  });

  tasksContainer.addEventListener("change", (e) => {
    if (e.target.type === "checkbox") {
      const taskDiv = e.target.closest(".task-div");
      const taskId = taskDiv.dataset.id;

      const task = todoManager.getTasks().find((task) => task.id === taskId);
      task.toggleComplete();
      taskDiv.classList.toggle("completed", task.completed);

      eventBus.emit("taskChanged", task);
    }
  });
})();

export default uiController;

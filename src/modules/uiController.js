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
      taskGroupDiv.dataset.id = group.id;

      const taskGroupHeader = document.createElement("div");
      taskGroupHeader.classList.add("task-group__header");
      taskGroupHeader.innerHTML = `
        <p class="task-group__title h6">${group.groupName}</p>
        <div class="menu-wrapper">
          <div class="menu-anchor">
            <ul class="task-group__menu hide">
              <li data-action="createTask">Create&nbsp;Task</li>
              <li data-action="deleteGroup">Delete&nbsp;Group</li>
            </ul>
          </div>
          ${
            group.id === "inbox"
              ? ``
              : `<button class="task-menu__trigger"><span data-feather="more-horizontal"></span></button>`
          }
          
        </div>
      `;

      const taskGroupWrapper = document.createElement("div");
      taskGroupWrapper.classList.add("task-group__wrapper");

      const taskSubset = group.getTasksFromArray(tasks);
      taskSubset.forEach((task) => {
        const taskWrapper = document.createElement("div");
        taskWrapper.classList.add("task-div");
        taskWrapper.dataset.id = task.id;
        taskWrapper.dataset.completed = task.completed;

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;

        const title = document.createElement("span");
        title.classList.add("h6");
        title.classList.add("task-title");
        title.textContent = task.title;

        const primaryWrapper = document.createElement("div");
        primaryWrapper.classList.add("primary");
        primaryWrapper.append(checkbox, title);

        const selectLabel = document.createElement("label");
        selectLabel.setAttribute("for", `groupSelect-${task.id}`);
        selectLabel.classList.add("sr-only");
        selectLabel.textContent =
          "Select the group you would like to move this task to:";

        const selectIcon = document.createElement("span");
        selectIcon.setAttribute("data-feather", "inbox");

        const select = document.createElement("select");
        select.setAttribute("id", `groupSelect-${task.id}`);
        select.setAttribute("name", "groupSelect");
        select.innerHTML = `${taskGroupsAsOptions}`;
        select.value = task.groupId;

        const selectGroup = document.createElement("div");
        selectGroup.classList.add("select-group");
        selectGroup.append(selectLabel, selectIcon, select);

        const deleteTaskBtn = document.createElement("button");
        deleteTaskBtn.classList.add("delete-task-btn");
        deleteTaskBtn.innerHTML = `<span data-feather="trash-2"></span>`;
        deleteTaskBtn.dataset.action = "deleteTask";

        const secondaryWrapper = document.createElement("div");
        secondaryWrapper.classList.add("secondary");
        secondaryWrapper.append(selectGroup, deleteTaskBtn);

        taskWrapper.append(primaryWrapper, secondaryWrapper);
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
    }

    if (e.target.type.includes("select")) {
      const taskDiv = e.target.closest(".task-div");
      const taskId = taskDiv.dataset.id;

      const task = todoManager.getTasks().find((task) => task.id === taskId);
      task.groupId = e.target.value;
    }
    eventBus.emit("tasksChanged");
    displayTasks();
  });

  tasksContainer.addEventListener("click", (e) => {
    if (e.target.closest(".task-menu__trigger")) {
      const targetId = e.target.closest(".task-group").dataset.id;

      const nonTargetElements = Array.from(
        document.querySelectorAll(".task-group")
      ).filter((group) => group.dataset.id !== targetId);

      e.target
        .closest(".task-menu__trigger")
        .parentElement.querySelector(".task-group__menu")
        .classList.toggle("hide");

      nonTargetElements.forEach((el) => {
        el.querySelector(".task-group__menu").classList.add("hide");
      });
    }

    if (e.target.dataset.action === "deleteGroup") {
      const targetId = e.target.closest(".task-group").dataset.id;
      if (targetId !== "inbox") {
        todoManager.deleteTaskGroup(targetId);
      }
    }

    if (e.target.closest(".delete-task-btn")) {
      const targetId = e.target.closest(".task-div").dataset.id;
      todoManager.deleteTask(targetId);
      console.log("trash can click");
    }
  });
})();

export default uiController;

import eventBus from "./eventBus";
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

    document.querySelector(".tasks-container").appendChild(row);

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
    // Now works with rows, not cards
    const taskData = {
      title: row.querySelector(".task-title-input").value,
      dueDateString: new Date().toDateString,
      description: "", // Since we're only requiring title now
      importance: 1, // Default values
    };

    if (!taskData.title) {
      alert("Title is required!");
      return;
    }

    eventBus.emit("formSubmitted", taskData);
    // transformRowToDisplayMode(row, taskData);
  };

  const handleCancelTask = function (row) {
    // delete row?
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
      editBtn.classList.add("task-edit-btn");
      editBtn.innerHTML = `<span data-feather="edit-2"></span>`;

      taskDiv.append(checkbox, title, editBtn);

      document.querySelector(".tasks-container").appendChild(taskDiv);

      feather.replace();
    });
  };

  eventBus.on("tasksChanged", displayTasks);

  document
    .querySelector(".add-task-btn")
    .addEventListener("click", createEditableTaskRow);

  return { getSubmission };
})();

export default uiController;

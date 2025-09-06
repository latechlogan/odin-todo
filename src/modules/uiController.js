import eventBus from "./eventBus";

const uiController = (function () {
  const createNewDateCard = function (date) {
    const card = document.createElement("div");
    card.className = "task-group-card";
    card.dataset.date = date;
    card.innerHTML = `
      <div class="date-header">${new Date(date).toDateString()}</div>
      <div class="tasks-list"></div>
      <div class="add-task-row">+ Add task...</div>
    `;

    document.querySelector(".timeline-container").appendChild(card);

    // Set up click handler for add row
    card.querySelector(".add-task-row").addEventListener("click", () => {
      addEditableTaskRow(card);
    });

    return card;
  };

  const createEditableTaskRow = function () {
    const row = document.createElement("div");
    row.className = "task-row editing";
    row.innerHTML = `
      <input type="text" class="task-title-input" placeholder="Task title..." />
      <button class="save-task-btn">Save</button>
      <button class="cancel-task-btn">Cancel</button>
    `;

    setupRowHandlers(row);
    return row;
  };

  const setupRowHandlers = function (row) {
    row
      .querySelector(".save-task-btn")
      .addEventListener("click", () => handleSaveTask(row));
    row
      .querySelector(".cancel-task-btn")
      .addEventListener("click", () => handleCancelTask(row));

    // Enter key saves the task
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
      dueDateString: row.closest(".task-group-card").dataset.date, // Get date from parent card
      description: "", // Since we're only requiring title now
      importance: 1, // Default values
    };

    if (!taskData.title) {
      alert("Title is required!");
      return;
    }

    eventBus.emit("formSubmitted", taskData);
    transformRowToDisplayMode(row, taskData); // Transform the row, not card
  };

  const handleCancelTask = function (row) {
    // Replace the editing row with the "+ Add task..." row
    const card = row.closest(".task-group-card");
    const addRow = document.createElement("div");
    addRow.className = "add-task-row";
    addRow.textContent = "+ Add task...";
    addRow.addEventListener("click", () => addEditableTaskRow(card));

    row.replaceWith(addRow);
  };

  const transformRowToDisplayMode = function (row, taskData) {
    row.className = "task-row display";
    row.innerHTML = `
      <span class="task-title">${taskData.title}</span>
      <button class="edit-task-btn">Edit</button>
      <button class="delete-task-btn">Delete</button>
    `;

    // Add the "+ Add task..." row back
    const card = row.closest(".task-group-card");
    const addRow = document.createElement("div");
    addRow.className = "add-task-row";
    addRow.textContent = "+ Add task...";
    addRow.addEventListener("click", () => addEditableTaskRow(card));
    card.appendChild(addRow);
  };

  const handleDateClick = function (dateElement) {
    const date = dateElement.dataset.date;
    const existingCard = document.querySelector(`[data-date="${date}"]`);

    if (existingCard) {
      addEditableTaskRow(existingCard);
    } else {
      createNewDateCard(date);
    }
  };

  const addEditableTaskRow = function (card) {
    // Prevent multiple editing rows
    if (card.querySelector(".task-row.editing")) {
      return;
    }

    const newRow = createEditableTaskRow();
    card.querySelector(".add-task-row").replaceWith(newRow);
    newRow.querySelector(".task-title-input").focus();
  };

  // code below for testing in console without UI
  const testSubmission = {
    title: "Pickup the Kids",
    dueDateString: new Date(),
    description: "",
    importance: 1,
  };

  const getSubmission = function () {
    eventBus.emit("formSubmitted", testSubmission);
  };

  return {
    getSubmission,
    createTestCard: () => createNewDateCard("2025-09-05"),
  };
})();

export default uiController;

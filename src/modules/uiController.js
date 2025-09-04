import eventBus from "./eventBus";

const uiController = (function () {
  const testSubmission = {
    title: "Pickup Dry Cleaning",
    dueDateString: "2025/09/05",
    description: "Pickup the dry cleaning at Weil Cleaning on North 7th",
    importance: 1,
  };

  const getSubmission = function () {
    eventBus.emit("formSubmitted", testSubmission);
  };

  return { getSubmission };
})();

export default uiController;

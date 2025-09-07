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

  return { getSubmission };
})();

export default uiController;

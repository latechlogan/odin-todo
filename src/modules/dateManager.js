import eventBus from "./eventBus";

const dateManager = (function () {
  const generateTimelineDates = function () {
    const currentDate = new Date();
    const numberOfDays = 90;
    const timelineDates = new Map();

    for (let i = 0; i < numberOfDays; i++) {
      const datekey = new Date(currentDate).toISOString().split("T")[0];
      timelineDates.set(datekey);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return timelineDates;
  };

  return { generateTimelineDates };
})();

export default dateManager;

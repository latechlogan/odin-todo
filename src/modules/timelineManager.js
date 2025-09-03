const timelineManager = (function () {
  const lockedIn = "timelineManager.js is locked in!";

  return {
    logger: () => console.log(lockedIn),
  };
})();

export default timelineManager;

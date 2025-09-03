const uiController = (function () {
  const lockedIn = "uiController.js is locked in!";

  return {
    logger: () => console.log(lockedIn),
  };
})();

export default uiController;

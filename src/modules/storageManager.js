const storageManager = (function () {
  const lockedIn = "storageManager.js is locked in!";

  return {
    logger: () => console.log(lockedIn),
  };
})();

export default storageManager;

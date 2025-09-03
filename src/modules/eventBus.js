const eventBus = (function () {
  const lockedIn = "eventBus.js is locked in!";

  return {
    logger: () => console.log(lockedIn),
  };
})();

export default eventBus;

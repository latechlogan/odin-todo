const todoManager = (function () {
  const lockedIn = "todoManager.js is locked in!";

  return {
    logger: () => console.log(lockedIn),
  };
})();

export default todoManager;

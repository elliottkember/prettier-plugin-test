on(Actions.auth.refreshLogin).do(
  "Clear cookies on auth credentials reset",
  ({ done }) => {
    done();
  },
);

on(Actions.main.initialize, Actions.main.wakeUp).do(
  "Check if the user needs to be reauthenticated",
  ({ done }) => {
    done();
  },
);

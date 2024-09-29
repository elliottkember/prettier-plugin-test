const Actions = {
  auth: {
    refreshLogin: "auth/refreshLogin",
  },
  main: {
    initialize: "main/initialize",
    wakeUp: "main/wakeUp",
  },
};

const on = (...inputs: string[]) => ({ do: (string, fn) => {} });

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

// Desired output:
// prettier-ignore

on(
  Actions.auth.refreshLogin
).do(
  "Clear cookies on auth credentials reset",
  ({ done }) => {
    done();
  },
);

// Desired output:
// prettier-ignore

on(
  Actions.main.initialize,
  Actions.main.wakeUp
).do(
  "Check if the user needs to be reauthenticated",
  ({ done }) => {
    done();
  },
);

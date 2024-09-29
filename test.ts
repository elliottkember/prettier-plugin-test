const Actions = {auth: {
  refreshLogin: 'auth/refreshLogin',
}, main: {
  initialize: 'main/initialize',
  wakeUp: 'main/wakeUp',
}};
const on = (input: string) => ({ do: (string, fn) => {} });


on(Actions.auth.refreshLogin).do(
  'Clear cookies on auth credentials reset',
  ({ done }) => {
    done();
  },
);

// hi

on(Actions.main.initialize,
  Actions.main.wakeUp).do(
  'Check if the user needs to be reauthenticated',
  ({ done }) => {
    done();
  }
);

const Actions = {
  auth: {
    refreshLogin: "auth/refreshLogin",
  },
  main: {
    initialize: "main/initialize",
    wakeUp: "main/wakeUp",
  },
};

const on = (action: unknown | unknown[], ...actions: unknown[]) => ({
  do: (
    description: string,
    callback: (arg0: { done: () => void }) => any,
  ) => {
    callback({ done: () => {} });
  },
});

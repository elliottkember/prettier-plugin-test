"use strict";
const Actions = {
    auth: {
        refreshLogin: "auth/refreshLogin",
    },
    main: {
        initialize: "main/initialize",
        wakeUp: "main/wakeUp",
    },
};
const on = (action, ...actions) => ({
    do: (description, callback) => {
        callback({ done: () => { } });
    },
});

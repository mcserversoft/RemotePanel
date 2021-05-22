function start(server, token) {
    axios.post('http://localhost:25560/api/server/execute/action', { "Guid": server, "Action": "1" }, {
        headers: { "Authorization": `Bearer ${token}` }
    }).then(() => console.log("It worked")).catch((err) => console.error(err))
}

function stop(server, token) {
    axios.post('http://localhost:25560/api/server/execute/action', { "Guid": server, "Action": "2" }, {
        headers: { "Authorization": `Bearer ${token}` }
    }).then(() => console.log("It worked")).catch((err) => console.error(err))
}

function restart(server, token) {
    axios.post('http://localhost:25560/api/server/execute/action', { "Guid": server, "Action": "3" }, {
        headers: { "Authorization": `Bearer ${token}` }
    }).then(() => console.log("It worked")).catch((err) => console.error(err))
}

function kill(server, token) {
    axios.post('http://localhost:25560/api/server/execute/action', { "Guid": server, "Action": "4" }, {
        headers: { "Authorization": `Bearer ${token}` }
    }).then(() => console.log("It worked")).catch((err) => console.error(err))
}

function updatestatus() {
    let token = sessionStorage.getItem('token')
    axios.get("http://localhost:25560/api/servers", {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    }).then((data) => {
        
    data.data.forEach(server => {
        
        if (server.Status === 0) {
            server.rStatus = "Offline";
            server.rColor = `style="color: #d65554;"`
        } else if (server.Status === 1) {
            server.rStatus = "Online";
            server.rColor = `style="color: #71b280;"`
        } else if (server.Status === 2) {
            server.rStatus = "Placeholder";
        } else if (server.Status === 3) {
            server.rStatus = "Starting";
            server.rColor = `style="color: #eda60e;"`
        } else if (server.Status === 4) {
            server.rStatus = "Stopping";
            server.rColor = `style="color: #eda60e;"`
        } else {
            server.rStatus = "Unknown";
        }
        
        console.log(server.Guid ,server.rStatus)
        $(`#${server.Guid}`).replaceWith(`
            <button ${server.rColor} class="uk-button uk-button-default" id="${server.Guid}">${server.rStatus}</button>
        `);
      })
    }).catch(err => {
        UIkit.notification('My message');
    });
  }
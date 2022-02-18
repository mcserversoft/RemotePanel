async function start(server) {
    showPopup('Sent Start Signal');
    UIkit.dropdown($('#uk-dropdown').removeClass('uk-open'));
    await axios.post(`/api/server/execute/action`, { "Guid": server, "Action": "1" }, {
        headers: { "Authorization": `Bearer ${token}` }
    }).then(() => console.log("It worked")).catch((err) => console.error(err))
}


async function stop(server) {
    showPopup('Sent Stop Signal');
    await axios.post(`/api/server/execute/action`, { "Guid": server, "Action": "2" }, {
        headers: { "Authorization": `Bearer ${token}` }
    }).then(() => console.log("It worked")).catch((err) => console.error(err))
}


async function restart(server) {
    showPopup('Sent Restart Signal');
    await axios.post(`/api/server/execute/action`, { "Guid": server, "Action": "3" }, {
        headers: { "Authorization": `Bearer ${token}` }
    }).then(() => console.log("It worked")).catch((err) => console.error(err))
}


async function kill(server) {
    showPopup('Sent kill Signal');
    await axios.post(`/api/server/execute/action`, { "Guid": server, "Action": "4" }, {
        headers: { "Authorization": `Bearer ${token}` }
    }).then(() => console.log("It worked")).catch((err) => console.error(err))
}


async function sendCommand(server) {
    showPopup('Command Sent');
    await axios.post(`/api/server/execute/command`, { "Guid": server, "Command": document.getElementById('consoleInput').value }, {
        headers: { "Authorization": `Bearer ${token}` }
    }).then(() => console.log("It worked")).catch((err) => console.error(err))
    document.getElementById('consoleInput').value=''
}

async function updateStatus() {
    await axios.get(`/api/servers`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    }).then((data) => {     
    data.data.forEach(server => {
        
        $(`#${server.Guid}`).replaceWith(`
            <button class="uk-button uk-button-default color-${server.Status}" id="${server.Guid}">${GetFriendlyStatusName(server.Status)}</button>
        `);
        $(`#${'icon' + server.Guid}`).replaceWith(`
            <div id="${'icon' + server.Guid}" class="uk-position-left"><span class="color-${server.Status}" uk-icon="icon: triangle-right; ratio: 1"></span></div>
        `);
    })
    }).catch(err => {
        UIkit.notification({message: '<span uk-icon=\'icon: ban\'></span> Failed to fetch server status.', status: 'danger'});
        console.error(err);
    });
}

function showPopup(content){
    UIkit.notification({message: '<span uk-icon=\'icon: check\'></span> ' + content + '.', status: 'info'});
}
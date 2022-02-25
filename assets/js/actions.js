async function start(serverGuid) {
    showPopup('Sent Start Signal');

    await axios.post(`/api/server/execute/action`, { "Guid": serverGuid, "Action": "1" }, {
    }).then(() => console.log("It worked")).catch((err) => console.error(err))
}

async function stop(serverGuid) {
    showPopup('Sent Stop Signal');

    await axios.post(`/api/server/execute/action`, { "Guid": serverGuid, "Action": "2" }, {
    }).then(() => console.log("It worked")).catch((err) => console.error(err))
}

async function restart(serverGuid) {
    showPopup('Sent Restart Signal');

    await axios.post(`/api/server/execute/action`, { "Guid": serverGuid, "Action": "3" }, {
    }).then(() => console.log("It worked")).catch((err) => console.error(err))
}

async function kill(serverGuid) {
    showPopup('Sent kill Signal');

    await axios.post(`/api/server/execute/action`, { "Guid": serverGuid, "Action": "4" }, {
    }).then(() => console.log("It worked")).catch((err) => console.error(err))
}

async function updateServers() {
    if (document.hidden) {
        //webpage is not active, don't update so reduce server calls
        return;
    }

    await axios.get(`/api/servers`, {
    }).then((response) => {
        response.data.forEach(server => {
            showLostConnectionPopup(false);

            $(`[data-server-guid="${server.Guid}"]`).data("server", server)
            $(`.serverName-${server.Guid}`).html(`${server.Name}`)
            $(`.serverStatus-${server.Guid}`).html(`${GetFriendlyStatusName(server.Status)}`)
            $(`.serverStatusColor-${server.Guid}`).removeClass(["color-0", "color-1", "color-2", "color-3", "color-4"]).addClass(`color-${server.Status}`)
        })
    }).catch((err) => console.error(err))
}
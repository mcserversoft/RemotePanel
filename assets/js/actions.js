async function start(serverGuid) {
    showPopup('Sent Start Signal');
    await sendAction(serverGuid, 1);
}

async function stop(serverGuid) {
    showPopup('Sent Stop Signal');
    await sendAction(serverGuid, 2);
}

async function restart(serverGuid) {
    showPopup('Sent Restart Signal');
    await sendAction(serverGuid, 3);
}

async function kill(serverGuid) {
    showPopup('Sent kill Signal');
    await sendAction(serverGuid, 4);
}

async function sendAction(serverGuid, action) {
    await axios({
        method: 'post',
        url: `/api/v1/servers/${serverGuid}/execute/action`,
        params: {
            action: action,
        }
    }).then(
        console.log("It worked")
    ).catch((err) => console.error(err))
}

async function updateServers() {
    if (document.hidden) {
        //webpage is not active, don't update so reduce server calls
        return;
    }

    await axios({
        method: 'get',
        url: `/api/v1/servers`
    }).then((response) => {
        response.data.forEach(server => {
            showLostConnectionPopup(false);

            $(`[data-server-guid="${server.guid}"]`).data("server", server)
            $(`.serverName-${server.guid}`).html(`${server.name}`)
            $(`.serverStatus-${server.guid}`).html(`${GetFriendlyStatusName(server.status)}`)
            $(`.serverStatusColor-${server.guid}`).removeClass(["color-0", "color-1", "color-2", "color-3", "color-4"]).addClass(`color-${server.status}`)
        })
    }).catch((err) => console.error(err))
}
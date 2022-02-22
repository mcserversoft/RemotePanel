async function loadConsole(serverGuid) {
    $("#serverConsole").text("");

    await axios.post(`/api/server/console`, { "Guid": serverGuid, "AmountOfLines": 50, "Reversed": false }, {
        headers: { "Authorization": `Bearer ${token}` }

    }).then((response) => {

        response.data.forEach(line => {
            $("#serverConsole").append(line + "&#13;&#10;");
        });
        scrollToBottom();
    }
    ).catch((err) => console.error(err))
}

async function sendCommand(serverGuid) {
    let input = $("#consoleInput").val();

    if (input == null || input == '') {
        return;
    }

    showPopup('Command Sent');

    await axios.post(`/api/server/execute/command`, { "Guid": serverGuid, "Command": input }, {
        headers: { "Authorization": `Bearer ${token}` }
    }).then(() => console.log("It worked")).catch((err) => console.error(err))

    $("#consoleInput").val('');
    loadConsole(serverGuid);
}

function scrollToBottom() {
    $("#serverConsole").scrollTop($("#serverConsole")[0].scrollHeight);
}
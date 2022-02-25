const LINE_BREAK = "&#13;&#10;";

async function updateConsoleIfNeeded() {
    let serverGuid = localStorage.getItem("activeServerGuid");

    if (serverGuid == null) {
        return;
    }

    let lines = $('#serverConsole').val().split('\n');
    let length = lines.length - 1;

    let secondLastLine = lines[length - 1];
    let lastLine = lines[length];

    await axios.post(`/api/server/console/outdated`, { "Guid": serverGuid, "SecondLastLine": secondLastLine, "LastLine": lastLine }, {

    }).then((response) => {
        if (response.data) {
            loadConsole(serverGuid)
        }
    }).catch((err) => console.error(err))
}

async function loadConsole(serverGuid) {
    clearConsole();

    await axios.post(`/api/server/console`, { "Guid": serverGuid, "AmountOfLines": 50, "Reversed": false }, {

    }).then((response) => {

        response.data.forEach(line => {
            $("#serverConsole").append(LINE_BREAK + line);
        });
        scrollToBottom();
    }).catch((err) => console.error(err))
}

async function sendCommand(serverGuid) {
    let input = $("#consoleInput").val();

    if (input == null || input == '') {
        return;
    }

    showPopup('Command Sent');

    await axios.post(`/api/server/execute/command`, { "Guid": serverGuid, "Command": input }, {
    }).then().catch((err) => console.error(err))

    $("#consoleInput").val('');
    loadConsole(serverGuid);
}

function clearConsole() {
    $("#serverConsole").text("");
}

function scrollToBottom() {
    $("#serverConsole").scrollTop($("#serverConsole")[0].scrollHeight);
}
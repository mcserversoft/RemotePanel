const LINE_BREAK = "&#13;&#10;";

async function updateConsoleIfNeeded() {
    let serverGuid = localStorage.getItem("activeServerGuid");

    if (serverGuid == null) {
        return;
    }

    let lines = $('#serverConsole').val().split('\n');
    let length = lines.length - 1;

    let secondLastLine = encodeURIComponent(lines[length - 1]);
    let lastLine = encodeURIComponent(lines[length]);

    await axios({
        method: 'get',
        url: `/api/v1/servers/${serverGuid}/console/outdated`,
        params: {
             secondLastLine: secondLastLine,       
            lastLine: lastLine
        }
    }).then((response) => {
        if (response.data === "True") {
            loadConsole(serverGuid)
        }
    }).catch((err) => console.error(err))
}

async function loadConsole(serverGuid) {
    clearConsole();

    await axios({
        method: 'get',
        url: `/api/v1/servers/${serverGuid}/console`,
        params: {
            amountOfLines: 50,
            reversed: false
        }
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

    await axios({
        method: 'post',
        url: `/api/v1/servers/${serverGuid}/execute/command`,
        data: {
            command: input,
        }
    }).catch((err) => console.error(err));


    $("#consoleInput").val('');
    loadConsole(serverGuid);
}

function clearConsole() {
    $("#serverConsole").text("");
}

function scrollToBottom() {
    $("#serverConsole").scrollTop($("#serverConsole")[0].scrollHeight);
}
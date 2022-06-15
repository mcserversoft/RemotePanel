document.addEventListener("DOMContentLoaded", function () {
    loadServers();
});

async function loadServers() {
    setInterval(updateServers, 3000);
    setInterval(updateConsoleIfNeeded, 3000);

    await axios({
        method: 'get',
        url: `/api/v1/servers`
    }).then((response) => {
        response.data.forEach((server, index) => {
            let control = $(`
            <a class="item ellipseOverflow"
                data-server-guid="${server.guid}"
                onclick="loadDashboard(this)">
                <i class="server icon serverStatusColor-${server.guid} color-${server.status}"></i>
                <span class="serverName-${server.guid}">${server.name}</span>
                </a>
                `).data("server", server);
            $(".servers").append(control);

            // load default server dashboard
            if (index == 0) {
                let firstControl = $(".servers:first-child a")[0];
                loadDashboard(firstControl);
            }
        })
    });
}


function loadDashboard(control) {
    $(".servers:first-child a").each(function () {
        $(this).removeClass("active")
    });
    $(control).addClass("active");

    let data = $(control).data();
    let server = data.server;

    localStorage.setItem("activeServerGuid", server.guid);

    $(".serverDashboard").html(`
<div class="ui inverted segments">
    <div class="ui horizontal segments">
        <div class="ui left aligned segment hideOnSmallScreens">
            <h1 class="serverName-${server.guid}">${server.name}</h1>
        </div>
        <div class="ui right aligned segment">
            <button class="ui icon grey button" onclick=refreshDashboard('${server.guid}')><i class="sync icon"></i></button>
            <button class="ui labeled icon pointing dropdown grey button">
                <i class="circle icon serverStatusColor-${server.guid} color-${server.status}"></i><span class="serverStatus-${server.guid}">${GetFriendlyStatusName(server.status)}</span>
                <div class="menu inverted">
                    <div class="item" onclick="start('${server.guid}')">Start</div>
                    <div class="item" onclick="stop('${server.guid}')">Stop</div>
                    <div class="item" onclick="restart('${server.guid}')">Restart</div>
                    <div class="item" onclick="kill('${server.guid}')">Kill</div>
                </div>
            </button>
        </div>
    </div>
</div>
<div class="ui inverted segments">
    <div class="ui segment">
        <textarea readonly id="serverConsole">test</textarea>
    </div>
    <div class="ui segment">
        <form action="#" onsubmit="sendCommand('${server.guid}'); return false;">
            <div class="ui left icon fluid input">
                <input id="consoleInput" type="text" placeholder="Enter command e.g. /say hello">
                <i class="terminal icon"></i>
            </div>
        </form>
    </div>
</div>
    `);

    $('.ui.dropdown').dropdown();
    loadConsole(server.guid);
}

function refreshDashboard(serverGuid) {
    updateServers();
    loadConsole(serverGuid);
}

function GetFriendlyStatusName(status) {
    if (status === 0) {
        return "Offline";

    } else if (status === 1) {
        return "Online";

    } else if (status === 2) {
        // Placeholder;
        return "Unknown";

    } else if (status === 3) {
        return "Starting";

    } else if (status === 4) {
        return "Stopping";
    }
}

function showPopup(content) {
    $('body')
        .toast({
            position: 'bottom right',
            message: content
        });
}

function showLostConnectionPopup(visible) {
    let parameter = visible ? "show" : "hide";

    $(".ui.basic.modal").modal({
        closable: false,
    }).modal(parameter);
}

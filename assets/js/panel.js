document.addEventListener("DOMContentLoaded", function () {
    loadServers();
});

function loadServers() {
    setInterval(updateServers, 3000);
    setInterval(updateConsoleIfNeeded, 3000);

    axios.get(`/api/servers`, {
    }).then((response) => {
        response.data.forEach((server, index) => {
            let control = $(`
            <a class="item ellipseOverflow"
                data-server-guid="${server.Guid}"
                onclick="loadDashboard(this)">
                <i class="server icon serverStatusColor-${server.Guid} color-${server.Status}"></i>
                <span class="serverName-${server.Guid}">${server.Name}</span>
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

    localStorage.setItem("activeServerGuid", server.Guid);

    $(".serverDashboard").html(`
<div class="ui inverted segments">
    <div class="ui horizontal segments">
        <div class="ui left aligned segment hideOnSmallScreens">
            <h1 class="serverName-${server.Guid}">${server.Name}</h1>
        </div>
        <div class="ui right aligned segment">
            <button class="ui icon grey button" onclick=refreshDashboard('${server.Guid}')><i class="sync icon"></i></button>
            <button class="ui labeled icon pointing dropdown grey button">
                <i class="circle icon serverStatusColor-${server.Guid} color-${server.Status}"></i><span class="serverStatus-${server.Guid}">${GetFriendlyStatusName(server.Status)}</span>
                <div class="menu inverted">
                    <div class="item" onclick="start('${server.Guid}')">Start</div>
                    <div class="item" onclick="stop('${server.Guid}')">Stop</div>
                    <div class="item" onclick="restart('${server.Guid}')">Restart</div>
                    <div class="item" onclick="kill('${server.Guid}')">Kill</div>
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
        <form action="#" onsubmit="sendCommand('${server.Guid}'); return false;">
            <div class="ui left icon fluid input">
                <input id="consoleInput" type="text" placeholder="Enter command e.g. /say hello">
                <i class="terminal icon"></i>
            </div>
        </form>
    </div>
</div>
    `);

    $('.ui.dropdown').dropdown();
    loadConsole(server.Guid);
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

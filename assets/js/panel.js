document.addEventListener("DOMContentLoaded", function () {
    loadServers();
});

let token = localStorage.getItem("token");

function loadServers() {
    setInterval(updateStatus, 3000);
    axios.get(`/api/servers`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    }).then((response) => {
        response.data.forEach((server, index) => {
            $(".server-list").append(`
                <li>
                <a class="uk-text-truncate uk-margin-small-left"
                data-server="${encodeURIComponent(JSON.stringify(server))}"
                onclick="loadDashboard(this)">${server.Name}
                </a>
                <div id="${'icon' + server.Guid}" class="uk-position-left"><span class="color-${server.Status}" uk-icon="icon: triangle-right; ratio: 1"></span></div>
                <hr class="uk-margin-small-left uk-margin-small-right uk-margin-remove-top uk-margin-remove-bottom">
                </li>
                `);

            // load default server dashboard
            if (index == 0) {
                let firstControl = $(".server-list li:first-child a")[0];
                loadDashboard(firstControl);
            }
        })
    }).catch(err => {
        if (err.status === 401) {
            localStorage.removeItem("token")
            window.location.href = "/index.html"
        } else {
            alert("Something went wrong: " + err);
            console.error(err);
            //TODO find a better way of handling this error
        }
    });
}

function loadDashboard(control) {
    let data = $(control).data();
    let server = JSON.parse(decodeURIComponent(data.server))

    $(".serverDashboard").html(`
    <li>
        <div class="uk-align-left uk-text-left">
        <form action="#" onsubmit="sendCommand('${server.Guid}'); return false;">
        <div class="uk-margin">
            <div class="uk-inline">
                <a class="uk-form-icon uk-form-icon-flip" uk-tooltip="Send" href="#" uk-icon="icon: forward" onclick="sendCommand('${server.Guid}')"></a>
                <input id="consoleInput" class="uk-input uk-form-width-medium2" type="text" placeholder="Server Command">
            </div>
        </div>
        </form>
        <p>Guid: ${server.Guid}</p>
        </div>
        <div class="uk-align-right">
            <div class="uk-button-group server-status">
                    <button class="uk-button uk-button-default color-${server.Status}" id="${server.Guid}">${GetFriendlyStatusName(server.Status)}</button>
                <div class="uk-inline">
                    <button class="uk-button uk-button-default" type="button"><span uk-icon="icon: triangle-down"></span></button>
                    <div uk-dropdown="mode: click; boundary: ! .uk-button-group; boundary-align: true;">
                        <ul class="uk-nav uk-dropdown-nav">
                            <li><a href="#" class="uk-dropdown-close color-1" onclick="start('${server.Guid}')">Start</a></li>
                            <li><a href="#" class="uk-dropdown-close color-0" onclick="stop('${server.Guid}')">Stop</a></li>
                            <li><a href="#" class="uk-dropdown-close color-3" onclick="restart('${server.Guid}')">Restart</a></li>
                            <li><a href="#" class="uk-dropdown-close color-2" onclick="kill('${server.Guid}')">Kill</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <p>Auto Start: ${server.IsSetToAutoStart}</p>
        </div>
    </li>
    `);
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
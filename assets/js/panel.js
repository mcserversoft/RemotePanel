document.addEventListener("DOMContentLoaded", function() {
    let token = sessionStorage.getItem('token')
    let apiurl = sessionStorage.getItem('apiurl')
    if (apiurl == null || apiurl === '') {
        apiurl = "http://localhost:25560"
    }
    setInterval(updatestatus, 3000);
    axios.get(`${apiurl}/api/servers`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    }).then((data) => { 
      data.data.forEach(server => {
        $("#server-list").append(`
        <li><a href="#">${server.Name}</a></li>
        `);
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
        const guid = server.Guid.toString()
        $(".server-control").append(`
        <li>
            <div class="uk-align-left uk-text-left">
            <form action="#" onsubmit="sendcommand('${guid}', '${token}'); return false;">
            <div class="uk-margin">
                <div class="uk-inline">
                    <a class="uk-form-icon uk-form-icon-flip" uk-tooltip="Send" href="#" uk-icon="icon: forward" onclick="sendcommand('${guid}', '${token}')"></a>
                    <input id="${server.Guid + 'abc123'}" class="uk-input uk-form-width-medium2" type="text" placeholder="Server Command">
                </div>
            </div>
            </form>
            <p>Guid: ${server.Guid}</p>
            </div>
            <div class="uk-align-right">
                <div class="uk-button-group server-status">
                        <button ${server.rColor} class="uk-button uk-button-default" id="${server.Guid}">${server.rStatus}</button>
                    <div class="uk-inline">
                        <button class="uk-button uk-button-default" type="button"><span uk-icon="icon:  triangle-down"></span></button>
                        <div uk-dropdown="mode: click; boundary: ! .uk-button-group; boundary-align: true;">
                            <ul class="uk-nav uk-dropdown-nav">
                                <li><a href="#" onclick="start('${guid}', '${token}')" style="color: #71b280;">Start</a></li>
                                <li><a href="#" onclick="stop('${guid}', '${token}')" style="color: #d65554;">Stop</a></li>
                                <li><a href="#" onclick="restart('${guid}', '${token}')" style="color: #eda60e;">Restart</a></li>
                                <li><a href="#" onclick="kill('${guid}', '${token}')" style="color: #888;">Kill</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <p>Auto Start: ${server.IsSetToAutoStart}</p>
            </div>
        </li>
        `);
      })
    }).catch(err => {
        if (err.status === 401) {
            sessionStorage.removeItem("token")
            window.location.href = "/index.html"
        } else {
            window.location.href = "/index.html" 
        }
    });
  });
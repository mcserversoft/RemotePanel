document.addEventListener("DOMContentLoaded", function() {
    let token = sessionStorage.getItem('token')
    axios.get("http://localhost:25560/api/servers", {
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
            server.rColor = `style="color: #c61717;"`
        } else if (server.Status === 1) {
            server.rStatus = "Online";
            server.rColor = `style="color: #71b280"`
        } else if (server.Status === 2) {
            server.rStatus = "Placeholder";
        } else {
            server.rStatus = "Unknown";
        }

        $(".server-control").append(`
        <li class="uk-align-right">
            <div class="uk-button-group">
                <button ${server.rColor} class="uk-button uk-button-default">${server.rStatus}</button>
                <div class="uk-inline">
                    <button class="uk-button uk-button-default" type="button"><span uk-icon="icon:  triangle-down"></span></button>
                    <div uk-dropdown="mode: click; boundary: ! .uk-button-group; boundary-align: true;">
                        <ul class="uk-nav uk-dropdown-nav">
                            <li><a href="#">Start</a></li>
                            <li><a href="#">Stop</a></li>
                            <li><a href="#">Restart</a></li>
                            <li><a href="#">Kill</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </li>
        `);
      })
    }).catch(err => {
        sessionStorage.removeItem("token")
        window.location.href = "/index.html"
    });
  });


document.addEventListener("DOMContentLoaded", function () {
    checkConnection();
});

function checkConnection() {
    axios.get(`/`).then(() => {
        $("#login-card2").replaceWith(`
		<div class="" id="cred-status">
        </div>
        <form action="#" onsubmit="login(); return false;">
        <div class="uk-margin uk-width-expand">
            <div class="uk-inline">
                <span class="uk-form-icon" uk-icon="icon: user"></span>
                <input class="uk-input" id="username" type="text" placeholder="Username">
            </div>
        </div>                
        <div class="uk-margin uk-width-expand">
            <div class="uk-inline">
                <span class="uk-form-icon uk-form-icon" uk-icon="icon: lock"></span>
                <input class="uk-input" id="password" type="password" placeholder="Password">
                <input class="uk-hidden" type="submit">
            </div>
        </div>
        <a type="submit" onclick="login()" class="uk-button uk-button-default uk-width-5-6 uk-width-3-4@s uk-width-3-4@m uk-width-1-1@l">Login</a>    
    </form>
        `);
    }
    ).catch(err => {
        $("#login-card").replaceWith(`
        <div class="uk-card uk-card-secondary uk-card-body uk-padding-large uk-animation-shake">
        <div class="uk-overlay uk-margin-remove-bottom uk-padding-remove-bottom uk-position-top-right uk-visible@s">
            <a href="" class="uk-icon-button" uk-toggle="target: #modal-api-url" uk-icon="cog"></a>
        </div>
        <h1 class="uk-card-title uk-text-bold uk-margin-remove-top uk-padding-remove-top">MCSS Login</h1>
        <img class="uk-margin-medium-bottom" src="/assets/img/logo.png" alt="" width="100" height="100">
        <div class="">
            <span uk-icon="icon: warning; ratio: 2"></span>
            <p>Unable to reach the API</p>
            <a class="uk-text-success" href="#" uk-toggle="target: #modal-close-default2">Why?</a>
        </div>
        <a class="uk-icon-button uk-margin-medium-top uk-hidden@s" uk-toggle="target: #modal-api-url" uk-icon="cog"></a>  
    </div>
        `);
    });
}

function login() {
    let token = localStorage.getItem('token')

    if (token == null) {
        let username = document.getElementById("username").value;
        let password = document.getElementById("password").value;
        const request = new Request(`/api/token`, { method: 'POST', body: new URLSearchParams({ 'username': username, 'password': password }) })

        fetch(request).then(function (response) {
            try {
                if (response.status === 200) {
                    response.json().then((result) => {
                        JSON.stringify(result)
                        let token = result["access_token"]

                        localStorage.setItem("token", token)
                        window.location.href = "/panel.html";
                    })
                } else if (response.status === 401) {
                    $("#cred-status").replaceWith(`<div class="" id="cred-status">
                    <p style="color: #cf3755;">Your username and/or password do not match.</p>
                    </div>`)
                } else if (response.status === 500) {
                    console.log(response.status)
                    $("#cred-status").replaceWith(`<div class="" id="cred-status">
                    <p style="color: #cf3755;">Something went wrong.</p>
                    </div>`)
                } else {
                    console.log("API could not be reached, error code: " + response.status)
                }
            } catch (error) {
                console.log("Failed to login: " + error)
            }
        })
    }
}
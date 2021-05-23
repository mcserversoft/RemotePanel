function login() {
    let token = localStorage.getItem('token')
    var apiurl = sessionStorage.getItem('apiurl')

    if (apiurl == null || apiurl == '') {
        apiurl = "http://localhost:25560"
    }

    if (token != null) {
        console.log("Token found")
    }
    else {
        console.log("No token found locally")
        let username = document.getElementById("username").value;
        let password = document.getElementById("password").value;
        const request = new Request(`${apiurl}/api/token`, {method: 'POST', body: new URLSearchParams({'username': username, 'password': password})})

        fetch(request)
            .then(function (response) {

                try {

                    if (response.status === 200) {
                        response.json().then((result) => {
                            JSON.stringify(result)
                            let token = result["access_token"]
                            console.log(token);
                            sessionStorage.setItem("token",token)
                            window.location.href = "/panel.html";
                        })
                    } else if (response.status === 401) {
                        console.log(response.status)
                        console.log("bad credentials")
                        $("#cred-status").replaceWith(`<div class="" id="cred-status">
                        <p style="color: rgb(255, 0, 0);">Wrong Password</p>
                        </div>`)
                    } else if (response.status === 500) {
                        console.log("we done broke something")
                        $("#cred-status").replaceWith(`<div class="" id="cred-status">
                        <p style="color: rgb(255, 0, 0);">Something Went Wrong</p>
                        </div>`)
                    } else {
                        console.log("API could not be reached, error code is " + response.status)
                    }

                } catch (error) {
                    console.log("error")
                }

            })
    }
}
document.addEventListener("DOMContentLoaded", function () {
    isUserAuthenticated();
});

function isUserAuthenticated() {
    let token = localStorage.getItem('token')

    axios.get(`/`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    }).then(function (response) {
        let isAuthenticated = (response.status == 200 && token != null);
        redirectIfRequired(isAuthenticated)
    });
}

function redirectIfRequired(isAuthenticated) {
    let currentPage = window.location.pathname;

    if ((currentPage == "/" || currentPage == "/index.html") && isAuthenticated) {
        window.location.href = "/panel.html";
    } else if (currentPage == "panel.html" && !isAuthenticated) {
        window.location.href = "/index.html";
    }
}

function logout() {
    localStorage.removeItem("token")
    window.location.href = "/index.html"
}
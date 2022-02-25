let token = localStorage.getItem("token");
let offlineMode = false;

document.addEventListener("DOMContentLoaded", function () {
    axios.interceptors.request.use(
        requestConfig => {
            requestConfig.headers.authorization = `Bearer ${token}`;

            return requestConfig;
        }
    );

    axios.interceptors.response.use(
        response => {
            let statusCode = response.status;

            if (statusCode == 200 && offlineMode) {
                showLostConnectionPopup(false);
            }

            return response;
        },
        error => {
            if (!error.response) {
                //Error: Network Error
                showLostConnectionPopup(true);
            } else if (error.response.status == 401) {
                logout();
            }

            return Promise.reject(error)
        }
    );

    isUserAuthenticated();
});

function isUserAuthenticated() {
    if (token == null) {
        redirectIfRequired(false);
        return;
    }

    axios.get(`/api/version`, {
    }).then(function (response) {
        let isAuthenticated = (response.status == 200 && token != null);
        redirectIfRequired(isAuthenticated)
    });
}

function redirectIfRequired(isAuthenticated) {
    let currentPage = window.location.pathname;

    if ((currentPage == "/" || currentPage == "/index.html") && isAuthenticated) {
        window.location.href = "/panel.html";
    } else if (currentPage == "/panel.html" && !isAuthenticated) {
        window.location.href = "/index.html";
    }
}

function logout() {
    destroySession();
    window.location.href = "/index.html"
}

function destroySession() {
    localStorage.removeItem("token");
    //the code below would remove user preferences (if that is ever added)
    //localStorage.clear();
}
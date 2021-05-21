document.addEventListener("DOMContentLoaded", function() {
    let token = sessionStorage.getItem('token')
        if (token != null) {
            console.log("Token found")
            window.location.href = "/panel.html";

        } else {
            console.log("Token NOT found")
        }
});
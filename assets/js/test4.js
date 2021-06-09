document.addEventListener("DOMContentLoaded", function() {
    let token = localStorage.getItem('token')
        if (token === null) {
            console.log("Token Not found")
            window.location.href = "/index.html";
        } else {
            console.log("Token Found")
        }
});
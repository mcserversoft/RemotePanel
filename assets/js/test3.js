document.addEventListener("DOMContentLoaded", function() {
    let token = localStorage.getItem('token')

    axios.get(`/`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    }).then(function (response) {
        if (response.status == 200 && token != null) {
            console.log("Conditions Met")
            window.location.href = "/panel.html";
        } else {
            console.log("Conditions Not Met")}
    });
});
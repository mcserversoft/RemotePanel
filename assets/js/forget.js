function forget() {
    sessionStorage.removeItem("token")
    window.location.href = "/index.html"
}
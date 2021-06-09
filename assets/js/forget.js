function forget() {
    localStorage.removeItem("token")
    window.location.href = "/index.html"
}
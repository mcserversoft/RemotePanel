const form = document.querySelector('form')
        form.addEventListener('submit', e => {
            e.preventDefault()
            let username = document.getElementById('username').value
            let password = document.getElementById('password').value
            if (username && password) {
                login(username, password)
            } else {
                console.log('Empty')
            }
        })
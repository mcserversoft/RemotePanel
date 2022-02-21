document.addEventListener("DOMContentLoaded", function () {
	$('.ui.form')
		.form({
			fields: {
				email: {
					identifier: 'username',
					rules: [
						{
							type: 'empty',
							prompt: 'Please enter your username.'
						}
					]
				},
				password: {
					identifier: 'password',
					rules: [
						{
							type: 'empty',
							prompt: 'Please enter your password.'
						}
					]
				}
			},
			onSuccess: () => { login(); }
		});

	checkConnection();
});

function checkConnection() {
	showBusyIndicator(true);

	axios.get(`/`).then(() => {
		clearErrorsMessages();
		showBusyIndicator(false);
	}
	).catch(err => {
		console.log(err)
		$(".ui.form .ui.input").addClass("disabled");
		$(".ui.submit.button").addClass("disabled");
		showErrorMessage("Unable to reach the API.");
	});

	showBusyIndicator(false);
}

function showInfoDialog() {
	$('.mini.modal').modal('show');
}

function login() {
	showBusyIndicator(true);

	let token = localStorage.getItem('token')
	if (token != null) {
		return;
	}

	let username = document.getElementById("username").value;
	let password = document.getElementById("password").value;
	const request = new Request(`/api/token`, { method: 'POST', body: new URLSearchParams({ 'username': username, 'password': password }) })

	fetch(request).then(function (response) {
		try {
			if (response.status === 200) {
				response.json().then((result) => {
					$(".ui.form .ui.input").hide();

					JSON.stringify(result)
					let token = result["access_token"]

					localStorage.setItem("token", token)
					window.location.href = "/panel.html";
				})
				return;

			} else if (response.status === 401) {
				showErrorMessage("Your username and/or password are not correct.");

			} else if (response.status === 500) {
				console.log(response.status)
				showErrorMessage("Unable to reach the API.", response.status);

			} else {
				console.log("API could not be reached, error code: " + response.status)
				showErrorMessage("Unable to reach the API.", response.status);
			}
		} catch (error) {
			showErrorMessage("Failed to login for some unknown reason.");
		}
		showBusyIndicator(false);
	})
}

function showBusyIndicator(isBusy) {
	if (isBusy) {
		$(".ui.form .ui.input").addClass("disabled");
		$(".ui.submit.button").addClass("loading");
	} else {
		$(".ui.form .ui.input").removeClass("disabled");
		$(".ui.submit.button").removeClass("loading");
	}
}

function showErrorMessage(message, error) {
	if (error == null) {
		$('.ui.form').form("add errors", [message]);

	} else {
		$('.ui.form').form("add errors", [message + ` (${error})`]);
	}
}

function clearErrorsMessages() {
	$('.ui.form').form("remove errors");
}

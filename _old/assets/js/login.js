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

async function login() {
	showBusyIndicator(true);

	let apiKey = localStorage.getItem('apiKey')
	if (apiKey != null) {
		return;
	}

	let username = document.getElementById("username").value;
	let password = document.getElementById("password").value;

	const request = new Request(`/auth`, { method: 'POST', body: JSON.stringify({ 'username': username, 'password': password }) })
	fetch(request).then(response => {
		try {

			if (response.status === 200) {
				response.json().then((result) => {
					$(".ui.form .ui.input").hide();

					console.log(result);
					JSON.stringify(result)

					localStorage.setItem("apiKey", result["apiKey"])
					localStorage.setItem("username", result["username"])

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

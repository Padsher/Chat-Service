// store given JWT just on page to make it easier to
// test many users by many tabs and signup/logout by refreshing
let AUTH_KEY = '';
let socket;

window.onload = () => {
	function failAuth() {
		AUTH_KEY = '';
		chat.messages = [];
		chat.seen = false;
		chatWrite.seen = false;
		buttons.seen = false;
		authForm.seen = true;
	}

	function wsConnect() {
		socket = new WebSocket(`ws://${window.location.host}/ws?jwt=${AUTH_KEY}`);

		socket.onclose = (event) => {
			alert(`closed socket , wasClean - ${event.wasClean}, code - ${event.code}, reason - ${event.reason}`);
			failAuth();
		};

		socket.onmessage = (message) => {
			chat.messages.push(JSON.parse(message.data));
		};

		socket.onerror = (error) => {
			alert(`got error - ${error}`);
			failAuth();
		};
	}

	const chat = new Vue({
		el: '#chat',
		data: {
			messages: [],
			seen: false,
		},
	});

	const authForm = new Vue({
		el: '#auth-form',
		data: {
			login: '',
			password: '',
			seen: true,
		},

		methods: {
			signUp: async function (event) {
				const response = await fetch('/signup', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ login: this.login, password: this.password }),
				});

				if (!response.ok) {
					alert(`Error , got ${response.status} response`);
					return;
				}

				const result = await response.json();

				if (result.isValid) {
					AUTH_KEY = result.jwt;
					authForm.seen = false;
					chat.seen = true;
					chatWrite.seen = true;
					buttons.seen = true;
					wsConnect();
				} else {
					alert('Invalid password!');
				}
			},
		},
	});

	const chatWrite = new Vue({
		el: '#chat-write',
		data: {
			message: '',
			seen: false,
		},

		methods: {
			postMessage: async function (event) {
				const response = await fetch('/messages', {
					method: 'POST',
					headers: {
						Authorization: AUTH_KEY,
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ message: this.message }),
				});

				if (response.ok) {
					this.message = '';
				} else {
					alert('message have not been sent!');
				}
			},
		},
	});

	const buttons = new Vue({
		el: '#buttons',
		data: {
			seen: false,
		},

		methods: {
			logOut: function () {
				fetch('/logout', {
					method: 'GET',
					headers: {
						Authorization: AUTH_KEY,
					},
				});
				failAuth();
			},

			getAllMessages: async function () {
				const response = await fetch('/messages', {
					method: 'GET',
					headers: {
						Authorization: AUTH_KEY,
					},
				});

				if (response.ok) {
					const result = await response.json();
					chat.messages = result;
				} else {
					alert('can not get messages!');
				}
			},
		},

	});
}

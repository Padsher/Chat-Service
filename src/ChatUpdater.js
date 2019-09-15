const log = console.log;

class ChatUpdater {
	constructor () {
		this.activeUsers = [];
	}

	addUser(ws, login) {
		log(`user "${login}" connected`);
		this.activeUsers.push({ ws, login });
		log(this.activeUsers);
	}

	deleteUser(login) {
		log(`deleting user "${login}"...`)
		this.activeUsers = this.activeUsers.filter((activeUser) => {
			if (activeUser.login === login) {
				activeUser.ws.terminate();
				return false;
			} else {
				return true;
			}
		});
		log(this.activeUsers);
	}

	updateChat (message) {
		log('updating chat...')
		this.activeUsers.forEach((activeUser) => {
			log(`sending to ${activeUser.login}`)
			activeUser.ws.send(JSON.stringify(message));
		});
	}
};

module.exports = ChatUpdater;
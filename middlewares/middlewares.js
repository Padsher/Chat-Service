const jws = require('jws');
const crypto = require('crypto');
const log = console.log;
const { User } = require('../models');


function hashPass(password) {
	const hash = crypto.createHash('sha256');
	return hash.update(password).digest('hex');
}

function createJwt(login, key) {
	return jws.sign({
  		header: { alg: 'HS256' },
  		payload: login,
  		secret: key,
	});
}

module.exports = {
	createAuthMiddleware: (key) => {
		return async (request, response, next) => {
			try {
				log('auth checking...');
				const jwt = request.headers.authorization;
				log(jwt);

				if (!jws.verify(jwt, 'HS256', key)) {
					throw new Error('JWT does not match secret key');
				}

				const result = jws.decode(jwt);
				if (result.payload === undefined) {
					throw new Error('JWT decoding error');
				}

				const user = await User.findOne({
					where: {
						login: result.payload,
					},
				});

				if (user === null) {
					throw new Error(`User ${result.payload} does not exist`);
				}
				request.login = result.payload;
				log('auth check successed');
				next();
			} catch (e) {
				next(e)
			}
		};
	},

	checkWsAuth: async (key, jwt) => {
		log('ws auth checking...');
		if (!jws.verify(jwt, 'HS256', key)) {
			throw new Error('JWT in ws does not match secret key');
		}

		const result = jws.decode(jwt);
		if (result.payload === undefined) {
			throw new Error('ws JWT decoding error');
		}

		const user = await User.findOne({
			where: {
				login: result.payload,
			},
		});

		if (user === null) {
			throw new Error(`User ${result.payload} does not exist`);
		}

		log('ws auth check successed');
		return result.payload;
	},

	createSignupHandler: (key) => {
		return async (request, response) => {
			log('signuping');
			const { login, password } = request.body;
			log(login);
			log(password);
			let user;

			try {
				user = await User.create({
					login,
					password: hashPass(password),
				});

			} catch (e) {
				log('error in creating, trying to find one...');
				user = await User.findOne({
					where: {
						login,
					},
				});
				if (user == null) {
					throw new Error('User is null when signup!');
				}
			}

			log(user);
			log(user.dataValues);
			log(user.dataValues.createdAt.toString());

			const responseBody = {
				isValid: false,
				jwt: '',
			};

			if (hashPass(password) === user.dataValues.password) {
				responseBody.isValid = true;
				responseBody.jwt = createJwt(login, key);
			}

			response.json(responseBody);
			
		};
	},
}
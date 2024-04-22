const ENV = require('../constants');
const jwt = require('jsonwebtoken');
const { User } = require('../utils/mongoose-utils');

// login as admin to enable editor functionality in the browser
exports.login = (req, res) => {
	if (req.body && req.body.username && req.body.password && req.body.username === ENV.ADMIN_USERNAME && req.body.password === ENV.ADMIN_PASSWORD) {
		const token = jwt.sign(
			{
				name: req.body.username,
				role: "admin"
			},
			ENV.JWT_KEY,
			{
				expiresIn: "6h"
			}
		);
		return res.status(200).send({ token: token });
	} else {
		res.status(401).json({});
	}
}

exports.isAdmin = (req, res) => {
	return res.status(200).send();
}

exports.createUser = (req, res) => {
	// const { username, email, password } = req.body;
	console.log('Oi')
	const newUser = new User({
		username: req.body.username,
		email: req.body.email, // Assumindo que você está enviando o ID do usuário como userId no corpo da solicitação
		password: req.body.password // Assumindo que você está enviando uma lista de IDs de panoramas como panoramas no corpo da solicitação
	});

	if (newUser) {
		return res.status(201).send(newUser);
	} else {
		return res.status(500);
	}
}
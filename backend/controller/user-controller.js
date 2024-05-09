const ENV = require('../constants');
const jwt = require('jsonwebtoken');
const { User } = require('../utils/mongoose-utils');

// login as admin to enable editor functionality in the browser
const bcrypt = require('bcrypt');

exports.login = (req, res) => {
	const { username, password } = req.body;

	// Encontrar o usuário pelo nome de usuário no banco de dados
	User.findOne({ username: username }, (err, user) => {
		if (err) {
			console.error(err);
			// TODO: enviar resposta de erro
			return res.status(500).json({ error: 'Erro interno do servidor' });
		}

		// Verificar se o usuário existe
		if (!user) {
			// Usuário não encontrado
			return res.status(401).json({ error: 'Nome de usuário ou senha inválidos' });
		}

		// Verificar a senha
		bcrypt.compare(password, user.password, (err, result) => {
			if (err) {
				console.error(err);
				// TODO: enviar resposta de erro
				return res.status(500).json({ error: 'Erro interno do servidor' });
			}

			if (!result) {
				// Senha incorreta
				return res.status(401).json({ error: 'Nome de usuário ou senha inválidos' });
			}

			// Senha correta, gerar token de autenticação
			const token = jwt.sign(
				{
					name: user.username,
					role: "admin"
				},
				ENV.JWT_KEY,
				{
					expiresIn: "6h"
				}
			);

			return res.status(200).send({ token: token });
		});
	});
};

exports.isAdmin = (req, res) => {
	return res.status(200).send();
}

exports.createUser = (req, res) => {
	const { username, email, password } = req.body;

	// Gerar um salt para a criptografia da senha
	bcrypt.genSalt(10, (err, salt) => {
		if (err) {
			console.error(err);
			// TODO: enviar resposta de erro
			return res.status(500).json({ error: 'Erro interno do servidor' });
		}

		// Criptografar a senha com o salt gerado
		bcrypt.hash(password, salt, (err, hashedPassword) => {
			if (err) {
				console.error(err);
				// TODO: enviar resposta de erro
				return res.status(500).json({ error: 'Erro interno do servidor' });
			}

			// Criar um novo usuário com a senha criptografada
			const newUser = new User({
				username: username,
				email: email,
				password: hashedPassword
			});

			// Salvar o novo usuário no banco de dados
			newUser.save((err, savedUser) => {
				if (err) {
					console.error(err);
					// TODO: enviar resposta de erro
					return res.status(500).json({ error: 'Erro ao salvar usuário' });
				}

				// Remover a senha do objeto de usuário antes de enviar a resposta
				const userWithoutPassword = savedUser.toObject();
				delete userWithoutPassword.password;

				return res.status(201).json({ user: userWithoutPassword });
			});
		});
	});
};


exports.getAllUsers = (req, res) => {
	User.find({})
		.populate('tours') // Popula o campo de tours
		.exec((err, users) => {
			if (err) {
				console.error(err);
				// TODO: enviar resposta de erro
				return res.status(500).json({ error: 'Erro interno do servidor' });
			}

			// Removendo a senha de cada usuário
			const usersWithoutPassword = users.map(user => {
				const userWithoutPassword = user.toObject();
				delete userWithoutPassword.password;
				return userWithoutPassword;
			});

			return res.status(200).json({ users: usersWithoutPassword });
		});
};


exports.getUserById = (req, res) => {
	const userId = req.params.userId;

	User.findById(userId, (err, user) => {
		if (err) {
			console.error(err);
			// TODO: enviar resposta de erro
			return res.status(500).json({ error: 'Erro interno do servidor' });
		}
		if (!user) {
			// Se o usuário com o ID especificado não for encontrado
			return res.status(404).json({ error: 'Usuário não encontrado' });
		}
		return res.status(200).json({ user: user });
	});
};

exports.deleteUser = (req, res) => {
	const userId = req.params.userId;

	// Encontrar e remover o usuário pelo ID
	User.deleteOne({ _id: userId }, (err, deletedUser) => {
		if (err) {
			console.error(err);
			// TODO: enviar resposta de erro
			return res.status(500).json({ error: 'Erro interno do servidor' });
		}

		if (!deletedUser) {
			// Usuário não encontrado
			return res.status(404).json({ error: 'Usuário não encontrado' });
		}

		// Usuário removido com sucesso
		return res.status(200).json({ message: 'Usuário deletado com sucesso' });
	});
};

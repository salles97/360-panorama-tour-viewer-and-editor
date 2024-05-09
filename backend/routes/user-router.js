const UserController = require('../controller/user-controller');

const checkAuth = require('../middleware/authentication');

const express = require('express');
const router = express.Router();


router.post('/', UserController.createUser);
router.post('/login', UserController.login);	// login as admin to enable editor functionality in the browser
router.get('/isAdmin', (req, res, next) => checkAuth(req, res, next, ["admin"]), UserController.isAdmin);	// checks if the user jwt token is still valid
router.get('/', UserController.getAllUsers);
router.get('/:userId', UserController.getUserById);
router.delete('/:userId', UserController.deleteUser);


module.exports = router;
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

// @route   GET api/users
// @desc    Obter todos os usuários
// @access  Private/Admin
router.get('/', auth, userController.getAllUsers);

// @route   POST api/users
// @desc    Criar um novo usuário
// @access  Private/Admin
router.post('/', auth, userController.createUser);

// @route   DELETE api/users/:id
// @desc    Excluir um usuário
// @access  Private/Admin
router.delete('/:id', auth, userController.deleteUser);

module.exports = router;

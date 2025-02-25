const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Registrar usuário
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Verificar se o usuário já existe
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'Usuário já existe' });
    }

    // Criar novo usuário
    user = new User({
      name,
      email,
      password,
      role: role || 'user'
    });

    await user.save();

    // Criar token JWT
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '24h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

// Login de usuário
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verificar se o usuário existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Credenciais inválidas' });
    }

    // Verificar senha
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Credenciais inválidas' });
    }

    // Criar token JWT
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '24h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

// Obter usuário atual
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

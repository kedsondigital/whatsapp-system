const User = require('../models/User');

// Obter todos os usuários (apenas para admin)
exports.getAllUsers = async (req, res) => {
  try {
    // Verificar se o usuário é admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Acesso negado' });
    }

    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

// Criar novo usuário (apenas para admin)
exports.createUser = async (req, res) => {
  try {
    // Verificar se o usuário é admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Acesso negado' });
    }

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

    res.json({ msg: 'Usuário criado com sucesso' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

// Excluir usuário (apenas para admin)
exports.deleteUser = async (req, res) => {
  try {
    // Verificar se o usuário é admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Acesso negado' });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ msg: 'Usuário não encontrado' });
    }

    await user.deleteOne();

    res.json({ msg: 'Usuário removido' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

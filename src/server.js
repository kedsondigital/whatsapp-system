const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Carregar variáveis de ambiente
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Definir rotas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/whatsapp', require('./routes/whatsapp'));

// Rota de teste
app.get('/api/test', (req, res) => {
  res.json({ message: 'API do Sistema WhatsApp está funcionando!' });
});

// Conectar ao MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB conectado'))
  .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

const PORT = process.env.PORT || 7000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

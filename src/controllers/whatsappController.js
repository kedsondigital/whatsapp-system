const whatsappService = require('../services/whatsappService');
const ScheduledMessage = require('../models/ScheduledMessage');

// Inicializar cliente WhatsApp
exports.initializeClient = async (req, res) => {
  try {
    const userId = req.user.id;
    const clientData = await whatsappService.initializeClient(userId);
    
    res.json({
      status: clientData.status,
      qr: clientData.qr
    });
  } catch (error) {
    console.error('Erro ao inicializar cliente:', error);
    res.status(500).json({ msg: 'Erro ao inicializar cliente WhatsApp' });
  }
};

// Obter status do cliente
exports.getStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const clientData = whatsappService.getClientStatus(userId);
    
    if (!clientData) {
      return res.status(404).json({ msg: 'Cliente não inicializado' });
    }
    
    res.json({
      status: clientData.status,
      qr: clientData.qr
    });
  } catch (error) {
    console.error('Erro ao obter status:', error);
    res.status(500).json({ msg: 'Erro ao obter status do cliente' });
  }
};

// Extrair contatos de um grupo
exports.extractGroupContacts = async (req, res) => {
  try {
    const userId = req.user.id;
    const { groupId } = req.params;
    
    const contacts = await whatsappService.extractGroupContacts(userId, groupId);
    
    res.json(contacts);
  } catch (error) {
    console.error('Erro ao extrair contatos:', error);
    res.status(500).json({ msg: error.message || 'Erro ao extrair contatos do grupo' });
  }
};

// Agendar mensagem para um grupo
exports.scheduleGroupMessage = async (req, res) => {
  try {
    const userId = req.user.id;
    const { groupId, message, scheduledTime } = req.body;
    
    if (!groupId || !message || !scheduledTime) {
      return res.status(400).json({ msg: 'Todos os campos são obrigatórios' });
    }
    
    // Salvar no banco de dados
    const scheduledMessage = new ScheduledMessage({
      user: userId,
      groupId,
      message,
      scheduledTime,
      status: 'pending'
    });
    
    await scheduledMessage.save();
    
    // Agendar a mensagem
    await whatsappService.scheduleGroupMessage(
      userId,
      groupId,
      message,
      scheduledTime
    );
    
    res.json(scheduledMessage);
  } catch (error) {
    console.error('Erro ao agendar mensagem:', error);
    res.status(500).json({ msg: error.message || 'Erro ao agendar mensagem' });
  }
};

// Obter mensagens agendadas
exports.getScheduledMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Se for admin, pode ver todas as mensagens
    const query = req.user.role === 'admin' ? {} : { user: userId };
    
    const messages = await ScheduledMessage.find(query).sort({ scheduledTime: 1 });
    
    res.json(messages);
  } catch (error) {
    console.error('Erro ao obter mensagens agendadas:', error);
    res.status(500).json({ msg: 'Erro ao obter mensagens agendadas' });
  }
};

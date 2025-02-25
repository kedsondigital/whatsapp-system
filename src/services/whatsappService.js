const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const fs = require('fs');
const path = require('path');

// Armazenar clientes ativos
const activeClients = new Map();

// Inicializar cliente WhatsApp
const initializeClient = async (userId) => {
  // Verificar se já existe um cliente para este usuário
  if (activeClients.has(userId)) {
    return activeClients.get(userId);
  }

  // Criar pasta para armazenar dados de autenticação
  const sessionDir = path.resolve(__dirname, `../sessions/${userId}`);
  if (!fs.existsSync(sessionDir)) {
    fs.mkdirSync(sessionDir, { recursive: true });
  }

  // Criar novo cliente
  const client = new Client({
    authStrategy: new LocalAuth({ clientId: userId }),
    puppeteer: {
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
  });

  // Armazenar cliente
  activeClients.set(userId, {
    client,
    status: 'initializing',
    qr: null
  });

  // Evento de QR Code
  client.on('qr', async (qr) => {
    // Converter QR para imagem base64
    const qrImage = await qrcode.toDataURL(qr);
    activeClients.get(userId).qr = qrImage;
    activeClients.get(userId).status = 'qr_ready';
  });

  // Evento de autenticação
  client.on('authenticated', () => {
    activeClients.get(userId).status = 'authenticated';
    activeClients.get(userId).qr = null;
  });

  // Evento de pronto
  client.on('ready', () => {
    activeClients.get(userId).status = 'ready';
    console.log(`Cliente WhatsApp pronto para ${userId}`);
  });

  // Inicializar cliente
  await client.initialize();

  return activeClients.get(userId);
};

// Extrair contatos de um grupo
const extractGroupContacts = async (userId, groupId) => {
  try {
    const clientData = activeClients.get(userId);
    
    if (!clientData || clientData.status !== 'ready') {
      throw new Error('Cliente WhatsApp não está pronto');
    }

    const client = clientData.client;
    const chat = await client.getChatById(groupId);
    
    if (!chat.isGroup) {
      throw new Error('O ID fornecido não é de um grupo');
    }

    const participants = await chat.participants;
    
    // Obter detalhes de cada participante
    const contacts = await Promise.all(
      participants.map(async (participant) => {
        const contact = await client.getContactById(participant.id._serialized);
        return {
          id: contact.id._serialized,
          name: contact.name || contact.pushname || 'Desconhecido',
          number: contact.number
        };
      })
    );

    return contacts;
  } catch (error) {
    console.error('Erro ao extrair contatos:', error);
    throw error;
  }
};

// Agendar mensagem para um grupo
const scheduleGroupMessage = async (userId, groupId, message, scheduledTime) => {
  try {
    // Verificar se o cliente está pronto
    const clientData = activeClients.get(userId);
    if (!clientData || clientData.status !== 'ready') {
      throw new Error('Cliente WhatsApp não está pronto');
    }

    // Armazenar agendamento (em um sistema real, isso iria para o banco de dados)
    const schedule = {
      userId,
      groupId,
      message,
      scheduledTime: new Date(scheduledTime),
      status: 'pending'
    };

    // Em um sistema real, você usaria um job scheduler como node-cron ou agenda
    // Aqui estamos apenas simulando com setTimeout
    const timeToSend = new Date(scheduledTime) - new Date();
    
    if (timeToSend <= 0) {
      throw new Error('O horário agendado já passou');
    }

    setTimeout(async () => {
      try {
        const client = clientData.client;
        await client.sendMessage(groupId, message);
        // Atualizar status (em um sistema real, atualizaria no banco de dados)
        schedule.status = 'sent';
      } catch (error) {
        console.error('Erro ao enviar mensagem agendada:', error);
        // Atualizar status (em um sistema real, atualizaria no banco de dados)
        schedule.status = 'failed';
      }
    }, timeToSend);

    return schedule;
  } catch (error) {
    console.error('Erro ao agendar mensagem:', error);
    throw error;
  }
};

module.exports = {
  initializeClient,
  extractGroupContacts,
  scheduleGroupMessage,
  getClientStatus: (userId) => activeClients.get(userId)
};

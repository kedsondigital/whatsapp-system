const express = require('express');
const router = express.Router();
const whatsappController = require('../controllers/whatsappController');
const auth = require('../middleware/auth');

// @route   POST api/whatsapp/init
// @desc    Inicializar cliente WhatsApp
// @access  Private
router.post('/init', auth, whatsappController.initializeClient);

// @route   GET api/whatsapp/status
// @desc    Obter status do cliente
// @access  Private
router.get('/status', auth, whatsappController.getStatus);

// @route   GET api/whatsapp/group/:groupId/contacts
// @desc    Extrair contatos de um grupo
// @access  Private
router.get('/group/:groupId/contacts', auth, whatsappController.extractGroupContacts);

// @route   POST api/whatsapp/group/message
// @desc    Agendar mensagem para um grupo
// @access  Private
router.post('/group/message', auth, whatsappController.scheduleGroupMessage);

// @route   GET api/whatsapp/scheduled
// @desc    Obter mensagens agendadas
// @access  Private
router.get('/scheduled', auth, whatsappController.getScheduledMessages);

module.exports = router;

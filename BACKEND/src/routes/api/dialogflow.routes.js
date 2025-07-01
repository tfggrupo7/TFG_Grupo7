const express = require('express');
const { SessionsClient } = require('dialogflow');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

const projectId = 'chefdeskchatbot-mgam'; // <- Sustituye por tu ID de proyecto
const path = require('path');
const sessionClient = new SessionsClient({
keyFilename: path.resolve(__dirname, '../../../keys/chefdeskchatbot-mgam-e258c8601a8b.json')
});

router.post('/chat', async (req, res) => {
  const { message, sessionId } = req.body;
  const sessionPath = `projects/${projectId}/agent/sessions/${sessionId || uuidv4()}`;

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: message,
        languageCode: 'es',
      }
    }
  };

  try {
    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult;

    const intentName = result.intent?.displayName || '';
    const endConversation = intentName.toLowerCase().includes('despedida');


    res.json({ reply: result.fulfillmentText, endConversation: endConversation });
  } catch (error) {
    console.error('Error al conectar con Dialogflow:', error);
    res.status(500).json({ error: 'Fallo al conectar con Dialogflow' });
  }
});

module.exports = router;
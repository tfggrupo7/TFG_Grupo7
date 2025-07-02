const path = require('path');
const { SessionsClient } = require('@google-cloud/dialogflow');
const { v4: uuidv4 } = require('uuid');

// Ruta absoluta segura al archivo de claves
const path = require('path');
const sessionClient = new SessionsClient({
keyFilename: path.resolve(__dirname, '../../../keys/chefdeskchatbot-mgam-e258c8601a8b.json')
});

const projectId = 'chefdeskchatbot-mgam'; // ID de proyecto en Google Cloud

/**
 * POST /api/chat
 * --------------------------------------------------
 * Controlador que envía un mensaje a Dialogflow y devuelve la respuesta.
 */
const sendMessageToDialogflow = async (req, res) => {
    const { message, sessionId } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'El mensaje es obligatorio' });
    }

    const sessionPath = `projects/${projectId}/agent/sessions/${sessionId || uuidv4()}`;

    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                text: message,
                languageCode: 'es',
            },
        },
    };

    try {
        const responses = await sessionClient.detectIntent(request);
        const result = responses[0].queryResult;
        return res.json({ reply: result.fulfillmentText || '[Respuesta vacía]' });
    } catch (error) {
        console.error('❌ Error al conectar con Dialogflow:', error.message);
        return res.status(500).json({ error: 'Fallo al conectar con Dialogflow' });
    }
};

module.exports = {
    sendMessageToDialogflow
};

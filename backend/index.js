
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/gerar', async (req, res) => {
  const { tema, tipo, quantidade } = req.body;

  const prompt = `Gere ${quantidade} questões do tipo "${tipo}" sobre o tema "${tema}".`;

  try {
    const resposta = await axios.post('https://api.deepseek.com/v1/chat/completions', {
      model: 'deepseek-chat',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const conteudo = resposta.data.choices[0].message.content;
    res.json({ sucesso: true, questoes: conteudo });

  } catch (erro) {
    console.error(erro.response?.data || erro.message);
    res.status(500).json({ sucesso: false, erro: 'Erro ao gerar questões.' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor backend rodando na porta ${PORT}`));

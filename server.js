const express = require('express');
const app = express();
const http = require('http').createServer(app);
const path = require('path');

// Configura o Socket.IO com CORS liberado para funcionar no localhost e no Render
const io = require('socket.io')(http, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Serve os arquivos estáticos (como style.css) corretamente em qualquer ambiente
app.use(express.static(__dirname));

// Rota para a página inicial
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Evento para quando o cliente se conecta ao servidor via Socket.io
io.on('connection', (socket) => {
  console.log('Usuário conectado:', socket.id);

  // Evento para quando o cliente envia uma mensagem via Socket.io
  socket.on('chat message', (data) => {
    io.emit('chat message', data);
  });

  // Evento para quando o cliente se desconecta do servidor via Socket.io
  socket.on('disconnect', () => {
    console.log('Usuário desconectado:', socket.id);
  });
});

// Usa a porta fornecida pelo Render (process.env.PORT) ou 3000 no localhost
const PORT = process.env.PORT || 3000;
http.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT} - http://localhost:${PORT}`);
});

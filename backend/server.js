const express = require('express');
const cors = require('cors');
const path = require('path');
const os = require('os');

const usersRouter = require('./routes/users');
const postsRouter = require('./routes/posts');
const testsRouter = require('./routes/tests');
const appointmentsRouter = require('./routes/appointments');
const botRouter = require('./routes/bot');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

var frontendPath = path.join(__dirname, '..');
app.use(express.static(frontendPath));

app.use('/api/users', usersRouter);
app.use('/api/posts', postsRouter);
app.use('/api/tests', testsRouter);
app.use('/api/appointments', appointmentsRouter);
app.use('/api/bot', botRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

function getLocalIp() {
  var interfaces = os.networkInterfaces();
  for (var name in interfaces) {
    for (var i = 0; i < interfaces[name].length; i++) {
      var addr = interfaces[name][i];
      if (addr.family === 'IPv4' && !addr.internal) {
        return addr.address;
      }
    }
  }
  return '127.0.0.1';
}

app.listen(PORT, '0.0.0.0', () => {
  var ip = getLocalIp();
  console.log('');
  console.log('  MindWell — Mental Health Support');
  console.log('  ─────────────────────────────────');
  console.log('  Local:   http://localhost:' + PORT);
  console.log('  Network: http://' + ip + ':' + PORT);
  console.log('  ─────────────────────────────────');
  console.log('');
});

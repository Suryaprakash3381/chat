const cors = require('cors');
const { app } = require('./server');

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

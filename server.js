const express = require('express');
const bodyParser = require('body-parser');
const booksrouter = require('./router/books');
const usersRouter = require('./router/users');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const PORT = process.env.PORT || 3000;
const db = require('./services/database');
const { authenticateToken } = require('./middlewares/auth');

const corsOptions = {
    origin: 'http://localhost:5174',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
    allowedHeaders: ['Content-Type', 'Authorization']
};

const app = express();

app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use('/api/books', booksrouter);
app.use('/api/users', usersRouter);

app.post('/api/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Déconnexion réussie' });
});

app.get('/api/session', authenticateToken, (req, res) => {
    if (req?.user) {
        res.json({ user: req.user });
    } else {
        res.status(401).json({ message: 'Non authentifié' });
    }
});

app.get('/api/statistics', (req, res) => {
    const totalBooksQuery = 'SELECT COUNT(*) AS total_books FROM livres';
    const totalUsersQuery = 'SELECT COUNT(*) AS total_users FROM utilisateurs';

    db.query(totalBooksQuery, (err, booksResult) => {
        if (err) throw err;
        db.query(totalUsersQuery, (err, usersResult) => {
            if (err) throw err;
            res.json({
                total_books: booksResult[0].total_books,
                total_users: usersResult[0].total_users
            });
        });
    });
});

// Mise à jour du chemin pour servir les fichiers statiques depuis 'webpub'
app.use(express.static(path.join(__dirname, 'webpub')));

app.get('*', (_, res) => {
    res.sendFile(path.join(__dirname, 'webpub', 'index.html'));
});

app.listen(PORT, () => {
    console.info(`Serveur démarré sur le port ${PORT}`);
});

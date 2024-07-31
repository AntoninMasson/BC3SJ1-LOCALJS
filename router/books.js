const express = require('express');
const router = express.Router();
const db = require('./../services/database');
const { authenticateToken } = require('../middlewares/auth');

router
.get('/', (_, res) => {
    const sql = 'SELECT * FROM livres';
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
})

.post('/', (req, res) => {
    const { title, author, date_publication, isbn, description, status, cover } = req.body;
    const sql = 'INSERT INTO livres (titre, auteur, date_publication, isbn, description, statut, photo_url) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [title, author, date_publication, isbn, description, status || "disponible", cover], (err) => {
        if (err) res.status(400).send("Erreur d'envoi");
        res.send('Livre ajouté');
    });
})

.get('/:id', (req, res) => {
    const sql = 'SELECT * FROM livres WHERE id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;
        res.json(result);
    });
})

.put('/:id', (req, res) => {
    const { title, author, published_date, isbn, description, status, photo_url } = req.body;
    const sql = 'UPDATE livres SET titre = ?, auteur = ?, date_publication = ?, isbn = ?, description = ?, statut = ?, photo_url = ? WHERE id = ?';
    db.query(sql, [title, author, published_date, isbn, description, status, photo_url, req.params.id], (err, result) => {
        if (err) throw err;
        res.send('Livre mis à jour');
    });
})

.delete('/:id', (req, res) => {
    const sql = 'DELETE FROM livres WHERE id = ?';
    db.query(sql, [req.params.id], (err) => {
        if (err) throw err;
        res.send('Livre supprimé');
    });
})

.post('/rent', authenticateToken, async (req, res) => {
    const { userId, bookId } = req.body;
    const sql = 'INSERT INTO emprunts (user_id, book_id) VALUES (?, ?)';
    db.query(sql, [userId, bookId], (err, result) => {
        if (err) {
            res.status(500).send("Erreur d'emprunt");
        } else {
            // Update book status to 'emprunté'
            const updateBookStatusSql = 'UPDATE livres SET statut = ? WHERE id = ?';
            db.query(updateBookStatusSql, ['emprunté', bookId], (err) => {
                if (err) {
                    res.status(500).send("Erreur de mise à jour du statut du livre");
                } else {
                    res.send('Livre emprunté avec succès');
                }
            });
        }
    });
})

.post('/return', authenticateToken, async (req, res) => {
    const { userId, bookId } = req.body;
    const sql = 'UPDATE emprunts SET date_retour = NOW() WHERE user_id = ? AND book_id = ? AND date_retour IS NULL';
    db.query(sql, [userId, bookId], (err, result) => {
        if (err) {
            res.status(500).send("Erreur de rendu");
        } else if (result.affectedRows === 0) {
            res.status(400).send("Aucun emprunt en cours trouvé pour ce livre");
        } else {
            // Update book status to 'disponible'
            const updateBookStatusSql = 'UPDATE livres SET statut = ? WHERE id = ?';
            db.query(updateBookStatusSql, ['disponible', bookId], (err) => {
                if (err) {
                    res.status(500).send("Erreur de mise à jour du statut du livre");
                } else {
                    res.send('Livre rendu avec succès');
                }
            });
        }
    });
});

module.exports = router;

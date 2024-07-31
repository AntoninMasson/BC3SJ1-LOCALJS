const pool = require('./db'); 
/**
 * Function to rent a book for a user.
 * @param {number} userId - The ID of the user renting the book.
 * @param {number} bookId - The ID of the book being rented.
 * @returns {Promise<void>}
 */
async function rentBook(userId, bookId) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        // Vérifiez si le livre est déjà loué
        const { rows: bookRows } = await client.query('SELECT * FROM rentals WHERE book_id = $1 AND returned = FALSE', [bookId]);
        if (bookRows.length > 0) {
            throw new Error('Book is already rented.');
        }

        // Insérez une nouvelle location
        await client.query('INSERT INTO rentals (user_id, book_id, rental_date) VALUES ($1, $2, NOW())', [userId, bookId]);

        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

/**
 * Function to return a rented book.
 * @param {number} rentalId - The ID of the rental record.
 * @returns {Promise<void>}
 */
async function returnBook(rentalId) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Mettre à jour l'enregistrement de location pour marquer le livre comme retourné
        await client.query('UPDATE rentals SET returned = TRUE WHERE id = $1', [rentalId]);

        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

/**
 * Function to get rental history of a user.
 * @param {number} userId - The ID of the user.
 * @returns {Promise<Array>}
 */
async function getRentalHistory(userId) {
    const client = await pool.connect();
    try {
        const { rows } = await client.query('SELECT * FROM rentals WHERE user_id = $1', [userId]);
        return rows;
    } finally {
        client.release();
    }
}

module.exports = {
    rentBook,
    returnBook,
    getRentalHistory,
};

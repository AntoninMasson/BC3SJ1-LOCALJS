import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
const base = import.meta.env.VITE_BASE_API 

const BookReturn = () => {
    const [userId, setUserId] = useState('');
    const [bookId, setBookId] = useState('');
    const [message, setMessage] = useState('');

    const handleReturnBook = async () => {
        try {
            const response = await axios.post('/api/books/return', { userId, bookId }, { withCredentials: true });
            setMessage(response.data);
        } catch (error) {
            setMessage(error.response?.data?.error || 'Erreur lors du rendu du livre');
        }
    };

    return (
        <div>
            <h1>Return a Book</h1>
            <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Enter user ID"
            />
            <input
                type="text"
                value={bookId}
                onChange={(e) => setBookId(e.target.value)}
                placeholder="Enter book ID"
            />
            <button onClick={handleReturnBook}>Return</button>
            <p>{message}</p>
        </div>
    );
};

export default BookReturn;

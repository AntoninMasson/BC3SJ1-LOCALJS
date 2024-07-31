import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
const base = import.meta.env.VITE_BASE_API 
const BookRental = () => {
    const [userId, setUserId] = useState('');
    const [bookId, setBookId] = useState('');
    const [message, setMessage] = useState('');

    const handleRentBook = async () => {
        try {
            const response = await axios.post('/api/books/rent', { userId, bookId }, { withCredentials: true });
            setMessage(response.data);
        } catch (error) {
            setMessage(error.response?.data?.error || 'Erreur lors de l\'emprunt du livre');
        }
    };

    return (
        <div>
            <h1>Rent a Book</h1>
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
            <button onClick={handleRentBook}>Rent</button>
            <p>{message}</p>
        </div>
    );
};

export default BookRental;

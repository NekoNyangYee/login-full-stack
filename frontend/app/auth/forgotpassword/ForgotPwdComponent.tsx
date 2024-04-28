"use client"

import React, { useState } from 'react';
import axios from 'axios';

import '../../../public/scss/main.scss'

export const ForgotPwdComponent = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
            setMessage(response.data.message);
        } catch (error) {
            setMessage('Failed to send password reset email.');
        }
    };

    return (
        <div>
            <h2>비밀번호 찾기</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email"
                />
                <button type="submit">메일인증 보내기</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};
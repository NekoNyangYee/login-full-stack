import React, { useState } from 'react';
import axios from 'axios';
import { usePathname } from 'next/navigation';

export const ResetPasswordComponent = () => {
    const pathname = usePathname();
    const token = pathname.split('/').pop(); // URL 마지막 부분이 토큰으로 가정
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/auth/reset-password', { token, newPassword: password });
            setMessage(response.data.message);
        } catch (error) {
            setMessage('Failed to reset password.');
        }
    };

    return (
        <div>
            <h2>Reset Password</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter new password"
                />
                <button type="submit">Reset Password</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};
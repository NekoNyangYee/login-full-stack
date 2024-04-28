"use client"

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';

import '../../../public/scss/main.scss'

export const ResetPasswordComponent = () => {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/auth/reset-password', { token: token, newPassword: password });
            alert(response.data.message);
        } catch (error) {
            alert('변경에 실패하였습니다. 다시 시도해주세요.');
        }
    };

    useEffect(() => {
        console.log(token);
        const verifyToken = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/auth/validate-reset-token?token=${token}`);
                console.log(response.data);
                if (!response.data.valid) {
                    alert('토큰이 유효하지 않거나 만료되었습니다. 다시 메일 요청을 해주세요.');
                    window.close();
                }
            } catch (err) {
                console.error(err);
            }

        }
        verifyToken();
    }, [token]);

    return (
        <div>
            <h2>비밀번호 재설정</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter new password"
                />
                <button type="submit">재설정하기</button>
            </form>
        </div>
    );
};
"use client"

import React, { useState } from 'react';
import axios from 'axios';

import "../../public/scss/signup.scss"

export default function SignupPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // 입력 값 확인
        if (!username || !email || !password) {
            const missingFields = [];
            if (!username) missingFields.push("username");
            if (!email) missingFields.push("email");
            if (!password) missingFields.push("password");

            alert(`Please enter your ${missingFields.join(", ")}.`);
            return;
        }

        try {
            // 회원가입 API 요청
            await axios.post('http://localhost:5000/api/auth/signup', { username, email, password });
            alert("회원가입 되었습니다.");
        } catch (error) {
            if (axios.isAxiosError(error)) {
                // 'error'가 AxiosError이면, 안전하게 'response' 속성에 접근할 수 있습니다.
                const message = error.response?.data?.message || "An error occurred during signup.";
                alert(message);
            } else {
                // 'error'가 AxiosError가 아니면, 일반 오류 메시지를 출력합니다.
                alert("An unexpected error occurred.");
            }
        }
    };

    return (
        <div className='signup-container'>
            <h1>회원가입</h1>
            <form onSubmit={handleSignup}>
                <div className="input-container">
                    <label htmlFor="username">닉네임</label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="input-container">
                    <label htmlFor="email">이메일</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="input-container">
                    <label htmlFor="password">비밀번호</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">회원가입</button>
            </form>
        </div>
    );
}
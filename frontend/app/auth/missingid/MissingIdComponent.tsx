"use client"

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

import '../../../public/scss/main.scss'

export const MissingIdComponent = () => {
    const [userName, setUserName] = useState<string>('');
    const [message, setMessage] = useState<string>('');

    const router = useRouter();

    const handleFindId = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            // 클라이언트 측 코드
            const response = await axios.post('http://localhost:5000/api/auth/missing-id', { username: userName });
            alert(`${userName}님의 이메일은 ${response.data.email} 입니다.\n 확인 후 로그인해주세요.`);
            router.push('/');
        } catch (error: any) {
            if (error.response) {
                // 요청이 이루어졌고 서버가 2xx 범위가 아닌 상태 코드로 응답
                setMessage(error.response.data.message);
            } else if (error.request) {
                // 요청이 이루어 졌으나 응답을 받지 못함
                setMessage('No response from server.');
            } else {
                // 요청을 설정하는 중에 문제가 발생함
                setMessage(error.message);
            }
        }
    }
    return (
        <div>
            <h2>아이디 찾기</h2>
            <form onSubmit={handleFindId}>
                <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    required
                    placeholder="사용자 이름을 입력하세요."
                />
                <button type="submit">아이디 찾기</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}
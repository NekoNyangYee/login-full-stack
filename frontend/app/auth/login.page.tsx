"use client"

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from 'next/navigation'

import "../../public/scss/login.scss"
import Link from "next/link";

interface ErrorResponse {
    response: {
        data: {
            message: string;
        };
    };
}

export default function LoginPage() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:5000/api/auth/login", { email, password });
            const { token } = response.data;
            localStorage.setItem("authToken", token);

            alert("로그인 성공! 환영한다 게이야");
            setError("")
            router.push("/main");
        } catch (err) {
            const e = err as ErrorResponse;
            console.error(e.response.data.message);
            setError("로그인 실패! 이메일과 비밀번호를 확인해주세요.");
        }
    }
    return (
        <div className="login-container">
            <h1>로그인</h1>
            {error && <p>{error}</p>}
            <form onSubmit={handleLogin}>
                <div className="input-container">
                    <label htmlFor="email">이메일</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="이메일 입력하세요."
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
                        placeholder="비밀번호 입력하세요."
                    />
                </div>
                <button type="submit">로그인</button>

                <p>비밀번호를 잊으셨나요? <Link href="/auth/forgotpassword">비밀번호 찾기</Link></p>
            </form>
        </div>
    );
}
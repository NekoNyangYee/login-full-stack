"use client"

import React, { useState } from "react";
import axios from "axios";
import Link from 'next/link';

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

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:5000/api/auth/login", { email, password });
            const { token } = response.data;
            localStorage.setItem("authToken", token);

            alert("로그인 성공! 환영한다 게이야");
        } catch (err) {
            const e = err as ErrorResponse;
            console.error(e.response.data.message);
        }
    }
    return (
        <div>
            <form onSubmit={handleLogin}>
                <div>
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
            Don't have an account? <Link href="/auth/signup">Sign up</Link>
        </div>
    );
}
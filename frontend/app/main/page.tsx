"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Main = () => {
    const router = useRouter();

    // 페이지가 로드될 때 로그인 상태를 확인
    useEffect(() => {
        // authToken을 쿠키에서 가져온다고 가정합니다. 실제로는 쿠키 관련 로직을 구현해야 합니다.
        const authToken = localStorage.getItem('authToken');

        if (!authToken) {
            // 로그인 토큰이 없으면 홈으로 리다이렉트
            alert('로그인이 필요한 페이지입니다.');
            router.push('/');
        }
    }, [router]);

    // 로그아웃 함수
    const handleLogout = () => {
        // localStorage에서 authToken 제거
        localStorage.removeItem('authToken');

        // 로그아웃 후 홈으로 리다이렉트
        router.push('/');
    };

    return (
        <div>
            <h1>Frontend</h1>
            <p>이 페이지가 보인다면 당신은 로그인에 성공하신 겁니다.</p>
            <button onClick={handleLogout}>로그아웃</button>
        </div>
    );
};

export default Main;
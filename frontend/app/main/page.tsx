"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const Main = () => {
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const router = useRouter();

    // 페이지가 로드될 때 로그인 상태를 확인
    useEffect(() => {
        // authToken을 쿠키에서 가져온다고 가정합니다. 실제로는 쿠키 관련 로직을 구현해야 합니다.
        const authToken = localStorage.getItem('authToken');

        if (!authToken) {
            setShowAlert(true);
            // alert 후에 바로 리다이렉트하지 않고 사용자에게 메시지를 표시
            setTimeout(() => {
                router.push('/');
            }, 300); // 3초 후 홈으로 리다이렉트
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
            {showAlert && <p>로그인이 필요한 페이지입니다.</p>}
            <h1>Frontend</h1>
            <p>이 페이지가 보인다면 당신은 로그인에 성공하신 겁니다.</p>
            <button onClick={handleLogout}>로그아웃</button>
        </div>
    );
};

export default Main;
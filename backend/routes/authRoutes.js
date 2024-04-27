const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const pool = require('../config/db');

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

        if (user.rows.length === 0) {
            return res.status(401).json({ message: "Invaild Email or Password" });
        }

        const vaildPassword = await bcrypt.compare(password, user.rows[0].password_hash);
        if (!vaildPassword) {
            return res.status(401).json({ message: "Invaild Email or Password" });
        }

        const token = jwt.sign({ user_id: user.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '2h' });

        res.json({ token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

router.post('/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // 이메일 중복 체크
        let user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (user.rows.length > 0) {
            return res.status(401).json({ message: "해당 유저가 이미 존재해요. 다른 이메일 혹은 유저명으로 등록해주세요." });
        }

        // 비밀번호 해시 생성
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        // 새 사용자 생성
        user = await pool.query(
            "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING *",
            [username, email, password_hash]
        );

        // JWT 생성
        const token = jwt.sign({ user_id: user.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '2h' });

        // 응답으로 JWT 반환
        res.json({ token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (user.rows.length === 0) {
            return res.status(404).json({ message: "No user found with that email." });
        }

        const resetToken = crypto.randomBytes(20).toString('hex');
        const expireTime = new Date(Date.now() + 3600000); // 1 hour from now

        await pool.query("UPDATE users SET reset_token = $1, reset_token_expires = $2 WHERE email = $3", [resetToken, expireTime, email]);

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            secure: true,
            port: 465,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: `비밀번호 재설정 관련 메일입니다.`,
            text: `귀하(또는 다른 사람)가 귀하 계정의 비밀번호 재설정을 요청했기 때문에 이 메일을 보내드립니다.\n\n
            Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n
            http://localhost:3000/auth/resetpassword?token=${resetToken}\n\n
            요청하지 않은 경우 이 이메일을 무시하시면 귀하의 비밀번호는 변경되지 않습니다.`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error occurred:", error.message);
                return res.status(500).send("Server error");
            }
            console.log('Message sent: %s', info.messageId);
            // 메일이 정상적으로 발송되었을 때만 200 응답을 보냄
            res.status(200).json({ message: email + '로 메일을 정상적으로 보냈습니다.' });
        });

        console.log(mailOptions)

    } catch (err) {
        console.error("Error occurred:", err.message);
        res.status(500).send("Server error");
    }
});

router.post('/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;
    try {
        console.log('Received token for password reset:', token);
        const user = await pool.query("SELECT * FROM users WHERE reset_token = $1 AND reset_token_expires > NOW()", [token]);
        if (user.rows.length === 0) {
            return res.status(400).json({ message: "유효하지 않은 토큰이에요." });
        }

        const salt = await bcrypt.genSalt(10);
        const newPasswordHash = await bcrypt.hash(newPassword, salt);

        await pool.query("UPDATE users SET password_hash = $1, reset_token = NULL, reset_token_expires = NULL WHERE reset_token = $2", [newPasswordHash, token]);
        res.status(200).json({ message: "비밀번호가 성공적으로 변경되었어요." });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

// 서버에서 토큰을 검증하는 API 예시
router.get('/validate-reset-token', async (req, res) => {
    const { token } = req.query;
    console.log('Validating token:', token);
    try {
        // 토큰과 만료시간을 확인하는 쿼리
        const user = await pool.query("SELECT * FROM users WHERE reset_token = $1 AND reset_token_expires > NOW()", [token]);
        if (user.rows.length > 0) {
            res.json({ valid: true });
        } else {
            res.json({ valid: false });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});


module.exports = router;
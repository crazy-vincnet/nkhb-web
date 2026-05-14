import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

async function sendTestEmail() {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const targetEmail = "youngjae1009@gmail.com";

  console.log(`Attempting to send test email to: ${targetEmail}`);
  console.log(`Using SMTP User: ${user}`);

  if (!user || !pass) {
    console.error('Error: SMTP_USER or SMTP_PASS not found in .env');
    return;
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  });

  const mailOptions = {
    from: `"NKHB Test" <${user}>`,
    to: targetEmail,
    subject: "NKHB 이메일 전송 테스트",
    text: "이것은 NKHB 관리 시스템에서 보낸 테스트 이메일입니다. 정상적으로 수신되었다면 답장을 보내주세요.",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; padding: 20px; border: 1px solid #eee; border-radius: 12px;">
        <h2 style="color: #2563eb;">🚀 NKHB 이메일 테스트</h2>
        <p>안녕하세요, <strong>youngjae1009@gmail.com</strong>님!</p>
        <p>이 메일은 NKHB 웹사이트의 이메일 전송 기능이 정상적으로 작동하는지 확인하기 위한 테스트 메일입니다.</p>
        <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin-top: 10px;">
          <p style="margin: 0; font-size: 14px; color: #64748b;">전송 시간: ${new Date().toLocaleString()}</p>
          <p style="margin: 5px 0 0 0; font-size: 14px; color: #64748b;">전송 엔진: Nodemailer (Gmail SMTP)</p>
        </div>
        <p style="margin-top: 20px;">이 메일을 받으셨다면 이메일 시스템이 성공적으로 고도화되었음을 의미합니다. 감사합니다!</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #94a3b8; text-align: center;">© 2026 NKHB (New Korea Hope Broadcasting)</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Success! Email sent:', info.messageId);
  } catch (error) {
    console.error('Failed to send email:', error);
  }
}

sendTestEmail();

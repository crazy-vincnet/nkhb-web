import type { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, location, reason, message } = req.body;

  // Verify credentials
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const to = process.env.SMTP_TO || user;

  if (!user || !pass) {
    console.error('SMTP credentials missing');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  });

  const mailOptions = {
    from: `"NKHB Website" <${user}>`,
    to: to,
    replyTo: email,
    subject: `[희망의 편지] ${name}님이 보낸 메시지`,
    text: `
이름: ${name}
이메일: ${email}
지역: ${location}
관심 계기: ${reason}

메시지:
${message}
    `,
    html: `
      <div style="font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8fafc; padding: 40px 20px;">
        <div style="background-color: #ffffff; border-radius: 24px; overflow: hidden; shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
          <!-- Header -->
          <div style="background-color: #2563eb; padding: 40px 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.025em;">NKHB <span style="opacity: 0.8;">Studio</span></h1>
            <p style="color: #bfdbfe; margin: 8px 0 0 0; font-size: 14px; font-weight: 500;">새로운 희망의 편지가 도착했습니다</p>
          </div>

          <!-- Content -->
          <div style="padding: 40px 30px;">
            <div style="margin-bottom: 32px;">
              <h2 style="font-size: 18px; font-weight: 700; color: #1e293b; margin-bottom: 16px; display: flex; align-items: center;">
                📝 작성자 정보
              </h2>
              <table style="width: 100%; border-collapse: collapse; background-color: #f1f5f9; border-radius: 16px;">
                <tr>
                  <td style="padding: 16px 20px; border-bottom: 1px solid #e2e8f0; width: 100px;">
                    <span style="font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase;">이름</span>
                  </td>
                  <td style="padding: 16px 20px; border-bottom: 1px solid #e2e8f0;">
                    <span style="font-size: 15px; font-weight: 600; color: #1e293b;">${name}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 16px 20px; border-bottom: 1px solid #e2e8f0;">
                    <span style="font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase;">이메일</span>
                  </td>
                  <td style="padding: 16px 20px; border-bottom: 1px solid #e2e8f0;">
                    <a href="mailto:${email}" style="font-size: 15px; font-weight: 600; color: #2563eb; text-decoration: none;">${email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 16px 20px; border-bottom: 1px solid #e2e8f0;">
                    <span style="font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase;">지역</span>
                  </td>
                  <td style="padding: 16px 20px; border-bottom: 1px solid #e2e8f0;">
                    <span style="font-size: 15px; font-weight: 600; color: #1e293b;">${location}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 16px 20px;">
                    <span style="font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase;">계기</span>
                  </td>
                  <td style="padding: 16px 20px;">
                    <span style="font-size: 15px; font-weight: 600; color: #1e293b;">${reason}</span>
                  </td>
                </tr>
              </table>
            </div>

            <div>
              <h2 style="font-size: 18px; font-weight: 700; color: #1e293b; margin-bottom: 16px;">
                💬 메시지 내용
              </h2>
              <div style="background-color: #ffffff; border: 2px solid #f1f5f9; padding: 24px; border-radius: 16px; font-size: 16px; line-height: 1.7; color: #334155; white-space: pre-wrap;">${message}</div>
            </div>

            <div style="margin-top: 40px; text-align: center;">
              <a href="https://nkhb.org/admin/letters" style="display: inline-block; background-color: #1e293b; color: #ffffff; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 14px;">관리자 페이지에서 확인하기</a>
            </div>
          </div>

          <!-- Footer -->
          <div style="padding: 30px; border-top: 1px solid #f1f5f9; text-align: center;">
            <p style="margin: 0; font-size: 12px; color: #94a3b8; line-height: 1.5;">
              본 메일은 NKHB 웹사이트에서 자동으로 발송되었습니다.<br>
              © 2026 New Korea Hope Broadcasting. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('Nodemailer Error:', error);
    return res.status(500).json({ error: error.message });
  }
}

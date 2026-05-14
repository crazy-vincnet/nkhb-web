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
      <div style="font-family: sans-serif; max-width: 600px; line-height: 1.6;">
        <h2 style="color: #2563eb;">📧 새 편지가 도착했습니다</h2>
        <hr style="border: 1px solid #eee;">
        <p><strong>이름:</strong> ${name}</p>
        <p><strong>이메일:</strong> ${email}</p>
        <p><strong>지역:</strong> ${location}</p>
        <p><strong>관심 계기:</strong> ${reason}</p>
        <div style="background: #f8fafc; padding: 20px; border-radius: 12px; margin-top: 20px;">
          <p style="margin: 0; white-space: pre-wrap;">${message}</p>
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

import { Resend } from 'resend';

export interface NewInquiryEmail {
  id: number;
  authorName: string;
  title: string;
  content: string;
}

export function buildInquiryEmailText(payload: NewInquiryEmail, adminUrl: string): string {
  return (
    `새로운 예약 문의가 등록되었습니다.\n\n` +
    `작성자: ${payload.authorName}\n` +
    `제목: ${payload.title}\n\n` +
    `내용:\n${payload.content}\n\n` +
    `관리자 페이지: ${adminUrl}`
  );
}

export async function sendNewInquiryNotification(env: CloudflareEnv, payload: NewInquiryEmail): Promise<void> {
  const recipients = env.NOTIFY_EMAILS.split(',').map((s) => s.trim()).filter(Boolean);
  if (recipients.length === 0) return;

  const resend = new Resend(env.RESEND_API_KEY);
  const adminUrl = `${env.SITE_URL}/admin/inquiry/${payload.id}`;

  await resend.emails.send({
    from: env.SENDER_EMAIL,
    to: recipients,
    subject: `[한라산출장바베큐] 새 예약 문의 — ${payload.title}`,
    text: buildInquiryEmailText(payload, adminUrl),
  });
}

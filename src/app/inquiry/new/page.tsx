import { getEnv } from '@/lib/inquiries/cf';
import InquiryForm from './InquiryForm';

export const metadata = { title: '예약 문의 작성 | 한라산출장바베큐' };
export const dynamic = 'force-dynamic';

export default function NewInquiryPage() {
  const siteKey = getEnv().TURNSTILE_SITE_KEY ?? '';
  return (
    <main className="px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-center pt-10 pb-6">예약 문의 작성</h1>
      <InquiryForm siteKey={siteKey} />
    </main>
  );
}

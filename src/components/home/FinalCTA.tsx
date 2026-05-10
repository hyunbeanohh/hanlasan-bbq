import CallButton from '@/components/cta/CallButton';
import SmsButton from '@/components/cta/SmsButton';
import EmailButton from '@/components/cta/EmailButton';
import { CONTACT } from '@/lib/constants';

export default function FinalCTA() {
  return (
    <section className="py-20 md:py-28 bg-brand-soft">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-brand font-semibold text-xs uppercase tracking-widest mb-4">
          CONTACT US
        </p>
        <h2 className="text-3xl md:text-5xl font-bold text-ink mb-6 leading-tight">
          지금 바로 출장 문의
        </h2>
        <p className="text-ink-soft text-lg mb-4 max-w-lg mx-auto">
          날짜·장소·인원만 알려주세요. 나머지는 저희가 다 합니다.
        </p>
        <p className="text-brand font-bold text-xl mb-10">
          {CONTACT.phone}
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <CallButton variant="primary" />
          <SmsButton variant="ghost" />
          <EmailButton variant="ghost" />
        </div>
      </div>
    </section>
  );
}

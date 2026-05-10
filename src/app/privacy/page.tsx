export const metadata = { title: '개인정보처리방침 | 한라산출장바베큐' };

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 text-sm leading-relaxed">
      <h1 className="text-2xl font-bold mb-6">개인정보처리방침</h1>
      <p className="mb-6">
        한라산출장바베큐(이하 &ldquo;회사&rdquo;)는 「개인정보보호법」을 준수하여 다음과 같이 개인정보를 처리합니다.
      </p>

      <h2 className="text-lg font-bold mt-6 mb-2">1. 수집하는 개인정보 항목</h2>
      <ul className="list-disc pl-6 mb-4">
        <li>예약 문의 시: 고객명, 연락처, 이메일, 문의내용</li>
      </ul>

      <h2 className="text-lg font-bold mt-6 mb-2">2. 수집·이용 목적</h2>
      <p className="mb-4">예약 상담 및 답변 응대 목적으로만 사용합니다.</p>

      <h2 className="text-lg font-bold mt-6 mb-2">3. 보유 및 이용기간</h2>
      <p className="mb-4">상담 완료 후 1년간 보관 후 자동 파기됩니다.</p>

      <h2 className="text-lg font-bold mt-6 mb-2">4. 제3자 제공</h2>
      <p className="mb-4">
        회사는 수집한 개인정보를 제3자에게 제공하지 않습니다. 단, 법령에 의거한 경우는 예외입니다.
      </p>

      <h2 className="text-lg font-bold mt-6 mb-2">5. 보호조치</h2>
      <p className="mb-4">
        전화번호와 이메일은 AES-256 암호화하여 저장합니다. 비밀번호는 PBKDF2 해시로 저장합니다.
      </p>

      <h2 className="text-lg font-bold mt-6 mb-2">6. 정보주체 권리</h2>
      <p className="mb-4">본인 글 작성 시 입력한 비밀번호로 직접 수정·삭제하실 수 있습니다.</p>

      <h2 className="text-lg font-bold mt-6 mb-2">7. 문의처</h2>
      <p>이메일: ohnamsoo3822@naver.com</p>
    </main>
  );
}

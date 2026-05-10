'use client';

import { useState } from 'react';

export default function PasswordPrompt({ inquiryId }: { inquiryId: number }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const res = await fetch(`/inquiry/${inquiryId}/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    setPending(false);
    if (res.ok) {
      location.reload();
    } else {
      const data = (await res.json().catch(() => ({}))) as { message?: string };
      setError(data.message ?? '비밀번호가 올바르지 않습니다.');
    }
  }

  return (
    <form onSubmit={submit} className="max-w-md mx-auto py-20 space-y-4 text-center">
      <p className="text-fg-muted text-sm">비밀글입니다. 작성 시 입력한 비밀번호를 입력해주세요.</p>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full border border-border rounded p-2 text-sm"
        required
      />
      {error && <p className="text-red-600 text-xs">{error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="bg-brand text-white px-6 py-2 rounded-full text-sm font-semibold disabled:opacity-50"
      >
        {pending ? '확인 중…' : '확인'}
      </button>
    </form>
  );
}

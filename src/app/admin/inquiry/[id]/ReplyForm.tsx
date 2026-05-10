'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { replyAction, type ReplyState } from './actions';

const INITIAL: ReplyState = { ok: false };

function Btn() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="bg-brand text-white px-6 py-2 rounded-full text-sm">
      {pending ? '등록 중…' : '답글 등록'}
    </button>
  );
}

export default function ReplyForm({ parentId }: { parentId: number }) {
  const action = replyAction.bind(null, parentId);
  const [state, formAction] = useActionState(action, INITIAL);
  return (
    <form action={formAction} className="space-y-3 mt-6">
      <textarea
        name="content"
        required
        rows={6}
        className="w-full border border-border rounded p-3 text-sm"
        placeholder="답변 내용을 입력하세요"
      />
      {state.message && !state.ok && <p className="text-red-600 text-xs">{state.message}</p>}
      {state.ok && <p className="text-green-700 text-xs">답글이 등록되었습니다.</p>}
      <Btn />
    </form>
  );
}

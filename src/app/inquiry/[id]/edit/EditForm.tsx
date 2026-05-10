'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { updateInquiryAction, type EditState } from './actions';

const INITIAL: EditState = { ok: false };

function SubmitBtn() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="bg-brand text-white px-6 py-2 rounded-full text-sm">
      {pending ? '저장 중…' : '저장'}
    </button>
  );
}

export default function EditForm({
  inquiryId,
  initialTitle,
  initialContent,
}: {
  inquiryId: number;
  initialTitle: string;
  initialContent: string;
}) {
  const action = updateInquiryAction.bind(null, inquiryId);
  const [state, formAction] = useActionState(action, INITIAL);

  return (
    <form action={formAction} className="space-y-4 max-w-2xl mx-auto py-10">
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1">제목 *</label>
        <input
          id="title"
          name="title"
          defaultValue={initialTitle}
          required
          className="w-full border border-border rounded p-2 text-sm"
        />
      </div>
      <div>
        <label htmlFor="content" className="block text-sm font-medium mb-1">내용 *</label>
        <textarea
          id="content"
          name="content"
          defaultValue={initialContent}
          required
          rows={10}
          className="w-full border border-border rounded p-3 text-sm"
        />
      </div>
      {state.message && !state.ok && <p className="text-red-600 text-sm">{state.message}</p>}
      <div className="flex justify-center gap-2">
        <SubmitBtn />
        <a href={`/inquiry/${inquiryId}`} className="border border-border px-6 py-2 rounded-full text-sm">
          취소
        </a>
      </div>
    </form>
  );
}

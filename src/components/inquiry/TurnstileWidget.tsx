'use client';

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    turnstile?: {
      render: (selector: string | HTMLElement, options: Record<string, unknown>) => string;
      reset: (id?: string) => void;
    };
  }
}

interface Props {
  siteKey: string;
  onToken: (token: string) => void;
  /** 위젯 로드 실패나 검증 오류 시 호출 (대체 연락 수단 안내용) */
  onError?: () => void;
}

export default function TurnstileWidget({ siteKey, onToken, onError }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  // 부모가 매 렌더마다 새 콜백을 넘겨도 위젯을 다시 그리지 않도록 최신 콜백만 ref로 보관한다.
  const onTokenRef = useRef(onToken);
  const onErrorRef = useRef(onError);
  useEffect(() => {
    onTokenRef.current = onToken;
    onErrorRef.current = onError;
  }, [onToken, onError]);

  useEffect(() => {
    const SCRIPT_ID = 'cf-turnstile-script';
    function render() {
      if (!window.turnstile || !ref.current) return;
      widgetId.current = window.turnstile.render(ref.current, {
        sitekey: siteKey,
        callback: (token: string) => onTokenRef.current(token),
        'error-callback': () => {
          onTokenRef.current('');
          onErrorRef.current?.();
        },
        'expired-callback': () => onTokenRef.current(''),
        'timeout-callback': () => onTokenRef.current(''),
        // 대부분의 방문자에게는 보이지 않고, 추가 확인이 필요할 때만 체크박스가 나타난다.
        appearance: 'interaction-only',
        theme: 'light',
        language: 'ko',
      });
    }
    if (document.getElementById(SCRIPT_ID)) {
      render();
    } else {
      const s = document.createElement('script');
      s.id = SCRIPT_ID;
      s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      s.async = true;
      s.defer = true;
      s.onload = render;
      s.onerror = () => onErrorRef.current?.();
      document.head.appendChild(s);
    }
    return () => {
      if (widgetId.current && window.turnstile) window.turnstile.reset(widgetId.current);
    };
  }, [siteKey]);

  return <div ref={ref} />;
}

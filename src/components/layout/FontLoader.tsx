'use client';

import { useEffect } from 'react';

const FONT_CSS =
  'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css';
const LINK_ID = 'pretendard-css';
const LOADED_KEY = 'pretendard_loaded';

/**
 * Pretendard 글꼴을 첫 화면(사진, 글자)이 다 그려진 뒤에 불러온다.
 * 한글 글꼴 파일이 수백 KB라 처음부터 받으면 모바일에서 첫 화면 사진이 늦게 뜬다.
 * 그 전에는 기기 기본 글꼴로 보이고, 같은 탭에서 이미 한 번 받았으면 바로 불러온다.
 */
export default function FontLoader() {
  useEffect(() => {
    if (document.getElementById(LINK_ID)) return;
    function add() {
      if (document.getElementById(LINK_ID)) return;
      const link = document.createElement('link');
      link.id = LINK_ID;
      link.rel = 'stylesheet';
      link.href = FONT_CSS;
      link.crossOrigin = 'anonymous';
      link.onload = () => {
        try {
          window.sessionStorage.setItem(LOADED_KEY, '1');
        } catch {
          // sessionStorage를 쓸 수 없어도 글꼴은 그대로 적용된다.
        }
      };
      document.head.appendChild(link);
    }
    let cached = false;
    try {
      cached = window.sessionStorage.getItem(LOADED_KEY) === '1';
    } catch {
      cached = false;
    }
    if (cached || document.readyState === 'complete') {
      add();
      return;
    }
    window.addEventListener('load', add, { once: true });
    return () => window.removeEventListener('load', add);
  }, []);
  return null;
}

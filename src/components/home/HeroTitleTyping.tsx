'use client';

import { useState } from 'react';
import { TypeAnimation } from 'react-type-animation';

export default function HeroTitleTyping() {
  const [done, setDone] = useState(false);

  return (
    <>
      <style>{`.hero-typing-done span::after { display: none !important; content: none !important; }`}</style>
      <span className={done ? 'hero-typing-done' : undefined}>
        <TypeAnimation
          sequence={[
            '최고의 맛, 완벽한 서비스.',
            400,
            '최고의 맛, 완벽한 서비스.\n프리미엄 출장 바베큐.',
            () => setDone(true),
          ]}
          wrapper="span"
          speed={50}
          cursor
          style={{ whiteSpace: 'pre-line', display: 'inline-block' }}
        />
      </span>
    </>
  );
}

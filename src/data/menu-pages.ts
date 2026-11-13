import type { FaqItem } from '@/data/faq';
import { QUICK_QUOTE_MENUS } from '@/lib/quick-quote/constants';

/**
 * 메뉴별 검색용 상세 페이지(/menu/[slug]) 내용.
 * 가격과 기본 설명은 src/data/menu.ts의 MENU_ITEMS를 그대로 쓰고,
 * 여기에는 검색 제목, 소개 문단, 메뉴별 질문만 둔다.
 * 사실 확인된 내용만 적는다 (가격표, 메뉴 설명, 회사소개의 운영 방식).
 */
export type MenuPage = {
  slug: string;
  /** MENU_ITEMS의 id */
  menuId: string;
  /** 빠른 견적 폼에서 미리 선택할 메뉴 이름 */
  quoteMenu: (typeof QUICK_QUOTE_MENUS)[number];
  /** 페이지 제목(h1)과 브라우저 탭 제목 */
  heading: string;
  metaTitle: string;
  metaDescription: string;
  lead: string;
  intro: string[];
  points: { title: string; body: string }[];
  faq: FaqItem[];
};

export const MENU_PAGES: MenuPage[] = [
  {
    slug: 'tong-dwaeji',
    menuId: 'sig-tong-dwaeji',
    quoteMenu: '통돼지바베큐',
    heading: '통돼지바베큐 출장',
    metaTitle: '통돼지바베큐 출장 인원별 가격',
    metaDescription:
      '통돼지바베큐 출장 인원별 가격과 진행 방식 안내. 행사장에서 돼지를 통째로 구워 볼거리와 식사를 함께 준비합니다. 기업 워크숍, 체육대회, 야유회, 가족 잔치까지 전국 출장 상담.',
    lead: '돼지를 통째로 구워내는 모습부터 행사의 볼거리가 됩니다.',
    intro: [
      '한라산출장바베큐의 통돼지바베큐는 행사장에서 직접 굽는 출장 바베큐입니다. 현장에서 구워지는 과정을 함께 즐길 수 있어 여럿이 모인 자리에 잘 어울립니다.',
      '행사 인원과 식사 구성을 고려해 통삼겹살 바베큐와 함께 준비하는 구성도 상담해 드립니다.',
    ],
    points: [
      {
        title: '현장에서 통째로',
        body: '행사장에서 돼지를 통째로 구워, 굽는 과정까지 함께 즐기실 수 있습니다.',
      },
      { title: '대표가 직접', body: '대표가 직접 현장에 찾아가 세팅부터 조리, 정리까지 맡습니다.' },
      { title: '장비는 저희가', body: '그릴과 식기 등 조리에 필요한 장비를 싣고 갑니다.' },
    ],
    faq: [
      [
        '통돼지바베큐 가격은 어떻게 되나요?',
        '인원별 가격표를 이 페이지에 안내해 두었습니다. 장소와 구성에 따라 달라질 수 있어 정확한 금액은 견적으로 안내해 드립니다.',
      ],
      [
        '통삼겹살 바베큐와 함께 준비할 수 있나요?',
        '네, 행사 인원과 식사 구성을 고려해 통삼겹살 바베큐와 함께 준비하는 구성도 상담해 드립니다.',
      ],
    ],
  },
  {
    slug: 'tongsamgyeop',
    menuId: 'sig-tongsamgyeop',
    quoteMenu: '통삼겹살 바베큐',
    heading: '통삼겹살 바베큐 출장',
    metaTitle: '통삼겹살 바베큐 출장 인원별 가격 (수입산, 국내산)',
    metaDescription:
      '참숯 가마에서 2시간 이상 익혀 기름을 빼고 참나무 훈연 향을 입힌 통삼겹살 바베큐. 수입산과 국내산 인원별 가격, 진행 방식 안내. 동문회, 워크숍 등 전국 출장 상담.',
    lead: '참숯 가마에서 2시간 이상, 기름을 빼고 참나무 향을 입힙니다.',
    intro: [
      '두툼한 통삼겹살을 참숯 가마에서 2시간 이상 천천히 익혀 기름을 빼고, 참나무 훈연 향을 입힌 한라산출장바베큐의 대표 메뉴입니다.',
      '현장에서 먹기 좋은 두께로 직접 썰어 드리며, 동문회와 워크숍 등 여러 행사에서 선보여 왔습니다. 수입산과 국내산 중에서 고르실 수 있습니다.',
    ],
    points: [
      { title: '2시간 이상 훈연', body: '급하게 굽지 않고 참숯과 참나무로 천천히 익힙니다.' },
      { title: '현장에서 썰어 드림', body: '먹기 좋은 두께로 행사장에서 직접 썰어 드립니다.' },
      { title: '수입산과 국내산', body: '예산에 맞춰 수입산과 국내산 중에서 고르실 수 있습니다.' },
    ],
    faq: [
      [
        '수입산과 국내산은 어떻게 다른가요?',
        '같은 방식으로 조리하며 고기 원산지만 다릅니다. 두 가지 가격을 인원별 가격표에 함께 안내해 두었습니다.',
      ],
      [
        '얼마나 오래 굽나요?',
        '참숯 가마에서 2시간 이상 천천히 익혀 기름을 빼고 참나무 훈연 향을 입힙니다.',
      ],
    ],
  },
  {
    slug: 'haemul',
    menuId: 'sig-haemul-modum',
    quoteMenu: '해물바베큐',
    heading: '해물모듬 바베큐 출장',
    metaTitle: '해물모듬 바베큐 출장 인원별 가격 (전복, 새우, 통삼겹)',
    metaDescription:
      '전복과 새우에 통삼겹살을 더한 해물모듬 바베큐 출장. 참나무로 2시간 이상 훈연해 행사 현장에서 따뜻하게 준비합니다. 인원별 가격과 진행 방식 안내.',
    lead: '전복과 새우에 통삼겹살까지, 해산물과 고기를 함께 즐기는 바베큐입니다.',
    intro: [
      '신선한 전복과 새우에 두툼한 통삼겹살을 더한 해물모듬 바베큐입니다. 정성껏 손질한 재료를 참나무로 2시간 이상 천천히 훈연합니다.',
      '전복의 쫄깃함, 새우의 고소함, 통삼겹살의 촉촉한 육즙을 행사 현장에서 따뜻하게 준비해 드립니다.',
    ],
    points: [
      { title: '해산물과 고기를 함께', body: '전복, 새우, 통삼겹살을 한 번에 준비합니다.' },
      { title: '참나무 훈연', body: '참나무로 2시간 이상 천천히 훈연합니다.' },
      { title: '현장에서 따뜻하게', body: '행사장에서 바로 구워 따뜻하게 내어 드립니다.' },
    ],
    faq: [
      [
        '해물모듬 바베큐에는 무엇이 들어가나요?',
        '전복과 새우에 두툼한 통삼겹살을 더해 구성합니다. 세부 구성은 상담 때 안내해 드립니다.',
      ],
    ],
  },
];

export function getMenuPage(slug: string): MenuPage | undefined {
  return MENU_PAGES.find((p) => p.slug === slug);
}

export function getMenuPageByMenuId(menuId: string): MenuPage | undefined {
  return MENU_PAGES.find((p) => p.menuId === menuId);
}

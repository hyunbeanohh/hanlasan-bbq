export interface BanquetOption {
  id: string;
  label: string;
  detail: string | null;
  priceWon: number;
}

export const BANQUET_OPTIONS: BanquetOption[] = [
  { id: 'vegetables',   label: '채소',                                                   detail: '상추·고추·마늘·양파 (30~40명 기준)', priceWon: 40000  },
  { id: 'kimchi',       label: '김치',                                                   detail: null,                                  priceWon: 40000  },
  { id: 'meal-set',     label: '식사',                                                   detail: '콩나물 김칫국·오뎅탕, 반찬 3종',       priceWon: 6000   },
  { id: 'soup-bowls',   label: '육개장 · 동태탕',                                        detail: '밥·찬 별도',                           priceWon: 8000   },
  { id: 'party-platter', label: '모듬전·홍어무침·잡채·골뱅이(오징어)무침·과일',           detail: '30~40명 기준',                         priceWon: 120000 },
  { id: 'table-6p',     label: '6인 테이블',                                             detail: '테이블 보 포함',                       priceWon: 13000  },
  { id: 'chair',        label: '의자',                                                   detail: null,                                  priceWon: 1300   },
  { id: 'tent',         label: '천막',                                                   detail: null,                                  priceWon: 60000  },
  { id: 'draft-beer',   label: '생맥주',                                                 detail: '20,000cc · 잔 포함',                  priceWon: 160000 },
];

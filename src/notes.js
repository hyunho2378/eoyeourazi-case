/* 화면 위 주석 자료. x, y는 화면 그림 안의 위치(퍼센트).
   c: blue 눌러서 바뀌는 곳, yellow 읽는 정보, red 출처와 막힌 지점.
   화면 그림은 실제 서비스(jeongseon-arirang.vercel.app)를 모바일 폭으로 직접 열어 찍은 캡처다. */

const N = (c, tag, x, y, what, why, side) => ({ c, tag, x, y, what, why, side });

/* GUI 기능 구간: 주 화면 하나에 주석 두세 곳 + STEP 화면 나열 */
export const FEATURES = [
  {
    id: 'question', label: 'QUESTION', a: '물으면 열차와 공연과 장날을 맞춘', b: '하루 일정이 나오는 질문 창',
    lead: '날짜와 하고 싶은 일을 문장으로 입력. 되는 날로 맞춘 일정과 예매 링크까지 한 화면.',
    main: {
      src: 'live/chat-answer.jpg', alt: '질문에 대한 답 화면',
      notes: [
        N('yellow', '날짜 조정', 84, 48, '16일(금) 열차가 없어 가장 가까운 운행일 17일(토)로 짠 일정', '되는 날로 맞춰 먼저 제안'),
        N('blue', '예매 링크', 62, 74.1, '아리아라리 예매와 뗏꾼 예매', '공연 줄에서 예매 페이지로 바로 이동'),
        N('blue', '방문일', 44, 86.1, '방문일 칩을 누르면 달력 열림', '날짜를 바꿔 다시 물을 수 있음', 'r'),
      ],
    },
    steps: [
      { label: '질문', src: 'live/chat-home.jpg', alt: '질문 첫 화면' },
      { label: '답', src: 'live/chat-answer.jpg', alt: '답 화면' },
      { label: '날짜', src: 'live/chat-calendar.jpg', alt: '방문일 달력' },
      { label: '일정', src: 'live/chat-timeline.jpg', alt: '하루 일정' },
    ],
  },
  {
    id: 'place', label: 'PLACE', a: '지도 위 장소를 누르면', b: '이야기와 가사와 길이 한 장으로',
    lead: '사진과 네 탭과 스탬프와 길 안내를 장소 화면 하나에 담음.',
    main: {
      src: 'live/park-card.jpg', alt: '아라리공원 장소 화면',
      notes: [
        N('yellow', '장소 캐릭터', 36, 23, '노버가 아라리공원 이야기를 안내', '스탬프의 노래 칸과 같은 얼굴', 'r'),
        N('yellow', '이 장소의 아리랑', 6, 32.8, '그 장소를 부른 가사 두 줄', '노래와 장소를 한 화면에서'),
        N('yellow', '스탬프', 50, 62.3, '스탬프 2/4 표시. 받은 칸만 캐릭터가 켜짐', '대고 나면 바로 진행도 확인'),
      ],
    },
    steps: [
      { label: '장소 목록', src: 'live/map-list.jpg', alt: '아리랑 지도 목록' },
      { label: '3D 지도', src: 'live/place-map.jpg', alt: '3D 지도' },
      { label: '길 안내', src: 'live/place-route.jpg', alt: '길 안내' },
      { label: '장소 카드', src: 'live/place-card.jpg', alt: '장소 카드' },
      { label: '소리와 정보', src: 'live/place-sheet.jpg', alt: '장소 카드 아래 구간' },
    ],
  },
  {
    id: 'nfc', label: 'NFC', a: '스티커에 대면 열리는', b: '그 자리의 가사와 소리',
    lead: '앱 설치 없이 알림 한 번으로 장소 화면. 가사는 출처와 함께 표시.',
    main: {
      src: 'live/park-lyric.jpg', alt: '아라리공원 가사와 소리 화면',
      notes: [
        N('yellow', '가사', 6, 33.4, '정선 앞 조양강물은 소리없이 흐르고 님향한 충절은 변함이 없네', '아라리공원 앞 조양강을 부른 가사'),
        N('red', '가사 출처', 86, 39.7, '정선군 누리집 수록 가사와 부른 사람 정도진 표기', '가사의 출처를 인용 바로 아래에'),
        N('blue', '재생 바', 50, 52, '0:00 / 8:19', '곡 길이를 보고 재생'),
      ],
    },
    steps: [
      { label: '스티커에 대기', src: 'scr04.webp', alt: 'NFC 알림', ratio: 610 / 1326 },
      { label: '장소 화면 열림', src: 'live/park-card.jpg', alt: '장소 화면' },
      { label: '가사와 소리', src: 'live/park-lyric.jpg', alt: '가사와 소리' },
    ],
  },
  {
    id: 'pass', label: 'PASS', a: '스탬프 네 개로 남는', b: '패스와 완주 카드',
    lead: '다녀간 장소와 날짜가 쌓이고 룰렛 쿠폰과 완주 카드로 이어짐.',
    main: {
      src: 'live/pass.jpg', alt: '아리랑 패스 화면',
      notes: [
        N('yellow', '스탬프 다섯 칸', 13, 30.2, '기억 삶 노래 오늘 보너스', '받은 칸만 캐릭터가 켜지고 나머지는 잠금'),
        N('blue', '다음 장소', 80, 46, '아라리촌 도보 4분', '파란 띠 하나로 다음에 갈 곳 안내'),
        N('yellow', '쿠폰함', 80, 62.8, '룰렛으로 받은 쿠폰이 쌓이는 곳', '스탬프를 받은 뒤 돌린 결과를 한곳에'),
      ],
    },
    steps: [
      { label: '패스', src: 'live/pass.jpg', alt: '패스' },
      { label: '룰렛', src: 'ui-roulette.webp', alt: '룰렛', ratio: 702 / 1170 },
      { label: '완주 카드', src: 'ui-card.webp', alt: '완주 카드', ratio: 702 / 1170 },
    ],
  },
];

/* 문제 장: 흩어진 사이트 세 곳의 실제 화면 */
export const SITES = [
  {
    key: 'korail', src: 'site-korail.webp', alt: '코레일 열차운임과 시간표 화면',
    cap: '코레일 열차운임/시간표 화면(2026. 10. 30. 인터넷 아카이브 보관본)',
    notes: [N('red', '열차 시각', 32, 73, '시간표 파일을 내려받아야 보이는 열차 시각', '아리랑열차는 장날인 토요일과 일요일에만 다님')],
  },
  {
    key: 'jacf', src: 'site-jacf.webp', alt: '정선아리랑문화재단 공연안내 화면',
    cap: '정선아리랑문화재단 공연안내 화면(2026. 11. 22.)',
    notes: [N('red', '공연과 예매', 35.5, 72, '공연 날짜와 예매는 재단 누리집의 공연안내와 예매확인 메뉴', '장날 아리아라리와 토요일 뗏꾼 무대')],
  },
  {
    key: 'tour', src: 'site-tour.webp', alt: '정선군 관광 누리집 아라리촌 화면',
    cap: '정선군 관광 누리집 관광명소 아라리촌 화면(2026. 11. 22.)',
    notes: [
      N('red', '장소 안내', 24, 47.5, '장날과 박물관 휴관일은 관광 누리집 안내', '장소 소개는 여행정보 쪽'),
      N('red', '가사', 84.4, 12.5, '아우라지 가사는 정선아리랑 메뉴에 따로 실림', '장소와 가사가 다른 메뉴에 나뉨'),
    ],
  },
];

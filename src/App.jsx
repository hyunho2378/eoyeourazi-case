import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';
import { Annotated, Stage, shot } from './Annotated';
import { Hub } from './Hub';
import { KEY, SITES } from './notes';

gsap.registerPlugin(ScrollTrigger);

const SERVICE = 'https://jeongseon-arirang.vercel.app';
const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* 결론 한 줄 제목과 짧은 보조 구절 */
function Head({ title, lead }) {
  return (
    <div className="head">
      <h2 className="headline rv">{title}</h2>
      {lead && <p className="lead rv">{lead}</p>}
    </div>
  );
}

/* 실제 서비스를 휴대폰 틀에 띄운다. 화면에 들어올 때 불러오고 직접 눌러 쓸 수 있다. */
function LiveScreen({ path, poster, title }) {
  const box = useRef(null);
  const [on, setOn] = useState(false);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const el = box.current;
    const st = ScrollTrigger.create({
      trigger: el, start: 'top 95%', end: 'bottom 5%',
      onToggle: (self) => { if (self.isActive) setOn(true); },
    });
    const ro = new ResizeObserver(([e]) => setScale(e.contentRect.width / 390));
    ro.observe(el);
    return () => { st.kill(); ro.disconnect(); };
  }, []);
  return (
    <div className="phone live">
      <div className="phone-screen" ref={box} style={{ aspectRatio: '390 / 844' }}>
        <img src={shot(poster)} alt="" aria-hidden="true" />
        {on && <iframe key={path} src={SERVICE + path} title={title} style={{ transform: `scale(${scale})` }} loading="lazy" />}
      </div>
    </div>
  );
}

const LIVE = [
  { path: '/', poster: 'live/chat-home.jpg', name: '질문 창', what: '날짜와 하고 싶은 일 입력' },
  { path: '/map', poster: 'live/map-list.jpg', name: '아리랑 지도', what: '2D와 3D 전환과 장소 선택' },
  { path: '/n/park?preview=1', poster: 'live/park-card.jpg', name: '장소 화면', what: '가사와 소리 재생' },
  { path: '/n/pass', poster: 'live/pass.jpg', name: '아리랑 패스', what: '스탬프와 쿠폰 확인' },
  { path: '/guess', poster: 'live/quiz-q.jpg', name: '사진 퀴즈', what: '보기를 눌러 정답 확인' },
];

const STAGES = [
  ['비교', '아는 강원 여행지가 더 끌려 정선은 후보에서 빠짐', '인스타그램 장소 게시물과 댓글 DM 링크로 정선의 장소를 먼저 만남'],
  ['계획', '열차와 공연과 장날을 사이트 세 곳에서 따로 찾음', '날짜를 고르면 열차와 공연이 맞춰진 하루 일정'],
  ['도착', '도착해서 무엇을 할지 모름', '일정의 다음 장소 안내와 도보 시간'],
  ['관람', '가사 속 조양강을 그냥 지나침', 'NFC 스티커로 여는 그 자리의 가사와 소리'],
  ['귀가', '다녀가도 노래와 장소가 남지 않음', '패스에 남는 장소와 다음 공연'],
];

const FLOW = [
  ['질문', '열차와 공연과 장날을 묻는 첫 화면', 'live/chat-home.jpg'],
  ['하루 일정', '11:00 정선역 도착부터 17:52 출발까지', 'live/chat-timeline.jpg'],
  ['박물관 태그', '스티커에 대면 뜨는 NFC 알림', 'scr04.webp'],
  ['아라리공원 가사', '조양강을 부른 가사와 소리', 'live/park-lyric.jpg'],
  ['패스', '스탬프와 쿠폰과 완주 카드', 'live/pass.jpg'],
];

const HUB_LEFT = [
  { name: '2030 여행자', give: '질문과 방문 기록', get: '하루 일정과 질문 답을 무료로 이용. 패스에 남는 장소' },
  { name: '정선군 관광 부서', give: '시범 운영 계약', get: '장소별 숫자 보고와 질문 유형별 건수를 매달' },
  { name: '정선아리랑문화재단과 보존회', give: '공연 정보 공유와 가사 감수', get: '예매 페이지로 간 수' },
];
const HUB_RIGHT = [
  { name: '박물관과 공연장', give: '공연과 운영 정보', get: '방문객 연결과 예매 링크' },
  { name: '코레일', give: '열차 시간표 자료', get: '정선아리랑열차 객실과 정선역에 QR 게시 제안' },
  { name: '시장 상점', give: '장터 먹거리 할인 쿠폰은 상점 협의 뒤', get: '장소 화면의 시장 이야기와 룰렛' },
];

const PLACES = [
  ['아리랑박물관', '음성 도슨트', '큐레이터 목소리로 듣는 1896년 아리랑 녹음 이야기', 'ui-museum.webp'],
  ['아라리촌', '3D 지도 길 안내', '다음 노래 속 장소까지 걷는 길과 시간', 'ui-route.webp'],
  ['아라리공원', '가사와 소리', '조양강 앞에서 그 강을 부른 가사와 소리', 'ui-lyric.webp'],
  ['정선아리랑시장', '시장 쿠폰 룰렛', '완주하면 장터 먹거리 할인 쿠폰은 상점 협의 뒤', 'ui-roulette.webp'],
];

const PROPOSAL = [
  ['정선군에', ['정선읍 네 곳 석 달 시범 운영 계약', '시범 운영비 약 670만 원', 'NFC 스티커 20장과 거치대 4개 설치', '질문 유형별 건수를 매달 보고', '장소별 태그 수와 들른 장소 수 보고']],
  ['정선아리랑문화재단과 보존회에', ['공연 날짜와 예매 정보 공유', '가사 감수', '하루 일정 속 14시 공연 줄에서 재단 예매 페이지로 연결', '예매 페이지로 이동한 수 전달']],
  ['정선군과 재단에 함께', ['정선아리랑열차 객실과 정선역 QR 공동 게시']],
  ['공식 자료 연동', ['정선군 누리집과 정선아리랑문화재단 공연안내를 자료 목록으로 연결', '코레일 시간표와 박물관 자료도 같은 자료 목록으로 연결', '답은 자료 목록에서 규칙으로 찾아 출처와 함께 표시']],
  ['운영 주체와 비용', ['운영 인력 4명이 준비와 운영 12주와 보고까지 1인 156시간', '운영 인력 644만 원', '서버 월 27달러 5개월 19.9만 원', '스티커와 거치대 2.6만 원과 결과 보고서 무료']],
  ['시장 상점에', ['완주 쿠폰 룰렛은 상점 협의 뒤 연결']],
];

const PHASES = [
  ['석 달', '정선읍 네 곳 시범 운영. 태그 수와 예매 이동 수로 계속 여부 판단'],
  ['1년', '정선 연간 운영. 아우라지처럼 가사에 나오는 장소로 확대'],
  ['3년', '강원 시군 세 곳과 운영 계약'],
];

export default function App() {
  const root = useRef(null);
  const [live, setLive] = useState(0);
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    const ctx = gsap.context(() => {
      if (reduced()) return;
      /* 진입 연출: 아래 24px에서 떠오르며 밝아짐, 650ms, 강한 감속, 섹션 안 순번 지연 */
      gsap.utils.toArray('[data-sec]').forEach((sec) => {
        sec.querySelectorAll('.rv').forEach((item, idx) => {
          gsap.from(item, {
            autoAlpha: 0, y: 24, duration: 0.65, ease: 'power3.out', delay: Math.min(idx, 4) * 0.08,
            scrollTrigger: { trigger: item, start: 'top 88%' },
          });
        });
      });
    }, root);
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    return () => { ctx.revert(); window.removeEventListener('load', refresh); };
  }, []);

  return (
    <div className="page" ref={root}>
      <header className="top">
        <a href="#top" className="top-logo wordmark" aria-label="어여우라지 처음으로">어여우라지</a>
        <a className="top-link" href={SERVICE} target="_blank" rel="noreferrer">실제 서비스 열기 <ArrowUpRight size={16} strokeWidth={2} /></a>
      </header>

      <main id="top">
        {/* 1. 표지: 실제 앱 화면 + 한 줄 */}
        <section className="cover" data-sec>
          <div className="cover-text">
            <h1 className="cover-mark wordmark rv">어여우라지</h1>
            <p className="cover-line rv">정선아리랑 가사 속 정선을 실제 여행길로 옮기는 NFC 여행 안내 서비스</p>
            <p className="cover-sub rv">한림대학교 지역 길과 문학적 가치 캡스톤 디자인<br />팀 이어주민</p>
          </div>
          <div className="cover-symbol rv">
            <div className="phone">
              <div className="phone-screen" style={{ aspectRatio: '780 / 1688' }}>
                <img src={shot('live/chat-answer.jpg')} alt="어여우라지가 짠 하루 일정 답 화면" loading="eager" />
              </div>
            </div>
          </div>
        </section>

        {/* 2. 현장: 정선 현장 조사와 만난 사람들의 말 */}
        <section className="sec field" data-sec>
          <Head title={<>정선읍과 여량의 노래 속 장소를<br />직접 걸은 현장 조사</>} lead="2026. 10. 14.~15. 아리랑박물관 직원과 정선 DMO 인터뷰와 재단 서면 질의" />
          <div className="field-grid">
            <div className="field-photos rv">
              <figure className="fp-main">
                <img src={shot('field-museum-1.webp')} alt="아리랑박물관 정선아리랑 연표 전시 벽" loading="lazy" />
                <figcaption>아리랑박물관 정선아리랑 연표 전시 벽</figcaption>
              </figure>
              <div className="fp-pair">
                <figure>
                  <img src={shot('field-ararichon-3.webp')} alt="아라리촌 너와집과 단풍" loading="lazy" />
                  <figcaption>아라리촌</figcaption>
                </figure>
                <figure>
                  <img src={shot('field-market-1.webp')} alt="정선아리랑시장 장날 풍경" loading="lazy" />
                  <figcaption>정선아리랑시장</figcaption>
                </figure>
              </div>
            </div>
            <div className="field-voices">
              <div className="voice rv">
                <p className="v-quote">“보통은 마지막 코스로 오시고요.”</p>
                <p className="v-who">아리랑박물관 직원</p>
                <p className="v-note">박물관은 정선 하루의 끝에 들르는 곳</p>
              </div>
              <div className="voice rv">
                <p className="v-quote">“그 통계는 가지고 있는 거는 없고”</p>
                <p className="v-who">정선 DMO</p>
                <p className="v-note">장소별 방문 통계 없음</p>
              </div>
              <div className="voice rv">
                <p className="v-quote">구체적인 통계는 별도 조사 필요</p>
                <p className="v-who">정선아리랑문화재단 서면 답변 요지</p>
                <p className="v-note">방문을 세는 일은 별도 조사 대상</p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. 문제: 설문 문장 + 흩어진 사이트 세 곳 */}
        <section className="sec problem alt" data-sec>
          <Head title={<>이름은 아는 노래<br />후보에서 빠지는 정선</>} />
          <ul className="facts rv">
            <li>40명 중 39명이 정선아리랑의 이름이나 가락을 알지만 나와 가깝다는 점수는 5점 중 1.98점</li>
            <li>정선 미방문 30명 중 28명이 정선을 여행지로 잘 모름</li>
            <li>정선을 다녀간 10명 중 5명은 아리랑을 접하지 못함</li>
            <li className="src">출처: 이어주민 20대 설문 40명(2026. 10.)</li>
          </ul>
          <p className="sub-h rv">열차와 공연과 장날이 사이트 세 곳에 나뉨</p>
          <div className="sites">
            {SITES.map((s) => (
              <figure className="site rv" key={s.key}>
                <Annotated src={s.src} alt={s.alt} notes={s.notes} ratio={1.6} frame="plain" stack />
                <figcaption>{s.cap}</figcaption>
              </figure>
            ))}
          </div>
          <p className="facts src rv sites-src">재단과 박물관과 축제와 아리랑마을 네 사이트에서 서로 다른 정보 19유형 확인. 출처: 이어주민 재단 웹사이트 불일치 분석(2026. 10. 13.)</p>
        </section>

        {/* 4. 문제 정의 */}
        <section className="sec define" data-sec>
          <Head title={<>정선이 어떤 곳이고 오늘 무엇을 할 수 있는지<br />한 번에 보여야 하는 2030</>} />
          <p className="pov rv">정선만의 경험을 찾지만 찾아볼 시간이 아까운 2030에게 필요한 화면. 그런데 아리랑은 장소와 끊기고 열차와 공연과 장날은 흩어짐. 그래서 정선을 후보에서 빼거나 와서도 아리랑을 지나치는 상태.</p>
          <div className="pairs">
            <div className="pair-head rv"><span>막힌 곳</span><span /><span>어여우라지의 해결</span></div>
            <div className="pair rv">
              <div><b>무엇이 언제 열리는지 모름</b><p>열차와 공연과 장날이 세 곳에 나뉨. 오늘 정선에서 무엇을 할지 한 번에 알 수 없음</p></div>
              <i className="pair-line" aria-hidden="true" />
              <div><b>물으면 나오는 하루</b><p>열차와 공연과 장날을 맞춘 일정</p></div>
            </div>
            <div className="pair rv">
              <div><b>지나치는 아리랑</b><p>가사는 누리집에 있고 노래 속 장소는 관광지 메뉴에 따로 있음. 와서도 아리랑을 만나지 못함</p></div>
              <i className="pair-line" aria-hidden="true" />
              <div><b>노래 속 장소 NFC</b><p>그 자리에서 여는 가사와 소리</p></div>
            </div>
          </div>
        </section>

        {/* 5. 퍼소나 */}
        <section className="sec persona alt" data-sec>
          <Head title={<>정선을 후보에서 지우는<br />2030 지은</>} />
          <div className="ps rv">
            <div className="ps-who">
              <ul className="ps-list">
                <li>22세 강원 소재 대학 재학</li>
                <li>차 없이 열차와 버스로 이동</li>
                <li>정선 방문 경험 없음</li>
                <li>당일 5~6시간 열차 시간에 맞춰 여행</li>
              </ul>
              <blockquote className="ps-quote">“지역에 뭐가 있는지 잘 모르겠다”</blockquote>
              <p className="ps-cap">설문 응답을 바탕으로 만든 가상 인물</p>
            </div>
            <div className="ps-col">
              <p className="ps-label">불편</p>
              <ul className="ps-list">
                <li>정선에 무엇이 있는지 모름(미방문 30명 중 14명)</li>
                <li>무엇이 언제 열리는지 모름</li>
                <li>정선아리랑을 만날 곳을 모름</li>
              </ul>
            </div>
            <div className="ps-col">
              <p className="ps-label">필요</p>
              <ul className="ps-list">
                <li>물으면 나오는 하루</li>
                <li>차 없이 정선역에서 걸어서 닿는 장소</li>
                <li>가사가 나온 그 자리에서 듣는 아리랑</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 6. 사용자 여정 */}
        <section className="sec journey-sec" data-sec>
          <Head title={<>지은의 하루<br />지금과 어여우라지가 있을 때</>} />
          <div className="jt rv">
            <p className="jt-rowlabel jt-r1">지금의 지은</p>
            <p className="jt-rowlabel jt-r2">어여우라지와 함께</p>
            {STAGES.map(([name, now, next], i) => [
              <p className="jt-stage" key={name + 's'} style={{ gridColumn: i + 2 }}>{name}</p>,
              <p className="jt-now" key={name + 'n'} style={{ gridColumn: i + 2 }}><b>지금</b>{now}</p>,
              <p className="jt-next" key={name + 'x'} style={{ gridColumn: i + 2 }}><b>어여우라지</b>{next}</p>,
            ])}
          </div>
        </section>

        {/* 7. 서비스 콘셉트 */}
        <section className="sec concept alt" data-sec>
          <Head title={<>질문에서 패스까지<br />노래 속 장소를 잇는 다섯 접점</>} lead="인스타그램 장소 게시물과 댓글 DM 그리고 정선아리랑열차 객실과 정선역 QR에서 시작" />
          <ol className="flow rv">
            {FLOW.map(([name, what, img], i) => (
              <li key={name}>
                <p className="fl-step">{i + 1}</p>
                <div className="phone">
                  <div className="phone-screen" style={{ aspectRatio: '780 / 1688' }}>
                    <img src={shot(img)} alt={`${name} 화면`} loading="lazy" />
                  </div>
                </div>
                <p className="fl-name">{name}</p>
                <p className="fl-what">{what}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* 8. 이해관계자 구조 */}
        <section className="sec stake" data-sec>
          <Head title={<>서비스를 둘러싼 이해관계자와<br />주고받는 내용</>} />
          <div className="rv">
            <Hub center={{ title: '어여우라지', sub: '질문 창과 NFC 장소 화면과 패스' }} left={HUB_LEFT} right={HUB_RIGHT} />
          </div>
        </section>

        {/* 9. 핵심 화면 */}
        <section className="sec feat alt" data-sec>
          <Head title={<>핵심 다섯 화면과<br />눌렀을 때 바뀌는 내용</>} />
          <div className="rv"><Stage steps={KEY} /></div>
        </section>

        {/* 10. 직접 눌러 보기 */}
        <section className="sec tryit" data-sec>
          <Head title={<>실제 서비스를<br />이 자리에서 직접 사용</>} />
          <div className="try rv">
            <ul className="try-list" role="tablist">
              {LIVE.map((l, i) => (
                <li key={l.path}>
                  <button role="tab" aria-selected={i === live} className={i === live ? 'on' : ''} onClick={() => setLive(i)}>
                    <b>{l.name}</b><span>{l.what}</span>
                  </button>
                </li>
              ))}
              <li className="try-out">
                <a className="try-link" href={SERVICE + LIVE[live].path} target="_blank" rel="noreferrer">새 창에서 열기 <ArrowUpRight size={16} strokeWidth={2} /></a>
              </li>
            </ul>
            <LiveScreen path={LIVE[live].path} poster={LIVE[live].poster} title={`어여우라지 ${LIVE[live].name} 실제 화면`} />
          </div>
        </section>

        {/* 11. 정책 제안 */}
        <section className="sec policy alt" data-sec>
          <Head title={<>정선군과 재단에 하는<br />시범 운영 제안</>} lead="스티커가 놓이는 정선읍 네 곳과 그 자리에서 열리는 화면" />
          <div className="places rv">
            {PLACES.map(([place, feature, what, img]) => (
              <figure key={place}>
                <p className="pl-name">{place}</p>
                <img src={shot(img)} alt={`${place} ${feature} 화면`} loading="lazy" />
                <figcaption><b>{feature}</b><span>{what}</span></figcaption>
              </figure>
            ))}
          </div>
          <dl className="prop rv">
            {PROPOSAL.map(([who, items]) => (
              <div className="prop-row" key={who}>
                <dt><span className="ann-tag">{who}</span></dt>
                <dd>{items.map((t) => <p key={t}>{t}</p>)}</dd>
              </div>
            ))}
          </dl>
          <ol className="phases rv">
            {PHASES.map(([term, what]) => (
              <li key={term}><b>{term}</b><span>{what}</span></li>
            ))}
          </ol>
        </section>

        {/* 12. 크레딧 */}
        <section className="sec credit" data-sec>
          <h2 className="closing-line rv">노래 속 장소에서<br />정선아리랑을 만나는 2030</h2>
          <div className="cr-list">
            <div className="cr-item rv"><p className="cr-role">서비스</p><p>어여우라지</p><p>NFC 여행 안내 서비스 디자인</p></div>
            <div className="cr-item rv"><p className="cr-role">과목</p><p>한림대학교</p><p>지역 길과 문학적 가치 캡스톤 디자인</p></div>
            <div className="cr-item rv"><p className="cr-role">조사</p><p>20대 설문 40명 2026년 10월</p><p>아리랑박물관 직원 2명과 정선 DMO</p><p>정선아리랑문화재단 서면 답변</p></div>
            <div className="cr-item rv"><p className="cr-role">자료</p><p>가사: 정선군 누리집 수록 긴 아리랑(남자)</p><p>사진: 정선 현장 촬영(2026. 10. 14.~15.)</p><p>로고 글꼴: 정선군 정선아리랑체</p></div>
            <div className="cr-item rv"><p className="cr-role">실제 서비스</p><p><a href={SERVICE} target="_blank" rel="noreferrer">어여우라지 열기 <ArrowUpRight size={15} strokeWidth={2} /></a></p></div>
          </div>
        </section>
      </main>
    </div>
  );
}

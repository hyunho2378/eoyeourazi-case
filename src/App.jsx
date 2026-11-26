import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';
import { Annotated, Stage, shot } from './Annotated';
import { CHAT, MAP, PLACE, NFC, PASS, QUIZ, SITES } from './notes';

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
  { path: '/map', poster: 'live/map-list.jpg', name: '아리랑 지도', what: '2D와 3D 전환, 장소 선택' },
  { path: '/n/park?preview=1', poster: 'live/park-card.jpg', name: '장소 화면', what: '가사와 소리 재생' },
  { path: '/n/pass', poster: 'live/pass.jpg', name: '아리랑 패스', what: '스탬프와 쿠폰 확인' },
  { path: '/guess', poster: 'live/quiz-q.jpg', name: '사진 퀴즈', what: '보기를 눌러 정답 확인' },
];

const JOURNEY = [
  ['11:00', '정선역 도착', '질문으로 받은 하루 일정 열기'],
  ['13:07', '아리랑박물관', '1896년 원통음반 속 아리랑'],
  ['14:00', '아리랑센터 공연', '아리아라리 또는 뗏꾼, 75분'],
  ['16:09', '아라리공원', '조양강변 쉼터'],
  ['17:52', '정선역 출발', '완주 카드가 패스에 남음'],
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
            <p className="cover-sub rv">한림대학교 지역 길과 문학적 가치 캡스톤 디자인</p>
          </div>
          <div className="cover-symbol rv">
            <div className="phone">
              <div className="phone-screen" style={{ aspectRatio: '780 / 1688' }}>
                <img src={shot('live/chat-answer.jpg')} alt="어여우라지가 짠 하루 일정 답 화면" loading="eager" />
              </div>
            </div>
          </div>
        </section>

        {/* 2. 문제: 설문 문장 + 흩어진 사이트 세 곳 */}
        <section className="sec problem" data-sec>
          <Head title={<>장소와 끊긴 아리랑,<br />세 곳에 흩어진 하루 정보</>} />
          <ul className="facts rv">
            <li>정선에 가 본 적 없는 30명 중 28명이 정선을 여행지로 잘 모름</li>
            <li>다녀온 10명 중 5명은 정선에서 아리랑을 접하지 못함</li>
            <li className="src">출처: 20대 설문 40명(2026. 10.)</li>
          </ul>
          <div className="sites">
            {SITES.map((s) => (
              <figure className="site rv" key={s.key}>
                <Annotated src={s.src} alt={s.alt} notes={s.notes} ratio={1.6} frame="plain" />
                <figcaption>{s.cap}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* 3. 퍼소나와 하루 */}
        <section className="sec persona alt" data-sec>
          <Head title={<>정선을 후보에서 지우는<br />2030, 지은</>} />
          <div className="ps rv">
            <ul className="ps-list">
              <li>22세, 강원 소재 대학 재학</li>
              <li>차 없이 열차 시간에 맞춰 당일 5~6시간 여행</li>
              <li>흩어진 정보를 하나씩 찾을 시간이 아까워 아는 강원 여행지로 이동</li>
            </ul>
            <blockquote className="ps-quote">“지역에 뭐가 있는지 잘 모르겠다”</blockquote>
          </div>
          <p className="ps-cap rv">설문 응답을 바탕으로 만든 가상 인물</p>
          <div className="journey rv">
            <p className="journey-h">어여우라지가 짠 10월 17일 토요일</p>
            <ol className="journey-row">
              {JOURNEY.map(([t, place, what]) => (
                <li key={t}><b>{t}</b><span>{place}</span><em>{what}</em></li>
              ))}
            </ol>
          </div>
        </section>

        {/* 4. 질문하면 하루 일정 */}
        <section className="sec feat" data-sec>
          <Head title={<>질문 하나로 맞춰지는<br />열차와 공연, 장날의 하루</>} lead="질문, 답, 날짜, 일정 네 화면" />
          <div className="rv"><Stage steps={CHAT} /></div>
        </section>

        {/* 5. 아리랑 지도 */}
        <section className="sec feat alt" data-sec>
          <Head title={<>하루 일정이 그대로 올라가는<br />아리랑 지도</>} lead="목록, 3D 지도, 길 안내 세 화면" />
          <div className="rv"><Stage steps={MAP} /></div>
        </section>

        {/* 6. 장소 카드 */}
        <section className="sec feat" data-sec>
          <Head title={<>이야기와 가사, 정보를<br />한 장에 담은 장소 카드</>} lead="사진, 네 탭, 소리, 다음 코스" />
          <div className="rv"><Stage steps={PLACE} /></div>
        </section>

        {/* 7. NFC 스티커 */}
        <section className="sec feat alt" data-sec>
          <Head title={<>스티커에 대면 열리는<br />그 자리의 가사와 소리</>} lead="아리랑박물관과 아라리공원 거치대의 스티커" />
          <div className="rv"><Stage steps={NFC} /></div>
          <div className="ev">
            <p className="ev-h rv">스티커가 놓이는 노래 속 장소 네 곳</p>
            <div className="ev-grid">
              <figure className="ev-item rv">
                <img src={shot('field-museum-1.webp')} alt="아리랑박물관 정선아리랑 연표 전시 벽" loading="lazy" />
                <figcaption><span>아리랑박물관</span><em>음성 도슨트와 1896년 녹음 이야기</em></figcaption>
              </figure>
              <figure className="ev-item rv">
                <img src={shot('field-ararichon-3.webp')} alt="아라리촌 너와집과 단풍" loading="lazy" />
                <figcaption><span>아라리촌</span><em>다음 장소까지 지도 위 길</em></figcaption>
              </figure>
              <figure className="ev-item rv">
                <img src={shot('aerial.webp')} alt="아우라지 돌다리와 강" loading="lazy" />
                <figcaption><span>아우라지</span><em>뱃사공 가사 속 나루 이야기</em></figcaption>
              </figure>
              <figure className="ev-item rv">
                <img src={shot('field-market-1.webp')} alt="정선아리랑시장 장날 풍경" loading="lazy" />
                <figcaption><span>정선아리랑시장</span><em>네 곳을 돈 뒤 장터 먹거리 할인 쿠폰</em></figcaption>
              </figure>
            </div>
            <p className="ev-cap rv">정선 현장 촬영(2026. 10. 14~15.)</p>
          </div>
        </section>

        {/* 8. 패스와 완주 카드 */}
        <section className="sec feat" data-sec>
          <Head title={<>스탬프 네 개로 남는<br />완주 카드와 룰렛 쿠폰</>} lead="패스, 룰렛, 완주 카드 세 화면" />
          <div className="rv"><Stage steps={PASS} /></div>
        </section>

        {/* 9. 사진 퀴즈 */}
        <section className="sec feat alt" data-sec>
          <Head title={<>정선의 첫인상을 묻는<br />사진 퀴즈</>} lead="문제와 정답 두 화면" />
          <div className="rv"><Stage steps={QUIZ} /></div>
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

        {/* 11. 크레딧 */}
        <section className="sec credit" data-sec>
          <h2 className="closing-line rv">노래 속 장소에서<br />정선아리랑을 만나는 2030</h2>
          <div className="cr-list">
            <div className="cr-item rv"><p className="cr-role">서비스</p><p>어여우라지</p><p>NFC 여행 안내 서비스 디자인</p></div>
            <div className="cr-item rv"><p className="cr-role">과목</p><p>한림대학교</p><p>지역 길과 문학적 가치 캡스톤 디자인</p></div>
            <div className="cr-item rv"><p className="cr-role">조사</p><p>20대 설문 40명, 2026년 10월</p><p>아리랑박물관 직원 2명, 정선 DMO</p><p>정선아리랑문화재단 서면 답변</p></div>
            <div className="cr-item rv"><p className="cr-role">자료</p><p>가사: 정선군 누리집 수록 긴 아리랑(남자)</p><p>사진: 정선 현장 촬영</p><p>로고 글꼴: 정선군 정선아리랑체</p></div>
            <div className="cr-item rv"><p className="cr-role">실제 서비스</p><p><a href={SERVICE} target="_blank" rel="noreferrer">어여우라지 열기 <ArrowUpRight size={15} strokeWidth={2} /></a></p></div>
          </div>
        </section>
      </main>
    </div>
  );
}

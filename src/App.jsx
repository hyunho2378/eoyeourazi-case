import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DemoPhone, ChatDemo, NfcDemo, RouteDemo, PassDemo } from './Demos';

gsap.registerPlugin(ScrollTrigger);

const SERVICE = 'https://jeongseon-arirang.vercel.app';
const BASE = import.meta.env.BASE_URL;
const img = (n) => `${BASE}img/${n}.webp`;

/* 실제 서비스를 휴대폰 틀 안에 넣는다.
   원본 EQL의 영상 재생 제어(start top 95%, end bottom 5%)와 같은 범위에서 처음 들어올 때 불러온다. */
function LiveScreen({ path, poster, title, className = '' }) {
  const box = useRef(null);
  const [on, setOn] = useState(false);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const el = box.current;
    const st = ScrollTrigger.create({
      trigger: el,
      start: () => 'top 95%',
      end: () => 'bottom 5%',
      onToggle: (self) => { if (self.isActive) setOn(true); },
    });
    const ro = new ResizeObserver(([e]) => setScale(e.contentRect.width / 390));
    ro.observe(el);
    return () => { st.kill(); ro.disconnect(); };
  }, []);
  return (
    <div className={`phone live ${className}`}>
      <div className="phone-screen" ref={box}>
        <img src={poster} alt="" aria-hidden="true" />
        {on && (
          <iframe
            src={SERVICE + path}
            title={title}
            style={{ transform: `scale(${scale})` }}
            loading="lazy"
          />
        )}
      </div>
    </div>
  );
}

function Shot({ src, alt, className = '' }) {
  return (
    <div className={`phone ${className}`}>
      <div className="phone-screen">
        <img src={src} alt={alt} loading="lazy" />
      </div>
    </div>
  );
}

/* EQL Swiper 값: 8장 보기, 간격 5px, 장당 3000ms, 선형, 손으로 끌 수 없음 */
const STRIP = [
  ['field-museum-1', '아리랑박물관'],
  ['field-ararichon-2', '아라리촌'],
  ['field-museum-3', '아리랑박물관'],
  ['field-market-2', '정선아리랑시장'],
  ['field-ararichon-1', '아라리촌'],
  ['field-museum-4', '아리랑박물관'],
  ['ararichon', '아라리촌'],
  ['field-museum-2', '아리랑박물관'],
  ['field-ararichon-4', '아라리촌'],
  ['field-museum-5', '아리랑박물관'],
  ['field-ararichon-5', '아라리촌'],
  ['field-market-1', '정선아리랑시장'],
];
function Strip() {
  const list = [...STRIP, ...STRIP];
  return (
    <div className="strip" style={{ '--n': STRIP.length }}>
      <div className="strip-track">
        {list.map(([n, label], i) => (
          <figure className="strip-slide" key={i} aria-hidden={i >= STRIP.length}>
            <img src={img(n)} alt={i < STRIP.length ? `${label} 현장 사진` : ''} loading="lazy" />
            <figcaption>{label}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const root = useRef(null);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = gsap.context(() => {
      if (reduce) return;
      /* EQL 원문: gsap.from(item, 1.5, { y: 50, delay: idx * 0.2, opacity: 0, start: 'top bottom', end: 'top center' })
         지연 순번은 섹션 안에서 매긴다. 멈춘 화면도 읽히도록 opacity는 빼고 y 이동만 옮긴다. */
      gsap.utils.toArray('[data-sec]').forEach((sec) => {
        sec.querySelectorAll('.rv').forEach((item, idx) => {
          gsap.from(item, {
            duration: 1.5,
            y: 50,
            delay: idx * 0.2,
            scrollTrigger: { trigger: item, start: 'top bottom', end: 'top center' },
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
        <a href="#top" className="top-logo" aria-label="어여우라지 처음으로">
          <span className="top-mark">어여우라지</span>
        </a>
        <a className="top-link" href={SERVICE} target="_blank" rel="noreferrer">실제 서비스 열기</a>
      </header>

      <main id="top">
        {/* 1. intro */}
        <section className="intro" data-sec>
          <div className="intro-main">
            <p className="intro-side">
              <span>정선아리랑 NFC 여행 안내</span>
              <span>서비스 디자인, 2026</span>
            </p>
            <h1 className="wordmark rv">어여우라지</h1>
          </div>
          <div className="intro-media rv">
            <img src={img('aerial')} alt="정선 아우라지 항공 사진, 물길 위로 놓인 돌다리" />
          </div>
        </section>

        {/* 2. overview */}
        <section className="overview" data-sec>
          <div className="ov-top">
            <div className="ov-text">
              <h2 className="t-bold rv">가사 속 장소가 <br />하루 여행이 됩니다.</h2>
              <div className="t-body rv">
                <p>어여우라지는 정선에 처음 가는 2030을 위한 여행 안내 서비스입니다. 질문 한 번이면 열차와 공연에 맞춘 하루가 나옵니다. 노래 속 장소에서는 스티커에 휴대폰을 대면 그 자리의 가사가 열립니다.</p>
                <p>정선아리랑은 1971년 강원도 무형문화재 제1호로 지정되었습니다. 2012년에는 전국의 아리랑과 함께 유네스코 인류무형문화유산에 올랐습니다. 그런데 2030에게는 이름으로만 남았습니다.</p>
              </div>
            </div>
            <div className="ov-small rv"><img src={img('museum-wall')} alt="아리랑박물관 음반 전시 벽" loading="lazy" /></div>
          </div>
          <div className="ov-big rv"><img src={img('three-screens')} alt="질문 첫 화면과 사진이 붙은 답, 하루 일정 화면을 띄운 휴대폰 세 대" loading="lazy" /></div>
        </section>

        {/* 3. research (EQL interview) */}
        <section className="research" data-sec>
          <div className="rs-left">
            <h2 className="t-bold rv">20대 40명에게 묻고 <br />정선 현장을 찾았습니다.</h2>
            <div className="t-body rv">
              <p>설문에 답한 20대는 40명입니다. 조사는 2026년 10월에 했습니다. 그중 30명은 정선에 가 본 적이 없고 10명은 다녀왔습니다. 아리랑박물관 직원 2명과 정선 DMO는 현장에서 만났고 정선아리랑문화재단은 서면으로 답했습니다.</p>
            </div>
            <div className="rs-photos rv">
              <img className="rs-p1" src={img('field-museum-2')} alt="아리랑박물관 전시실" loading="lazy" />
              <img className="rs-p2" src={img('field-museum-4')} alt="아리랑박물관 음반 진열장" loading="lazy" />
            </div>
          </div>
          <ol className="rs-list">
            <li className="rv">
              <span className="num">01</span>
              <strong className="big-word">노래 이름 인지도</strong>
              <p>응답자 40명 가운데 39명이 이름이나 가락을 압니다. 나와 가깝다는 점수는 5점 만점에 1.98점입니다. 떠오르는 단어가 없다는 답도 16명입니다.</p>
            </li>
            <li className="rv">
              <span className="num">02</span>
              <strong className="big-word">정선 여행지 인지도</strong>
              <p>정선에 가 보지 않은 30명 가운데 28명은 정선을 여행지로 잘 모릅니다. 강원에 사는 응답자는 21명입니다. 정선에 무엇이 있는지 모른다는 답이 14명입니다.</p>
            </li>
            <li className="rv">
              <span className="num">03</span>
              <strong className="big-word">방문 중 아리랑 접촉</strong>
              <p>정선에 다녀온 10명 중 5명은 아리랑을 접하지 못했습니다. 아리랑박물관 직원은 “보통은 마지막 코스로 오시고요.”라고 말했습니다.</p>
            </li>
            <li className="rv">
              <span className="num">04</span>
              <strong className="big-word">지역 특색 경험 수요</strong>
              <p>응답자는 “제 지역에서는 해볼 수 없는 특색 있는 경험”을 원하면서도 “지역에 뭐가 있는지 잘 모르겠다”고 답했습니다.</p>
            </li>
          </ol>
        </section>

        {/* 4. banner: 따로 있는 가사와 장소 */}
        <section className="banner" data-sec>
          <div className="bn-content">
            <h2 className="t-bold rv">가사와 장소 안내가 <br />따로 있습니다.</h2>
            <blockquote className="lyric rv">
              <p>정선 앞 조양강물은 <br />소리없이 흐르고 <br />님향한 충절은 <br />변함이 없네</p>
              <cite>정선군 누리집 수록 긴 아리랑(남자)</cite>
            </blockquote>
            <div className="t-body rv">
              <p>정선군 누리집에서 가사는 정선아리랑 메뉴에, 아우라지와 조양강 소개는 관광지 메뉴에 실려 있습니다.</p>
            </div>
          </div>
          <div className="bn-img rv"><img src={img('field-museum-3')} alt="아리랑박물관 음반 전시" loading="lazy" /></div>
        </section>

        {/* 5. principle: 세 사이트에 나뉜 하루 */}
        <section className="principle" data-sec>
          <div className="pr-wrap">
            <div className="pr-head">
              <h2 className="t-bold rv">열차와 공연 정보가 <br />사이트 세 곳에 흩어져 있습니다.</h2>
              <div className="t-body rv">
                <p>정선에 다녀온 20대가 열차에 타지 않은 이유는 21건입니다. 그중 6건은 도착 뒤 할 일을 몰랐다는 답입니다.</p>
              </div>
            </div>
            <div className="pr-head-img rv">
              <img src={img('field-market-1')} alt="정선아리랑시장 장날 거리" loading="lazy" />
            </div>
            <div className="pr-sites">
              <figure className="pr-site-row rv">
                <div className="pr-shot"><img src={img('site-korail')} alt="코레일 열차운임과 시간표 화면, 시간표 파일 목록" loading="lazy" /></div>
                <figcaption>
                  <strong>코레일</strong>
                  <p>아리랑열차가 서는 날과 시각을 따로 찾아야 합니다. 열차는 토요일과 일요일, 장날에만 다니고 정선역에 11시에 닿습니다.</p>
                  <span>코레일 열차운임/시간표 화면(2026. 10. 30. 인터넷 아카이브 보관본)</span>
                </figcaption>
              </figure>
              <figure className="pr-site-row rv">
                <div className="pr-shot"><img src={img('site-jacf')} alt="정선아리랑문화재단 공연안내 화면" loading="lazy" /></div>
                <figcaption>
                  <strong>정선아리랑문화재단</strong>
                  <p>공연 날짜와 예매는 재단 누리집에 있습니다. 장날에는 아리아라리, 토요일에는 뗏꾼이 무대에 오릅니다.</p>
                  <span>정선아리랑문화재단 공연안내 화면(2026. 11. 22.)</span>
                </figcaption>
              </figure>
              <figure className="pr-site-row rv">
                <div className="pr-shot"><img src={img('site-tour')} alt="정선군 관광 누리집 아라리촌 관광명소 화면, 휴무일 정보" loading="lazy" /></div>
                <figcaption>
                  <strong>정선군 관광 누리집</strong>
                  <p>장날과 박물관 휴관일, 장소마다 휴무일은 관광 누리집에 있고 아우라지 가사는 다른 메뉴에 실려 있습니다.</p>
                  <span>정선군 관광 누리집 관광명소 아라리촌 화면(2026. 11. 22.)</span>
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* 6. banner2: 퍼소나 지은 */}
        <section className="persona" data-sec>
          <div className="ps-left rv">
            <img src={img('field-ararichon-1')} alt="아라리촌 숲길과 너와집" loading="lazy" />
          </div>
          <div className="ps-right">
            <h2 className="t-bold rv">지은 씨는 정선에 <br />가 본 적이 없습니다.</h2>
            <div className="t-body rv">
              <p>지은은 강원에 있는 대학에 다니는 22세 학생입니다. 차가 없어 열차와 버스로 다니고 열차 시간에 맞춰 당일 5~6시간을 여행합니다.</p>
              <p>제 지역에 없는 경험에 끌리지만 흩어진 정보를 하나씩 찾아볼 시간이 아깝습니다. 그래서 아는 강원 여행지로 갑니다. 정선아리랑은 이름만 알고 어디서 만나는지는 모릅니다.</p>
            </div>
            <blockquote className="ps-quote rv">“지역에 뭐가 있는지 잘 모르겠다”</blockquote>
            <p className="ps-cap rv">설문 응답을 바탕으로 만든 가상 인물</p>
          </div>
        </section>

        {/* 7. proposal: 세 장면의 변화 */}
        <section className="proposal" data-sec>
          <div className="pp-wrap">
            <img className="pp-bg" src={img('field-ararichon-4')} alt="" aria-hidden="true" loading="lazy" />
            <div className="pp-shade" />
            <div className="pp-text">
              <h2 className="t-bold rv">정선 여행 세 단계가 <br />달라집니다.</h2>
              <div className="t-body rv">
                <p>지은 씨가 정선에 가기로 정하고 다녀오기까지 <br />세 단계에서 쓰는 화면이 이어집니다.</p>
              </div>
              <ul>
                <li className="rv">
                  <strong>계획</strong>
                  <p>사이트 세 곳에서 찾던 정보가 <br />질문 한 번으로 나옵니다.</p>
                </li>
                <li className="rv">
                  <strong>현장</strong>
                  <p>조양강 앞 스티커에 휴대폰을 대면 <br />그 강의 가사가 열립니다.</p>
                </li>
                <li className="rv">
                  <strong>기록</strong>
                  <p>들른 장소 네 곳이 <br />이야기 조각으로 패스에 남습니다.</p>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 8. device */}
        <section className="device" data-sec>
          <p className="device-txt rv">
            지은 씨의 하루는 인스타그램 게시물 링크에서 시작합니다.
            날짜를 고르면 열차와 공연이 맞춰진 하루가 나옵니다.
            노래 속 장소에서는 스티커로 가사가 열리고 패스에 스탬프가 남습니다.
          </p>
          <div className="device-img rv"><img src={img('pair')} alt="질문 첫 화면과 아라리공원 장소 화면을 띄운 휴대폰 두 대" loading="lazy" /></div>
        </section>

        {/* 9. A zone: 물으면 나오는 하루 */}
        <section className="zone a-zone" data-sec>
          <div className="zone-wrap">
            <div className="zone-head">
              <div className="zone-head-img rv">
                <Shot src={img('mk03-front')} alt="10월 17일 하루 일정 답 화면" />
              </div>
              <div className="zone-title">
                <span className="zone-num rv">1</span>
                <h2 className="t-title rv">질문 한 번으로 받는 <br />하루 일정</h2>
                <div className="t-body rv">
                  <p>“아리랑열차 타고 아리랑 공연 보는 하루”처럼 물으면 장소 사진과 함께 그날 열차와 공연이 열리는지 답합니다.</p>
                  <p>답은 정선군과 정선아리랑문화재단이 공개한 자료와 코레일 시간표에서 찾습니다.</p>
                </div>
              </div>
            </div>
            <div className="a-phones">
              <figure className="a-side a-side-l rv">
                <Shot src={img('scr02')} alt="아리랑박물관 운영시간을 물은 답, 박물관 사진이 붙어 있음" />
                <figcaption>사진이 붙은 답</figcaption>
              </figure>
              <figure className="a-center rv">
                <DemoPhone><ChatDemo /></DemoPhone>
                <figcaption>질문을 치면 하루 일정이 나오는 흐름이 스스로 재생됩니다</figcaption>
              </figure>
              <figure className="a-side a-side-r rv">
                <LiveScreen path="/chat" poster={img('scr03')} title="어여우라지 질문 창 실제 화면" />
                <figcaption>직접 써 보기</figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* 10. banner3 */}
        <section className="banner3" data-sec>
          <div className="b3-img rv"><img src={img('field-museum-1')} alt="아리랑박물관 연표로 보는 정선아리랑 안내판" loading="lazy" /></div>
          <div className="b3-photo rv">
            <img className="b3-bg" src={img('field-museum-5')} alt="" aria-hidden="true" loading="lazy" />
            <img className="b3-phone" src={img('mk04-front')} alt="휴대폰 잠금 화면에 뜬 NFC 태그 알림" loading="lazy" />
          </div>
        </section>

        {/* 11. B zone: 노래 속 장소 NFC */}
        <section className="b-zone" data-sec>
          <div className="bz-con1">
            <img className="bz-bg" src={img('field-ararichon-2')} alt="" aria-hidden="true" loading="lazy" />
            <div className="bz-phone rv"><img src={img('mk05-front')} alt="아리랑박물관 장소 화면, 캐릭터가 인사함" loading="lazy" /></div>
          </div>
          <div className="bz-con2">
            <div className="bz-text">
              <span className="zone-num rv">2</span>
              <h2 className="t-title rv">노래 속 장소 NFC</h2>
              <div className="t-body rv">
                <p>아리랑박물관과 아라리공원 거치대의 스티커에 휴대폰을 대면 앱 설치 없이 그 장소 화면이 열립니다. 정선군 관광 캐릭터가 인사하고 장소 이야기를 안내합니다.</p>
              </div>
              <figure className="bz-text-shot rv">
                <Shot src={img('mk06-front')} alt="아리랑박물관 장소 화면, 3D 지도와 운영시간" />
                <figcaption>스티커를 대면 열리는 첫 화면</figcaption>
              </figure>
            </div>
            <div className="bz-img rv"><img src={img('ui-hero')} alt="아라리촌 장소 화면, 캐릭터 말풍선" loading="lazy" /></div>
          </div>
          <div className="bz-con3">
            <figure className="rv"><Shot src={img('ui-docent')} alt="장소 해설 화면" /><figcaption>장소 화면과 캐릭터</figcaption></figure>
            <figure className="rv"><Shot src={img('ui-lyric')} alt="정선 앞 조양강물 가사와 곡명, 부른 사람" /><figcaption>가사와 부른 사람</figcaption></figure>
            <figure className="rv"><Shot src={img('ui-progress')} alt="스탬프 1/4 패스 화면" /><figcaption>패스 스탬프</figcaption></figure>
          </div>
          <div className="bz-con4">
            <div className="t-body bz-con4-txt rv">
              <p>스티커는 노래에 나오는 자리에 둡니다. 화면은 그 장소의 가사와 부른 사람을 먼저 보여 줍니다. 들른 장소는 패스에 스탬프로 남습니다.</p>
            </div>
            <Strip />
          </div>
          <div className="bz-con5">
            <figure className="rv">
              <DemoPhone><NfcDemo /></DemoPhone>
              <figcaption>스티커에 대면 아라리공원 화면이 올라오고 가사와 소리가 열립니다</figcaption>
            </figure>
            <figure className="rv">
              <LiveScreen path="/n/park" poster={img('scr13')} title="아라리공원 NFC 장소 실제 화면" />
              <figcaption>직접 써 보기</figcaption>
            </figure>
          </div>
        </section>

        {/* 12. 정선읍 네 곳 (EQL c-zone 자리) */}
        <section className="places" data-sec>
          <div className="pl-head">
            <h2 className="t-title rv">정선읍 네 곳마다 <br />기능이 다릅니다.</h2>
            <div className="t-body rv">
              <p>정선역에서 걸어서 닿는 네 곳이 한 코스입니다.</p>
            </div>
          </div>
          <div className="pl-grid">
            <figure className="rv">
              <Shot src={img('ui-museum')} alt="아리랑박물관 장소 해설 화면" />
              <figcaption><span>아리랑박물관</span><strong>음성 도슨트</strong><em>큐레이터 목소리로 1896년 아리랑 녹음 이야기를 듣습니다.</em></figcaption>
            </figure>
            <figure className="rv">
              <DemoPhone><RouteDemo /></DemoPhone>
              <figcaption><span>아라리촌</span><strong>3D 지도 길 안내</strong><em>걸어가는 길이 지도 위에 그려지고 도보 시간이 뜨는 화면이 스스로 재생됩니다.</em></figcaption>
            </figure>
            <figure className="rv">
              <Shot className="tall" src={img('scr13')} alt="아라리공원 장소 화면, 3D 지도와 가사" />
              <figcaption><span>아라리공원</span><strong>가사와 소리</strong><em>조양강 앞에서 그 강이 나오는 가사와 소리가 열립니다.</em></figcaption>
            </figure>
            <figure className="rv">
              <Shot src={img('ui-roulette')} alt="정선아리랑시장 쿠폰 룰렛 화면" />
              <figcaption><span>정선아리랑시장</span><strong>시장 쿠폰 룰렛</strong><em>네 곳에 모두 들르면 장터 먹거리 할인 쿠폰이 나옵니다.</em></figcaption>
            </figure>
          </div>
        </section>

        {/* 13. C zone: 완주 카드 */}
        <section className="c-zone" data-sec>
          <div className="cz-con2">
            <div className="cz-head">
              <div className="cz-text">
                <span className="zone-num rv">3</span>
                <h2 className="t-title rv">네 조각을 모으면 <br />완주 카드가 남습니다.</h2>
              </div>
              <div className="t-body rv">
                <p>장소마다 이야기 조각이 하나씩 열립니다. 기억과 삶, 노래와 오늘 네 조각을 모으면 정선아리랑 한 자락 완주 카드가 패스에 남습니다.</p>
              </div>
            </div>
            <div className="cz-phones">
              <figure className="rv cz-card"><DemoPhone><PassDemo /></DemoPhone><figcaption>스탬프 네 개가 차례로 차고 완주 카드가 올라옵니다</figcaption></figure>
              <figure className="rv cz-card"><Shot src={img('scr09')} alt="스탬프 2/4와 다녀간 장소가 들어 있는 패스 화면" /><figcaption>스탬프와 다녀간 장소</figcaption></figure>
              <figure className="rv"><LiveScreen path="/n/pass" poster={img('ui-progress')} title="어여우라지 패스 실제 화면" /><figcaption>직접 써 보기</figcaption></figure>
            </div>
          </div>
        </section>

        {/* 14. mockup image + closing */}
        <section className="mockup" data-sec>
          <div className="mockup-img rv">
            <img src={img('field-ararichon-5')} alt="아라리촌 물레방아와 초가" loading="lazy" />
            <div className="mockup-shade" />
            <h2 className="t-title closing">2030이 노래 속 장소에서 <br />정선아리랑을 만납니다.</h2>
          </div>
        </section>

        {/* 15. credit */}
        <section className="credit" data-sec>
          <div className="cr-left">
            <div className="cr-txt">
              <div className="cr-item rv"><p className="cr-role">서비스</p><p>어여우라지</p><p>NFC 여행 안내 서비스 디자인</p></div>
              <div className="cr-item rv"><p className="cr-role">과목</p><p>한림대학교</p><p>지역 길과 문학적 가치(캡스톤 디자인)</p></div>
              <div className="cr-item rv"><p className="cr-role">조사</p><p>20대 설문 40명</p><p>2026년 10월</p><p>아리랑박물관 직원 2명, 정선 DMO</p><p>정선아리랑문화재단 서면 답변</p></div>
              <div className="cr-item rv"><p className="cr-role">자료</p><p>가사: 정선군 누리집 수록 긴 아리랑(남자)</p><p>사진: 정선 현장 촬영</p><p>로고 글꼴: 정선군 정선아리랑체</p></div>
              <div className="cr-item rv"><p className="cr-role">실제 서비스</p><p><a href={SERVICE} target="_blank" rel="noreferrer">어여우라지 열기</a></p></div>
            </div>
          </div>
          <div className="cr-right rv"><img src={img('field-ararichon-3')} alt="아라리촌 초가와 가을 나무" loading="lazy" /></div>
        </section>
      </main>
    </div>
  );
}

/* 실제 서비스(jeongseon-arirang.vercel.app) 화면을 코드로 다시 짠 재현 화면.
   문구와 숫자, 색은 실제 화면 캡처(public/img/scr*, mk*, ui*)에서 그대로 옮겼다.
   GSAP 타임라인이 화면 안에서 입력과 결과 등장, 화면 전환을 스스로 재생하고,
   화면에 들어올 때만 돌아간다. prefers-reduced-motion이면 마지막 상태로 멈춘다. */
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import './demos.css';

const BASE = import.meta.env.BASE_URL;

const APP_W = 390;
const APP_H = 844;

/* 휴대폰 틀 안에 390 폭 재현 화면을 넣고 칸 너비에 맞춰 줄인다. */
export function DemoPhone({ children, className = '' }) {
  const box = useRef(null);
  const [s, setS] = useState(1);
  useEffect(() => {
    const ro = new ResizeObserver(([e]) => setS(e.contentRect.width / APP_W));
    ro.observe(box.current);
    return () => ro.disconnect();
  }, []);
  return (
    <div className={`phone demo ${className}`}>
      <div className="phone-screen demo-screen" ref={box}>
        <div className="demo-fit" style={{ transform: `scale(${s})`, width: APP_W, height: APP_H }}>
          {children}
        </div>
      </div>
    </div>
  );
}

function useDemo(build) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.1, paused: true });
    build(tl, el, (sel) => el.querySelector(sel), (sel) => el.querySelectorAll(sel));
    let io;
    if (reduce) {
      tl.progress(1).pause();
    } else {
      io = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) tl.play(); else tl.pause(); },
        { threshold: 0.2 },
      );
      io.observe(el);
    }
    return () => { if (io) io.disconnect(); tl.kill(); };
  }, []);
  return ref;
}

/* 글자가 한 자씩 찍히는 입력 */
function typeInto(tl, node, text, duration, pos) {
  const state = { i: 0 };
  tl.to(state, {
    i: text.length,
    duration,
    ease: 'none',
    onUpdate() { node.textContent = text.slice(0, Math.round(state.i)); },
  }, pos);
}

/* ---------- 데모 1: 질문 한 번으로 받는 하루 일정 (/chat) ---------- */
export function ChatDemo() {
  const ref = useDemo((tl, el, q, qa) => {
    const typed = q('[data-typed]');
    const intro = q('[data-intro]');
    const chips = qa('[data-chip]');
    const user = q('[data-user]');
    const photos = qa('[data-photo]');
    const answer = q('[data-answer]');
    const plan = q('[data-plan]');
    const send = q('[data-send]');

    tl.set(typed, { textContent: '' })
      .set([user, plan], { autoAlpha: 0, y: 14 })
      .set(photos, { autoAlpha: 0, y: 10 })
      .set(answer, { autoAlpha: 0, y: 8 })
      .set(intro, { autoAlpha: 1, y: 0 })
      .set(chips, { autoAlpha: 1, y: 0 })
      .to({}, { duration: 0.5 });

    typeInto(tl, typed, '아리랑열차 타고 아리랑 공연 보는 하루', 1.9, '>');

    tl.to(send, { scale: 0.86, duration: 0.12, yoyo: true, repeat: 1 }, '>0.25')
      .set(typed, { textContent: '' })
      .to([intro, ...chips], { autoAlpha: 0, y: -10, duration: 0.35, stagger: 0.03 }, '<')
      .to(user, { autoAlpha: 1, y: 0, duration: 0.4 }, '>-0.1')
      .to(photos, { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.12 }, '>0.2')
      .to(answer, { autoAlpha: 1, y: 0, duration: 0.5 }, '>0.05')
      .to(plan, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '>0.25')
      .to({}, { duration: 2.6 });
  });

  return (
    <div className="dm dm-chat" ref={ref} aria-hidden="true">
      <div className="dm-top">
        <span className="dm-mark">어여우라지</span>
      </div>
      <div className="dm-body">
        <div className="dm-intro" data-intro>
          <p className="dm-intro-t">아리랑이 흐르는 정선,<br />무엇이든 물어보세요.</p>
          <p className="dm-intro-s">날짜를 고르면 장터와 공연, 열차를 하루로 이어 드려요.</p>
        </div>
        <p className="dm-user" data-user>아리랑열차 타고 아리랑 공연 보는 하루</p>
        <div className="dm-photos">
          <img data-photo src={`${BASE}img/field-market-2.webp`} alt="" />
          <img data-photo src={`${BASE}img/field-museum-4.webp`} alt="" />
        </div>
        <p className="dm-answer" data-answer>
          10월 17일(토) 하루 일정을 짜 봤어요. 돌아가는 열차는 정선역에서 17시 52분에 떠나요.
          정선아리랑센터 공연은 오후 2시, 75분, 5,000원이에요.
        </p>
        <div className="dm-plan" data-plan>
          <p className="dm-plan-d">10월 17일 토요일</p>
          <p className="dm-plan-r">열차 11:00 도착, 17:52 출발 <em>시간표</em></p>
          <p className="dm-plan-tags"><span>장날</span><span>아리랑 공연 14:00</span><span>박물관 열림</span></p>
          <p className="dm-plan-h">오늘의 아리랑</p>
          <p className="dm-plan-b">14:00 정선아리랑센터 공연, 아리아라리 또는 뗏꾼.</p>
        </div>
      </div>
      <div className="dm-foot">
        <div className="dm-field">
          <span className="dm-typed" data-typed />
          <i className="dm-caret" />
          <b className="dm-send" data-send>↑</b>
        </div>
        <div className="dm-chips">
          <span data-chip>하루 일정 짜기</span>
          <span data-chip>아리랑 공연과 박물관</span>
          <span data-chip>차 없이 가는 길</span>
          <span data-chip>정선아리랑이 뭐예요?</span>
        </div>
        <p className="dm-note">정선군과 정선아리랑문화재단 공식 자료로 답해요.</p>
      </div>
    </div>
  );
}

/* ---------- 데모 2: 스티커에 휴대폰을 대면 열리는 아라리공원 화면 (/n/park) ---------- */
export function NfcDemo() {
  const ref = useDemo((tl, el, q, qa) => {
    const ripple = qa('[data-ripple]');
    const tag = q('[data-tag]');
    const sheet = q('[data-sheet]');
    const stamp = q('[data-stamp]');
    const lyric = qa('[data-line]');
    const listen = q('[data-listen]');
    const wave = qa('[data-bar]');
    const next = q('[data-next]');

    tl.set(sheet, { yPercent: 108 })
      .set([stamp, next], { autoAlpha: 0, y: 10 })
      .set(lyric, { autoAlpha: 0, y: 8 })
      .set(wave, { scaleY: 0.2, autoAlpha: 0 })
      .set(listen, { backgroundColor: '#F1F2F4', color: '#111111' })
      .set(tag, { autoAlpha: 1 })
      .fromTo(ripple,
        { scale: 0.4, autoAlpha: 0.55 },
        { scale: 1.9, autoAlpha: 0, duration: 1.1, stagger: 0.35, ease: 'power1.out' })
      .to(tag, { autoAlpha: 0, duration: 0.3 }, '>-0.2')
      .to(sheet, { yPercent: 0, duration: 0.75, ease: 'power3.out' }, '<')
      .to(stamp, { autoAlpha: 1, y: 0, duration: 0.4 }, '>-0.15')
      .to(lyric, { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.18 }, '>0.05')
      .to(listen, { backgroundColor: '#2254CC', color: '#FFFFFF', duration: 0.25 }, '>0.35')
      .to(wave, { autoAlpha: 1, duration: 0.2 }, '<')
      .to(wave, {
        scaleY: 1, duration: 0.38, stagger: { each: 0.07, yoyo: true, repeat: 7 }, ease: 'sine.inOut',
      }, '<')
      .to(next, { autoAlpha: 1, y: 0, duration: 0.45 }, '>-1.2')
      .to({}, { duration: 1.8 });
  });

  return (
    <div className="dm dm-nfc" ref={ref} aria-hidden="true">
      <div className="dm-map">
        <svg viewBox="0 0 390 420" preserveAspectRatio="xMidYMid slice">
          <rect width="390" height="420" fill="#EEF0F2" />
          <path d="M250 -20 C210 120 300 240 240 440 L390 440 L390 -20 Z" fill="#CFE0F5" />
          <g fill="#E2E5E8">
            <rect x="28" y="70" width="44" height="34" rx="3" />
            <rect x="90" y="120" width="60" height="40" rx="3" />
            <rect x="40" y="200" width="52" height="46" rx="3" />
            <rect x="130" y="250" width="70" height="44" rx="3" />
            <rect x="60" y="320" width="48" height="38" rx="3" />
          </g>
          <path d="M70 330 L140 270 L180 190 L250 150" stroke="#C7CBD1" strokeWidth="6" fill="none" strokeLinecap="round" />
        </svg>
        <span className="dm-pin dm-pin-a">정선아리랑시장</span>
        <span className="dm-pin dm-pin-b">아라리공원</span>
        <div className="dm-mapctl"><span>2D</span><b>3D</b><span>EN</span></div>
        <div className="dm-tag" data-tag>
          <i data-ripple /><i data-ripple /><i data-ripple />
          <p>스티커에 휴대폰을 댑니다</p>
        </div>
      </div>
      <div className="dm-sheet" data-sheet>
        <span className="dm-grip" />
        <p className="dm-kind">강원특별자치도 무형유산 제1호 정선아리랑</p>
        <p className="dm-title">아라리공원</p>
        <p className="dm-sub">상시 이용 <em>2/4</em></p>
        <p className="dm-stamp" data-stamp>스탬프를 모았어요. 이야기 조각: <b>노래</b></p>
        <p className="dm-lyric-h" data-line>이 장소의 아리랑</p>
        <p className="dm-lyric" data-line>정선 앞 조양강물은 소리없이 흐르고<br />님향한 충절은 변함이 없네</p>
        <p className="dm-src" data-line>정선군 누리집 수록 공연 가사, 부른 사람 정도진, 이본 있음</p>
        <div className="dm-acts">
          <b className="dm-act-main">길 안내</b>
          <span>패스에 담기</span>
          <span data-listen>듣기</span>
          <span>공유</span>
        </div>
        <div className="dm-tabs"><b>이야기</b><span>가사</span><span>정보</span><span>주변</span></div>
        <div className="dm-wave">
          <i data-bar /><i data-bar /><i data-bar /><i data-bar /><i data-bar /><i data-bar /><i data-bar /><i data-bar />
        </div>
        <div className="dm-next" data-next>
          <p>다음 장소 <b>정선아리랑시장</b> 도보 4분</p>
          <b className="dm-act-main">길 안내</b>
        </div>
      </div>
    </div>
  );
}

/* ---------- 데모 3: 3D 지도 길 안내 (아라리촌에서 다음 장소까지) ---------- */
export function RouteDemo() {
  const ref = useDemo((tl, el, q, qa) => {
    const line = q('[data-line-path]');
    const dot = q('[data-walker]');
    const pins = qa('[data-pin]');
    const bar = q('[data-bar-route]');
    const len = line.getTotalLength();
    const pts = [0, 0.25, 0.5, 0.75, 1].map((t) => line.getPointAtLength(len * t));

    tl.set(line, { strokeDasharray: len, strokeDashoffset: len })
      .set(pins, { autoAlpha: 0, y: 8 })
      .set(bar, { autoAlpha: 0, y: 12 })
      .set(dot, { autoAlpha: 0, attr: { cx: pts[0].x, cy: pts[0].y } })
      .to(pins, { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.16 })
      .to(line, { strokeDashoffset: 0, duration: 1.5, ease: 'power1.inOut' }, '>-0.1')
      .to(dot, { autoAlpha: 1, duration: 0.2 }, '<')
      .to(dot, {
        keyframes: pts.slice(1).map((p) => ({ attr: { cx: p.x, cy: p.y }, duration: 0.42 })),
        ease: 'none',
      }, '<')
      .to(bar, { autoAlpha: 1, y: 0, duration: 0.45 }, '>-0.2')
      .to({}, { duration: 2.2 });
  });

  return (
    <div className="dm dm-route" ref={ref} aria-hidden="true">
      <div className="dm-mapctl dm-mapctl-top"><span>2D</span><b>3D</b><span>EN</span></div>
      <svg className="dm-routemap" viewBox="0 0 390 844" preserveAspectRatio="xMidYMid slice">
        <rect width="390" height="844" fill="#F1F3F5" />
        <path d="M310 -20 C270 220 340 470 290 870 L390 870 L390 -20 Z" fill="#CFE0F5" />
        <g fill="#E4E7EA">
          <rect x="30" y="120" width="66" height="50" rx="3" />
          <rect x="120" y="210" width="84" height="58" rx="3" />
          <rect x="40" y="340" width="72" height="62" rx="3" />
          <rect x="160" y="430" width="92" height="60" rx="3" />
          <rect x="56" y="560" width="70" height="54" rx="3" />
          <rect x="200" y="620" width="78" height="50" rx="3" />
        </g>
        <path
          data-line-path
          d="M90 650 C126 580 158 548 178 470 C206 372 226 320 258 236"
          stroke="#2254CC" strokeWidth="5" fill="none" strokeLinecap="round"
        />
        <circle data-walker r="8" fill="#111111" />
      </svg>
      <span className="dm-pin dm-pin-c" data-pin>아라리촌</span>
      <span className="dm-pin dm-pin-d" data-pin>아라리공원</span>
      <span className="dm-pin dm-pin-e" data-pin>정선아리랑시장</span>
      <div className="dm-next dm-next-route" data-bar-route>
        <p>다음 장소 <b>아라리공원</b> 도보 4분</p>
        <b className="dm-act-main">길 안내</b>
      </div>
    </div>
  );
}

/* ---------- 데모 4: 스탬프 네 개와 완주 카드 (/n/pass) ---------- */
export function PassDemo() {
  const ref = useDemo((tl, el, q, qa) => {
    const slots = qa('[data-slot]');
    const fill = q('[data-fill]');
    const count = q('[data-count]');
    const card = q('[data-card]');
    const shade = q('[data-shade]');
    const names = ['기억', '삶', '노래', '오늘'];

    tl.set(slots, { className: 'dm-slot' })
      .set(fill, { scaleX: 0 })
      .set(card, { yPercent: 110 })
      .set(shade, { autoAlpha: 0 })
      .set(count, { textContent: '0/4' })
      .to({}, { duration: 0.4 });

    names.forEach((n, i) => {
      tl.to(slots[i], { className: 'dm-slot is-on', duration: 0.01 }, `>0.35`)
        .fromTo(slots[i], { scale: 0.86 }, { scale: 1, duration: 0.4, ease: 'back.out(2)' }, '<')
        .to(fill, { scaleX: (i + 1) / 4, duration: 0.4, ease: 'power1.out' }, '<')
        .call(() => { count.textContent = `${i + 1}/4`; }, null, '<');
    });

    tl.to(shade, { autoAlpha: 1, duration: 0.3 }, '>0.4')
      .to(card, { yPercent: 0, duration: 0.7, ease: 'power3.out' }, '<')
      .to({}, { duration: 2.6 });
  });

  return (
    <div className="dm dm-pass" ref={ref} aria-hidden="true">
      <div className="dm-top dm-top-pass"><span>홈</span><span>EN</span></div>
      <div className="dm-pass-body">
        <p className="dm-pass-user">아라리 여행자</p>
        <p className="dm-pass-title">정선아리랑 한 자락 여행</p>
        <p className="dm-pass-count">스탬프 <b data-count>0/4</b></p>
        <div className="dm-progress"><i data-fill /></div>
        <div className="dm-slots">
          <span className="dm-slot" data-slot>기억</span>
          <span className="dm-slot" data-slot>삶</span>
          <span className="dm-slot" data-slot>노래</span>
          <span className="dm-slot" data-slot>오늘</span>
        </div>
        <p className="dm-pass-row">다녀간 장소 <b>아리랑박물관</b> 스탬프 받음, 10월 16일</p>
        <p className="dm-pass-row">다녀간 장소 <b>아라리공원</b> 스탬프 받음, 10월 16일</p>
      </div>
      <div className="dm-shade" data-shade />
      <div className="dm-card" data-card>
        <p className="dm-card-h">완주 카드</p>
        <div className="dm-card-in">
          <p className="dm-kind">강원특별자치도 무형유산 제1호 정선아리랑</p>
          <p className="dm-card-t">정선아리랑 한 자락을<br />완성한 여행자</p>
          <p className="dm-card-names">기억 와와군, 삶 다도, 노래 노버, 오늘 강새</p>
          <p className="dm-card-meta">아라리 여행자, 2026. 10. 16.</p>
          <p className="dm-card-meta">아리랑박물관, 아라리촌, 아라리공원, 정선아리랑시장</p>
          <p className="dm-card-mark">어여우라지</p>
        </div>
        <p className="dm-card-save">저장과 공유</p>
      </div>
    </div>
  );
}

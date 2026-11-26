/* 화면 위 주석. 피그마 주석처럼 화면의 한 지점에 점을 찍고 실선으로 옆 카드에 잇는다.
   카드: 작은 색 태그 + 짧은 설명 두 줄(무엇을 누르면 무엇이 되는지, 왜 그렇게 했는지).
   980px 이하에서는 선 대신 점과 카드에 같은 번호를 붙여 화면 아래에 카드를 나열한다. */
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

const BASE = import.meta.env.BASE_URL;
export const shot = (name) => `${BASE}img/${name}`;
export const BREAK = 980;
const LINE = { blue: '#1f5fd6', yellow: '#e3a800', red: '#d93a2b' };

export function Annotated({ src, alt, notes, ratio = 780 / 1688, frame = 'phone', caption }) {
  const st = useRef(null);
  const [paths, setPaths] = useState([]);
  const [on, setOn] = useState(-1);
  const [seen, setSeen] = useState(false);

  const layout = useCallback(() => {
    const el = st.current;
    if (!el) return;
    const cards = el.querySelectorAll('[data-card]');
    cards.forEach((c) => { c.style.top = ''; c.style.width = ''; c.style.left = ''; c.style.right = ''; });
    el.style.marginBottom = '';
    if (window.innerWidth <= BREAK) { setPaths([]); return; }
    const sr = el.getBoundingClientRect();
    const pr = el.querySelector('.phone').getBoundingClientRect();
    const mL = pr.left - sr.left;
    const mR = pr.right - sr.left;
    const GAP = 64;
    const CAP = frame === 'plain' ? 420 : 330;
    const wL = Math.min(CAP, mL - GAP);
    const wR = Math.min(CAP, sr.width - mR - GAP);
    const items = notes.map((n, i) => {
      const d = el.querySelector(`[data-dot="${i}"]`).getBoundingClientRect();
      return {
        i, side: n.side || (n.x < 50 ? 'l' : 'r'), c: n.c,
        dx: d.left + d.width / 2 - sr.left, dy: d.top + d.height / 2 - sr.top,
        card: el.querySelector(`[data-card="${i}"]`),
      };
    });
    const out = [];
    let need = 0;
    ['l', 'r'].forEach((side) => {
      const list = items.filter((it) => it.side === side).sort((a, b) => a.dy - b.dy);
      const w = side === 'l' ? wL : wR;
      if (w < 120) return;
      const x0 = side === 'l' ? mL - GAP - w : mR + GAP;
      let cursor = 0;
      list.forEach((it, k) => {
        it.card.style.width = `${w}px`;
        it.card.style.left = `${x0}px`;
        const h = it.card.offsetHeight;
        const top = Math.max(cursor, it.dy - 22);
        it.card.style.top = `${top}px`;
        cursor = top + h + 18;
        need = Math.max(need, top + h);
        const ty = top + 22;
        const edge = side === 'l' ? x0 + w : x0;
        const ex = side === 'l' ? edge + 18 + k * 9 : edge - 18 - k * 9;
        const d = Math.abs(it.dy - ty) < 2
          ? `M${it.dx},${it.dy} H${edge}`
          : `M${it.dx},${it.dy} H${ex} V${ty} H${edge}`;
        out.push({ d, c: it.c, i: it.i });
      });
    });
    if (need - sr.height > 1) el.style.marginBottom = `${Math.ceil(need - sr.height)}px`;
    setPaths(out);
  }, [notes, frame]);

  useLayoutEffect(() => {
    layout();
    const el = st.current;
    const ro = new ResizeObserver(layout);
    ro.observe(el);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(layout);
    window.addEventListener('resize', layout);
    return () => { ro.disconnect(); window.removeEventListener('resize', layout); };
  }, [layout]);

  useEffect(() => {
    const el = st.current;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className={`ann${seen ? ' seen' : ''}`} data-frame={frame} ref={st}>
      <div className="ann-mid">
        <div className="phone">
          <div className="phone-screen" style={{ aspectRatio: ratio }}>
            <img src={shot(src)} alt={alt} loading="lazy" />
            {notes.map((n, i) => (
              <span
                key={i} data-dot={i}
                className={`ann-dot c-${n.c}${on === i ? ' on' : ''}`}
                style={{ left: `${n.x}%`, top: `${n.y}%`, transitionDelay: `${0.25 + i * 0.12}s` }}
              ><i>{i + 1}</i></span>
            ))}
          </div>
        </div>
        {caption && <p className="ann-cap">{caption}</p>}
      </div>
      <svg className="ann-lines" aria-hidden="true">
        {paths.map((p) => (
          <g key={p.i} style={{ transitionDelay: `${0.35 + p.i * 0.12}s` }}>
            <path d={p.d} className="ln-under" />
            <path d={p.d} className="ln" stroke={LINE[p.c]} />
          </g>
        ))}
      </svg>
      <div className="ann-cards">
        {notes.map((n, i) => (
          <div
            key={i} data-card={i} className={`ann-card c-${n.c}`}
            style={{ transitionDelay: `${0.35 + i * 0.12}s` }}
            onMouseEnter={() => setOn(i)} onMouseLeave={() => setOn(-1)}
          >
            <p className="ann-tag"><em>{i + 1}</em>{n.tag}</p>
            <p className="ann-what">{n.what}</p>
            {n.why && <p className="ann-why">{n.why}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

/* 단계 탭이 있는 기능 무대. 화면 안에 들어와 있는 동안 9초마다 다음 단계로 넘어가고, 직접 누르면 멈춘다. */
export function Stage({ steps }) {
  const [k, setK] = useState(0);
  const [auto, setAuto] = useState(true);
  const box = useRef(null);
  useEffect(() => {
    if (!auto || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    let vis = false;
    const io = new IntersectionObserver(([e]) => { vis = e.isIntersecting; }, { threshold: 0.5 });
    io.observe(box.current);
    const id = setInterval(() => { if (vis) setK((v) => (v + 1) % steps.length); }, 9000);
    return () => { io.disconnect(); clearInterval(id); };
  }, [auto, steps.length]);
  const s = steps[k];
  return (
    <div className="stage" ref={box}>
      <div className="tabs" role="tablist">
        {steps.map((t, i) => (
          <button key={t.label} role="tab" aria-selected={i === k} className={i === k ? 'on' : ''} onClick={() => { setK(i); setAuto(false); }}>
            {t.label}
          </button>
        ))}
      </div>
      <Annotated key={k} src={s.src} alt={s.alt} notes={s.notes} ratio={s.ratio} />
    </div>
  );
}

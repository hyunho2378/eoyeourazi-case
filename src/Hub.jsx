/* 이해관계자 구조. 가운데 서비스 하나에 좌우 이해관계자 여섯을 실선으로 잇고,
   각 이해관계자 옆에 서비스로 주는 내용과 서비스에서 받는 내용을 적는다.
   980px 이하에서는 선 없이 서비스 아래에 이해관계자를 세로로 나열한다. */
import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { BREAK } from './Annotated';

export function Hub({ center, left, right }) {
  const root = useRef(null);
  const [paths, setPaths] = useState([]);

  const layout = useCallback(() => {
    const el = root.current;
    if (!el) return;
    if (window.innerWidth <= BREAK) { setPaths([]); return; }
    const sr = el.getBoundingClientRect();
    const hub = el.querySelector('.hub-core').getBoundingClientRect();
    const out = [];
    [['l', left], ['r', right]].forEach(([side, list]) => {
      list.forEach((_, k) => {
        const nd = el.querySelector(`[data-node="${side}${k}"]`).getBoundingClientRect();
        const ny = nd.top + nd.height / 2 - sr.top;
        const nx = side === 'l' ? nd.right - sr.left : nd.left - sr.left;
        const hx = side === 'l' ? hub.left - sr.left : hub.right - sr.left;
        const slot = (k + 1) / (list.length + 1);
        const hy = hub.top - sr.top + hub.height * slot;
        const mid = (nx + hx) / 2;
        out.push(`M${nx},${ny} H${mid} V${hy} H${hx}`);
      });
    });
    setPaths(out);
  }, [left, right]);

  useLayoutEffect(() => {
    layout();
    const el = root.current;
    const ro = new ResizeObserver(layout);
    ro.observe(el);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(layout);
    window.addEventListener('resize', layout);
    return () => { ro.disconnect(); window.removeEventListener('resize', layout); };
  }, [layout]);

  const node = (n, id) => (
    <div className="hub-node" data-node={id} key={id}>
      <p className="hub-name">{n.name}</p>
      <p className="hub-row"><b>주는 내용</b>{n.give}</p>
      <p className="hub-row"><b>받는 내용</b>{n.get}</p>
    </div>
  );

  return (
    <div className="hub" ref={root}>
      <div className="hub-col">{left.map((n, k) => node(n, `l${k}`))}</div>
      <div className="hub-core">
        <p className="hub-mark wordmark">{center.title}</p>
        <p className="hub-sub">{center.sub}</p>
      </div>
      <div className="hub-col">{right.map((n, k) => node(n, `r${k}`))}</div>
      <svg className="hub-lines" aria-hidden="true">
        {paths.map((d, i) => <path key={i} d={d} />)}
      </svg>
    </div>
  );
}

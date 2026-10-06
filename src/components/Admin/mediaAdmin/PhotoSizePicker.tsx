import { useState } from 'react';
import { SIZE_CHOICES, SHAPE_CHOICES, MIN_BOX, MAX_BOX, type PhotoOptions } from '../../../lib/imageOptimize';

const inp = 'w-full border border-ink-light rounded-lg px-3 py-2 text-sm bg-surface-card focus:outline-none focus:ring-2 focus:ring-brand-yellow';
const CUSTOM = 'custom';

interface Props {
  value: PhotoOptions;
  onChange: (o: PhotoOptions) => void;
  idPrefix: string;
}

// Size and shape choices for a photo: ready-made sizes, or an exact width x height typed in pixels.
export default function PhotoSizePicker({ value, onChange, idPrefix }: Props) {
  const [custom, setCustom] = useState(!!value.box);
  const [w, setW] = useState(String(value.box?.w ?? 1200));
  const [h, setH] = useState(String(value.box?.h ?? 800));
  const [fill, setFill] = useState(value.box?.fill ?? true);

  const apply = (nw: string, nh: string, nf: boolean) => {
    const wn = Math.round(Number(nw)), hn = Math.round(Number(nh));
    if (wn >= MIN_BOX && wn <= MAX_BOX && hn >= MIN_BOX && hn <= MAX_BOX) onChange({ ...value, box: { w: wn, h: hn, fill: nf } });
  };
  const wn = Number(w), hn = Number(h);
  const bad = custom && !(wn >= MIN_BOX && wn <= MAX_BOX && hn >= MIN_BOX && hn <= MAX_BOX);

  const pickSize = (v: string) => {
    if (v === CUSTOM) { setCustom(true); apply(w, h, fill); return; }
    setCustom(false);
    onChange({ maxDim: Number(v), aspect: value.aspect });
  };

  return (
    <div className="grid sm:grid-cols-2 gap-3">
      <div>
        <label htmlFor={`${idPrefix}-size`} className="text-xs font-bold text-ink-paragraph uppercase tracking-wide block mb-1">Photo size on the website</label>
        <select id={`${idPrefix}-size`} value={custom ? CUSTOM : value.maxDim} onChange={e => pickSize(e.target.value)} className={inp}>
          {SIZE_CHOICES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          <option value={CUSTOM}>Custom size (width x height)...</option>
        </select>
      </div>
      {!custom ? (
        <div>
          <label htmlFor={`${idPrefix}-shape`} className="text-xs font-bold text-ink-paragraph uppercase tracking-wide block mb-1">Photo shape</label>
          <select id={`${idPrefix}-shape`} value={value.aspect} onChange={e => onChange({ maxDim: value.maxDim, aspect: Number(e.target.value) })} className={inp}>
            {SHAPE_CHOICES.map(c => <option key={c.label} value={c.value}>{c.label}</option>)}
          </select>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label htmlFor={`${idPrefix}-w`} className="text-xs font-bold text-ink-paragraph uppercase tracking-wide block mb-1">Width (px)</label>
            <input id={`${idPrefix}-w`} type="number" inputMode="numeric" min={MIN_BOX} max={MAX_BOX} value={w} onChange={e => { setW(e.target.value); apply(e.target.value, h, fill); }} className={inp} aria-invalid={bad} />
          </div>
          <div>
            <label htmlFor={`${idPrefix}-h`} className="text-xs font-bold text-ink-paragraph uppercase tracking-wide block mb-1">Height (px)</label>
            <input id={`${idPrefix}-h`} type="number" inputMode="numeric" min={MIN_BOX} max={MAX_BOX} value={h} onChange={e => { setH(e.target.value); apply(w, e.target.value, fill); }} className={inp} aria-invalid={bad} />
          </div>
        </div>
      )}
      {custom && (
        <div className="sm:col-span-2 space-y-1.5">
          <div className="flex flex-wrap gap-4 text-sm">
            <label className="flex items-center gap-2"><input type="radio" name={`${idPrefix}-fill`} checked={fill} onChange={() => { setFill(true); apply(w, h, true); }} className="accent-amber-500" />Fill the size (crops the edges)</label>
            <label className="flex items-center gap-2"><input type="radio" name={`${idPrefix}-fill`} checked={!fill} onChange={() => { setFill(false); apply(w, h, false); }} className="accent-amber-500" />Keep the whole photo (fits inside)</label>
          </div>
          <p className={`text-[11px] ${bad ? 'text-status-error' : 'text-ink-caption'}`}>{bad ? `Width and height must each be between ${MIN_BOX} and ${MAX_BOX} px.` : 'A photo smaller than this size is not enlarged, so it never turns blurry.'}</p>
        </div>
      )}
    </div>
  );
}

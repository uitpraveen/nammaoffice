import type { EntryData } from "@/lib/studio/validation";

export function HeroPoster({data,preview=false}:{data:EntryData;preview?:boolean}) {
  const Heading="h2";
  const frame=data.posterFrame??"auto";
  const ratio=frame==="portrait"?"3 / 4":frame==="square"?"1 / 1":frame==="landscape"?"16 / 9":undefined;
  const fit=ratio?(data.posterFit??"contain"):"contain";
  const artwork=data.coverMediaId?<picture className="block h-full w-full">
    {data.mobileMediaId&&<source media="(max-width: 639px)" srcSet={`/media/${data.mobileMediaId}/display`}/>}
    <img src={`/media/${data.coverMediaId}/display`} alt={data.coverAlt||"Event poster preview"} fetchPriority={preview?"auto":"high"} className="block w-full" style={{height:ratio?"100%":"auto",maxHeight:ratio?undefined:680,objectFit:fit,objectPosition:ratio?`${data.posterPositionX??50}% ${data.posterPositionY??50}%`:"50% 50%"}}/>
  </picture>:<div className="flex h-80 items-center justify-center text-slate-400">Choose a poster to preview</div>;
  return <aside aria-label="Featured event" className={`w-full overflow-hidden rounded-2xl border border-white/15 shadow-[0_28px_90px_rgba(0,0,0,0.4)] ${data.imageOnly?"bg-black/20":"bg-white text-slate-900"}`}>
    {data.imageOnly&&<Heading className="sr-only">{data.title||"Featured event"}</Heading>}
    <div className="relative min-w-0 w-full overflow-hidden bg-black/5" style={{aspectRatio:ratio}}><div className={ratio?"absolute inset-0":""}>
      {data.imageOnly&&data.ctaUrl&&!preview?<a className="block h-full w-full focus-visible:outline-4 focus-visible:-outline-offset-4 focus-visible:outline-amber-400" href={data.ctaUrl} aria-label={data.ctaLabel||data.title}>{artwork}</a>:artwork}
    </div></div>
    {!data.imageOnly&&<div className="flex flex-col justify-center p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-800">What’s happening</p>
      <Heading className="mt-2 text-xl font-semibold leading-tight tracking-tight text-slate-900">{data.title||"Your event title"}</Heading>
      {data.excerpt&&<p className="mt-2 text-sm leading-relaxed text-slate-600">{data.excerpt}</p>}
      <div className="mt-4 flex flex-col items-start gap-5">
        {data.ctaUrl&&data.ctaLabel&&(preview?<span className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white">{data.ctaLabel}</span>:<a href={data.ctaUrl} className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-700">{data.ctaLabel}<span aria-hidden> ↗</span></a>)}
        {data.coverMediaId&&<a href={`/media/${data.coverMediaId}/display`} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-slate-600 underline underline-offset-4">View full poster<span className="sr-only"> (opens in a new tab)</span></a>}
      </div>
    </div>}
  </aside>;
}

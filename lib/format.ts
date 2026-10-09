export const rupiah=(n:number)=>new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(n);

export function nominal(s:string){
  const normalized=s.trim().replace(/^Rp\s*/i,'').replace(/\./g,'').replace(',','.').replace(/\s/g,'');
  if(!normalized || !/^-?\d+(?:\.\d+)?$/.test(normalized)) throw Error('Masukkan nominal yang valid.');
  const n=Number(normalized);
  if(!Number.isFinite(n)||n<0) throw Error('Masukkan nominal yang valid.');
  return n;
}

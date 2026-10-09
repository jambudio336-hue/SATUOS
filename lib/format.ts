export const rupiah=(n:number)=>new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(n);
export function nominal(s:string){const n=Number(s.replace(/\./g,'').replace(',','.').replace(/[^0-9.-]/g,''));if(!Number.isFinite(n)||n<0)throw Error('Masukkan nominal yang valid.');return n}

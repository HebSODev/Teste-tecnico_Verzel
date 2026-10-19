// Varredura exploratória: compara /api/carrinho/calcular com a fórmula da documentação.
// Uso: node scripts/varredura-calculo.mjs
const B=(process.env.BASE_URL ?? 'https://verzel-store.qa-test-verzel-store.workers.dev')+'/api';
const P={P001:59.9,P002:139.9,P003:189.9,P004:49.9,P005:100,P006:29.9,P007:229.9,P008:50};
const r2=v=>Math.round((v+Number.EPSILON)*100)/100;
const combos=[];
for(const id of Object.keys(P)) for(let q=1;q<=5;q++) combos.push([[id,q]]);
combos.push([['P001',2],['P006',1],['P004',1]],[['P002',1],['P008',1],['P006',1]],[['P003',1],['P006',1]]);
let bad=0;
for(const items of combos){ for(const cupom of [undefined,'BEMVINDO10']){
  const res=await fetch(B+'/carrinho/calcular',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({itens:items.map(([produtoId,quantidade])=>({produtoId,quantidade})),cupom})});
  const j=await res.json();
  const sub=r2(items.reduce((s,[id,q])=>s+P[id]*q,0));
  const desc=cupom?r2(sub*0.1):0; const frete=sub>=200?0:19.9; const falt=r2(Math.max(0,200-sub)); const tot=r2(sub-desc+frete);
  const exp={subtotal:sub,desconto:desc,frete,valorFaltanteFreteGratis:falt,total:tot};
  const diffs=Object.entries(exp).filter(([k,v])=>j[k]!==v).map(([k,v])=>`${k}: esperado ${v} obtido ${j[k]}`);
  if(diffs.length){bad++;console.log(JSON.stringify(items),cupom||'-',diffs.join('; '));}
}}
console.log('divergencias',bad,'de',combos.length*2);

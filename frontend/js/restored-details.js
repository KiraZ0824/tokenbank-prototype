/* Preserve information from the original screens alongside the revised workflow. */
(function(){
  'use strict';
  const W=TB.workflow,t=W.t,esc=TB.utils.esc;
  const m=n=>n!=null&&Number.isFinite(Number(n))?new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:2}).format(Number(n)):'—';
  const val=v=>v==null||v===''?'—':esc(typeof v==='object'?TB.text(v):String(v));
  const button=(label,route)=>`<button class="btn btn-sm" onclick="TB.router.navigate('#${route}')">${label}</button>`;
  const sample=()=>t('历史样本','Historical sample');
  const panel=(title,headers,rows)=>W.panel(`${title} · ${sample()}`,W.table(headers,rows));
  const nav=(role,routes)=>TB.router.register(role,routes);

  const memberDashboard=TB.router.routes.member['/dashboard'];
  const memberWallet=TB.router.routes.member['/wallet'];
  const memberHoldings=TB.router.routes.member['/holdings'];
  // The inherited list contained all institutions. Limit it to the active demo institution.
  const originalHoldingRows=TB.pages.member._holdingRows;
  TB.pages.member._holdingRows=function(){const own=new Set(TB.data.holdings.filter(x=>x.member===TB.state.user.org).map(x=>x.id));return originalHoldingRows().filter(x=>own.has(x.id));};
  const originalBookingRows=TB.pages.member._bookingRows;
  TB.pages.member._bookingRows=function(){const own=new Set(TB.data.bookings.filter(x=>x.member===TB.state.user.org).map(x=>x.id));return originalBookingRows().filter(x=>own.has(x.id));};
  const originalTransactionRows=TB.pages.member._transactionRows;
  TB.pages.member._transactionRows=function(){const own=new Set(TB.data.transactions.filter(x=>x.member===TB.state.user.org).map(x=>x.id));return originalTransactionRows().filter(x=>own.has(x.id));};
  const txRows=()=>TB.data.transactions.filter(x=>x.member===TB.state.user.org).map(x=>[val(x.id),val(x.time),val(x.type),m(x.amount),m(x.fee),val(x.status),val(x.series),val(x.remarks)]);
  const txHead=()=>[t('流水编号','ID'),t('时间','Time'),t('类型','Type'),t('金额','Amount'),t('手续费','Fee'),t('状态','Status'),t('产品','Product'),t('备注','Remarks')];
  nav('member',{
    '/dashboard':p=>{const hs=TB.data.holdings.filter(x=>x.member===TB.state.user.org);return memberDashboard(p)+W.summary([[t('持仓估值（参考）','Indicative portfolio value'),m(hs.reduce((a,x)=>a+(x.valuation||0),0)),sample()],[t('预期收益（参考）','Indicative expected return'),m(hs.reduce((a,x)=>a+(x.expectedReturn||0),0)),sample()]])+panel(t('近期交易','Recent transactions'),txHead(),txRows().slice(0,5));},
    '/wallet':p=>memberWallet(p)+W.panel(t('EMT 提现入口','EMT withdrawal'),`<div class="wf-task-body">${button(t('查看提现（原版演示）','View withdrawal (original demo)'),'/wallet/withdraw')}<p class="wf-muted">${t('提现入口及费用由现有资金流程和业务规则确认。','The withdrawal entry and fees remain subject to the existing funding flow and business confirmation.')}</p></div>`)+panel(t('历史资金流水','Historical fund movements'),txHead(),txRows()),
    '/holdings':p=>memberHoldings(p)
  });

  const quoteHead=()=>['Quote ID',t('产品','Product'),t('卖方收益率','Seller yield'),t('参考价格','Indicative price'),t('报价时间','Quote time'),t('有效期至','Valid until'),t('状态','Status'),t('报价方','Provider'),t('操作','Action')];
  const quoteRows=()=>TB.data.quotes.map(q=>[val(q.id),val(q.series),Number.isFinite(q.sellerYield)?TB.utils.yield(q.sellerYield):'—',Number.isFinite(q.markPrice)?TB.utils.price(q.markPrice):'—',val(q.quoteTime),val(q.validUntil),val(q.status),val(q.provider),`<button class="btn btn-sm" onclick="TB.pages.issuer.viewQuote('${esc(q.id)}')">${t('查看详情','View details')}</button>`]);
  const burnHistory=()=>panel(t('销毁申请记录','Burn request records'),[t('申请编号','Request ID'),t('产品','Product'),t('面值','Face value'),t('申请人','Applicant'),t('申请时间','Applied'),t('状态','Status'),t('完成时间','Completed')],TB.data.burnRequests.map(b=>[val(b.id),val(b.series),m(b.amount),val(b.applicant),val(b.applyTime),val(b.status),val(b.completeTime)]));
  const issuerDashboard=TB.router.routes.issuer['/dashboard'];
  nav('issuer',{
    '/dashboard':p=>{const active=TB.data.series.filter(s=>['open','minting'].includes(s.status));return issuerDashboard(p)+W.summary([[t('活跃产品','Active products'),String(active.length),sample()],[t('发行总面值','Total face value'),m(TB.data.series.reduce((a,s)=>a+s.faceTotal,0)),sample()],[t('已分配面值','Allocated face value'),m(TB.data.series.reduce((a,s)=>a+Math.max(0,s.faceTotal-s.faceAvailable),0)),sample()]])+panel(t('活跃产品','Active products'),[t('产品编号','Product ID'),t('产品名称','Product name'),t('状态','Status'),t('可售额度','Available'),t('到期日','Maturity'),t('操作','Action')],active.map(s=>[val(s.id),val(s.name),val(s.status),m(s.faceAvailable),val(s.maturityDate),button(t('查看详情','View details'),'/series/'+s.id)]));},
    '/quotes':()=>W.header(t('报价管理','Quote management'),'',button(t('角色与规则','Roles & rules'),'/rules'))+panel(t('报价记录','Quote records'),quoteHead(),quoteRows())+W.panel(t('报价职责','Quote responsibility'),`<div class="wf-task-body">${t('卖方报价维护职责仍待业务确认。历史记录仅为样本，非实时可成交报价。','Quote maintenance responsibility remains open. Historical records are sample data, not live executable quotes.')}</div>`),
    '/burn':()=>W.lifecycle()+burnHistory()
  });
  const opsDashboard=TB.router.routes.ops['/dashboard'];
  nav('ops',{
    '/dashboard':p=>{const total=TB.data.series.reduce((a,s)=>a+s.faceTotal,0),available=TB.data.series.reduce((a,s)=>a+s.faceAvailable,0);return opsDashboard(p)+W.summary([[t('成员机构','Members'),String(TB.data.members.filter(x=>x.type==='Member').length),sample()],[t('开放销售产品','Open products'),String(TB.data.series.filter(x=>x.status==='open').length),sample()],[t('持仓面值','Position face value'),m(TB.data.holdings.reduce((a,x)=>a+(x.faceValue||0),0)),sample()],[t('发行面值 / 可售','Issued / available'),m(total)+' / '+m(available),sample()]]);},
    '/series-review':()=>W.lifecycle()+panel(t('发行申请明细','Issuance applications'),[t('产品编号','Product ID'),t('产品名称','Product name'),t('发行方','Issuer'),t('发行面值','Face value'),t('原状态','Original status'),t('创建时间','Created'),t('操作','Action')],TB.data.series.filter(s=>['pending','approving','minting'].includes(s.status)).map(s=>[val(s.id),val(s.name),val(s.issuer),m(s.faceTotal),val(s.status),val(s.createdAt),button(t('查看详情','View detail'),'/series/'+s.id)])),
    '/product-monitor':()=>W.lifecycle()+panel(t('产品兑付及持仓监控','Product settlement and positions'),[t('产品编号','Product ID'),t('产品名称','Product name'),t('到期日','Maturity'),t('产品状态','Product status'),t('持仓笔数','Positions'),t('持仓面值','Position face'),t('操作','Action')],TB.data.series.filter(s=>['open','closed','maturity','burned'].includes(s.status)).map(s=>{const h=TB.data.holdings.filter(x=>x.series===s.id);return [val(s.id),val(s.name),val(s.maturityDate),val(s.status),String(h.length),m(h.reduce((a,x)=>a+(x.faceValue||0),0)),`<button class="btn btn-sm" onclick="TB.ops.viewMonitorDetail('${esc(s.id)}')">${t('查看详情','View details')}</button>`];}))
  });
  const funding=W.funding;
  W.funding=function(){
    const flows=TB.data.emtFlows||[],ledger=TB.data.emtLedger||[];
    const flowsPanel=panel(t('EMT 储备流水','EMT reserve movements'),[t('流水号','Movement ID'),t('时间','Time'),t('类型','Type'),t('方向','Direction'),t('金额','Amount'),t('渠道','Channel'),t('状态','Status'),t('备注','Remarks')],flows.map(x=>[val(x.id),val(x.time),val(x.type),val(x.direction),m(x.amount),val(x.channel),val(x.status),val(x.remarks)]));
    const ledgerPanel=panel(t('EMT 收支明细','EMT cash ledger'),[t('明细编号','Entry ID'),t('时间','Time'),t('业务事项','Business item'),t('产品','Product'),t('对手方','Counterparty'),t('方向','Direction'),t('金额','Amount'),t('备注','Remarks')],ledger.map(x=>[val(x.id),val(x.time),val(x.item),val(x.series),val(x.counterparty),val(x.direction),m(x.amount),val(x.remarks)]));
    return funding()+flowsPanel+ledgerPanel;
  };
  ['bg','issuer','ops'].forEach(role=>nav(role,{'/funding':()=>W.funding()}));
  nav('issuer',{'/emt':()=>W.funding()});
})();

(function(){
  'use strict';
  const W=TB.workflow,t=W.t,esc=TB.utils.esc;
  const money=n=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:2}).format(n);
  const badge=(s,tone='neutral')=>`<span class="wf-badge ${tone}">${s}</span>`;
  const button=(s,path,primary=false)=>`<button class="btn ${primary?'btn-primary':''}" onclick="TB.router.navigate('#${path}')">${s}</button>`;
  W.marketQuery='';W.marketFilter='all';W.marketView='card';W.marketYield='';W.marketFace='';
  W.market=function(){
    return W.header(t('美债代币市场','Treasury token market'),t('Bison Group 发行 · 卖方提供参考报价 · TokenBank 总账户内记账','Issued by Bison Group · Seller indicative quotes · TokenBank omnibus allocations'),button(t('我的挂单','My orders'),'/orders'))
      +W.pageIntro(t('试运营：持有至到期后自动兑付，不支持提前退出、展期或向外部钱包转出。报价维护职责仍待最终确认。','Pilot: automatic maturity payout. Early exit, rollover and external token withdrawal are unavailable. Quote ownership awaits final confirmation.'))
      +W.panel(t('可售产品','Available products'),`<div class="wf-toolbar"><label class="wf-search">${t('搜索产品或 ISIN','Search product or ISIN')}<input type="search" value="${esc(W.marketQuery)}" placeholder="R-UST / ISIN" oninput="TB.workflow.marketQuery=this.value;TB.workflow.filterMarket()"></label><label>${t('交易状态','Trading status')}<select onchange="TB.workflow.marketFilter=this.value;TB.workflow.filterMarket()"><option value="all">${t('全部状态','All statuses')}</option><option value="open" ${W.marketFilter==='open'?'selected':''}>${t('开放销售','Open for sale')}</option><option value="closed" ${W.marketFilter==='closed'?'selected':''}>${t('停止购买 / 售罄','Closed / sold out')}</option></select></label><label>${t('收益率','Yield')}<select onchange="TB.workflow.marketYield=this.value;TB.workflow.filterMarket()"><option value="">${t('全部','All')}</option><option value="high" ${W.marketYield==='high'?'selected':''}>≥ 5.50%</option><option value="mid" ${W.marketYield==='mid'?'selected':''}>&lt; 5.50%</option></select></label><label>${t('可售面值','Available face')}<select onchange="TB.workflow.marketFace=this.value;TB.workflow.filterMarket()"><option value="">${t('全部','All')}</option><option value="500000" ${W.marketFace==='500000'?'selected':''}>500K+</option><option value="1000000" ${W.marketFace==='1000000'?'selected':''}>1M+</option></select></label><div class="wf-toolbar-note">${t('参考数据 · 挂单前重新获取报价','Indicative data · Refresh before ordering')}</div></div><div class="wf-market-viewbar"><span>${t('展示方式','View')}</span><div class="wf-view-switch" role="group" aria-label="${t('产品展示方式','Product view')}"><button class="btn ${W.marketView==='card'?'selected':''}" aria-pressed="${W.marketView==='card'}" onclick="TB.workflow.setMarketView('card')">${t('卡片','Cards')}</button><button class="btn ${W.marketView==='list'?'selected':''}" aria-pressed="${W.marketView==='list'}" onclick="TB.workflow.setMarketView('list')">${t('列表','List')}</button></div></div><div id="wf-market-results">${W.marketResults()}</div>`)
      +W.panel(t('购买前需要了解','Before you invest'),`<div class="wf-journey">${[t('KYC / KYB 与非美国主体校验','KYC / KYB & non-US checks'),t('EMT 余额与可售额度校验','EMT & capacity checks'),t('限时确认与资金处理','Timed confirmation & funding'),t('按 VMI ID 更新持仓','Update VMI allocations')].map((s,i)=>`<div><b>${i+1}</b><span>${s}</span></div>`).join('')}</div>`);
  };
  W.marketItems=()=>TB.data.series.filter(s=>['open','closed'].includes(s.status)).filter(s=>(s.id+' '+s.name+' '+s.isin).toLowerCase().includes(W.marketQuery.toLowerCase())).filter(s=>W.marketFilter==='all'||s.status===W.marketFilter).filter(s=>!W.marketYield||(W.marketYield==='high'?s.sellerYield>=0.055:s.sellerYield<0.055)).filter(s=>!W.marketFace||s.faceAvailable>=Number(W.marketFace));
  W.marketRows=()=>W.table([t('产品 / ISIN','Product / ISIN'),t('到期日','Maturity'),t('参考收益率','Indicative yield'),t('参考价格','Indicative price'),t('可售面值','Available face'),t('状态','Status'),t('操作','Action')],W.marketItems().map(s=>[`${s.id}<small>${s.isin} · Bison Group</small>`,s.maturityDate,(s.sellerYield*100).toFixed(2)+'%',s.markPrice.toFixed(6),money(s.faceAvailable),badge(s.status==='open'&&s.faceAvailable>0?t('开放销售','Open'):t('停止购买 / 售罄','Closed / sold out'),s.status==='open'&&s.faceAvailable>0?'success':'neutral'),`<div class="wf-actions">${button(t('产品详情','Details'),'/market/'+s.id)}${s.status==='open'&&s.faceAvailable>0?button(t('挂单购买','Place order'),'/subscribe/'+s.id,true):`<button class="btn" disabled>${t('不可购买','Unavailable')}</button>`}</div>`]));
  W.marketCards=()=>{
    const items=W.marketItems();
    if(!items.length)return `<div class="wf-empty">${t('没有符合条件的产品，请调整搜索或筛选条件。','No matching products. Adjust your search or filters.')}</div>`;
    return `<div class="market-grid wf-market-grid">${items.map(s=>{
      const open=s.status==='open'&&s.faceAvailable>0;
      return `<article class="market-card"><div class="market-card-top"><div><h3 class="market-card-name">${esc(s.name)}</h3><div class="market-card-id">${s.id} · Bison Group</div></div>${badge(open?t('开放销售','Open'):t('停止购买 / 售罄','Closed / sold out'),open?'success':'neutral')}</div><div class="market-card-quote"><strong class="market-card-quote-rate">${(s.sellerYield*100).toFixed(2)}%</strong><span class="market-card-quote-sub">${t('参考收益率','Indicative yield')}</span></div><div class="market-card-body"><div class="market-card-row"><span>${t('到期日','Maturity')}</span><strong>${s.maturityDate}</strong></div><div class="market-card-row"><span>${t('参考价格','Indicative price')}</span><strong>${s.markPrice.toFixed(6)}</strong></div><div class="market-card-row"><span>${t('可售面值','Available face')}</span><strong>${money(s.faceAvailable)}</strong></div></div><div class="market-card-foot">${button(t('产品详情','Details'),'/market/'+s.id)}${open?button(t('挂单购买','Place order'),'/subscribe/'+s.id,true):`<button class="btn" disabled>${t('不可购买','Unavailable')}</button>`}</div></article>`;
    }).join('')}</div>`;
  };
  W.marketResults=()=>W.marketView==='list'?W.marketRows():W.marketCards();
  W.setMarketView=view=>{if(!['card','list'].includes(view))return;W.marketView=view;TB.router.render();};
  TB.pages.member.setMarketView=W.setMarketView;
  W.filterMarket=()=>document.getElementById('wf-market-results').innerHTML=W.marketResults();
  W.draft=null;
  W.startDate=()=>TB.utils.nextTradingDay(TB.utils.todayStr());
  W.newDraft=id=>({id,step:0,face:500000,date:W.startDate(),nonUS:false,kyb:false,risk:false,quoteUntil:0});
  W.productInfo=s=>{
    const value=(v,fallback='—')=>v==null||v===''?fallback:esc(String(v));
    const pct=v=>Number.isFinite(v)?(v*100).toFixed(2)+'%':'—';
    const price=v=>Number.isFinite(v)?v.toFixed(6):'—';
    const facts=rows=>W.facts(rows.map(([k,v])=>[k,value(v)]));
    return `<div class="wf-product-info">${W.panel(t('产品规格','Product specifications'),facts([
      [t('产品名称','Product name'),s.name],[t('产品编号','Product ID'),s.id],['CUSIP',s.cusip],['ISIN',s.isin],
      [t('底层资产','Underlying asset'),t('美国国债','US Treasury')],[t('发行方 / 资产持有人','Issuer / asset owner'),'Bison Group'],
      [t('执行代理','Execution agent'),'Bison Bank'],[t('托管方（样本）','Custodian (sample)'),s.custodian],
      [t('产品到期日','Maturity date'),s.maturityDate],[t('发行总面值','Total face value'),money(s.faceTotal)],
      [t('可售额度','Available face value'),money(s.faceAvailable)],[t('历史窗口天数（待确认）','Historical window (pending)'),s.windowDays==null?'—':s.windowDays+' '+t('天','days')],
      [t('最小购买额','Minimum purchase'),money(500000)],[t('购买步进','Purchase increment'),money(100000)]
    ]))}${W.panel(t('价格与报价信息','Pricing and quote information'),facts([
      [t('卖方参考收益率','Indicative seller yield'),pct(s.sellerYield)],[t('参考市场收益率','Market reference yield'),pct(s.refYield)],
      [t('收益差','Yield spread'),s.bpSpread==null?'—':s.bpSpread+' bp'],[t('当前参考价格','Indicative price'),price(s.markPrice)],
      [t('市场参考价格','Market reference price'),price(s.marketRefPrice)],[t('估值日（样本）','Valuation date (sample)'),s.valuationDate],
      [t('报价提供方（样本）','Quote provider (sample)'),s.quoteProvider],[t('价格来源（样本）','Price source (sample)'),s.priceSource],
      [t('报价时间（样本）','Quote time (sample)'),s.quoteTime],[t('报价有效期至（样本）','Quote valid until (sample)'),s.quoteValidUntil],
      [t('交易手续费（演示）','Transaction fee (demo)'),money(20)+' / '+t('笔','trade')],
      [t('未来预定定金规则','Future booking deposit'),t('待业务确认','Pending business confirmation')]
    ]))}${W.panel(t('交易安排','Trading arrangement'),facts([
      [t('记账位置','Ledger'),t('TokenBank 虚拟总账户','TokenBank omnibus')],
      [t('成员分户','Member allocation'),'VMI ID'],[t('资金币种','Payment currency'),'USD EMT'],
      [t('到期安排','At maturity'),t('自动兑付及代币回收','Automatic payout & token return')],
      [t('提前退出 / 展期','Early exit / rollover'),t('试运营不开放','Unavailable during pilot')]
    ]))}</div>`;
  };
  W.subscribe=function(params){
    const s=W.series(params.id);
    if(!s)return W.header(t('未找到产品','Product not found'),'')+button(t('返回市场','Back to market'),'/market');
    if(!W.draft||W.draft.id!==s.id)W.draft=W.newDraft(s.id);
    const d=W.draft;
    let h=W.header(t('挂单购买','Place a Treasury order'),s.id+' · Bison Group · VMI-ALPHA-001',button(t('返回产品市场','Back to market'),'/market'));
    const progress=`<ol class="wf-order-steps" aria-label="${t('挂单步骤','Order steps')}">${[t('交易信息','Order details'),t('合规与资金','Compliance & funding'),t('报价与确认','Quote & confirm')].map((label,i)=>`<li class="${i<d.step?'done':i===d.step?'current':''}" ${i===d.step?'aria-current="step"':''}><span>${i<d.step?'✓':i+1}</span><div>${label}</div></li>`).join('')}</ol>`;
    let body='';
    if(d.step===0){
      body=`<form id="wf-order-form" onsubmit="event.preventDefault();TB.workflow.orderNext()"><label class="wf-field">${t('购买面值（USD）','Face value (USD)')}<input id="wf-face" type="number" min="500000" step="100000" max="${s.faceAvailable}" required value="${d.face}" oninput="TB.workflow.draft.face=Number(this.value);TB.workflow.updateEstimate()"><small>${t('最低 500,000；按 100,000 递增。','Minimum 500,000; increments of 100,000.')}</small></label><label class="wf-field">${t('预定交易日','Scheduled trade date')}<input id="wf-trade-date" type="date" required value="${d.date}" min="${W.startDate()}" max="${s.maturityDate}" onchange="TB.workflow.draft.date=this.value;TB.workflow.updateEstimate()"><small>${t('营业日且早于到期日。未来交易日在交易日重新核验余额与报价。','A business day before maturity. Future orders recheck balance and quote on the trade date.')}</small></label>${W.notice(t('按最新流程，试运营期不开放提前退出；本次持仓持有至产品到期。','Under the revised pilot flow, this position is held to product maturity.'))}<div id="wf-order-error" class="wf-error" role="alert"></div><button class="btn btn-primary">${t('继续 · 检查合规与资金','Continue · Check compliance & funds')}</button></form>`;
    }else if(d.step===1){
      body=`<form onsubmit="event.preventDefault();TB.workflow.orderNext()"><h3>${t('机构合规核对','Institution compliance')}</h3><label class="wf-check"><input type="checkbox" id="wf-nonus" required ${d.nonUS?'checked':''}>${t('确认机构为非美国主体','Confirm the institution is a non-US person')}</label><label class="wf-check"><input type="checkbox" id="wf-kyb" required ${d.kyb?'checked':''}>${t('已核对 Remi 机构 KYC / KYB 状态','Verify the institution KYC / KYB record in Remi')}</label><label class="wf-check"><input type="checkbox" id="wf-risk" required ${d.risk?'checked':''}>${t('已阅读产品风险揭示及到期兑付规则','Read the product risk disclosure and maturity rules')}</label>${W.facts([[t('可用 EMT','Available EMT'),money(W.data.balance)],[t('当日购买预估资金','Estimated same-day funds'),money(d.face*s.markPrice+20)],[t('检查结果','Check result'),W.data.balance>=d.face*s.markPrice+20?badge(t('余额充足','Sufficient balance'),'success'):badge(t('余额不足','Insufficient funds'),'danger')]])}${W.notice(t('未来预定按流程图先校验预期利息及手续费。旧规格定金公式与新流程口径待对齐，演示仅支持当日扣款；未来挂单保存为“待业务确认”，不收取未确认定金。','Future bookings check expected interest and fees in the flowchart. The older deposit formula needs alignment; demo debits same-day orders only. Future orders remain pending business confirmation with no unconfirmed deposit charged.'),'warning')}<div id="wf-order-error" class="wf-error" role="alert"></div><div class="wf-actions"><button class="btn" type="button" onclick="TB.workflow.orderBack()">${t('上一步','Back')}</button><button class="btn btn-primary">${t('继续 · 获取卖方演示报价','Continue · Get demo seller quote')}</button></div></form>`;
    }else{
      const expired=d.quoteUntil<Date.now(),future=d.date>W.startDate();
      body=`<form onsubmit="event.preventDefault();TB.workflow.confirmOrder()">${W.notice(t('模拟报价来源：BG 卖方。报价不代表实时市场数据。','Demo quote source: BG seller. This is not live market data.'))}${W.facts([[t('参考单价','Indicative unit price'),s.markPrice.toFixed(6)],[t('购买面值','Face value'),money(d.face)],[t('交易日','Trade date'),d.date],[t('产品到期日','Product maturity'),s.maturityDate],[t('手续费（演示）','Fee (demo)'),money(20)],[t('当日交易扣款','Same-day debit'),future?t('未来预定 · 暂不扣款','Future booking · No debit'):money(d.face*s.markPrice+20)]])}<div class="wf-quote-timer"><span id="wf-quote-time" role="timer">${expired?t('报价已过期','Quote expired'):t('报价有效期 2 分钟','Quote valid for 2 minutes')}</span><button class="btn btn-sm" type="button" onclick="TB.workflow.refreshQuote()">${t('重新获取演示报价','Refresh demo quote')}</button></div><label class="wf-check"><input type="checkbox" id="wf-final-confirm" required>${t('确认交易信息，并知悉代币仅在 TokenBank 总账户按 VMI 记账','Confirm the order and acknowledge VMI allocation in the TokenBank omnibus account')}</label><div id="wf-order-error" class="wf-error" role="alert"></div><div class="wf-actions"><button class="btn" type="button" onclick="TB.workflow.orderBack()">${t('上一步','Back')}</button><button class="btn btn-primary" id="wf-confirm-order" ${expired?'disabled':''}>${future?t('保存待确认预定（演示）','Save provisional booking (demo)'):t('确认并扣款（演示）','Confirm & debit (demo)')}</button></div></form>`;
    }
    const purchasable=s.status==='open'&&s.faceAvailable>=500000;
    if(!purchasable)body=W.notice(t('当前产品已停止购买或可售额度不足。','This product is closed or has insufficient available capacity.'),'warning');
    h+=`<div class="wf-order-layout">${W.productInfo(s)}<aside class="wf-order-side">${W.panel(t('挂单购买','Place order'),`<div class="wf-order-panel">${purchasable?progress:''}<div class="wf-task-body">${body}${purchasable?`<div class="wf-order-summary"><h3>${t('交易摘要','Order summary')}</h3><div id="wf-estimate">${W.estimate()}</div></div>`:''}</div></div>`)}</aside></div>`;
    return h;
  };
  W.estimate=()=>{const d=W.draft,s=W.series(d.id);return W.facts([[t('购买面值','Face value'),money(d.face||0)],[t('参考金额（含演示手续费）','Indicative total (incl. demo fee)'),money((d.face||0)*s.markPrice+20)],[t('交易日','Trade date'),esc(d.date)]]);};
  W.updateEstimate=()=>{const el=document.getElementById('wf-estimate');if(el)el.innerHTML=W.estimate();};
  W.validateOrder=()=>{
    const d=W.draft,s=W.series(d.id),today=W.startDate();
    if(s.status!=='open'||d.face>s.faceAvailable)return t('当前可售额度不足或产品已停止购买。','Insufficient capacity or product closed.');
    if(!Number.isFinite(d.face)||d.face<500000||(d.face-500000)%100000!==0)return t('面值最低 500,000，按 100,000 递增。','Minimum face value is 500,000 in 100,000 increments.');
    if(!d.date||d.date<today||d.date>=s.maturityDate||!TB.utils.isTradingDay(d.date))return t('请选择早于到期日的有效营业日。','Choose a valid business day before maturity.');
    return '';
  };
  W.orderNext=()=>{
    const d=W.draft,error=W.validateOrder();if(error){document.getElementById('wf-order-error').textContent=error;return;}
    if(d.step===1){d.nonUS=document.getElementById('wf-nonus').checked;d.kyb=document.getElementById('wf-kyb').checked;d.risk=document.getElementById('wf-risk').checked;if(!d.nonUS||!d.kyb||!d.risk)return;
      if(d.date===W.startDate()&&W.data.balance<d.face*W.series(d.id).markPrice+20){document.getElementById('wf-order-error').textContent=t('EMT 余额不足，请先准备资金。','Insufficient EMT balance. Fund the account first.');return;}d.quoteUntil=Date.now()+120000;
    }
    d.step++;TB.router.render();
  };
  W.orderBack=()=>{if(W.draft)W.draft.step=Math.max(0,W.draft.step-1);TB.router.render();};
  W.refreshQuote=()=>{W.draft.quoteUntil=Date.now()+120000;TB.router.render();};
  W.confirmOrder=()=>{
    const d=W.draft,error=W.validateOrder(),el=document.getElementById('wf-order-error');
    if(error){el.textContent=error;return;}if(d.quoteUntil<=Date.now()){el.textContent=t('报价已过期，请重新获取。','Quote expired; refresh it.');return;}
    if(!d.nonUS||!d.kyb||!d.risk||!document.getElementById('wf-final-confirm').checked)return;
    const s=W.series(d.id),future=d.date>W.startDate(),cost=d.face*s.markPrice+20;
    if(!future&&W.data.balance<cost){el.textContent=t('EMT 可用余额不足。','Insufficient EMT balance.');return;}
    const order={id:'ORD-'+Date.now(),series:s.id,face:d.face,date:d.date,cost,price:s.markPrice,status:future?'provisional':'settlementPending',vmi:'VMI-ALPHA-001',time:new Date().toISOString()};
    if(!future){W.data.balance-=cost;W.data.reserve+=cost-20;}W.data.orders.unshift(order);W.event(order.id+' · '+t('挂单已记录','Order recorded'));W.draft=null;TB.router.navigate('#/orders/'+order.id);
  };
  W.orderStatus=o=>o.status==='settled'?badge(t('已交割','Settled'),'success'):o.status==='cancelled'?badge(t('已撤单','Cancelled')):o.status==='provisional'?badge(t('预定 · 待业务确认','Booking · Business confirmation'),'warning'):badge(t('待交割回执','Awaiting settlement receipt'),'info');
  W.orders=()=>W.header(t('我的挂单','My orders'),t('未成交可撤单；已成交查看持仓。资金扣款与交割回执分别展示。','Cancel unfilled orders or view settled positions. Debits and settlement receipts are tracked separately.'),button(t('浏览产品','Explore products'),'/market',true))+W.panel(t('挂单记录','Order register'),W.table([t('挂单编号 / 产品','Order / product'),t('面值','Face value'),t('交易日','Trade date'),t('状态','Status'),t('操作','Action')],W.data.orders.map(o=>[`${o.id}<small>${o.series}</small>`,money(o.face),o.date,W.orderStatus(o),button(t('查看挂单','View order'),'/orders/'+o.id)])));
  W.wallet=()=>W.header(t('EMT 余额与记账','EMT balance & ledger'),t('查看本地演示资金变化。成员持仓通过 VMI ID 记在平台总账户内。','View local demo fund movements. Member token holdings are allocated by VMI ID within the platform omnibus account.'))+W.summary([[t('可用 EMT','Available EMT'),money(W.data.balance),'USD EMT'],[t('已扣款待交割','Debited, pending settlement'),money(W.data.orders.filter(o=>o.status==='settlementPending').reduce((n,o)=>n+o.cost,0)),t('等待交割回执','Awaiting settlement receipts')],[t('成员分户','Member allocation'),'VMI-ALPHA-001',t('总账户内分户记账','Allocation in omnibus account')]])+W.pageIntro(t('本版本未连接真实 Remi 账户。充值和提现由既有资金系统处理；这里展示演示交易记账，不提供外部代币转账。','This version is not connected to a real Remi account. Funding and withdrawal use the existing fund system. This screen shows demo ledger movements and provides no external token transfer.'))+W.panel(t('交易资金变化','Order fund movements'),W.table([t('挂单','Order'),t('EMT 金额','EMT amount'),t('资金状态','Fund status'),t('操作','Action')],W.data.orders.map(o=>[o.id,money(o.cost),o.status==='provisional'?t('未扣款','Not debited'):o.status==='cancelled'?t('退款完成','Refunded'):t('已扣款','Debited'),button(t('查看挂单','View order'),'/orders/'+o.id)])));
  W.orderDetail=params=>{
    const o=W.data.orders.find(x=>x.id===params.id);if(!o)return W.header(t('未找到挂单','Order not found'),'')+button(t('返回挂单','Back to orders'),'/orders');
    const filled=o.status==='settled',cancelled=o.status==='cancelled';
    return W.header(o.id,o.series+' · '+o.vmi,button(t('返回挂单列表','Back to orders'),'/orders'))+W.panel(t('挂单状态','Order status'),`<div class="wf-task-body">${W.orderStatus(o)}${W.facts([[t('购买面值','Face value'),money(o.face)],[t('预定交易日','Scheduled trade date'),o.date],[t('EMT 扣款','EMT debit'),o.status==='provisional'?t('未扣款','Not debited'):cancelled?t('已退回演示扣款','Demo debit refunded'):money(o.cost)],[t('代币记账','Token allocation'),filled?t('TokenBank 总账户 · VMI 分户','TokenBank omnibus · VMI allocation'):t('尚未交割','Not settled')],[t('交割凭证','Settlement receipt'),esc(o.receipt||'—')]])}${!filled&&!cancelled?`<div class="wf-actions"><button class="btn" onclick="TB.workflow.cancelOrder('${o.id}')">${t('撤销未成交挂单（演示）','Cancel unfilled order (demo)')}</button></div>`:''}${o.status==='settlementPending'?`<form class="wf-receipt" onsubmit="event.preventDefault();TB.workflow.settleOrder('${o.id}')"><label class="wf-field">${t('模拟 EMT / 代币交割回执编号','Demo EMT / token settlement receipt')}<input id="wf-settle-ref" required maxlength="100"></label><button class="btn btn-primary">${t('模拟收到交割成功回执','Simulate successful settlement receipt')}</button></form>`:''}${o.status==='provisional'?W.notice(t('未来预定规则尚待对齐，本演示不扣定金或自动成交。交易日需重新核验合规、余额和报价。','Future-booking rules await alignment. No deposit or automatic execution in this demo. Recheck compliance, funds and quote on the trade date.'),'warning'):''}${filled?button(t('查看持仓','View position'),'/holdings/'+o.holdingId,true):''}<p class="wf-muted">${t('演示操作仅保存在本浏览器，不影响真实账户。','Demo actions are saved in this browser only and do not affect real accounts.')}</p></div>`);
  };
  W.cancelOrder=id=>{const o=W.data.orders.find(x=>x.id===id);if(!o||!['provisional','settlementPending'].includes(o.status))return;
    if(o.status==='settlementPending'){W.data.balance+=o.cost;W.data.reserve-=o.cost-20;}o.status='cancelled';W.event(id+' · '+t('挂单已撤销','Order cancelled'));TB.router.render();};
  W.settleOrder=id=>{const o=W.data.orders.find(x=>x.id===id),ref=document.getElementById('wf-settle-ref').value.trim();if(!o||o.status!=='settlementPending'||!ref)return;o.status='settled';o.receipt=ref;o.holdingId='HLD-'+Date.now();W.event(id+' · '+t('已登记交割回执','Settlement receipt recorded'));W.syncHoldings();TB.router.render();};
  W.syncHoldings=()=>W.data.orders.filter(o=>o.status==='settled').forEach(o=>{if(!TB.data.holdings.some(h=>h.id===o.holdingId)){const s=W.series(o.series);TB.data.holdings.push({id:o.holdingId,series:o.series,faceValue:o.face,tokens:o.face,checkin:o.date,maturityDate:s.maturityDate,valuation:o.face*o.price,sellerYield:s.sellerYield,expectedReturn:0,status:'settled',member:'Alpha Fund Management'});}});
  W.syncHoldings();
  const originalHolding=TB.router.routes.member['/holdings/:holdingId'];
  const originalProduct=TB.router.routes.member['/market/:productId'];
  TB.router.register('member',{'/market':W.market,'/subscribe/:id':W.subscribe,'/orders':W.orders,'/orders/:id':W.orderDetail,'/wallet':W.wallet,
    '/holdings/:holdingId':p=>W.pageIntro(t('此持仓在 TokenBank 虚拟总账户内，以 VMI-ALPHA-001 记账。到期自动兑付 EMT 并回收代币。试运营不支持提前退出或展期。','This holding is recorded in the TokenBank omnibus account under VMI-ALPHA-001. At maturity, EMT is paid and tokens return automatically. Early exit and rollover are unavailable in the pilot.'))+originalHolding(p),
    '/market/:productId':p=>W.subscribe({id:p.productId})
  });
  TB.pages.member.bookAheadFromRow=id=>TB.router.navigate('#/subscribe/'+id);
  if(TB.pages.member.startPurchase)TB.pages.member.startPurchase=id=>TB.router.navigate('#/subscribe/'+id);
  // Saved order capacity is projected into the legacy data model on every load.
  W.data.orders.filter(o=>['settled','settlementPending'].includes(o.status)).forEach(o=>{const s=W.series(o.series);if(s)s.faceAvailable=Math.max(0,s.faceAvailable-o.face);});
  const confirmOrder=W.confirmOrder;
  W.confirmOrder=()=>{const before=W.data.orders.length;confirmOrder();if(W.data.orders.length>before){const o=W.data.orders[0];if(o.status==='settlementPending')W.series(o.series).faceAvailable-=o.face;}};
  const cancel=W.cancelOrder;
  W.cancelOrder=id=>{const o=W.data.orders.find(x=>x.id===id),reserved=o&&o.status==='settlementPending';cancel(id);if(reserved)W.series(o.series).faceAvailable+=o.face;};
  setInterval(()=>{if(!W.draft||W.draft.step!==2||!(/^#\/(subscribe|market)\//.test(TB.state.route)))return;const el=document.getElementById('wf-quote-time'),button=document.getElementById('wf-confirm-order');if(!el||!button)return;const secs=Math.max(0,Math.ceil((W.draft.quoteUntil-Date.now())/1000));el.textContent=secs?t('报价剩余 ','Quote expires in ')+Math.floor(secs/60)+':'+String(secs%60).padStart(2,'0'):t('报价已过期，请重新获取','Quote expired; refresh required');button.disabled=secs===0;},1000);
})();

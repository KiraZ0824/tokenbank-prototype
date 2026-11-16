/* Workflow UI revision. Local demo only; no financial or approval API calls. */
(function(){
  'use strict';
  const W = TB.workflow = {};
  const t = W.t = (zh,en)=>TB.state.lang==='zh'?zh:en;
  const esc = TB.utils.esc;
  const money = n=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:2}).format(n);
  const nav = path=>TB.router.navigate('#'+path);
  const btn = (label,path,primary=false)=>`<button class="btn ${primary?'btn-primary':''}" onclick="TB.router.navigate('#${path}')">${label}</button>`;
  const badge = (label,tone='neutral')=>`<span class="wf-badge ${tone}">${label}</span>`;
  const labels = ()=>({member:t('成员机构','Member institution'),issuer:t('Bison Bank · 执行代理','Bison Bank · Operator'),bg:t('Bison Group · 发行方','Bison Group · Issuer'),ops:t('TokenBank · RWA 运营','TokenBank · RWA operations')});
  const defaults = ()=>({version:3,reserve:4500000,balance:12500000,orders:[],events:[],products:[
    {id:'R-UST-2026-001',stage:7,history:[]},
    {id:'R-UST-2026-007',stage:3,history:[]},
    {id:'R-UST-2026-008',stage:5,history:[]},
    {id:'R-UST-2026-005',stage:9,history:[]}
  ]});
  try{W.data=JSON.parse(localStorage.getItem('tokenbank-workflow-v3'));}catch(e){}
  if(!W.data || W.data.version!==3) W.data=defaults();
  W.save=()=>{try{localStorage.setItem('tokenbank-workflow-v3',JSON.stringify(W.data));}catch(e){TB.utils.toast(t('浏览器未能保存演示数据','Browser could not save demo data'),'error');}};
  W.event=(text)=>{W.data.events.unshift({text,time:new Date().toISOString()});W.save();};
  W.product=id=>W.data.products.find(p=>p.id===id);
  W.series=id=>TB.data.series.find(s=>s.id===id);
  W.stages=()=>[
    [t('资产与指令','Asset & mandate'),'bg',t('BG 确认美债持仓及代币化授权；Bank 代录交易票据。','BG confirms Treasury holdings and tokenization mandate; Bank records the trade.')],
    [t('银行经办录入','Bank preparation'),'issuer',t('录入购买与交易票据，并标明资产归属 BG。','Record the purchase and trade evidence with BG as asset owner.')],
    [t('银行复核','Bank verification'),'issuer',t('复核票据、授权和产品字段；退回时填写原因。','Verify trade evidence, mandate and product fields; provide a reason when returning.')],
    [t('产品部门审核','Product review'),'ops',t('审核产品结构、风险和盈利性；不承担实时市场核价。','Review structure, risk and profitability; no real-time market price validation.')],
    [t('IT 部门审核','IT review'),'ops',t('审核技术字段与发行参数，通过后提交 Remi。','Review technical fields and issuance parameters before sending to Remi.')],
    [t('Remi 铸币回执','Remi mint receipt'),'issuer',t('复用现有发币系统；收到审核通过及铸币回执后再更新状态。','Reuse the existing issuance system; wait for approval and mint receipt.')],
    [t('BG 报价与上架','BG quote & listing'),'bg',t('卖方提供报价；报价职责按当前方案，待业务最终确认。','Seller supplies the quote; pricing ownership remains subject to final confirmation.')],
    [t('开放销售','Open for sale'),'ops',t('成员以 EMT 购买；持仓记在虚拟总账户下，以 VMI ID 区分。','Members pay EMT; holdings stay in the omnibus account, allocated by VMI ID.')],
    [t('到期资金准备','Maturity funding'),'bg',t('系统检查总账户 EMT 储备；不足时通知 BG 通过既有路径充值或重铸。','Check omnibus EMT reserves; notify BG to fund or mint via the existing path if insufficient.')],
    [t('EMT 兑付','EMT payout'),'ops',t('确认 EMT 支付回执后更新兑付状态，不能以申请成功代替付款成功。','Update payout only after an EMT payment receipt, not merely submission.')],
    [t('代币自动回收','Automatic token return'),'ops',t('按 VMI ID 核对持仓并自动回收；代币不在成员个人钱包。','Reconcile each VMI allocation and return tokens automatically from the omnibus account.')],
    [t('Bank 对账','Bank reconciliation'),'issuer',t('核对 EMT 全部结算、成员持仓回收及发行账户代币数量。','Reconcile all EMT settlements, returned allocations and issuer token balances.')],
    [t('BG 批准销毁','BG burn approval'),'bg',t('确认对账一致后，由 BG 批准发行资产代币销毁。','BG authorizes destruction after reconciliation matches.')],
    [t('Bank 执行销毁','Bank executes burn'),'issuer',t('Bank 作为代理通过 Remi 发起销毁，并等待发行系统成功回执。','Bank acts as agent through Remi; wait for successful issuer-system receipt.')],
    [t('已完成','Completed'),'',t('资金兑付、代币回收、对账与销毁均完成。','Payout, token return, reconciliation and burn are complete.')]
  ];
  W.totalDue=()=>W.data.products.filter(p=>p.stage>=8&&p.stage<10).reduce((n,p)=>n+W.series(p.id).faceTotal,0);
  W.header=(title,sub,actions='')=>`<h1 class="sr-only">${esc(title)}</h1>${actions?`<div class="wf-page-actions">${actions}</div>`:''}`;
  TB.utils.contentHeader=(title,actions)=>W.header(title,'',actions||'');
  W.pageIntro=()=>'';
  W.panel=(title,body,action='')=>`<section class="wf-panel"><div class="wf-panel-head"><h2>${title}</h2>${action}</div>${body}</section>`;
  W.notice=(text,tone='info')=>`<div class="wf-notice ${tone}">${text}</div>`;
  W.facts=(rows)=>`<dl class="wf-facts">${rows.map(([a,b])=>`<div><dt>${a}</dt><dd>${b}</dd></div>`).join('')}</dl>`;
  W.table=(headers,rows)=>`<div class="wf-table-scroll"><table class="wf-table"><thead><tr>${headers.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.length?rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join(''):`<tr><td colspan="${headers.length}" class="wf-empty">${t('没有符合条件的记录','No matching records')}</td></tr>`}</tbody></table></div>`;
  W.summary=(rows)=>`<div class="wf-summary">${rows.map(([label,value,foot])=>`<div><span>${label}</span><strong>${value}</strong><small>${foot}</small></div>`).join('')}</div>`;
  W.progress=(p)=>{
    const groups=[[0,2,t('资产与录入','Asset preparation')],[3,4,t('产品 / IT 审核','Product / IT review')],[5,6,t('铸币与上架','Mint & list')],[7,7,t('交易与持仓','Trade & holdings')],[8,10,t('兑付与回收','Payout & return')],[11,14,t('对账与销毁','Reconcile & burn')]];
    return `<ol class="wf-progress">${groups.map(([start,end,label],i)=>`<li class="${p.stage>end?'done':p.stage>=start?'current':''}"><span>${p.stage>end?'✓':i+1}</span><div>${label}<small>${p.stage>end?t('已完成','Complete'):p.stage>=start?t('进行中','In progress'):t('待前序完成','Waiting')}</small></div></li>`).join('')}</ol>`;
  };
  W.dashboard=function(){
    const member=TB.state.portal==='member',due=W.totalDue(),short=Math.max(0,due-W.data.reserve);
    const active=W.data.products.filter(p=>p.stage<14),tasks=active.filter(p=>W.stages()[p.stage][1]===TB.state.portal);
    let title=member?t('机构资产工作台','Institutional workspace'):TB.state.portal==='bg'?t('发行与资金工作台','Issuance & funding workspace'):TB.state.portal==='issuer'?t('代理执行工作台','Agency operations workspace'):t('全流程运营工作台','Lifecycle operations workspace');
    let h=W.header(title,member?t('查看产品、管理挂单，跟踪 EMT 交割和到期兑付。','Discover products, manage orders and follow EMT settlement through maturity.'):t('按责任处理下一步，同时跟踪资金与代币的独立状态。','Act on your next task and follow funds and tokens separately.'),btn(member?t('浏览产品','Explore products'):t('全流程台账','Lifecycle register'),member?'/market':'/lifecycle',true));
    h+=W.summary(member?[[t('可用 EMT','Available EMT'),money(W.data.balance),t('演示账户 · USD EMT','Demo account · USD EMT')],[t('持仓面值','Position face value'),money(TB.data.holdings.filter(x=>x.member==='Alpha Fund Management').reduce((n,x)=>n+x.faceValue,0)),t('TokenBank 总账户内记账','Allocated in TokenBank omnibus')],[t('我的挂单','My orders'),W.data.orders.length,t('按 VMI ID 追踪','Tracked by VMI ID')],[t('到期机制','Maturity mechanism'),t('自动兑付','Automatic payout'),t('无须手动赎回或提币','No manual redemption or token withdrawal')]]:[[t('当前待办','Your tasks'),tasks.length,t('仅显示本角色负责节点','Assigned to your role')],[t('运行中产品','Active products'),active.length,t('贯穿发行至销毁','Issuance through burn')],[t('到期应付 EMT','EMT payout due'),money(due),t('按台账中待兑付产品汇总','Based on products pending payout')],[t('储备缺口','Reserve shortfall'),money(short),short?t('需要 BG 准备资金','BG funding needed'):t('储备充足','Reserves sufficient')]]);
    if(member){
      h+='<div class="wf-columns">'+W.panel(t('近期持仓','Recent holdings'),W.table([t('产品 / VMI','Product / VMI'),t('面值','Face value'),t('到期日','Maturity'),t('操作','Action')],TB.data.holdings.filter(x=>x.member==='Alpha Fund Management').map(x=>[`${x.series}<small>VMI-ALPHA-001</small>`,money(x.faceValue),x.maturityDate,btn(t('查看持仓','View position'),'/holdings/'+x.id)])))+W.panel(t('账户与资金归属','Account & ownership'),W.facts([[t('成员标识','Member allocation'),'VMI-ALPHA-001'],[t('持仓位置','Holding location'),t('TokenBank 虚拟总账户','TokenBank omnibus account')],[t('EMT 支付路径','EMT payment'),t('成员 → TokenBank 总账户','Member → TokenBank omnibus')],[t('代币转出','Token withdrawal'),t('不支持外部转出','External withdrawal unavailable')]]))+'</div>';
    }else{
      if(short)h+=W.notice(`${t('到期 EMT 储备不足','Maturity EMT shortfall')} · ${money(short)} — ${t('请通知 BG 通过 Bison Bank / Remi 既有路径补充资金。','Notify BG to fund through the existing Bison Bank / Remi flow.')} ${btn(t('查看资金准备','View funding'),'/funding')}`,'warning');
      h+='<div class="wf-columns">'+W.panel(tasks.length?t('优先处理','Action queue'):t('全局产品进度','Global product progress'),W.table([t('产品','Product'),t('当前节点','Current stage'),t('责任方','Owner'),t('操作','Action')],(tasks.length?tasks:active).map(p=>[p.id,badge(W.stages()[p.stage][0],p.returned?'danger':'warning'),labels()[W.stages()[p.stage][1]],btn(t('处理任务','Open task'),'/lifecycle/'+p.id)])),badge(t('演示任务','Demo tasks')))+W.panel(t('角色与责任','Roles & responsibilities'),`<div class="wf-responsibilities">${[['BG',t('资产与资金归属','Asset & fund ownership'),t('指令、卖方报价、资金准备、销毁批准','Mandate, seller quotes, funding and burn approval')],['BB',t('Bison Bank 执行代理','Bison Bank execution agent'),t('录入、复核、代理铸币、对账、执行销毁','Record, verify, agent minting, reconcile and burn')],['TB',t('TokenBank / RWA','TokenBank / RWA'),t('产品与 IT 审核、VMI 记账、储备检查、自动兑付','Product / IT review, VMI ledger, reserves and automatic payout')]].map(([a,b,c])=>`<div><b>${a}</b><section><strong>${b}</strong><p>${c}</p></section></div>`).join('')}</div>`)+'</div>';
    }
    h+=W.panel(t('近期流程记录','Recent workflow activity'),W.data.events.length?`<ul class="wf-events">${W.data.events.slice(0,5).map(e=>`<li><span>${esc(e.text)}</span><time>${new Date(e.time).toLocaleString(TB.state.lang==='zh'?'zh-CN':'en-US',{timeZone:'Asia/Shanghai'})} CST</time></li>`).join('')}</ul>`:`<div class="wf-empty">${t('完成演示操作后，记录将显示在这里。','Demo actions will appear here after you complete a task.')}</div>`);
    return h;
  };
  W.lifecycle=function(){
    let h=W.header(t('产品全流程台账','Product lifecycle register'),t('从资产指令到销毁回执，查看每个产品的责任主体与当前节点。','Track ownership and each product from asset mandate to burn receipt.'),btn(t('角色与规则','Roles & rules'),'/rules'));
    h+=W.panel(t('全部产品','All products'),`<div class="wf-toolbar"><label class="wf-search">${t('搜索产品','Search products')}<input id="wf-search" type="search" placeholder="R-UST-2026…" oninput="TB.workflow.filterProducts(this.value)"></label><label>${t('节点责任方','Stage owner')}<select id="wf-owner" onchange="TB.workflow.filterProducts(document.getElementById('wf-search').value)"><option value="">${t('全部角色','All roles')}</option>${Object.entries(labels()).filter(([k])=>k!=='member').map(([k,v])=>`<option value="${k}">${v}</option>`).join('')}</select></label></div><div id="wf-product-table">${W.productRows('','')}</div>`);
    h+=W.pageIntro(t('底层持有人及发行方为 Bison Group；Bison Bank 仅以 Agent / Operator 身份执行。BG 的具体法律实体仍待业务确认。','Bison Group is the asset owner and issuer. Bison Bank acts as agent/operator. BG’s exact legal entity is pending business confirmation.'));
    return h;
  };
  W.productRows=(query,owner)=>W.table([t('产品','Product'),t('发行归属','Issuer ownership'),t('发行面值','Face value'),t('当前节点','Current stage'),t('下一责任方','Next owner'),t('操作','Action')],W.data.products.filter(p=>p.id.toLowerCase().includes(query.toLowerCase())&&(!owner||W.stages()[p.stage][1]===owner)).map(p=>[`${p.id}<small>${t('美债代币 · BNY 记账链路','Treasury token · BNY booking flow')}</small>`,'Bison Group',money(W.series(p.id).faceTotal),badge(p.returned?t('已退回 · 待修订','Returned · Revision required'):W.stages()[p.stage][0],p.returned?'danger':p.stage===14?'success':'info'),labels()[W.stages()[p.stage][1]]||'—',btn(t('查看流程','View lifecycle'),'/lifecycle/'+p.id)]));
  W.filterProducts=q=>{document.getElementById('wf-product-table').innerHTML=W.productRows(q,document.getElementById('wf-owner').value);};
  W.detail=function(params){
    const p=W.product(params.id),s=W.series(params.id);
    if(!p||!s)return W.header(t('未找到产品','Product not found'),'')+btn(t('返回台账','Back to register'),'/lifecycle');
    const stage=W.stages()[p.stage],can=stage[1]===TB.state.portal;
    let h=W.header(p.id,t('发行方 Bison Group · 执行代理 Bison Bank · 账本 TokenBank','Issuer Bison Group · Agent Bison Bank · Ledger TokenBank'),btn(t('返回台账','Back to register'),'/lifecycle'))+W.progress(p);
    if(p.returned)h+=W.notice(`${t('退回原因','Return reason')}: ${esc(p.returned)}`,'danger');
    h+='<div class="wf-columns detail">';
    h+=W.panel(`${t('当前任务','Current task')} · ${stage[0]}`,`<div class="wf-task-body">${badge(p.stage===14?t('已完成','Completed'):t('待处理','Awaiting action'),p.stage===14?'success':'warning')}<h2>${stage[0]}</h2><p>${stage[2]}</p>${W.facts([[t('节点责任方','Stage owner'),labels()[stage[1]]||'—'],[t('产品到期日','Maturity'),s.maturityDate],[t('发行面值','Face value'),money(s.faceTotal)],[t('兑付状态','Payout'),p.stage>9?t('已确认 EMT 回执','EMT receipt confirmed'):t('尚未完成','Not completed')],[t('代币状态','Token status'),p.stage===14?t('已销毁','Burned'):p.stage>10?t('已回收 · 待销毁','Returned · Awaiting burn'):t('总账户 / VMI 记账','Omnibus / VMI allocation')]])}${can&&p.stage<14?W.taskForm(p):W.notice(p.stage===14?t('本产品生命周期已完成。','This product lifecycle is complete.'):t('当前节点由其他角色负责，请通过顶部演示入口切换后查看操作。','Another role owns this stage. Switch the demo workspace to view its actions.'))}</div>`);
    h+=`<div>${W.panel(t('资金与资产路径','Fund & asset flow'),`<div class="wf-flow"><div><b>Bison Group</b><small>${t('资产持有人 / 发行方','Asset owner / issuer')}</small></div><span>↓ ${t('授权','Mandate')}</span><div><b>Bison Bank → BNY</b><small>${t('代理购买、记账及到期法币结算','Agent purchase, booking & fiat maturity')}</small></div><span>↓ ${t('代币化','Tokenization')}</span><div><b>TokenBank</b><small>${t('虚拟总账户 · VMI 分户','Omnibus · VMI allocations')}</small></div><span>↔ USD EMT</span><div><b>${t('成员机构','Member institutions')}</b><small>${t('购买 / 到期收款','Purchase / maturity payment')}</small></div></div>`)}${W.panel(t('相关操作','Related actions'),`<div class="wf-link-list">${btn(t('EMT 资金准备','EMT funding'),'/funding')}${btn(t('报价与待确认事项','Quotes & open issues'),'/rules')}${TB.state.portal==='issuer'?btn(t('原产品详细字段','Full product fields'),'/series/'+p.id):''}</div>`)}</div></div>`;
    h+=W.panel(t('节点执行记录','Stage audit trail'),p.history.length?W.table([t('完成节点','Completed stage'),t('执行角色','Role'),t('凭证 / 原因','Evidence / reason'),t('时间','Time')],p.history.slice().reverse().map(e=>[esc(e.stage),esc(e.actor),esc(e.ref),new Date(e.time).toLocaleString()])):`<div class="wf-empty">${t('预置演示节点尚无执行记录。后续操作将在此留痕。','Seeded demo stages have no execution records. New actions will be recorded here.')}</div>`);
    return h;
  };
  W.taskForm=p=>{
    const needReceipt=[0,1,2,5,6,9,10,11,13].includes(p.stage),fundBlocked=p.stage===8&&W.data.reserve<W.totalDue();
    return `<form id="wf-task-form" onsubmit="event.preventDefault();TB.workflow.advance('${p.id}')"><h3>${t('操作核对','Action checklist')}</h3><label class="wf-check"><input type="checkbox" id="wf-attest" required>${t('已核对本节点前置条件和相关凭证','I have checked stage prerequisites and supporting evidence')}</label><label class="wf-field">${needReceipt?t('凭证或回执编号（必填）','Evidence / receipt ID (required)'):t('审核意见或备注','Review comment / note')}<input id="wf-ref" ${needReceipt?'required':''} maxlength="200" placeholder="${needReceipt?t('输入已核实的回执编号','Enter a verified receipt reference'):t('输入审核说明','Enter review notes')}"></label>${p.stage===11?W.notice(t('必须确认 EMT 全部结算、全部代币回收且数量一致。','Confirm all EMT payouts and token returns are complete and quantities match.')):''}${fundBlocked?W.notice(t('EMT 储备不足，暂不能进入兑付。请先通知 BG 并登记到账回执。','Insufficient EMT reserves. Notify BG and record a funding receipt first.'),'warning'):''}<div id="wf-task-error" class="wf-error" role="alert"></div><div class="wf-actions"><button class="btn btn-primary" ${fundBlocked?'disabled':''} type="submit">${t('模拟完成当前节点','Simulate stage completion')}</button>${[2,3,4].includes(p.stage)?`<button class="btn" type="button" onclick="TB.workflow.returnTask('${p.id}')">${t('退回修改','Return for revision')}</button>`:''}</div><small class="wf-muted">${t('仅修改本地演示状态，不向 Remi / BNY 发送请求。','Changes local demo state only. No request is sent to Remi / BNY.')}</small></form>`;
  };
  W.advance=id=>{
    const p=W.product(id);if(!p||W.stages()[p.stage][1]!==TB.state.portal)return;
    const ref=document.getElementById('wf-ref').value.trim();
    if(!document.getElementById('wf-attest').checked)return;
    if([0,1,2,5,6,9,10,11,13].includes(p.stage)&&!ref){document.getElementById('wf-task-error').textContent=t('请填写凭证编号。','Enter an evidence reference.');return;}
    if(p.stage===8&&W.data.reserve<W.totalDue())return;
    if(p.stage===9){if(W.data.reserve<W.series(id).faceTotal){document.getElementById('wf-task-error').textContent=t('资金余额不足，不能登记兑付。','Insufficient reserves for this payout.');return;}W.data.reserve-=W.series(id).faceTotal;}
    p.history.push({stage:W.stages()[p.stage][0],actor:labels()[TB.state.portal],ref:ref||t('核对通过','Verified'),time:new Date().toISOString()});
    p.stage++;delete p.returned;W.event(id+' · '+W.stages()[p.stage][0]);TB.router.render();TB.utils.toast(t('演示节点已更新','Demo stage updated'),'success');
  };
  W.returnTask=id=>{
    const p=W.product(id),ref=document.getElementById('wf-ref').value.trim();
    if(!p||W.stages()[p.stage][1]!==TB.state.portal||![2,3,4].includes(p.stage))return;
    if(!ref){document.getElementById('wf-task-error').textContent=t('退回时请填写具体原因。','Provide a reason before returning.');return;}
    p.history.push({stage:W.stages()[p.stage][0],actor:labels()[TB.state.portal],ref:t('退回：','Returned: ')+ref,time:new Date().toISOString()});p.returned=ref;p.stage=1;W.event(id+' · '+t('退回银行经办','Returned to Bank preparation'));TB.router.render();
  };
  W.funding=function(){
    const due=W.totalDue(),gap=Math.max(0,due-W.data.reserve),can=TB.state.portal==='bg';
    return W.header(t('EMT 储备与资金准备','EMT reserves & funding'),t('资金归属 Bison Group；TokenBank 负责记账与储备检查。','Funds belong to Bison Group; TokenBank maintains the ledger and checks reserves.'))+W.summary([[t('总账户可用储备','Omnibus available reserves'),money(W.data.reserve),'USD EMT'],[t('待兑付金额','Pending payouts'),money(due),t('根据流程台账汇总','From the lifecycle register')],[t('所需补充','Funding required'),money(gap),gap?t('通知 BG 补充','Notify BG'):t('无需补充','No additional funding')]])+W.pageIntro(t('若资金不足，通知 BG 在 Bison Bank 法币账户充值，或通过现有 Remi 流程重铸 EMT。此界面不新建铸币渠道。','When funds are insufficient, notify BG to fund its Bison Bank fiat account or mint EMT through the existing Remi process. This screen does not create a new minting channel.'),gap?'warning':'info')+'<div class="wf-columns">'+W.panel(t('资金路径与职责','Funding path & ownership'),`<div class="wf-task-body">${W.facts([[t('资产与资金归属方','Asset & fund owner'),'Bison Group'],[t('法律实体','Legal entity'),badge(t('待业务确认','Pending business confirmation'),'warning')],[t('代理执行方','Execution agent'),'Bison Bank'],[t('EMT 记账位置','EMT ledger'),t('TokenBank 虚拟大账户','TokenBank virtual omnibus')],[t('成员分户','Member subledger'),'VMI ID']])}<button class="btn btn-primary" onclick="TB.workflow.notifyFunding()">${t('记录通知 BG（演示）','Record BG notification (demo)')}</button></div>`)+W.panel(t('登记既有系统到账回执','Record an existing-system funding receipt'),can?`<form class="wf-task-body" onsubmit="event.preventDefault();TB.workflow.fund()"><label class="wf-field">${t('到账 EMT 金额','EMT received')}<input id="wf-fund-amount" type="number" min="0.01" max="1000000000" step="0.01" required value="${gap||1000000}"></label><label class="wf-field">${t('Remi 到账回执编号','Remi funding receipt ID')}<input id="wf-fund-ref" required maxlength="100"></label><label class="wf-check"><input type="checkbox" required>${t('已在现有系统核实到账，仅登记演示记录','Verified receipt in the existing system; record demo only')}</label><div id="wf-fund-error" class="wf-error" role="alert"></div><button class="btn btn-primary">${t('模拟登记到账','Simulate receipt')}</button></form>`:`<div class="wf-task-body">${W.notice(t('此操作由 BG 独立账户执行。请通过顶部切换到 BG 演示入口。','This action belongs to the independent BG account. Switch to the BG demo workspace.'))}</div>`)+'</div>';
  };
  W.notifyFunding=()=>{W.event(t('已记录 BG 储备不足通知（本地演示，未发送消息）','BG reserve notification recorded (local demo; no message sent)'));TB.utils.toast(t('已记录本地演示通知','Local demo notification recorded'),'success');};
  W.fund=()=>{const amount=Number(document.getElementById('wf-fund-amount').value),ref=document.getElementById('wf-fund-ref').value.trim();if(TB.state.portal!=='bg'||!Number.isFinite(amount)||amount<=0||amount>1e9||!ref)return;W.data.reserve+=amount;W.event(t('BG 登记 EMT 到账：','BG EMT receipt: ')+money(amount)+' · '+ref);TB.router.render();};
  W.rules=()=>W.header(t('业务角色与待确认事项','Business roles & open decisions'),t('按最新研讨纪要展示职责，保留尚未确定的业务边界。','Responsibilities reflect the latest meeting notes; unresolved boundaries remain explicit.'))+W.panel(t('已经明确的设计规则','Confirmed design rules'),W.table([t('事项','Item'),t('界面行为','UI behavior')],[
    [t('发行与资产归属','Issuance & ownership'),t('Bison Group 为发行方与底层资产持有人；Bison Bank 为 Agent / Operator。','Bison Group owns the assets and issues tokens; Bison Bank acts as Agent / Operator.')],
    [t('账户隔离','Account separation'),t('BG 拥有独立入口；银行代理操作始终显示资金与资产归属。','BG has an independent workspace; agent actions identify ownership.')],
    [t('虚拟大账户','Omnibus ledger'),t('代币留在 TokenBank 总账户，以 VMI ID 区分成员，不转至个人钱包。','Tokens stay in the TokenBank omnibus account, allocated by VMI ID, with no personal-wallet delivery.')],
    [t('到期处理','Maturity'),t('自动触发兑付、回收，再经对账、BG 批准及 Bank 代理销毁。','Automatically initiate payout and return; reconcile, obtain BG approval, then let Bank execute burn.')],
    [t('流动性处理','Liquidity'),t('储备不足通知 BG；复用既有法币充值 / EMT 重铸链路。','Notify BG on a shortfall; reuse existing fiat funding / EMT minting.')],
    [t('试运营限制','Pilot restrictions'),t('提前退出不可用；展期暂不开发。','Early exit is unavailable; rollover is out of current scope.')]
  ]))+W.panel(t('待业务确认','Pending business confirmation'),W.table([t('问题','Question'),t('当前处理','Current treatment'),t('状态','Status')],[
    [t('BG 的具体法律实体','Exact BG legal entity'),t('BNY 记账与 TokenBank 充值实体均不预填结论。','Do not assert the BNY booking or TokenBank funding entity.'),badge(t('待确认','Open'),'warning')],
    [t('谁负责维护 Quote？','Who maintains quotes?'),t('目前倾向由卖方 BG 提供；Product Team 不负责实时市场比价。','Current preference: seller BG quotes. Product Team does not validate against real-time market feeds.'),badge(t('方案待定','Provisional'),'warning')],
    [t('持有人的法律权利','Holder legal claims'),t('BG 失败时对底层票据的权利须由业务 / 法务确认。','Claims against underlying bills on BG failure require business/legal confirmation.'),badge(t('待确认','Open'),'warning')],
    [t('做市商职责','Market-maker responsibilities'),t('Bison Trust 等实体的角色边界待确认。','Boundaries for Bison Trust and other entities remain open.'),badge(t('待确认','Open'),'warning')]
  ]));
  // Separate workspaces preserve the distinction between beneficial owner and agent.
  TB.data.users.push({id:'BG001',name:'BG Treasury',email:'treasury@bisongroup.demo',role:'bg_admin',portal:'bg',org:'Bison Group',remiId:'BG-ENTITY-PENDING'});
  TB.i18n['portal.bg']={zh:'BG 发行方',en:'BG Issuer'};
  TB.i18n['portal.issuer']={zh:'Bank 执行代理',en:'Bank Operator'};
  TB.i18n['nav.series']={zh:'产品代录与申请',en:'Product preparation'};
  TB.i18n['nav.burn']={zh:'销毁执行与回执',en:'Burn execution & receipt'};
  TB.data.series.forEach(s=>{s.issuer='Bison Group';s.quoteProvider='Bison Group';});
  ['bg','issuer','ops'].forEach(portal=>{
    if(portal==='bg') TB.nav.bg=[{group:null,items:[]}];
    TB.nav[portal][0].items.push({label:{zh:'产品全流程',en:'Product lifecycle'},icon:'series',route:'#/lifecycle'},{label:{zh:'EMT 资金准备',en:'EMT funding'},icon:'wallet',route:'#/funding'},{label:{zh:'角色与待确认',en:'Roles & open issues'},icon:'review',route:'#/rules'});
    TB.router.register(portal,{'/dashboard':W.dashboard,'/lifecycle':W.lifecycle,'/lifecycle/:id':W.detail,'/funding':W.funding,'/rules':W.rules});
  });
  TB.router.register('member',{'/dashboard':W.dashboard,'/rules':W.rules});
  // Redirect previous operational shortcuts to the revised lifecycle gates.
  TB.router.register('issuer',{'/burn':W.lifecycle,'/emt':W.funding,'/quotes':W.rules});
  TB.router.register('ops',{'/series-review':W.lifecycle,'/product-monitor':W.lifecycle});
  W.switchPortal=portal=>{if(!labels()[portal])return;TB.auth.login(portal);};
  TB.auth.renderShell=function(){
    document.getElementById('topbar').innerHTML=`<div class="wf-logo"><span class="wf-brand-icon">T</span>TokenBank</div><span class="wf-demo">${t('交互演示 · 本地数据','Interactive demo · Local data')}</span><div class="topbar-right"><label class="wf-workspace"><span class="sr-only">${t('切换演示角色','Switch demo role')}</span><select onchange="TB.workflow.switchPortal(this.value)">${Object.entries(labels()).map(([k,v])=>`<option value="${k}" ${TB.state.portal===k?'selected':''}>${v}</option>`).join('')}</select></label>${TB.utils.langSelect('lang-select')}<button class="btn btn-sm" onclick="TB.auth.logout()">${TB.t('logout')}</button></div>`;TB.auth.renderSidebar();
  };
  TB.auth.renderSidebar=function(){
    const side=document.getElementById('sidebar'),content=document.getElementById('main-content');
    const shell=document.getElementById('app-shell');
    if(TB.state.portal==='member'){
      shell.classList.add('member-layout');
      side.style.display='block';content.classList.remove('content-centered');
      content.style.removeProperty('margin-left');content.style.removeProperty('width');
      const items=[...TB.nav.member.flatMap(g=>g.items||[]),{label:{zh:'我的挂单',en:'My orders'},route:'#/orders'},{label:{zh:'业务规则',en:'Business rules'},route:'#/rules'}];
      side.innerHTML=`<nav class="wf-member-nav" aria-label="${t('成员机构主导航','Member main navigation')}">${items.map(it=>{
        const route=TB.state.route||'';
        const active=route===it.route||route.startsWith(it.route+'/')||(it.route==='#/market'&&route.startsWith('#/subscribe/'));
        return `<button class="menu-item ${active?'active':''}" ${active?'aria-current="page"':''} onclick="TB.router.navigate('${it.route}')">${TB.text(it.label)}</button>`;
      }).join('')}</nav>`;
      return;
    }
    shell.classList.remove('member-layout');
    side.style.display='block';content.classList.remove('content-centered');content.style.removeProperty('margin-left');content.style.removeProperty('width');
    const items=TB.nav[TB.state.portal]||[];
    let html=`<div class="wf-org"><b>${esc(TB.state.user.org)}</b><small>${labels()[TB.state.portal]}</small></div>`;
    if(TB.state.portal==='bg')html+=`<button class="menu-item ${TB.state.route==='#/dashboard'?'active':''}" onclick="TB.router.navigate('#/dashboard')"><span class="menu-item-icon">${TB.icon('dashboard')}</span>${t('发行方工作台','Issuer workspace')}</button>`;
    items.forEach(g=>{if(g.group)html+=`<div class="menu-group-title">${TB.t(g.group)}</div>`;(g.items||[]).forEach(it=>{let active=TB.state.route===it.route||(it.route==='#/lifecycle'&&TB.state.route.startsWith('#/lifecycle/'));html+=`<button class="menu-item ${active?'active':''}" onclick="TB.router.navigate('${it.route}')"><span class="menu-item-icon">${TB.icon(it.icon)}</span>${TB.text(it.label)}</button>`;});});
    if(TB.state.portal==='member')html+=`<button class="menu-item" onclick="TB.router.navigate('#/orders')">${t('我的挂单','My orders')}</button><button class="menu-item" onclick="TB.router.navigate('#/rules')">${t('业务规则','Business rules')}</button>`;
    html+=`<div class="wf-side-note"><strong>${t('资金与资产归属','Asset & fund ownership')}</strong><p>${t('Bison Group 发行 · Bison Bank 代理执行','Bison Group issues · Bison Bank executes as agent')}</p><span>${t('EMT / 代币分别追踪','EMT / tokens tracked separately')}</span></div>`;side.innerHTML=html;
  };
  const originalLogin=TB.auth.showLogin;
  TB.auth.showLogin=function(){originalLogin();const tabs=document.querySelector('.login-tabs');if(tabs){tabs.insertAdjacentHTML('beforeend',`<button class="login-tab" onclick="TB.auth.selectLoginPortal('bg',this)">${t('BG 发行方','BG Issuer')}</button>`);}const note=document.querySelector('.login-hero-note');if(note)note.textContent=t('交互演示：不连接真实资产、审批或资金系统。','Interactive demo: no connection to real assets, approvals or fund systems.');};
  const selectLogin=TB.auth.selectLoginPortal;
  TB.auth.selectLoginPortal=function(portal,el){if(portal==='bg'){TB.auth._loginPortal='bg';el.parentNode.querySelectorAll('.login-tab').forEach(e=>e.classList.remove('active'));el.classList.add('active');document.getElementById('login_email').value='treasury@bisongroup.demo';return;}selectLogin(portal,el);};
  TB.state.lang='zh';
  document.documentElement.lang='zh-CN';
  document.addEventListener('DOMContentLoaded',()=>TB.auth.showLogin());
})();

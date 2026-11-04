/* ============================================================
 * TokenBank Frontend — Member Portal Routes
 * ------------------------------------------------------------
 * Portal: Member (成员机构端)
 * Routes: 20 pages covering login activation, dashboard, market,
 * purchase wizard, book ahead, holdings, transactions, wallet,
 * sub-accounts, notifications, compliance and settings.
 * ============================================================ */
TB.pages = TB.pages || {};
TB.pages.member = TB.pages.member || {};

TB.pages.member.t = function(zh, en){ return TB.state.lang === 'zh' ? zh : en; };
TB.pages.member._seriesById = function(id){ return TB.data.series.find(function(s){ return s.id === id; }) || TB.data.series[0]; };
TB.pages.member._holdingById = function(id){ return TB.data.holdings.find(function(h){ return h.id === id; }) || TB.data.holdings[0]; };
TB.pages.member._accountById = function(id){ return TB.data.accounts.find(function(a){ return a.id === id; }) || TB.data.accounts[0]; };
TB.pages.member._bookingById = function(id){ return TB.data.bookings.find(function(b){ return b.id === id; }) || TB.data.bookings[0]; };

TB.pages.member._quickActions = function(){
  return '<div class="flex gap-2">'
    + '<button class="btn btn-primary" onclick="TB.utils.toast(\''+TB.pages.member.t('前往购买','Go to Purchase')+'\',\'success\');TB.router.navigate(\'#\/market\')">'+TB.t('purchase')+'</button>'
    + '<button class="btn btn-primary" onclick="TB.utils.toast(\''+TB.pages.member.t('前往提现','Go to Withdraw')+'\',\'success\');TB.router.navigate(\'#\/wallet\/withdraw\')">'+TB.t('withdraw')+'</button>'
    + '</div>';
};

TB.pages.member._marketRows = function(){
  return TB.data.series.map(function(s){
    return {
      id: s.id,
      product: s.name,
      provider: s.quoteProvider,
      face: TB.utils.money(s.faceAvailable),
      yield: TB.utils.yield(s.sellerYield),
      maturity: TB.utils.date(s.maturityDate),
      price: TB.utils.price(s.markPrice),
      valid: s.quoteValidUntil,
      status: TB.ui.statusBadge(s.status),
    };
  });
};

TB.pages.member._marketView = 'card';
TB.pages.member.setMarketView = function(v){ TB.pages.member._marketView = v; TB.router.render(); };
/* 状态标识：开放购买 / 售罄 / 停止购买，比原始 Series 状态更贴近可交易语义 */
TB.pages.member._marketStatus = function(s){
  var t = TB.pages.member.t;
  if(s.status === 'open') return s.faceAvailable > 0 ? {label:t('开放购买','Open for Purchase'), tone:'success'} : {label:t('售罄','Sold Out'), tone:'default'};
  if(s.status === 'closed') return {label:t('停止购买','Purchase Stopped'), tone:'warning'};
  return {label:TB.utils.enumLabel(s.status), tone:'info'};
};
TB.pages.member._marketPurchasable = function(s){ return s.status === 'open' && s.faceAvailable > 0; };
TB.pages.member._marketCards = function(){
  return TB.data.series.filter(function(s){ return s.status === 'open' || s.status === 'closed'; }).map(function(s){
    var stt = TB.pages.member._marketStatus(s);
    return '<div class="market-card">'
      + '<div class="market-card-top">'
      + '<div>'
      + '<div class="market-card-name">'+TB.utils.esc(s.name)+'</div>'
      + '<div class="market-card-id">'+TB.utils.esc(s.id)+' · '+TB.utils.esc(s.quoteProvider)+'</div>'
      + '</div>'
      + TB.ui.badge(stt.label, stt.tone)
      + '</div>'
      + '<div class="market-card-quote">'
      + '<div class="market-card-quote-rate">'+TB.utils.yield(s.sellerYield)+'</div>'
      + '<div class="market-card-quote-sub">'+TB.pages.member.t('参考收益率','Reference Yield')+'</div>'
      + '</div>'
      + '<div class="market-card-body">'
      + '<div class="market-card-row"><span>'+TB.pages.member.t('到期','Maturity')+'</span><strong>'+TB.utils.esc(TB.utils.dt(s.maturityDate))+'</strong></div>'
      + '<div class="market-card-row"><span>'+TB.pages.member.t('当前价格','Current Price')+'</span><strong>'+TB.utils.price(s.markPrice)+'</strong></div>'
      + '</div>'
      + '<div class="market-card-foot">'
      + '<div class="flex gap-2">'
      + '<button class="btn btn-sm" onclick="TB.pages.member.viewMarketDetail(\''+s.id+'\')">'+TB.t('viewDetail')+'</button>'
      + '<button class="btn btn-sm btn-primary"'+(TB.pages.member._marketPurchasable(s) ? '' : ' disabled')+' onclick="TB.pages.member.bookAheadFromRow(\''+s.id+'\')">'+TB.t('bookAhead')+'</button>'
      + '</div>'
      + '</div>'
      + '</div>';
  }).join('');
};

TB.pages.member._depositStatusLabel = function(st){
  var t = TB.pages.member.t;
  var map = { held:[t('已收取','Held'),'warning'], applied:[t('已抵扣','Applied'),'info'], refunded:[t('已退还','Refunded'),'success'], forfeited:[t('已没收','Forfeited'),'error'] };
  var m = map[st];
  return m ? TB.ui.badge(m[0], m[1]) : '-';
};

TB.pages.member._bookingRows = function(){
  return TB.data.bookings.map(function(b){
    var depStatus = b.depositStatus || (b.status === 'cancelled' ? 'forfeited' : (b.status === 'pendingSettlement' ? 'applied' : 'held'));
    return { id:b.id, series:b.series, face:TB.utils.money(b.faceValue), checkin:b.checkin, checkout:b.checkout, window:b.windowDays+'d', deposit:TB.utils.money(b.deposit||0), depositStatus:depStatus, cancellable:(b.status === 'bookingConfirmed' || b.status === 'depositTaken'), status:TB.ui.statusBadge(b.status), time:b.submittedAt };
  });
};

TB.pages.member._holdingRows = function(){
  return TB.data.holdings.map(function(h){
    return { id:h.id, series:h.series, face:TB.utils.money(h.faceValue), tokens:TB.utils.tokens(h.tokens), checkin:h.checkin, maturity:h.maturityDate, valuation:TB.utils.indicative(h.valuation, TB.utils.money), return:TB.utils.indicative(h.expectedReturn, TB.utils.money), status:TB.ui.statusBadge(h.status) };
  });
};

TB.pages.member._transactionRows = function(){
  return TB.data.transactions.map(function(t){
    return { id:t.id, time:t.time, type:t.type, amount:TB.utils.money(t.amount), fee:TB.utils.money(t.fee), status:TB.ui.statusBadge(t.status), series:t.series, remarks:t.remarks };
  });
};

TB.pages.member._holdingsTabs = function(activeKey){
  var current = activeKey || 'positions';
  return TB.ui.tabs({ items:[
    {key:'positions',label:TB.pages.member.t('持仓','Positions'),active:current==='positions'},
    {key:'bookings',label:TB.pages.member.t('预定','Bookings'),active:current==='bookings'},
    {key:'transactions',label:TB.pages.member.t('交易记录','Transactions'),active:current==='transactions'}
  ], content:{
    positions: TB.ui.table({ columns:[{label:TB.t('lbl.seriesId'),key:'series'},{label:TB.t('lbl.faceValue'),key:'face'},{label:TB.pages.member.t('Token数量','Tokens'),key:'tokens'},{label:TB.pages.member.t('起息日','Value Date'),key:'checkin'},{label:TB.pages.member.t('赎回日期','Redemption Date'),key:'maturity'},{label:TB.pages.member.t('当前估值','Current Value'),key:'valuation'},{label:TB.pages.member.t('预期收益','Expected Return'),key:'return'},{label:TB.t('status'),key:'status'}], data:TB.pages.member._holdingRows(), actions:[{label:TB.t('viewDetail'),onClick:'TB.pages.member.openHolding',type:'text'}] }),
    bookings: TB.ui.table({ columns:[{label:TB.pages.member.t('预定编号','Booking ID'),key:'id'},{label:TB.t('lbl.seriesId'),key:'series'},{label:TB.t('lbl.faceValue'),key:'face'},{label:TB.pages.member.t('起息日','Value Date'),key:'checkin'},{label:TB.pages.member.t('赎回日期','Redemption Date'),key:'checkout'},{label:TB.pages.member.t('窗口天数','Window Days'),key:'window'},{label:TB.pages.member.t('预估定金','Estimated Deposit'),key:'deposit'},{label:TB.pages.member.t('定金状态','Deposit Status'),key:'depositStatus',render:function(r){ return TB.pages.member._depositStatusLabel(r.depositStatus); }},{label:TB.t('status'),key:'status'},{label:TB.t('time'),key:'time'},{label:TB.t('actions'),key:'go',render:function(r){
      var view = '<span class="tag-link" onclick="TB.pages.member.openBooking(\''+r.id+'\')">'+TB.t('viewDetail')+'</span>';
      if(!r.cancellable) return view;
      return view+' <span class="tag-link" onclick="TB.pages.member.cancelBooking(\''+r.id+'\')">'+TB.pages.member.t('取消预订','Cancel Booking')+'</span>';
    }}], data:TB.pages.member._bookingRows() }),
    transactions: TB.ui.table({ columns:[{label:TB.pages.member.t('流水号','Txn ID'),key:'id'},{label:TB.t('time'),key:'time'},{label:TB.t('type'),key:'type'},{label:TB.t('amount'),key:'amount'},{label:TB.pages.member.t('手续费','Fee'),key:'fee'},{label:TB.t('status'),key:'status'},{label:TB.t('lbl.seriesId'),key:'series'},{label:TB.t('remarks'),key:'remarks'}], data:TB.pages.member._transactionRows() })
  }});
};

TB.pages.member._accountRows = function(){
  return TB.data.accounts.filter(function(a){ return a.org === 'Alpha Fund Management'; }).map(function(a){
    return { id:a.id, name:a.name, email:a.email, role:a.role, status:TB.ui.statusBadge(a.status), raw:a.status, created:a.created, lastLogin:a.lastLogin };
  });
};

TB.pages.member._notifRows = function(){
  return TB.data.notifications.map(function(n){
    return { id:n.id, title:n.title, desc:n.desc, time:n.time, status:TB.ui.statusBadge(n.read ? 'completed' : 'pending') };
  });
};

TB.pages.member._complianceDecls = function(){
  return [
    { label: TB.pages.member.t('非美国主体声明','Non-US Person Declaration'), value: TB.pages.member.t('已确认','Confirmed') },
    { label: TB.pages.member.t('KYB已通过','KYB Passed'), value: TB.pages.member.t('已通过','Passed') },
    { label: TB.pages.member.t('合规承诺','Compliance Undertaking'), value: TB.pages.member.t('已签署','Signed') },
    { label: TB.pages.member.t('自身规则声明','Own Rules Declaration'), value: TB.pages.member.t('已签署','Signed') },
  ];
};

TB.pages.member._importantReminders = function(){
  var t = TB.pages.member.t;
  var items = [];
  var addTop = function(list){ if(list.length > 0) items.push(list[0]); };
  addTop(TB.data.holdings
    .filter(function(h){ return h.status !== 'checkoutCompleted' && h.maturityDate < '2026-12-16'; })
    .sort(function(a, b){ return a.maturityDate < b.maturityDate ? -1 : 1; })
    .map(function(h){ return { tag:t('到期','Maturity'), text:t('持仓 '+h.series+' 将于 '+h.maturityDate+' 到期，请确认赎回安排。','Holding '+h.series+' matures on '+h.maturityDate+'. Please confirm the redemption plan.'), route:'#/holdings/'+h.id, action:t('查看持仓','View') }; }));
  addTop(TB.data.bookings
    .filter(function(b){ return b.status === 'pendingSettlement'; })
    .map(function(b){ return { tag:t('结算','Settlement'), text:t('预定 '+b.id+' 待结算，请在 '+b.checkin+' 前完成资金准备。','Booking '+b.id+' is pending settlement. Prepare funds before '+b.checkin+'.'), route:'#/bookings', action:t('去处理','Handle') }; }));
  addTop(TB.data.quotes
    .filter(function(q){ return q.status === 'expired'; })
    .map(function(q){ return { tag:t('报价','Quote'), text:t('产品 '+q.series+' 报价已过期，购买前请刷新报价。','The quote for '+q.series+' has expired. Refresh it before purchasing.'), route:'#/market', action:t('去刷新','Refresh') }; }));
  addTop(TB.data.notifications
    .filter(function(n){ return !n.read && n.priority === 'high'; })
    .map(function(n){ return { tag:t('通知','Notice'), text:n.title+' · '+n.desc, route:'#/notifications', action:t('查看','View') }; }));
  return items;
};

TB.pages.member._remindExpanded = false;
TB.pages.member.toggleReminders = function(){
  TB.pages.member._remindExpanded = !TB.pages.member._remindExpanded;
  TB.router.render();
};

TB.pages.member._remindPanel = function(){
  var t = TB.pages.member.t;
  var items = TB.pages.member._importantReminders();
  if(items.length === 0) return '';
  var expanded = TB.pages.member._remindExpanded;
  var html = '<div class="remind-panel"><div class="remind-head">'+
    '<span class="remind-head-title">⚠️ '+t('重要事项提醒','Important Reminders')+' · '+items.length+'</span>'+
    (items.length > 2 ? '<span class="tag-link" onclick="TB.pages.member.toggleReminders()">'+(expanded ? t('收起','Collapse') : t('查看更多','View more'))+'</span>' : '')+
    '</div><div class="remind-list'+(expanded ? ' expanded' : '')+'">';
  items.forEach(function(it, i){
    html += '<div class="remind-item'+(i === 0 ? ' remind-item-head' : '')+'">'+
      '<div class="remind-item-main">'+TB.ui.badge(it.tag, 'warning')+'<span class="remind-item-text">'+TB.utils.esc(it.text)+'</span></div>'+
      '<span class="tag-link" onclick="TB.router.navigate(\''+it.route+'\')">'+it.action+'</span></div>';
  });
  html += '</div></div>';
  return html;
};

TB.pages.member._tradeTab = 'buy';
TB.pages.member.setTradeTab = function(k){ TB.pages.member._tradeTab = k; TB.router.render(); };

TB.pages.member.walletEmt = function(){
  var org = TB.state.user ? TB.state.user.org : '';
  var m = TB.data.members.find(function(x){ return x.name === org; });
  return m ? m.emtBalance : 12500000;
};

/* Book Ahead 面向未来窗口，起息日默认取今天的下一个交易日；生效日遇非营业日按规则顺延 */
TB.pages.member._bookValueDate = function(){
  var d = new Date(TB.utils.todayStr() + 'T00:00:00');
  d.setDate(d.getDate() + 1);
  return TB.utils.nextTradingDay(TB.utils.fmtDate(d));
};

TB.pages.member._consentOk = function(){
  var t = TB.pages.member.t;
  var risk = document.getElementById('consent_risk');
  var disc = document.getElementById('consent_disclaimer');
  if(!risk || !risk.checked){ TB.utils.toast(t('请先阅读并同意风险揭示书','Please read and agree to the risk disclosure first'), 'error'); return false; }
  if(!disc || !disc.checked){ TB.utils.toast(t('请先同意 TokenBank 平台免责声明','Please agree to the TokenBank platform disclaimer first'), 'error'); return false; }
  return true;
};

/* 日期校验：起息日（Value Date）与赎回日（Redemption Date）均须为交易日，非交易日不可选择 */
TB.pages.member._validateDates = function(){
  var t = TB.pages.member.t;
  var errs = [];
  var bad = t('为非交易日，不可作为起息日或赎回日','is a non-trading day; non-trading days cannot be a value or redemption date');
  if(TB.pages.member._tradeTab === 'buy'){
    var bd = TB.utils.getInputVal('trade_buydate');
    var out = TB.utils.getInputVal('trade_checkout');
    if(out && !TB.utils.isTradingDay(out)) errs.push(t('赎回日','Redemption date')+' '+out+' '+bad);
    if(bd && out){
      if(out <= bd) errs.push(t('赎回日期须晚于起息日','The redemption date must be after the value date'));
      var hold = Math.round((new Date(out + 'T00:00:00') - new Date(bd + 'T00:00:00')) / 86400000);
      var ser = TB.pages.member._currentSeries;
      if(ser && hold > ser.windowDays) errs.push(t('持有天数','Holding days')+' '+hold+' '+t('超出产品窗口','exceeds the product window')+'（'+ser.windowDays+' '+t('天','days')+'）');
    }
  } else {
    var cin = TB.utils.getInputVal('trade_checkin');
    var cout = TB.utils.getInputVal('trade_checkout');
    var earliest = TB.pages.member._bookValueDate();
    if(cin && !TB.utils.isTradingDay(cin)) errs.push(t('起息日','Value date')+' '+cin+' '+bad);
    if(cin && cin < earliest) errs.push(t('起息日须为今天之后的交易日，最早可选 ','The value date must be a future trading day; the earliest selectable is ')+earliest);
    if(cout && !TB.utils.isTradingDay(cout)) errs.push(t('赎回日','Redemption date')+' '+cout+' '+bad);
    if(cin && cout && cout <= cin) errs.push(t('赎回日期须晚于起息日','The redemption date must be after the value date'));
  }
  var el = document.getElementById('trade_date_err');
  if(el) el.innerHTML = errs.length ? '⚠️ ' + errs.join('<br>⚠️ ') : '';
  return errs.length === 0;
};

/* 确认函：买入 / 预定提交前弹出，确认无误后才正式落单 */
TB.pages.member.openOrderConfirm = function(kind){
  var t = TB.pages.member.t;
  var s = TB.pages.member._currentSeries;
  var face = Number(TB.utils.getInputVal('trade_face')) || 0;
  var bd = TB.utils.getInputVal('trade_buydate') || TB.utils.defaultTradingDay();
  var out = TB.utils.getInputVal('trade_checkout');
  var cin = TB.utils.getInputVal('trade_checkin') || TB.pages.member._bookValueDate();
  var cout = TB.utils.getInputVal('trade_checkout');
  var emt = TB.pages.member.walletEmt();
  var rows = [];
  if(kind === 'buy'){
    var hold = out ? Math.round((new Date(out + 'T00:00:00') - new Date(bd + 'T00:00:00')) / 86400000) : 0;
    var ret = face * s.refYield * hold / 365;
    var cash = face * s.markPrice + 20;
    var yld = (face > 0 && hold > 0) ? ret / face * (365 / hold) * 100 : 0;
    rows = [
      {label:t('产品','Product'), value:TB.utils.esc(s.name) + '（' + s.id + '）'},
      {label:t('起息日','Value Date'), value:bd},
      {label:t('赎回日期','Redemption Date'), value:out},
      {label:t('持有天数','Holding Days'), value:hold + ' ' + t('天','days')},
      {label:t('买入面值','Buy Face Value'), value:TB.utils.money(face)},
      {label:t('成交价格','Execution Price'), value:TB.utils.price(s.markPrice)},
      {label:t('预期估值','Expected Valuation'), value:TB.utils.indicative(face * s.markPrice, TB.utils.money)},
      {label:t('预期收益','Expected Return'), value:TB.utils.indicative(ret, TB.utils.money)},
      {label:t('预期收益率','Expected Yield'), value:TB.utils.indicative(yld, TB.utils.yieldFmt)},
      {label:t('交易手续费','Transaction Fee'), value:TB.utils.money(20)},
      {label:t('现金应付','Cash Payable'), value:TB.utils.money(cash)},
      {label:t('当前可用 EMT','Available EMT'), value:TB.utils.money(emt)},
      {label:t('资金缺口','Funding Shortfall'), value: Math.max(0, cash - emt) > 0 ? TB.ui.badge(TB.utils.money(cash - emt) + ' ' + t('待充值','to top up'), 'error') : TB.ui.badge(t('已备足','Fully funded'), 'success')},
      {label:t('扣款后可用 EMT','EMT After Debit'), value:TB.utils.money(emt - cash)}
    ];
  } else {
    var days = Math.round((new Date(cout + 'T00:00:00') - new Date(cin + 'T00:00:00')) / 86400000);
    var dep = 20 + face * (s.sellerYield - s.refYield) * days / 365;
    var bRet = face * s.refYield * days / 365;
    var bYld = (face > 0 && days > 0) ? (bRet - dep) / face * (365 / days) * 100 : 0;
    var payable = Math.max(0, face - dep);
    var shortfall = Math.max(0, payable - Math.max(0, emt - dep));
    rows = [
      {label:t('产品','Product'), value:TB.utils.esc(s.name) + '（' + s.id + '）'},
      {label:t('起息日','Value Date'), value:cin},
      {label:t('赎回日期','Redemption Date'), value:cout},
      {label:t('窗口天数','Window Days'), value:days + ' ' + t('天','days')},
      {label:t('预定面值','Booking Face Value'), value:TB.utils.money(face)},
      {label:t('预期估值','Expected Valuation'), value:TB.utils.indicative(face * s.markPrice, TB.utils.money)},
      {label:t('预期收益','Expected Return'), value:TB.utils.indicative(bRet, TB.utils.money)},
      {label:t('预期收益率','Expected Yield'), value:TB.utils.indicative(bYld, TB.utils.yieldFmt)},
      {label:t('预估定金','Estimated Deposit')+TB.utils.note(t('提交时从可用 EMT 扣收，公式 = USB 20 交易手续费 + 面值 × 收益差 × 窗口天数 / 365。','Charged from available EMT on submission; USB 20 transaction fee + face × yield gap × window days / 365.')), value:TB.utils.money(dep)},
      {label:t('其中交易手续费','incl. Transaction Fee'), value:TB.utils.money(20)},
      {label:t('定金扣款后可用 EMT','EMT After Deposit'), value:TB.utils.money(emt - dep)},
      {label:t('起息日应付','Payable on Value Date')+TB.utils.note(t('起息日 cut-off 系统校验可用余额是否覆盖预定面值（含已付定金），随后自动扣款成交，扣款金额 = 预定面值 − 已付定金。','At the value-date cut-off the system checks that the available balance covers the booking face value (including the deposit already paid), then settles automatically; the debit equals face value minus deposit.')), value:TB.utils.money(payable)},
      {label:t('起息日资金缺口','Value-date Shortfall'), value: shortfall > 0 ? TB.ui.badge(TB.utils.money(shortfall) + ' ' + t('待充值','to top up'), 'error') : TB.ui.badge(t('已备足','Fully funded'), 'success')}
    ];
  }
  var fundHtml = '';
  if(kind === 'book'){
    var remind = TB.state.lang === 'zh'
      ? '请在起息日 <strong>' + cin + '</strong> cut-off 前备足可用 EMT ≥ <strong>' + TB.utils.money(payable) + '</strong>；系统校验通过后自动扣款成交（预定面值 − 已付定金）。'
      : 'Keep at least <strong>' + TB.utils.money(payable) + '</strong> available EMT before the cut-off on value date <strong>' + cin + '</strong>; once the check passes the system settles automatically (booking face value − deposit paid).';
    fundHtml = '<div class="book-fund-note">'
      + '<div class="book-fund-title">💰 ' + t('起息日备付提醒','Funding Reminder for the Value Date') + '</div>'
      + '<div>' + remind + '</div>'
      + '</div>';
  }
  var body = TB.ui.descList(rows) + fundHtml
    + '<div class="mt-4" style="font-size:12px;color:var(--text-secondary);line-height:1.8">'
    + t('本人确认以上订单信息无误，已阅读并同意《风险揭示书》与《TokenBank 平台免责声明》，知悉报价由卖方 Bison 提供、预期收益不构成保证收益。提交后订单将进入交割流程并体现在持仓中。',
        'I confirm the order details above are correct, have read and agreed to the Risk Disclosure and the TokenBank Platform Disclaimer, and understand that quotes are provided by the seller Bison and that expected returns are not guaranteed. Once submitted the order enters settlement and will appear in holdings.')
    + '</div>'
    + '<div class="text-muted text-sm mt-2">' + t('确认账号','Account') + '：' + TB.utils.esc(TB.state.user.name) + ' · ' + TB.utils.dt(TB.utils.nowET()) + '</div>';
  TB.ui.modal({
    title: kind === 'buy' ? t('买入确认函','Purchase Confirmation') : t('预定确认函','Booking Confirmation'),
    body: body,
    size: 'lg',
    footer: '<button class="btn" onclick="TB.ui.closeModal()">' + TB.t('cancel') + '</button>'
      + '<button class="btn btn-primary" onclick="TB.pages.member.confirmOrder(\'' + kind + '\')">' + t('确认无误并提交','Confirm and Submit') + '</button>'
  });
};

TB.pages.member.confirmOrder = function(kind){
  var t = TB.pages.member.t;
  var s = TB.pages.member._currentSeries;
  var org = TB.state.user ? TB.state.user.org : '';
  var face = Number(TB.utils.getInputVal('trade_face')) || 0;
  var bd = TB.utils.getInputVal('trade_buydate') || TB.utils.defaultTradingDay();
  var out = TB.utils.getInputVal('trade_checkout');
  var cin = TB.utils.getInputVal('trade_checkin') || TB.pages.member._bookValueDate();
  var cout = TB.utils.getInputVal('trade_checkout');
  if(kind === 'buy' && face * s.markPrice + 20 > TB.pages.member.walletEmt()){
    TB.ui.closeModal();
    TB.utils.toast(t('可用 EMT 不足，无法提交买入','Available EMT is insufficient; the purchase cannot be submitted'), 'error');
    return;
  }
  TB.ui.closeModal();
  if(kind === 'buy'){
    var hold = Math.round((new Date(out + 'T00:00:00') - new Date(bd + 'T00:00:00')) / 86400000);
    TB.data.holdings.unshift({
      id: 'HLD-' + (100 + TB.data.holdings.length),
      series: s.id, faceValue: face, tokens: face / s.markPrice, checkin: bd, maturityDate: out,
      valuation: face * s.markPrice, sellerYield: s.sellerYield, expectedReturn: face * s.refYield * hold / 365,
      status: 'settled', member: org
    });
    TB.utils.toast(t('买入提交成功，已进入持仓','Purchase submitted; position created'), 'success');
    TB.router.navigate('#/holdings');
  } else {
    var days = Math.round((new Date(cout + 'T00:00:00') - new Date(cin + 'T00:00:00')) / 86400000);
    TB.data.bookings.unshift({
      id: 'BK-' + cin.replace(/-/g, '') + '-' + (TB.data.bookings.length + 1),
      series: s.id, faceValue: face, checkin: cin, checkout: cout, windowDays: days,
      deposit: 20 + face * (s.sellerYield - s.refYield) * days / 365,
      status: 'bookingConfirmed', submittedAt: TB.utils.nowET(), member: org
    });
    TB.utils.toast(t('预定提交成功，已进入持仓','Booking submitted; added to holdings'), 'success');
    TB.router.navigate('#/bookings');
  }
};

TB.pages.member.submitBuy = function(seriesId){
  var t = TB.pages.member.t;
  var face = Number(TB.utils.getInputVal('trade_face'));
  if(!face || face < 100000 || face % 10000 !== 0){
    TB.utils.toast(t('买入面值需不低于 100,000 且为 10,000 的整数倍','Face value must be at least 100,000 and a multiple of 10,000'), 'error');
    return;
  }
  var cashNeed = face * TB.pages.member._currentSeries.markPrice + 20;
  var emtBal = TB.pages.member.walletEmt();
  if(cashNeed > emtBal){
    TB.utils.toast(t('可用 EMT 不足，缺口 ','Available EMT is insufficient; shortfall ') + TB.utils.money(cashNeed - emtBal) + t('，请先充值','; please top up first'), 'error');
    return;
  }
  if(!TB.utils.getInputVal('trade_checkout')){
    TB.utils.toast(t('请选择赎回日期','Please select a redemption date'), 'error');
    return;
  }
  if(!TB.pages.member._validateDates()) return;
  if(!TB.pages.member._consentOk()) return;
  TB.pages.member.openOrderConfirm('buy');
};

TB.pages.member.submitBooking = function(seriesId){
  var t = TB.pages.member.t;
  var face = Number(TB.utils.getInputVal('trade_face'));
  var cin = TB.utils.getInputVal('trade_checkin');
  var cout = TB.utils.getInputVal('trade_checkout');
  if(!face || face < 100000 || face % 10000 !== 0){
    TB.utils.toast(t('预定面值需不低于 100,000 且为 10,000 的整数倍','Face value must be at least 100,000 and a multiple of 10,000'), 'error');
    return;
  }
  if(!cin || !cout){
    TB.utils.toast(t('请选择起息日与赎回日期','Please select the value date and redemption date'), 'error');
    return;
  }
  if(!TB.pages.member._validateDates()) return;
  if(!TB.pages.member._consentOk()) return;
  TB.pages.member.openOrderConfirm('book');
};

TB.pages.member.calcTrade = function(){
  var t = TB.pages.member.t;
  var s = TB.pages.member._currentSeries;
  var el = document.getElementById('trade-calc');
  if(!s || !el) return;
  var face = Number(TB.utils.getInputVal('trade_face')) || 0;
  var rows = '';
  var calcRow = function(zh, en, note, valueHtml){
    return '<div class="bond-calc-row"><span>'+t(zh, en)+(note ? TB.utils.note(t(note[0], note[1])) : '')+'</span><strong>'+valueHtml+'</strong></div>';
  };
  if(TB.pages.member._tradeTab === 'buy'){
    var bd = TB.utils.getInputVal('trade_buydate') || TB.utils.defaultTradingDay();
    var out = TB.utils.getInputVal('trade_checkout');
    var hold = out ? Math.max(0, Math.round((new Date(out + 'T00:00:00') - new Date(bd + 'T00:00:00')) / 86400000)) : 0;
    var ret = face * s.refYield * hold / 365;
    var cash = face * s.markPrice + 20;
    var net = (face > 0 && hold > 0) ? (ret - 20) / face * (365 / hold) * 100 : 0;
    var valuation = face * s.markPrice;
    var buyYield = (face > 0 && hold > 0) ? ret / face * (365 / hold) * 100 : 0;
    rows = calcRow('持有天数','Holding Days',['持有天数 = 赎回日期 − 起息日，可短于产品窗口。','Holding days = redemption date minus value date; may be shorter than the product window.'], hold+' '+t('天','days'))
      + calcRow('预期估值','Expected Valuation',['预期估值 = 面值 × 当前价格，交割后作为持仓估值基准。','Expected valuation = face × current price; used as the position value after settlement.'], TB.utils.money(valuation))
      + calcRow('预期收益','Expected Return',['预期收益 = 面值 × 参考收益率 × 持有天数 / 365，仅供参考不构成保证收益。','Expected return = face × reference yield × holding days / 365; indicative only.'], TB.utils.money(ret))
      + calcRow('预期收益率','Expected Yield',['预期收益率 = 预期收益 ÷ 面值 × 365 ÷ 持有天数（未扣手续费），仅供参考不构成保证收益。','Expected yield = expected return ÷ face × 365 ÷ holding days, before fees; indicative only.'], TB.utils.yieldFmt(buyYield))
      + calcRow('现金应付','Cash Payable',['现金应付 = 面值 × 当前价格 + USB 20 交易费。','Cash payable = face × current price + USB 20 fee.'], TB.utils.money(cash))
      + calcRow('扣费后年化收益率','Net Annualized Yield',['扣费后年化收益率 =（预期收益 − 交易手续费）÷ 面值 × 365 ÷ 持有天数。','Net annualised yield = (expected return − transaction fee) ÷ face × 365 ÷ holding days.'], TB.utils.yieldFmt(net));
    var buyShort = Math.max(0, cash - TB.pages.member.walletEmt());
    if(face > 0 && buyShort > 0){
      rows += '<div class="trade-date-err">⚠️ ' + (TB.state.lang === 'zh'
        ? '现金应付 <strong>' + TB.utils.money(cash) + '</strong>，当前可用 EMT 缺口 <strong>' + TB.utils.money(buyShort) + '</strong>；请先充值，否则无法提交买入。'
        : 'Cash payable is <strong>' + TB.utils.money(cash) + '</strong> and available EMT is short by <strong>' + TB.utils.money(buyShort) + '</strong>; top up first, otherwise the purchase cannot be submitted.') + '</div>';
    }
  } else {
    var cin = TB.utils.getInputVal('trade_checkin');
    var cout = TB.utils.getInputVal('trade_checkout');
    var days = (cin && cout) ? Math.max(0, Math.round((new Date(cout) - new Date(cin)) / 86400000)) : 0;
    var gap = s.sellerYield - s.refYield;
    var dep = face > 0 ? 20 + face * gap * days / 365 : 0;
    var bVal = face * s.markPrice;
    var bRet = face * s.refYield * days / 365;
    var bYield = (face > 0 && days > 0) ? (bRet - dep) / face * (365 / days) * 100 : 0;
    var bPayable = Math.max(0, face - dep);
    var bShort = Math.max(0, bPayable - Math.max(0, TB.pages.member.walletEmt() - dep));
    rows = calcRow('窗口天数','Window Days',['窗口天数 = 赎回日期 − 起息日，须为交易日区间。','Window days = redemption date minus value date, over trading days.'], days+' '+t('天','days'))
      + calcRow('预期估值','Expected Valuation',['预期估值 = 面值 × 当前价格，交割后作为持仓估值基准。','Expected valuation = face × current price; used as the position value after settlement.'], TB.utils.money(bVal))
      + calcRow('预期收益','Expected Return',['预期收益 = 面值 × 参考收益率 × 窗口天数 / 365，仅供参考不构成保证收益。','Expected return = face × reference yield × window days / 365; indicative only.'], TB.utils.money(bRet))
      + calcRow('预估定金','Estimated Deposit',['定金 = USB 20 + 面值 × 收益差 × 窗口天数 / 365，提交时从可用 EMT 扣收。','Deposit = USB 20 + face × yield gap × window days / 365, charged from available EMT on submission.'], TB.utils.money(dep))
      + calcRow('起息日应付','Payable on Value Date',['起息日 cut-off 系统校验可用余额后自动扣款成交，金额 = 预定面值 − 已付定金。','At the value-date cut-off the system verifies the available balance and settles automatically; the debit equals booking face value minus the deposit paid.'], TB.utils.money(bPayable))
      + calcRow('预期收益率','Expected Yield',['预期收益率 =（预期收益 − 预估定金）÷ 面值 × 365 ÷ 窗口天数，仅供参考不构成保证收益。','Expected yield = (expected return − estimated deposit) ÷ face × 365 ÷ window days; indicative only.'], TB.utils.yieldFmt(bYield));
    if(face > 0 && bShort > 0){
      rows += '<div class="trade-date-err">⚠️ ' + (TB.state.lang === 'zh'
        ? '起息日需支付 <strong>' + TB.utils.money(bPayable) + '</strong>，当前可用 EMT 缺口 <strong>' + TB.utils.money(bShort) + '</strong>；请在起息日 cut-off 前完成充值，否则预定转入「待补款」，宽限期结束仍未补足将被取消并没收全部定金。'
        : 'The value-date payment is <strong>' + TB.utils.money(bPayable) + '</strong> and available EMT is short by <strong>' + TB.utils.money(bShort) + '</strong>; top up before the value-date cut-off, otherwise the booking becomes "Pending Top-up" and is cancelled with the full deposit forfeited if the grace period expires.') + '</div>';
    }
  }
  el.innerHTML = rows;
};

TB.pages.member.afterRender = function(){
  var list = document.querySelector('.remind-list');
  if(list){
    var items = list.querySelectorAll('.remind-item');
    if(TB.pages.member._remindExpanded || items.length <= 2){
      list.style.maxHeight = 'none';
    } else {
      var twoRows = items[0].getBoundingClientRect().height + items[1].getBoundingClientRect().height;
      list.style.maxHeight = Math.ceil(twoRows) + 'px';
    }
  }
  ['trade_face'].forEach(function(id){
    var el = document.getElementById(id);
    if(el) el.addEventListener('input', TB.pages.member.calcTrade);
  });
  ['trade_buydate','trade_checkin','trade_checkout'].forEach(function(id){
    var el = document.getElementById(id);
    if(el){
      el.addEventListener('change', function(){ TB.pages.member._validateDates(); TB.pages.member.calcTrade(); });
    }
  });
  TB.pages.member.calcTrade();
};

TB.pages.member._tradePanel = function(s, purchasable){
  var t = TB.pages.member.t;
  var tab = TB.pages.member._tradeTab;
  var emt = TB.pages.member.walletEmt();
  var field = function(label, note, valueHtml, inline){
    return '<div class="trade-field'+(inline ? ' trade-field-inline' : '')+'"><div class="trade-field-label"><span>'+label+(note ? TB.utils.note(note) : '')+'</span></div><div class="trade-field-value">'+valueHtml+'</div></div>';
  };
  var fieldRow = function(a, b){ return '<div class="trade-field-row">'+a+b+'</div>'; };
  var html = '<div class="trade-panel"><div class="trade-tabs">'
    + '<div class="trade-tab'+(tab === 'buy' ? ' active' : '')+'" onclick="TB.pages.member.setTradeTab(\'buy\')">'+t('买入','Buy')+'</div>'
    + '<div class="trade-tab'+(tab === 'book' ? ' active' : '')+'" onclick="TB.pages.member.setTradeTab(\'book\')">'+t('预定','Book Ahead')+'</div>'
    + '</div><div class="trade-body">';
  html += field(t('可用 EMT','Available EMT'), t('来自 Token Bank 钱包可用余额，金额单位为 USB；买入扣款与预定定金均从中扣减。','From your Token Bank wallet available balance, denominated in USB; purchase debits and booking deposits are taken from it.'), TB.utils.money(emt), true);
  html += '<div class="trade-field"><div class="trade-field-label"><span>'+(tab === 'buy' ? t('买入面值','Buy Face Value') : t('预定面值','Booking Face Value'))+TB.utils.note(t('不低于最小购买额 100,000，且为步进 10,000 的整数倍。','At least the 100,000 minimum purchase and a multiple of the 10,000 step.'))+'</span></div>'
    + '<input type="number" class="form-input" id="trade_face" value="1000000"></div>';
  if(tab === 'buy'){
    var today = TB.utils.defaultTradingDay();
    var defOut = TB.utils.fmtDate(new Date(new Date(today + 'T00:00:00').getTime() + s.windowDays * 86400000));
    if(s.maturityDate && defOut > s.maturityDate) defOut = s.maturityDate;
    defOut = TB.utils.isTradingDay(defOut) ? defOut : TB.utils.prevTradingDay(defOut);
    html += fieldRow(
      '<div class="trade-field"><div class="trade-field-label"><span>'+t('起息日','Value Date')+TB.utils.note(t('默认为今天且不可修改，交割按当日收盘处理。','Defaults to today and is read-only; settlement follows today’s close.'))+'</span></div><input type="text" class="form-input" id="trade_buydate" value="'+today+'" disabled></div>',
      '<div class="trade-field"><div class="trade-field-label"><span>'+t('赎回日期','Redemption Date')+TB.utils.note(t('可短于产品窗口持有（如只买 3 天）；仅交易日可选，须晚于起息日且不超过窗口天数。','May be shorter than the product window (e.g. 3 days); trading days only, after the value date and within the window.'))+'</span></div>'+TB.ui.datePicker({id:'trade_checkout', value:defOut})+'</div>'
    );
    html += field(t('成交价格','Execution Price'), t('引用 Bison 最新报价的当前价格；报价过期需等待发行方刷新。','Uses the latest Bison quote price; expired quotes must be refreshed by the issuer.'), TB.utils.price(s.markPrice));
  } else {
    html += fieldRow(
      '<div class="trade-field"><div class="trade-field-label"><span>'+t('起息日','Value Date')+TB.utils.note(t('预定生效日，即持仓的起息日，默认为今天的下一个交易日；仅可选择今天之后的交易日，遇非营业日自动顺延。','Booking effective date — the value date of the position, defaulting to the next trading day after today; only future trading days are selectable and non-business days roll forward.'))+'</span></div>'+TB.ui.datePicker({id:'trade_checkin', value:TB.pages.member._bookValueDate()})+'</div>',
      '<div class="trade-field"><div class="trade-field-label"><span>'+t('赎回日期','Redemption Date')+TB.utils.note(t('赎回日仅可选择交易日；不可交易的日期已置灰不可选。','The redemption date must be a trading day; non-trading days are greyed out and unselectable.'))+'</span></div>'+TB.ui.datePicker({id:'trade_checkout'})+'</div>'
    );
  }
  html += '<div class="trade-date-err" id="trade_date_err"></div>';
  html += '<div id="trade-calc"></div>';
  html += '<div class="trade-consent">'
    + '<label class="form-checkbox"><input type="checkbox" id="consent_risk"><span>'+t('我已阅读并同意','I have read and agree to')+'《'+t('风险揭示书','Risk Disclosure')+' v3》'+TB.utils.note(t('风险揭示书随产品创建由发行方上传，购买前确认并留痕。','Uploaded by the issuer at product creation; acknowledged and recorded before purchase.'))+'</span></label>'
    + '<label class="form-checkbox"><input type="checkbox" id="consent_disclaimer"><span>'+t('我已阅读并同意','I have read and agree to')+'《TokenBank '+t('平台免责声明','Platform Disclaimer')+'》'+TB.utils.note(t('平台仅负责展示、计算、校验与留痕；报价与兑付责任由卖方 Bison 承担。','The platform only displays, calculates, validates and records; quote and payout liability rests with the seller, Bison.'))+'</span></label>'
    + '</div>';
  html += '<button class="btn btn-primary btn-lg btn-block mt-4"'+(purchasable ? '' : ' disabled')+' onclick="'+(tab === 'buy' ? 'TB.pages.member.submitBuy(\''+s.id+'\')' : 'TB.pages.member.submitBooking(\''+s.id+'\')')+'">'
    + (tab === 'buy' ? t('买入','Buy') : t('预定','Book Ahead')) + ' ' + TB.utils.esc(s.id) + '</button>';
  html += '</div></div>';
  return html;
};

TB.router.register('member', {
  '/dashboard': function(){
    var rows = TB.pages.member._transactionRows().slice(0,5);
    var html = TB.utils.contentHeader(TB.pages.member.t('Dashboard','Dashboard'), TB.pages.member._quickActions());
    html += TB.pages.member._remindPanel();
    html += '<div class="stat-grid">';
    html += TB.ui.statCard(TB.pages.member.t('持仓估值','Portfolio Value'), TB.utils.moneyShort(11250000), '+8.2%', 'up');
    html += TB.ui.statCard(TB.pages.member.t('钱包余额','Wallet Balance'), TB.utils.moneyShort(12500000), '+2.1%', 'up');
    html += TB.ui.statCard(TB.pages.member.t('预期收益','Expected Return'), TB.utils.moneyShort(62500), '+0.9%', 'up');
    html += TB.ui.statCard(TB.pages.member.t('即将到期','Near Maturity'), '3', '-1', 'down');
    html += '</div>';
    html += TB.ui.card(null, TB.ui.table({ columns:[
      {label:'ID', key:'id'}, {label:TB.t('time'), key:'time'}, {label:TB.t('type'), key:'type'}, {label:TB.t('amount'), key:'amount'}, {label:TB.t('status'), key:'status'},
    ], data:rows, actions:[{label:TB.t('viewDetail'), onClick:'TB.utils.toast', type:'text'}] }));
    return html;
  },
  '/market': function(){
    var t = TB.pages.member.t;
    var view = TB.pages.member._marketView;
    var toggle = '<div class="view-toggle">'
      + '<button class="'+(view === 'card' ? 'active' : '')+'" onclick="TB.pages.member.setMarketView(\'card\')">▦ '+t('卡片','Cards')+'</button>'
      + '<button class="'+(view === 'list' ? 'active' : '')+'" onclick="TB.pages.member.setMarketView(\'list\')">☰ '+t('列表','List')+'</button>'
      + '</div>';
    var html = TB.utils.contentHeader(t('产品市场','Product Market'), toggle);
    html += TB.ui.filterBar({ fields:[
      {name:'status', label:TB.t('status'), type:'select', options:[{value:'',label:TB.t('all')},{value:'open',label:TB.utils.enumLabel('open')},{value:'closed',label:TB.utils.enumLabel('soldout')}]},
      {name:'yield', label:TB.t('lbl.yield'), type:'select', options:[{value:'',label:TB.t('all')},{value:'high',label:TB.utils.enumLabel('high')},{value:'mid',label:TB.utils.enumLabel('mid')}]},
      {name:'face', label:TB.t('lbl.faceValue'), type:'select', options:[{value:'',label:TB.t('all')},{value:'500k',label:'500K+'},{value:'1m',label:'1M+'}]},
    ], exportBtn:true });
    if(view === 'list'){
      html += TB.ui.table({ columns:[
        {key:'id', label:TB.t('lbl.seriesId'), render:function(r){ return '<span class="row-plain" onclick="TB.pages.member.viewMarketDetail(\''+r.id+'\')">'+r.id+'</span>'; }},
        {key:'name', label:TB.t('lbl.productName'), render:function(r){ return '<span class="row-plain" onclick="TB.pages.member.viewMarketDetail(\''+r.id+'\')">'+TB.utils.esc(r.name)+'</span>'; }},
        {key:'sellerYield', label:t('卖方收益率','Seller Yield'), render:function(r){ return TB.utils.yield(r.sellerYield); }},
        {key:'markPrice', label:t('当前价格','Current Price'), render:function(r){ return TB.utils.price(r.markPrice); }},
        {key:'maturityDate', label:TB.t('lbl.maturityDate')},
        {key:'windowDays', label:t('窗口天数','Window Days'), render:function(r){ return r.windowDays+' '+t('天','days'); }},
        {key:'faceAvailable', label:t('可售额度','Available'), render:function(r){ return TB.utils.money(r.faceAvailable); }},
        {key:'st', label:TB.t('status'), render:function(r){ var m = TB.pages.member._marketStatus(r); return TB.ui.badge(m.label, m.tone); }},
        {key:'go', label:TB.t('actions'), render:function(r){
          return '<span class="tag-link" onclick="TB.pages.member.viewMarketDetail(\''+r.id+'\')">'+TB.t('viewDetail')+'</span>'
            + (TB.pages.member._marketPurchasable(r) ? ' <span class="tag-link" onclick="TB.pages.member.bookAheadFromRow(\''+r.id+'\')">'+TB.t('bookAhead')+'</span>' : '');
        }}
      ], data: TB.data.series.filter(function(x){ return x.status === 'open' || x.status === 'closed'; }) });
    } else {
      html += '<div class="market-grid">'+TB.pages.member._marketCards()+'</div>';
    }
    return html;
  },
  '/market/:productId': function(p){
    var t = TB.pages.member.t;
    var s = TB.pages.member._seriesById(p.productId);
    TB.pages.member._currentSeries = s;
    var purchasable = s.status === 'open';
    var html = '<div class="bond-hero"><div class="bond-hero-top"><div>'
      + (function(m){ return TB.ui.badge(m.label, m.tone); })(TB.pages.member._marketStatus(s))
      + '<div class="bond-hero-name">'+TB.utils.esc(s.name)+'</div>'
      + '<div class="bond-hero-meta">'+TB.utils.esc(s.id)+' · '+t('发行方','Issuer')+'：'+TB.utils.esc(s.issuer)+' · '+t('托管方','Custodian')+'：'+TB.utils.esc(s.custodian)+'</div>'
      + '</div><div class="bond-hero-quote">'
      + '<div class="bond-hero-yield">'+TB.utils.yield(s.sellerYield)+'</div>'
      + '<div class="bond-hero-yield-sub">'+t('卖方收益率','Seller Yield')+'</div>'
      + '<div class="bond-hero-price">'+t('当前价格','Current Price')+' '+TB.utils.price(s.markPrice)+' · '+s.bpSpread+' bp</div>'
      + '</div></div></div>';
    if(!purchasable){
      html += '<div class="bond-quote-expired">⚠️ '+t('该产品当前不可购买：报价已过期或已售罄，请等待发行方刷新报价。','This product is not purchasable now: the quote expired or the series sold out. Please wait for a refreshed quote.')+'</div>';
    }
    html += '<div class="bond-cols"><div class="bond-col-main">'
      + '<div class="section-head">'+t('产品规格','Product Specifications')+'</div>'
      + TB.ui.card(null, TB.ui.descList([
          {label:'CUSIP', value:s.cusip},
          {label:'ISIN', value:s.isin},
          {label:t('当前价格','Current Price')+TB.utils.note(t('该周期对应美债产品（CUSIP '+s.cusip+'）的当前参考价，估值日 '+s.valuationDate+'，来源 '+s.priceSource+'。','Current reference price of the underlying Treasury (CUSIP '+s.cusip+') for this window; valuation date '+s.valuationDate+', source '+s.priceSource+'.')), value:TB.utils.price(s.markPrice)},
          {label:t('参考价格','Reference Price')+TB.utils.note(t('参考价格来源于第三方市场价格，独立于 Bison 报价，用于交叉校验报价合理性。','The reference price comes from third-party market prices, independent of the Bison quote, and is used to cross-check quote reasonableness.')), value:TB.utils.price(s.marketRefPrice)},
          {label:t('发行总面值','Total Face Value'), value:TB.utils.money(s.faceTotal)},
          {label:t('可售额度','Available'), value:TB.utils.money(s.faceAvailable)},
          {label:TB.t('lbl.maturityDate')+TB.utils.note(t('到期日为美东业务日，以美债现货收盘（17:00 ET）为基准换算成本地时间展示。','Maturity is an ET business date, converted to local time from the US Treasury close (17:00 ET).')), value:s.maturityDate},
          {label:t('窗口天数','Window Days')+TB.utils.note(t('该产品允许的最长持有天数；买入时选择的赎回日不得超出。','Maximum holding days for this product; the redemption date chosen at purchase cannot exceed it.')), value:s.windowDays + ' ' + t('天','days')},
          {label:t('卖方收益率','Seller Yield')+TB.utils.note(t('Bison 报价的卖方收益率，与页首大字展示一致；减去参考市场收益率即为收益差。','The seller yield quoted by Bison, identical to the headline figure above; minus the market reference yield it gives the yield gap.')), value:TB.utils.yield(s.sellerYield)},
          {label:t('参考市场收益率','Market Reference Yield')+TB.utils.note(t('对应期限美债的市场参考收益率，用于预期收益与定金计算，不代表保证收益。','Market reference yield of the matching Treasury tenor; drives the expected-return and deposit calculations and is not a guaranteed return.')), value:TB.utils.yield(s.refYield)},
          {label:t('收益差','Yield Gap')+TB.utils.note(t('收益差 = 卖方收益率 − 参考市场收益率；预定时锁定该差值而非价格，故无价格风险。','Yield gap = seller yield − market reference yield; bookings lock this gap rather than the price, so there is no price risk.')), value:s.bpSpread+' bp'},
          {label:t('估值日','Valuation Date')+TB.utils.note(t('估值日为美东业务日，收盘价与估值均以当日美债收盘（17:00 ET）为基准。','Valuation date is an ET business date; the close price and valuation are struck at the US Treasury close (17:00 ET).')), value:s.valuationDate},
          {label:t('交易手续费','Transaction Fee')+TB.utils.note(t('每笔买入或预定收取 USB 20，已计入现金应付与预估定金。','USB 20 per buy or booking; included in cash payable and the estimated deposit.')), value:TB.utils.money(20) + ' / ' + t('笔','trade')},
          {label:t('预定定金规则','Booking Deposit Rule')+TB.utils.note(t('收益差 = 卖方收益率 − 参考收益率 = '+Math.round((s.sellerYield - s.refYield) * 10000)+'bp；起息日截止（Value Date cut-off）余额不足先给最长 1 小时宽限（参数可调），仍不足则取消订单并没收全部定金。','Yield gap = seller yield − reference yield = '+Math.round((s.sellerYield - s.refYield) * 10000)+'bp; if the balance is short at the value-date cut-off a 1-hour grace (configurable) applies, after which the order is cancelled and the full deposit is forfeited.')), value:t('USB 20 + 面值 × 收益差 × 窗口天数 / 365','USB 20 + face × yield gap × window days / 365')},
          {label:t('报价提供方','Quote Provider'), value:s.quoteProvider},
          {label:t('价格来源','Price Source'), value:s.priceSource},
          {label:t('报价时间','Quote Timestamp')+TB.utils.note(t('Bison 报价时间按美东时间记录并换算为本地时间展示；收盘价口径以当日美债收盘（17:00 ET）为准。','Bison quote timestamps are recorded in ET and converted to local time; close-of-day pricing follows the US Treasury close (17:00 ET).')), value:s.quoteTime},
          {label:t('最小购买额','Min Purchase'), value:TB.utils.money(100000)},
          {label:t('购买步进','Purchase Step'), value:TB.utils.money(10000)}
        ]))
      + '</div><div class="bond-col-side">'
      + TB.pages.member._tradePanel(s, purchasable)
      + '</div></div>';
    return html;
  },
  '/bookings': function(){
    var html = TB.utils.contentHeader(TB.pages.member.t('持仓管理','Holdings Management'), '<button class="btn btn-primary" onclick="TB.router.navigate(\'#\/market\')">'+TB.t('bookAhead')+'</button>');
    html += TB.ui.alert('info', TB.pages.member.t('预定管理已整合到持仓管理中，可通过上方分类切换查看预定记录。','Bookings are now merged into Holdings Management and can be viewed through the category switch above.'));
    html += TB.pages.member._holdingsTabs('bookings');
    return html;
  },
  '/bookings/:bookingId': function(p){
    var t = TB.pages.member.t;
    var b = TB.data.bookings.find(function(x){ return x.id === p.bookingId; });
    if(!b) return TB.utils.contentHeader(t('预定详情','Booking Detail')) + TB.ui.emptyState('🔍', TB.t('noData'));
    var s = TB.data.series.find(function(x){ return x.id === b.series || x.id.replace(/^R-/, '') === b.series; }) || {};
    var dep = b.deposit || 0;
    var payable = Math.max(0, b.faceValue - dep);
    var cancelled = b.status === 'cancelled';
    var depStatus = b.depositStatus || (cancelled ? 'forfeited' : (b.status === 'pendingSettlement' ? 'applied' : 'held'));
    var actions = '';
    if(!cancelled && (b.status === 'bookingConfirmed' || b.status === 'depositTaken')){
      actions += '<button class="btn" onclick="TB.pages.member.cancelBooking(\''+b.id+'\')">'+t('取消预订','Cancel Booking')+'</button>';
    }
    if(s.id) actions += '<button class="btn" onclick="TB.router.navigate(\'#/market/'+s.id+'\')">'+t('查看产品','View Product')+'</button>';
    var html = TB.utils.contentHeader(t('预定详情','Booking Detail')+' · '+b.id, actions);
    html += TB.ui.card(t('预定信息','Booking Info'), TB.ui.descList([
      {label:t('预定编号','Booking ID'), value:b.id},
      {label:TB.t('lbl.seriesId'), value:b.series},
      {label:TB.t('lbl.productName'), value:TB.utils.esc(s.name || '-')},
      {label:t('起息日','Value Date'), value:b.checkin},
      {label:t('赎回日期','Redemption Date'), value:b.checkout},
      {label:t('窗口天数','Window Days'), value:b.windowDays+' '+t('天','days')},
      {label:TB.t('status'), value:TB.ui.statusBadge(b.status)},
      {label:t('提交时间','Submitted'), value:b.submittedAt}
    ]));
    var funds = [
      {label:t('预定面值','Booking Face Value'), value:TB.utils.money(b.faceValue)},
      {label:t('预估定金','Estimated Deposit')+TB.utils.note(t('定金 = USB 20 交易手续费 + 面值 × 收益差 × 窗口天数 / 365，提交时从可用 EMT 扣收。','Deposit = USB 20 transaction fee + face × yield gap × window days / 365, charged from available EMT on submission.')), value:TB.utils.money(dep)},
      {label:t('其中交易手续费','incl. Transaction Fee'), value:TB.utils.money(20)},
      {label:t('起息日应付','Payable on Value Date')+TB.utils.note(t('起息日 cut-off 校验余额后自动扣款成交，金额 = 预定面值 − 已付定金。','At the value-date cut-off the balance is verified and settled automatically; the debit equals face value minus deposit paid.')), value:TB.utils.money(payable)},
      {label:t('定金状态','Deposit Status'), value:TB.pages.member._depositStatusLabel(depStatus)}
    ];
    if(cancelled){
      funds.push({label:t('取消时间','Cancelled At'), value:b.cancelledAt || '-'});
      funds.push({label:t('手续费扣除（不退）','Fee Deducted (non-refundable)')+TB.utils.note(t('USB 20 交易手续费为交易成本，取消时不予退还。','The USB 20 transaction fee is a trading cost and is not refunded on cancellation.')), value:TB.utils.money(b.feeRetained != null ? b.feeRetained : 20)});
      funds.push({label:t('定金退还','Deposit Refund'), value:TB.utils.money(b.depositRefunded != null ? b.depositRefunded : (depStatus === 'refunded' ? Math.max(0, dep - 20) : 0))});
      funds.push({label:t('定金没收','Deposit Forfeited'), value:TB.utils.money(b.depositForfeited != null ? b.depositForfeited : (depStatus === 'forfeited' ? Math.max(0, dep - 20) : 0)) + (b.forfeitureReason ? ' · ' + TB.utils.esc(b.forfeitureReason) : '')});
    }
    html += TB.ui.card(t('资金与结算','Funds & Settlement'), TB.ui.descList(funds));
    var tl = [{time:b.submittedAt, title:t('预定提交','Booking Submitted'), desc:t('预定已确认，窗口额度已冻结','Booking confirmed and window capacity locked'), status:'completed'}];
    if(depStatus !== 'held' || b.status !== 'bookingConfirmed') tl.push({time:b.submittedAt, title:t('定金收取','Deposit Taken'), desc:t('定金 ','Deposit ') + TB.utils.money(dep) + t(' 已从可用 EMT 扣收',' deducted from available EMT'), status:'completed'});
    if(cancelled){
      tl.push({time:b.cancelledAt || '-', title:t('预定取消','Booking Cancelled'), desc:(depStatus === 'refunded' ? t('定金全额退还','Deposit refunded in full') : t('定金没收','Deposit forfeited')) + (b.forfeitureReason ? '（' + b.forfeitureReason + '）' : ''), status:'active'});
    } else {
      tl.push({time:b.checkin + ' 17:00:00', title:t('起息日结算','Value-date Settlement'), desc:t('cut-off 校验余额后自动扣款 ','Auto debit of ') + TB.utils.money(payable) + t(' 并执行 DVP 交割',' after the cut-off balance check, then DVP settlement'), status:'active'});
      tl.push({time:b.checkout + ' 17:00:00', title:t('赎回','Redemption'), desc:t('系统在赎回日自动执行赎回','Auto redemption on the redemption date'), status:''});
    }
    html += TB.ui.card(t('操作时间线','Operation Timeline'), TB.ui.timeline(tl));
    return html;
  },
  '/holdings': function(){
    var html = TB.utils.contentHeader(TB.pages.member.t('持仓管理','Holdings Management'), '<button class="btn btn-primary" onclick="TB.utils.toast(\''+TB.t('export')+'\',\'info\')">'+TB.t('export')+'</button>');
    html += '<div class="stat-grid">'+TB.ui.statCard(TB.pages.member.t('总面值','Total Face'), TB.utils.moneyShort(8500000), '+1.2%', 'up')+TB.ui.statCard(TB.pages.member.t('当前估值','Current Value'), TB.utils.moneyShort(8490000), '+0.8%', 'up')+TB.ui.statCard(TB.pages.member.t('预期收益','Expected Return'), TB.utils.moneyShort(43850), '+0.3%', 'up')+TB.ui.statCard(TB.pages.member.t('持仓笔数','Positions'), '5', '+1', 'up')+'</div>';
    html += TB.pages.member._holdingsTabs('positions');
    return html;
  },
  '/holdings/:holdingId': function(p){
    var t = TB.pages.member.t;
    var h = TB.pages.member._holdingById(p.holdingId); var s = TB.pages.member._seriesById(h.series);
    var hold = Math.max(0, Math.round((new Date(h.maturityDate + 'T00:00:00') - new Date(h.checkin + 'T00:00:00')) / 86400000));
    var expYield = (h.faceValue > 0 && hold > 0) ? h.expectedReturn / h.faceValue * (365 / hold) * 100 : 0;
    var netYield = (h.faceValue > 0 && hold > 0) ? (h.expectedReturn - 20) / h.faceValue * (365 / hold) * 100 : 0;
    var html = TB.utils.contentHeader(t('持仓详情','Holding Detail') + ' · ' + h.id);
    html += TB.ui.card(t('交易参数','Trade Parameters'), TB.ui.descList([
      {label:TB.t('lbl.seriesId'), value:h.series},
      {label:TB.t('lbl.productName'), value:TB.utils.esc(s.name || '-')},
      {label:TB.t('lbl.faceValue'), value:TB.utils.money(h.faceValue)},
      {label:t('Token数量','Tokens'), value:TB.utils.tokens(h.tokens)},
      {label:t('起息日','Value Date'), value:h.checkin},
      {label:t('赎回日期','Redemption Date'), value:h.maturityDate},
      {label:t('持有天数','Holding Days')+TB.utils.note(t('持有天数 = 赎回日期 − 起息日。','Holding days = redemption date minus value date.')), value:hold + ' ' + t('天','days')},
      {label:t('成交价格','Execution Price'), value:TB.utils.price(s.markPrice)},
      {label:t('卖方收益率','Seller Yield'), value:TB.utils.yield(h.sellerYield)},
      {label:t('参考市场收益率','Market Reference Yield'), value:TB.utils.yield(s.refYield)},
      {label:t('交易手续费','Transaction Fee'), value:TB.utils.money(20)},
      {label:TB.t('status'), value:TB.ui.statusBadge(h.status)}
    ]));
    html += TB.ui.card(t('估值与收益','Valuation & Return'), TB.ui.descList([
      {label:t('当前估值','Current Value'), value:TB.utils.indicative(h.valuation, TB.utils.money)},
      {label:t('预期收益','Expected Return'), value:TB.utils.indicative(h.expectedReturn, TB.utils.money)},
      {label:t('预期收益率','Expected Yield')+TB.utils.note(t('预期收益率 = 预期收益 ÷ 面值 × 365 ÷ 持有天数（未扣手续费）。','Expected yield = expected return ÷ face × 365 ÷ holding days, before fees.')), value:TB.utils.indicative(expYield, TB.utils.yieldFmt)},
      {label:t('扣费后年化收益率','Net Annualized Yield')+TB.utils.note(t('扣费后年化收益率 =（预期收益 − 交易手续费）÷ 面值 × 365 ÷ 持有天数。','Net annualized yield = (expected return − transaction fee) ÷ face × 365 ÷ holding days.')), value:TB.utils.yieldFmt(netYield)}
    ]));
    html += TB.ui.card(t('操作时间线','Operation Timeline'), TB.ui.timeline([
      {time:h.checkin + ' 09:30:00', title:t('买入成交','Trade Settled'), desc:t('DVP 交割完成，R-UST 已入持仓','DVP complete; R-UST credited to holdings'), status:'completed'},
      {time:h.maturityDate + ' 17:00:00', title:t('待赎回','Awaiting Redemption'), desc:t('系统按赎回日自动执行赎回','Auto redemption on the redemption date'), status:'active'}
    ]));
    return html;
  },

  '/transactions': function(){
    var html = TB.utils.contentHeader(TB.pages.member.t('持仓管理','Holdings Management'), '<button class="btn btn-primary" onclick="TB.utils.toast(\''+TB.t('export')+'\',\'info\')">'+TB.t('export')+'</button>');
    html += TB.ui.alert('info', TB.pages.member.t('交易记录入口已归并到持仓管理中，可通过分类切换查看全部交易流水。','Transactions are now grouped under Holdings Management and can be reviewed through the category switch above.'));
    html += TB.pages.member._holdingsTabs('transactions');
    return html;
  },
  '/wallet': function(){
    var html = TB.utils.contentHeader(TB.pages.member.t('钱包总览','Wallet Overview'), '<button class="btn btn-primary" onclick="TB.router.navigate(\'#\/wallet\/withdraw\')">'+TB.t('withdraw')+'</button>');
    html += '<div class="stat-grid">'+TB.ui.statCard(TB.pages.member.t('可用余额','Available Balance'), TB.utils.moneyShort(12500000), '+2.1%', 'up')+TB.ui.statCard(TB.pages.member.t('冻结余额','Frozen Balance'), TB.utils.moneyShort(200000), '0', 'down')+TB.ui.statCard(TB.pages.member.t('总余额','Total Balance'), TB.utils.moneyShort(12700000), '+1.8%', 'up')+'</div>';
    html += TB.ui.table({ columns:[{label:'ID',key:'id'},{label:TB.t('time'),key:'time'},{label:TB.t('type'),key:'type'},{label:TB.t('amount'),key:'amount'},{label:TB.t('status'),key:'status'},{label:TB.t('remarks'),key:'remarks'}], data:TB.pages.member._transactionRows().slice(0,4) });
    return html;
  },
  '/wallet/withdraw': function(){
    var html = TB.utils.contentHeader(TB.pages.member.t('提现','Withdraw'), '<button class="btn btn-primary" onclick="TB.ui.confirmModal(\''+TB.t('confirm')+'\',\''+TB.t('msg.confirmSubmit')+'\',\'TB.utils.toast(\\\''+TB.t('msg.submitSuccess')+'\\\',\\\'success\\\')\')">'+TB.t('withdraw')+'</button>');
    html += TB.ui.card(TB.pages.member.t('提现信息','Withdraw Info'), TB.ui.formField({label:TB.t('amount'),name:'withdraw_amount',type:'text',value:'1000000'}) + TB.ui.descList([{label:TB.pages.member.t('Gas费','Gas Fee'), value:TB.utils.money(15)},{label:TB.pages.member.t('实际到账','Net Amount'), value:TB.utils.money(999985)}]));
    return html;
  },
  '/accounts': function(){
    var html = TB.utils.contentHeader(TB.pages.member.t('子账号列表','Sub-Accounts'), '<button class="btn btn-primary" onclick="TB.pages.member.openCreateAccount()">'+TB.t('create')+'</button>');
    html += TB.ui.filterBar({ fields:[{name:'status',label:TB.t('status'),type:'select',options:[{value:'',label:TB.t('all')},{value:'active',label:TB.utils.enumLabel('active')},{value:'suspended',label:TB.utils.enumLabel('suspended')}]},{name:'role',label:TB.t('lbl.role'),type:'select',options:[{value:'',label:TB.t('all')},{value:'Admin',label:'Admin'},{value:'Trader',label:'Trader'}]},{name:'keyword',label:TB.pages.member.t('关键词','Keyword'),type:'text'}], exportBtn:true });
    html += TB.ui.table({ columns:[{label:TB.pages.member.t('账号名','Account'),key:'name'},{label:TB.t('lbl.email'),key:'email'},{label:TB.t('lbl.role'),key:'role'},{label:TB.t('status'),key:'status'},{label:TB.t('created'),key:'created'},{label:TB.t('lastLogin'),key:'lastLogin'},{label:TB.t('actions'),key:'go',render:function(r){
      var off = r.raw === 'deactivated';
      return '<span class="tag-link" onclick="TB.pages.member.editAccount(\''+r.id+'\')">'+TB.t('edit')+'</span> '
        + '<span class="tag-link" onclick="TB.pages.member.manageAccountPermissions(\''+r.id+'\')">'+TB.pages.member.t('权限管理','Permissions')+'</span> '
        + '<span class="tag-link" onclick="TB.pages.member.toggleAccountStatus(\''+r.id+'\')">'+(off ? TB.pages.member.t('启用','Enable') : TB.pages.member.t('禁用','Disable'))+'</span> '
        + '<span class="tag-link" onclick="TB.pages.member.resetAccountPwd(\''+r.id+'\')">'+TB.t('resetPwd')+'</span>';
    }}], data:TB.pages.member._accountRows() });
    return html;
  },
  '/accounts/:accountId/edit': function(p){
    var a = TB.pages.member._accountById(p.accountId);
    return TB.utils.contentHeader(TB.pages.member.t('编辑子账号','Edit Sub-account'), '<button class="btn btn-primary" onclick="TB.ui.confirmModal(\''+TB.t('save')+'\',\''+TB.t('msg.confirmSubmit')+'\',\'TB.utils.toast(\\\''+TB.t('msg.saveSuccess')+'\\\',\\\'success\\\')\')">'+TB.t('save')+'</button><button class="btn" onclick="TB.utils.toast(\''+TB.t('msg.operationSuccess')+'\',\'success\')">'+TB.t('resetPwd')+'</button>') + TB.ui.card(TB.pages.member.t('基本信息','Basic Info'), TB.ui.formField({label:TB.t('lbl.email'),name:'edit_email',type:'text',value:a.email}) + TB.ui.formField({label:TB.pages.member.t('手机号','Phone'),name:'edit_phone',type:'text',value:'+65 8888 8888'}) + TB.ui.formField({label:TB.t('lbl.role'),name:'edit_role',type:'select',options:[{value:'Admin',label:'Admin',selected:a.role==='Admin'},{value:'Trader',label:'Trader',selected:a.role==='Trader'},{value:'Viewer',label:'Viewer',selected:a.role==='Viewer'}]}));
  },
  '/accounts/:accountId/permissions': function(p){
    var a = TB.pages.member._accountById(p.accountId);
    return TB.ui.permPage('member', a);
  },
  '/notifications': function(){
    var html = TB.utils.contentHeader(TB.pages.member.t('通知中心','Notifications'), '<button class="btn btn-primary" onclick="TB.utils.markAllRead()">'+TB.t('markAllRead')+'</button>');
    html += TB.ui.tabs({ items:[{key:'all',label:TB.t('all'),active:true},{key:'unread',label:TB.t('unread')},{key:'read',label:TB.t('read')}], content:{ all: TB.ui.table({ columns:[{label:TB.pages.member.t('标题','Title'),key:'title'},{label:TB.t('remarks'),key:'desc'},{label:TB.t('time'),key:'time'},{label:TB.t('status'),key:'status'}], data:TB.pages.member._notifRows(), actions:[{label:TB.t('viewDetail'),onClick:'TB.utils.toast',type:'text'},{label:TB.t('delete'),onClick:'TB.utils.toast',type:'danger'}] }), unread: TB.ui.emptyState('🔔', TB.pages.member.t('暂无未读','No unread notifications')), read: TB.ui.table({ columns:[{label:TB.pages.member.t('标题','Title'),key:'title'},{label:TB.t('time'),key:'time'},{label:TB.t('status'),key:'status'}], data:TB.pages.member._notifRows().filter(function(n){return n.status.indexOf('Completed')>-1;}) }) } });
    return html;
  },
  '/compliance': function(){
    var html = TB.utils.contentHeader(TB.pages.member.t('合规设置','Compliance Settings'), '<button class="btn btn-primary" onclick="TB.utils.toast(\''+TB.t('msg.saveSuccess')+'\',\'success\')">'+TB.t('save')+'</button>');
    html += TB.ui.card(TB.pages.member.t('KYB状态','KYB Status'), TB.ui.descList([{label:TB.t('status'), value:TB.ui.statusBadge('active')},{label:TB.pages.member.t('更新时间','Updated At'), value:'2026-11-02 10:00:00'}]));
    html += TB.ui.card(TB.pages.member.t('合规声明','Compliance Declarations'), TB.ui.descList(TB.pages.member._complianceDecls()));
    return html;
  },
  '/settings': function(){
    var tabs = TB.ui.tabs({ items:[{key:'profile',label:TB.pages.member.t('个人信息','Profile'),active:true},{key:'twofa',label:'2FA'},{key:'password',label:TB.pages.member.t('密码修改','Password')},{key:'notif',label:TB.pages.member.t('通知偏好','Notifications')}], content:{
      profile: TB.ui.formField({label:TB.t('lbl.email'),name:'profile_email',type:'text',value:'john@alpha-fund.com'}) + TB.ui.formField({label:TB.pages.member.t('姓名','Name'),name:'profile_name',type:'text',value:'John Smith'}),
      twofa: TB.ui.card('2FA', TB.ui.alert('info', TB.pages.member.t('2FA已绑定','2FA is bound'))),
      password: TB.ui.formField({label:TB.pages.member.t('旧密码','Old Password'),name:'old_pwd',type:'password'}) + TB.ui.formField({label:TB.pages.member.t('新密码','New Password'),name:'new_pwd',type:'password'}),
      notif: TB.ui.formField({label:TB.pages.member.t('邮件通知','Email Notifications'),name:'notif_email',type:'checkbox',checked:true,checkboxLabel:TB.pages.member.t('开启','Enabled')})
    }});
    return TB.utils.contentHeader(TB.pages.member.t('个人设置','Settings'), '<button class="btn btn-primary" onclick="TB.utils.toast(\''+TB.t('msg.saveSuccess')+'\',\'success\')">'+TB.t('save')+'</button>') + tabs;
  },
  '/account-security': function(){
    var t = TB.pages.member.t;
    var roleName = function(r){
      var role = (TB.data.roles.member || []).find(function(x){ return x.id === r; });
      return role ? TB.text(role.name) : r;
    };
    var html = TB.utils.contentHeader(t('账户与安全','Account & Security'), '');
    html += TB.ui.tabs({ items:[
      {key:'accounts',label:t('账号管理','Accounts'),active:true},
      {key:'compliance',label:t('合规与安全','Compliance & Security')}
    ], content:{
      accounts: '<div class="mb-2" style="text-align:right"><button class="btn btn-sm btn-primary" onclick="TB.pages.member.openCreateAccount()">'+TB.t('create')+'</button></div>' + TB.ui.table({ columns:[{label:t('账号名','Account'),key:'name'},{label:TB.t('lbl.email'),key:'email'},{label:TB.t('lbl.role'),key:'role',render:function(r){ return roleName(r.role); }},{label:TB.t('status'),key:'status'},{label:TB.t('created'),key:'created'},{label:TB.t('lastLogin'),key:'lastLogin'},{label:TB.t('actions'),key:'go',render:function(r){
        var off = r.raw === 'deactivated';
        return '<span class="tag-link" onclick="TB.pages.member.editAccount(\''+r.id+'\')">'+TB.t('edit')+'</span> '
          + '<span class="tag-link" onclick="TB.pages.member.manageAccountPermissions(\''+r.id+'\')">'+t('权限管理','Permissions')+'</span> '
          + '<span class="tag-link" onclick="TB.pages.member.toggleAccountStatus(\''+r.id+'\')">'+(off ? t('启用','Enable') : t('禁用','Disable'))+'</span> '
          + '<span class="tag-link" onclick="TB.pages.member.resetAccountPwd(\''+r.id+'\')">'+TB.t('resetPwd')+'</span>';
      }}], data:TB.pages.member._accountRows() }),
      compliance: TB.ui.card(t('KYB状态','KYB Status'), TB.ui.descList([{label:TB.t('status'), value:TB.ui.statusBadge('active')},{label:t('更新时间','Updated At'), value:'2026-11-02 10:00:00'}])) + TB.ui.card(t('合规声明','Compliance Declarations'), TB.ui.descList(TB.pages.member._complianceDecls()))
    }});
    return html;
  },
  '/activation-setup': function(){
    var wizard = TB.ui.wizard({ steps:[{label:TB.pages.member.t('密码设置','Password')},{label:'2FA'},{label:TB.pages.member.t('合规声明','Compliance')}], current:1, content: TB.ui.card(TB.pages.member.t('激活设置','Activation Setup'), TB.pages.member.t('请完成初始化激活。','Please complete initial activation.')) , onFinish:"TB.utils.toast('Completed','success')" });
    return TB.utils.contentHeader(TB.pages.member.t('首次激活设置','Activation Setup')) + wizard;
  },
});

TB.pages.member.viewMarketDetail = function(id){ TB.router.navigate('#/market/' + id); };
TB.pages.member.bookAheadFromRow = function(id){ TB.pages.member._tradeTab = 'book'; TB.router.navigate('#/market/' + id); };
/* 取消预订（R22）：起息日前 2 个交易日（参数）前免费取消全额退定金；逾期取消没收全部定金 */
TB.pages.member.cancelBooking = function(id){
  var t = TB.pages.member.t;
  var b = TB.data.bookings.find(function(x){ return x.id === id; });
  if(!b) return;
  var deadline = TB.utils.minusTradingDays(b.checkin, 2);
  var free = TB.utils.todayStr() <= deadline;
  var dep = b.deposit || 0;
  var body = TB.ui.descList([
    {label:t('预定编号','Booking ID'), value:b.id},
    {label:TB.t('lbl.seriesId'), value:b.series},
    {label:t('起息日','Value Date'), value:b.checkin},
    {label:t('免费取消截止','Free-cancel Deadline')+TB.utils.note(t('起息日前 2 个交易日（参数）前可免费取消并全额退还定金。','Free cancellation with a full deposit refund is allowed until 2 trading days (configurable) before the value date.')), value:deadline},
    {label:t('定金','Deposit'), value:TB.utils.money(dep)},
    {label:t('手续费扣除（不退）','Fee Deducted (non-refundable)')+TB.utils.note(t('USB 20 交易手续费为交易成本，取消时不予退还。','The USB 20 transaction fee is a trading cost and is not refunded on cancellation.')), value:TB.utils.money(20)},
    {label:t('定金退还','Deposit Refund'), value:TB.utils.money(free ? Math.max(0, dep - 20) : 0)},
    {label:t('定金没收','Deposit Forfeited'), value:TB.utils.money(free ? 0 : Math.max(0, dep - 20))},
    {label:t('本次取消结果','Cancellation Outcome'), value: free ? TB.ui.badge(t('退还定金（扣手续费后）','Deposit refunded net of fee'),'success') : TB.ui.badge(t('没收定金（扣手续费后）','Deposit forfeited net of fee'),'error')}
  ]) + '<div class="mt-2 text-sm" style="color:var(--text-secondary);line-height:1.8">'
    + t('规则：起息日前 2 个交易日前取消，退还定金（扣除 USB 20 手续费）；逾期取消、或起息日截止（Value Date cut-off）余额不足（含最长 1 小时宽限后仍不足）被系统取消的，没收定金（扣除手续费后部分）。预定时锁定的是收益差 gap 而非价格，故无价格风险。',
        'Rule: cancelling at least 2 trading days before the value date refunds the deposit net of the USB 20 fee; late cancellation, or system cancellation for insufficient balance at the value-date cut-off (after the 1-hour grace), forfeits the deposit net of the fee. The booking locks the yield gap, not the price, so there is no price risk.')
    + '</div>';
  TB.ui.modal({
    title: t('取消预订','Cancel Booking'),
    body: body,
    footer: '<button class="btn" onclick="TB.ui.closeModal()">'+TB.t('cancel')+'</button>'
      + '<button class="btn btn-danger" onclick="TB.pages.member.confirmCancelBooking(\''+id+'\')">'+t('取消预订','Cancel Booking')+'</button>'
  });
};

TB.pages.member.confirmCancelBooking = function(id){
  var t = TB.pages.member.t;
  var b = TB.data.bookings.find(function(x){ return x.id === id; });
  if(!b) return;
  var deadline = TB.utils.minusTradingDays(b.checkin, 2);
  var free = TB.utils.todayStr() <= deadline;
  b.status = 'cancelled';
  b.cancelledAt = TB.utils.nowET();
  b.depositStatus = free ? 'refunded' : 'forfeited';
  b.feeRetained = 20;
  b.depositRefunded = free ? Math.max(0, (b.deposit || 0) - 20) : 0;
  b.depositForfeited = free ? 0 : Math.max(0, (b.deposit || 0) - 20);
  b.forfeitureReason = free ? '' : t('逾期取消','Late cancellation');
  TB.ui.closeModal();
  TB.utils.toast(free ? t('预订已取消，退还定金 ','Booking cancelled; deposit refunded ') + TB.utils.money(b.depositRefunded) + t('（已扣手续费 USB 20）',' (net of the USB 20 fee)') : t('预订已取消，没收定金 ','Booking cancelled; deposit forfeited ') + TB.utils.money(b.depositForfeited), free ? 'success' : 'error');
  TB.router.render();
};
TB.pages.member.openHolding = function(id){ TB.router.navigate('#/holdings/' + id); };
TB.pages.member.openBooking = function(id){ TB.router.navigate('#/bookings/' + id); };
TB.pages.member._nextAccountId = function(){
  var n = 0;
  TB.data.accounts.forEach(function(a){ var m = String(a.id).match(/ACC-(\d+)/); if(m) n = Math.max(n, +m[1]); });
  return 'ACC-' + String(n + 1).padStart(3, '0');
};
TB.pages.member.openCreateAccount = function(){
  var t = TB.pages.member.t;
  var body = TB.ui.formField({label:t('账号名','Account Name'), name:'new_name', type:'text', required:true})
    + TB.ui.formField({label:TB.t('lbl.email'), name:'new_email', type:'text', required:true})
    + TB.ui.formField({label:TB.t('lbl.role'), name:'new_role', type:'select', options:TB.data.roles.member.map(function(r){ return {value:r.id, label:TB.text(r.name), selected:r.id === 'Viewer'}; })});
  TB.ui.modal({
    title:t('创建子账号','Create Sub-account'),
    body:body,
    footer:'<button class="btn" onclick="TB.ui.closeModal()">'+TB.t('cancel')+'</button><button class="btn btn-primary" onclick="TB.pages.member.saveNewAccount()">'+TB.t('save')+'</button>'
  });
};
TB.pages.member.saveNewAccount = function(){
  var t = TB.pages.member.t;
  var name = (TB.utils.getInputVal('new_name') || '').trim();
  var email = (TB.utils.getInputVal('new_email') || '').trim();
  if(!name){ TB.utils.toast(t('请填写账号名','Account name is required'), 'error'); return; }
  if(!email || email.indexOf('@') < 0){ TB.utils.toast(t('请填写有效邮箱','Please enter a valid email'), 'error'); return; }
  if(TB.data.accounts.some(function(a){ return a.email === email; })){ TB.utils.toast(t('该邮箱已存在账号','An account with this email already exists'), 'error'); return; }
  var role = TB.utils.getInputVal('new_role') || 'Viewer';
  TB.data.accounts.push({ id:TB.pages.member._nextAccountId(), name:name, email:email, role:role, org:TB.state.user ? TB.state.user.org : 'Alpha Fund Management', status:'active', created:TB.utils.nowET().slice(0, 10), lastLogin:'-' });
  TB.ui.closeModal();
  TB.utils.toast(t('账号已创建','Account created'), 'success');
  TB.router.render();
};
TB.pages.member.editAccount = function(id){ TB.router.navigate('#/accounts/' + id + '/edit'); };
TB.pages.member.manageAccountPermissions = function(id){ TB.router.navigate('#/accounts/' + id + '/permissions'); };
TB.pages.member.toggleAccountStatus = function(id){
  var t = TB.pages.member.t;
  var a = TB.pages.member._accountById(id);
  if(!a) return;
  if(TB.state.user && (TB.state.user.id === a.id || (TB.state.user.email && TB.state.user.email === a.email))){
    TB.utils.toast(t('不能禁用当前登录账号','You cannot disable the account you are signed in with'), 'error');
    return;
  }
  var disabling = a.status !== 'deactivated';
  TB.ui.confirmModal(
    disabling ? t('禁用账号','Disable Account') : t('启用账号','Enable Account'),
    disabling ? t('禁用后该账号将无法登录并失去全部权限，确认禁用？','Once disabled the account can no longer sign in and loses all permissions. Confirm?')
              : t('启用后该账号恢复登录与已分配的权限，确认启用？','Once enabled the account regains sign-in and its assigned permissions. Confirm?'),
    'TB.pages.member._toggleAccountDone(\'' + id + '\')',
    disabling ? 'danger' : '');
};
TB.pages.member._toggleAccountDone = function(id){
  var t = TB.pages.member.t;
  var a = TB.pages.member._accountById(id);
  if(!a) return;
  a.status = a.status === 'deactivated' ? 'active' : 'deactivated';
  a.statusChangedAt = TB.utils.nowET();
  TB.utils.toast(a.status === 'deactivated' ? t('账号已禁用','Account disabled') : t('账号已启用','Account enabled'), a.status === 'deactivated' ? 'error' : 'success');
  TB.router.render();
};
TB.pages.member.resetAccountPwd = function(id){
  var t = TB.pages.member.t;
  var a = TB.pages.member._accountById(id);
  if(!a) return;
  if(a.status === 'deactivated'){
    TB.utils.toast(t('已停用账号需先启用才能重置密码','Enable the account before resetting its password'), 'error');
    return;
  }
  TB.ui.confirmModal(t('重置密码','Reset Password'),
    t('将生成临时密码并发送至账号邮箱，用户下次登录须修改。确认重置？','A temporary password will be generated and sent to the account email; the user must change it at next sign-in. Confirm?'),
    'TB.pages.member._resetPwdDone(\'' + id + '\')');
};
TB.pages.member._resetPwdDone = function(id){
  var t = TB.pages.member.t;
  var a = TB.pages.member._accountById(id);
  if(!a) return;
  a.pwdResetAt = TB.utils.nowET();
  a.pwdResetBy = TB.state.user ? TB.state.user.name : '';
  TB.utils.toast(t('密码已重置，临时密码已发送至 ','Password reset; temporary password sent to ') + a.email, 'success');
  TB.router.render();
};

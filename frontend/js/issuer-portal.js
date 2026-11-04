/* ============================================================
 * TokenBank Frontend — Issuer Portal Routes
 * Portal: Issuer (发行机构端)
 * Routes: 14 pages covering dashboard, series issuance (drawer flow
 * with draft save), series detail, quotes, burn flow, positions,
 * accounts, notifications, and approval management (flow config,
 * my approvals, history).
 * ============================================================ */
TB.pages = TB.pages || {};
TB.pages.issuer = TB.pages.issuer || {};
TB.pages.issuer.t = function(zh, en){ return TB.state.lang === 'zh' ? zh : en; };
TB.pages.issuer.seriesById = function(id){ return TB.data.series.find(function(s){ return s.id === id; }) || TB.data.series[0]; };

TB.pages.issuer.toast = function(msg){ TB.utils.toast(msg, 'info'); };
TB.pages.issuer.success = function(msg){ TB.utils.toast(msg, 'success'); };
TB.pages.issuer.viewSeries = function(id){ TB.router.navigate('#/series/'+id); };
TB.pages.issuer.managePermissions = function(id){ TB.router.navigate('#/accounts/'+id+'/permissions'); };
TB.pages.issuer.toggleAccountStatus = function(id){
  var t = TB.pages.issuer.t;
  var a = TB.data.accounts.find(function(x){ return x.id === id; });
  if(!a) return;
  if(TB.state.user && TB.state.user.email === a.email){
    TB.utils.toast(t('不能停用当前登录账号','You cannot disable the account you are signed in with'), 'error');
    return;
  }
  var disabling = a.status === 'active';
  TB.ui.confirmModal(disabling ? t('停用账号','Disable Account') : t('启用账号','Enable Account'),
    disabling ? t('停用后该账号将无法登录并失去全部权限，确认停用？','Once disabled the account can no longer sign in and loses all permissions. Confirm?')
              : t('启用后该账号恢复登录与已分配的权限，确认启用？','Once enabled the account regains sign-in and its assigned permissions. Confirm?'),
    'TB.pages.issuer._toggleAccountDone(\'' + id + '\')', disabling ? 'danger' : '');
};
TB.pages.issuer._toggleAccountDone = function(id){
  var t = TB.pages.issuer.t;
  var a = TB.data.accounts.find(function(x){ return x.id === id; });
  if(!a) return;
  a.status = a.status === 'active' ? 'deactivated' : 'active';
  a.statusChangedAt = TB.utils.nowET();
  TB.utils.toast(a.status === 'deactivated' ? t('账号已停用','Account disabled') : t('账号已启用','Account enabled'), a.status === 'deactivated' ? 'error' : 'success');
  TB.router.render();
};
TB.pages.issuer.resetAccountPwd = function(id){
  var t = TB.pages.issuer.t;
  var a = TB.data.accounts.find(function(x){ return x.id === id; });
  if(!a) return;
  if(a.status !== 'active'){
    TB.utils.toast(t('已停用账号需先启用才能重置密码','Enable the account before resetting its password'), 'error');
    return;
  }
  TB.ui.confirmModal(t('重置密码','Reset Password'),
    t('将生成临时密码并发送至账号邮箱，用户下次登录须修改。确认重置？','A temporary password will be generated and sent to the account email; the user must change it at next sign-in. Confirm?'),
    'TB.pages.issuer._resetPwdDone(\'' + id + '\')');
};
TB.pages.issuer._resetPwdDone = function(id){
  var t = TB.pages.issuer.t;
  var a = TB.data.accounts.find(function(x){ return x.id === id; });
  if(!a) return;
  a.pwdResetAt = TB.utils.nowET();
  a.pwdResetBy = TB.state.user ? TB.state.user.name : '';
  TB.utils.toast(t('密码已重置，临时密码已发送至 ','Password reset; temporary password sent to ') + a.email, 'success');
  TB.router.render();
};
TB.pages.issuer.newAccount = function(){
  var t = TB.pages.issuer.t;
  var body = TB.ui.formField({label:TB.t('lbl.email'), name:'new_email', type:'text', required:true})
    + TB.ui.formField({label:TB.t('lbl.role'), name:'new_role', type:'select', options:TB.data.roles.issuer.map(function(r){ return {value:r.id, label:TB.text(r.name)}; })});
  TB.ui.modal({
    title: t('创建账号','Create Account'),
    body: body,
    footer: '<button class="btn" onclick="TB.ui.closeModal()">'+TB.t('cancel')+'</button><button class="btn btn-primary" onclick="TB.pages.issuer.saveNewAccount()">'+TB.t('save')+'</button>'
  });
};
TB.pages.issuer.saveNewAccount = function(){
  var t = TB.pages.issuer.t;
  var email = TB.utils.getInputVal('new_email');
  if(!email || email.indexOf('@') < 0){
    TB.utils.toast(t('请填写有效邮箱','Please enter a valid email'), 'error');
    return;
  }
  var role = TB.utils.getInputVal('new_role') || 'Viewer';
  TB.data.accounts.push({id:'ACC-'+(100 + TB.data.accounts.length), name:email.split('@')[0], email:email, role:role, org:'Bison Bank', status:'active', created:TB.utils.nowET().slice(0, 10), lastLogin:'-'});
  TB.ui.closeModal();
  TB.utils.toast(TB.t('msg.saveSuccess'), 'success');
  TB.router.render();
};
/* 首页两张卡片等高：Series 列表区限高 8 行，待办列表取 Series 列表区（含分页）的实际高度 */
TB.pages.issuer.afterRender = function(){
  var tasks = document.getElementById('dash-tasks');
  var series = document.querySelector('#dash-series .table-wrap');
  var seriesArea = document.getElementById('dash-series');
  if(!tasks || !series || !seriesArea) return;
  var wide = window.matchMedia && window.matchMedia('(min-width:769px)').matches;
  if(!wide){
    tasks.style.height = '';
    series.style.height = '';
    return;
  }
  var head = series.querySelector('thead');
  var rows = series.querySelectorAll('tbody tr');
  var h = head ? head.getBoundingClientRect().height : 0;
  for(var i = 0; i < Math.min(8, rows.length); i++) h += rows[i].getBoundingClientRect().height;
  series.style.height = Math.ceil(h) + 'px';
  tasks.style.height = seriesArea.offsetHeight + 'px';
};
TB.pages.issuer.viewQuote = function(id){ TB.utils.toast(TB.pages.issuer.t('报价详情','Quote detail')+' '+id); };
TB.pages.issuer.issuanceSteps = [
  { key:'product-info', labelZh:'产品基本信息', labelEn:'Product Basics' },
  { key:'asset-info', labelZh:'底层资产录入', labelEn:'Underlying Asset' },
  { key:'documents', labelZh:'发行资料上传', labelEn:'Documents' },
  { key:'risk-disclosure', labelZh:'风险揭示书', labelEn:'Risk Disclosure' },
  { key:'submit', labelZh:'提交确认', labelEn:'Submit' }
];
TB.pages.issuer._issuance = null;

TB.pages.issuer._nextSeriesId = function(){
  var max = TB.data.series.reduce(function(m, s){ var n = parseInt(String(s.id).slice(-3), 10); return Math.max(m, isNaN(n) ? 0 : n); }, 0);
  return 'R-UST-2026-' + String(max + 1).padStart(3, '0');
};

TB.pages.issuer.openIssuance = function(seriesId){
  var t = TB.pages.issuer.t;
  if(seriesId){
    var row = TB.data.series.find(function(s){ return s.id === seriesId; });
    if(!row) return;
    TB.pages.issuer._issuance = { id:seriesId, step:row.step || 0, data:Object.assign({}, row.form || {}), files:(row.files || []).slice(), riskFiles:(row.riskFiles || []).slice() };
  } else {
    TB.pages.issuer._issuance = { id:TB.pages.issuer._nextSeriesId(), step:0, data:{}, files:[], riskFiles:[] };
  }
  TB.pages.issuer.renderIssuanceDrawer();
};

TB.pages.issuer._collectIssuance = function(){
  var st = TB.pages.issuer._issuance;
  if(!st) return;
  ['productName','custodian','faceTotal','maturityDate','windowDays','sellerYield','refYield','markPrice','quoteProvider','priceSource','minPurchase','purchaseStep','remarks',
   'cusip','isin','assetType','assetFace','assetMaturity','assetIssueDate','couponRate','assetCustodian','assetRemarks',
   'riskVersion'].forEach(function(k){
    var el = document.getElementById('iss_' + k);
    if(el) st.data[k] = el.value;
  });
  var agree = document.getElementById('iss_agree');
  if(agree) st.data.agree = agree.checked;
};

/* 把当前填写内容写回 Series 行；行不存在则新建草稿 */
TB.pages.issuer._persistIssuance = function(status){
  var t = TB.pages.issuer.t;
  var st = TB.pages.issuer._issuance;
  var d = st.data;
  var row = TB.data.series.find(function(s){ return s.id === st.id; });
  if(!row){
    row = { id:st.id, name:t('未命名产品','Untitled Product'), cusip:'', isin:'', issuer:'Bison Bank', custodian:'Bison Bank', maturityDate:'', faceTotal:0, faceAvailable:0, sellerYield:0, refYield:0, bpSpread:50, markPrice:0, windowDays:27, quoteProvider:'Bison Bank', priceSource:'Bison Treasury Desk', quoteTime:'-', quoteValidUntil:'-', valuationDate:'-', status:'draft', createdAt:TB.utils.nowET().slice(0, 10) };
    TB.data.series.push(row);
    row.faceAvailable = row.faceTotal;
  }
  row.form = d; row.files = st.files.slice(); row.riskFiles = (st.riskFiles || []).slice(); row.step = st.step;
  if(d.productName) row.name = d.productName;
  if(d.custodian) row.custodian = d.custodian;
  if(d.faceTotal) row.faceTotal = Number(d.faceTotal) || row.faceTotal;
  if(d.maturityDate) row.maturityDate = d.maturityDate;
  if(d.windowDays) row.windowDays = Number(d.windowDays) || row.windowDays;
  if(d.sellerYield) row.sellerYield = Number(d.sellerYield) || row.sellerYield;
  if(d.refYield) row.refYield = Number(d.refYield) || row.refYield;
  if(d.sellerYield && d.refYield) row.bpSpread = Math.round((Number(d.sellerYield) - Number(d.refYield)) * 10000);
  if(d.markPrice) row.markPrice = Number(d.markPrice) || row.markPrice;
  if(d.quoteProvider) row.quoteProvider = d.quoteProvider;
  if(d.priceSource) row.priceSource = d.priceSource;
  if(d.cusip) row.cusip = d.cusip;
  if(d.isin) row.isin = d.isin;
  if(status) row.status = status;
  return row;
};

TB.pages.issuer.saveDraftIssuance = function(){
  var t = TB.pages.issuer.t;
  if(!TB.pages.issuer._issuance) return;
  TB.pages.issuer._collectIssuance();
  TB.pages.issuer._persistIssuance('draft');
  TB.utils.toast(t('已暂存为草稿','Saved as draft'), 'success');
  TB.router.render();
  TB.pages.issuer.renderIssuanceDrawer();
};

TB.pages.issuer.gotoIssuanceStep = function(delta){
  var st = TB.pages.issuer._issuance;
  if(!st) return;
  TB.pages.issuer._collectIssuance();
  st.step = Math.max(0, Math.min(TB.pages.issuer.issuanceSteps.length - 1, st.step + delta));
  TB.pages.issuer.renderIssuanceDrawer();
};

TB.pages.issuer.addIssuanceFile = function(){
  var st = TB.pages.issuer._issuance;
  if(!st) return;
  var n = st.files.length + 1;
  st.files.push({ id:'F' + Date.now() + n, name:'Issuance_Document_' + n + '.pdf', size:(0.4 + n * 0.3).toFixed(1) + ' MB', time:TB.utils.nowET() });
  TB.pages.issuer._collectIssuance();
  TB.pages.issuer.renderIssuanceDrawer();
};

TB.pages.issuer.addRiskFile = function(){
  var st = TB.pages.issuer._issuance;
  if(!st) return;
  var n = st.riskFiles.length + 1;
  st.riskFiles.push({ id:'R' + Date.now() + n, name:'Risk_Disclosure_v3_' + n + '.pdf', size:(0.2 + n * 0.1).toFixed(1) + ' MB', time:TB.utils.nowET() });
  TB.pages.issuer.renderIssuanceDrawer();
};

TB.pages.issuer.removeRiskFile = function(id){
  var st = TB.pages.issuer._issuance;
  if(!st) return;
  st.riskFiles = st.riskFiles.filter(function(f){ return f.id !== id; });
  TB.pages.issuer.renderIssuanceDrawer();
};

TB.pages.issuer.removeIssuanceFile = function(id){
  var st = TB.pages.issuer._issuance;
  if(!st) return;
  st.files = st.files.filter(function(f){ return f.id !== id; });
  TB.pages.issuer._collectIssuance();
  TB.pages.issuer.renderIssuanceDrawer();
};

TB.pages.issuer.submitIssuance = function(){
  var t = TB.pages.issuer.t;
  var st = TB.pages.issuer._issuance;
  if(!st) return;
  TB.pages.issuer._collectIssuance();
  var d = st.data;
  if(!d.productName || !d.faceTotal || !d.maturityDate || !d.sellerYield || !d.refYield || !d.markPrice){
    TB.utils.toast(t('请完善产品基本信息：名称、总面值、到期日、卖方收益率、参考收益率、参考价格','Complete product basics: name, total face, maturity, seller yield, reference yield and mark price'), 'error');
    return;
  }
  if(!d.cusip || !d.isin){
    TB.utils.toast(t('请填写底层资产 CUSIP 与 ISIN','CUSIP and ISIN of the underlying asset are required'), 'error');
    return;
  }
  if(!st.riskFiles.length){
    TB.utils.toast(t('请上传风险揭示书文件','Please upload the risk disclosure document'), 'error');
    return;
  }
  if(d.agree === false){
    TB.utils.toast(t('请先勾选发行信息责任确认','Please confirm the responsibility declaration'), 'error');
    return;
  }
  var row = TB.pages.issuer._persistIssuance('approving');
  TB.pages.issuer._issuance = null;
  TB.ui.closeModal();
  var flow = TB.pages.issuer.flowByType('issuance');
  var task = flow && flow.enabled ? TB.pages.issuer._startApproval('issuance', row.id, TB.state.user ? TB.state.user.name : '', 'High') : null;
  TB.utils.toast(task
    ? t('已提交发行审批，当前节点：','Submitted for issuance approval; current node: ') + TB.pages.issuer.taskNodeName(task)
    : t('已提交（该类审批流程已停用，无需机构内审批）','Submitted (this approval flow is disabled; no internal review required)'), 'success');
  TB.router.render();
};

TB.pages.issuer._issuanceStepBody = function(st, step){
  var t = TB.pages.issuer.t;
  var d = st.data;
  var row2 = function(a, b){ return '<div class="form-row">'+a+(b || '<div class="form-group"></div>')+'</div>'; };
  if(step.key === 'product-info'){
    var bp = (Number(d.sellerYield) && Number(d.refYield)) ? Math.round((Number(d.sellerYield) - Number(d.refYield)) * 10000) : '';
    return TB.ui.formField({label:t('产品名称','Product Name'), name:'iss_productName', required:true, value:d.productName || '', placeholder:t('如 R-UST Bond Series 2026-019','e.g. R-UST Bond Series 2026-019')})
      + row2(
        TB.ui.formField({label:t('Series编号','Series ID'), name:'iss_seriesId', value:st.id, disabled:true, hint:t('系统自动生成，不可修改','Auto-generated and read-only')}),
        TB.ui.formField({label:t('币种','Currency'), name:'iss_currency', value:'USB', disabled:true}))
      + row2(
        TB.ui.formField({label:t('发行方','Issuer'), name:'iss_issuer', value:'Bison Bank', disabled:true}),
        TB.ui.formField({label:t('托管方','Custodian'), name:'iss_custodian', required:true, value:d.custodian || 'Bison Bank'}))
      + row2(
        TB.ui.formField({label:t('发行总面值','Total Face Value'), name:'iss_faceTotal', type:'number', required:true, value:d.faceTotal || '', hint:t('USB，按面值步进取整','USB, rounded to the face step')}),
        TB.ui.formField({label:t('到期日','Maturity Date'), name:'iss_maturityDate', type:'date', required:true, value:d.maturityDate || ''}))
      + row2(
        TB.ui.formField({label:t('窗口天数','Window Days'), name:'iss_windowDays', type:'number', required:true, value:d.windowDays || '27'}),
        TB.ui.formField({label:t('参考价格','Mark Price'), name:'iss_markPrice', type:'number', required:true, value:d.markPrice || '', hint:t('用于持仓估值，需注明来源与时间','Used for valuation; source and timestamp required')}))
      + row2(
        TB.ui.formField({label:t('卖方收益率','Seller Yield'), name:'iss_sellerYield', type:'number', required:true, value:d.sellerYield || '', hint:t('小数，如 0.0525','Decimal, e.g. 0.0525')}),
        TB.ui.formField({label:t('参考市场收益率','Reference Yield'), name:'iss_refYield', type:'number', required:true, value:d.refYield || ''}))
      + row2(
        TB.ui.formField({label:t('bp 差异','bp Spread'), name:'iss_bpSpread', value:bp, disabled:true, hint:t('=(卖方收益率 − 参考收益率) × 10000，自动计算','Auto-calculated from yields')}),
        TB.ui.formField({label:t('报价提供方','Quote Provider'), name:'iss_quoteProvider', value:d.quoteProvider || 'Bison Bank'}))
      + row2(
        TB.ui.formField({label:t('价格来源','Price Source'), name:'iss_priceSource', value:d.priceSource || 'Bison Treasury Desk'}),
        TB.ui.formField({label:t('最小购买额','Min Purchase'), name:'iss_minPurchase', type:'number', value:d.minPurchase || '100000'}))
      + row2(
        TB.ui.formField({label:t('购买步进','Purchase Step'), name:'iss_purchaseStep', type:'number', value:d.purchaseStep || '10000'}))
      + TB.ui.formField({label:t('备注','Remarks'), name:'iss_remarks', type:'textarea', value:d.remarks || ''});
  }
  if(step.key === 'asset-info'){
    return TB.ui.formField({label:TB.t('lbl.cusip'), name:'iss_cusip', required:true, value:d.cusip || '', hint:t('输入CUSIP编号查询底层资产信息','Enter CUSIP to look up asset info')})
      + '<div class="mb-4"><button class="btn btn-sm" onclick="TB.pages.issuer.toast(\''+t('CUSIP查询中...','Looking up CUSIP...')+'\')">'+t('CUSIP查询','CUSIP Lookup')+'</button></div>'
      + row2(
        TB.ui.formField({label:TB.t('lbl.isin'), name:'iss_isin', required:true, value:d.isin || ''}),
        TB.ui.formField({label:t('底层资产类型','Asset Type'), name:'iss_assetType', type:'select', options:[
          {value:'T-Bill', label:'T-Bill', selected:(d.assetType || 'T-Note') === 'T-Bill'},
          {value:'T-Note', label:'T-Note', selected:(d.assetType || 'T-Note') === 'T-Note'},
          {value:'T-Bond', label:'T-Bond', selected:(d.assetType || 'T-Note') === 'T-Bond'}
        ]}))
      + row2(
        TB.ui.formField({label:t('资产总面值','Asset Face Value'), name:'iss_assetFace', type:'number', required:true, value:d.assetFace || ''}),
        TB.ui.formField({label:t('资产到期日','Asset Maturity'), name:'iss_assetMaturity', type:'date', required:true, value:d.assetMaturity || ''}))
      + row2(
        TB.ui.formField({label:t('资产发行日','Asset Issue Date'), name:'iss_assetIssueDate', type:'date', required:true, value:d.assetIssueDate || ''}),
        TB.ui.formField({label:t('票面利率','Coupon Rate'), name:'iss_couponRate', type:'number', value:d.couponRate || '', hint:t('T-Note / T-Bond 付息资产必填','Required for coupon-bearing assets')}))
      + TB.ui.formField({label:t('资产托管行','Asset Custodian'), name:'iss_assetCustodian', required:true, value:d.assetCustodian || 'Bison Bank'})
      + TB.ui.formField({label:t('资产备注','Asset Remarks'), name:'iss_assetRemarks', type:'textarea', value:d.assetRemarks || ''});
  }
  if(step.key === 'documents'){
    var filesTable = st.files.length
      ? TB.ui.table({ columns:[{key:'name',label:t('文件名','File Name')},{key:'size',label:t('大小','Size')},{key:'time',label:TB.t('time')}], data:st.files, actions:[{label:TB.t('delete'), onClick:'TB.pages.issuer.removeIssuanceFile', type:'danger'}] })
      : TB.ui.emptyState('📎', t('尚未上传发行资料','No documents uploaded yet'));
    return '<div class="form-group"><label class="form-label">'+t('文件上传','File Upload')+'</label>'
      + '<div class="upload-zone" onclick="TB.pages.issuer.addIssuanceFile()">📎<div class="mt-2">'+t('拖拽文件到此处，或点击上传','Drag files here or click to upload')+'</div></div></div>'
      + filesTable;
  }
  if(step.key === 'risk-disclosure'){
    var riskTable = st.riskFiles.length
      ? TB.ui.table({ columns:[{key:'name',label:t('文件名','File Name')},{key:'size',label:t('大小','Size')},{key:'time',label:TB.t('time')}], data:st.riskFiles, actions:[{label:TB.t('delete'), onClick:'TB.pages.issuer.removeRiskFile', type:'danger'}], paginate:false })
      : TB.ui.emptyState('📎', t('尚未上传风险揭示书','No risk disclosure uploaded yet'));
    return '<div class="form-group"><label class="form-label">'+t('风险揭示书上传','Risk Disclosure Upload')+'</label>'
      + '<div class="upload-zone" onclick="TB.pages.issuer.addRiskFile()">📎<div class="mt-2">'+t('拖拽风险揭示书到此处，或点击上传（PDF）','Drag the risk disclosure here or click to upload (PDF)')+'</div></div>'
      + '<div class="form-hint">'+t('上传的风险揭示书将用于成员购买/预定前的确认留痕。','The uploaded risk disclosure is recorded in the member pre-purchase acknowledgment.')+'</div></div>'
      + riskTable;
  }
  var flow = TB.pages.issuer.flowByType('issuance');
  var pathHtml = flow && flow.nodes.length
    ? flow.nodes.map(function(n, i){
        return '<div class="flex items-center gap-2" style="padding:6px 0"><span class="badge badge-default">'+(i+1)+'</span><span>'+TB.text(n.name)+'</span><span class="text-muted">·</span><span>'+n.approvers.map(function(a){ return TB.ui.badge(a, 'info'); }).join(' ')+'</span><span class="badge badge-orange">'+TB.pages.issuer.modeLabel(n.mode)+'</span></div>';
      }).join('')
    : TB.ui.alert('warning', t('尚未配置发行审批流程，提交后将直接进入运营端审核。','Issuance approval flow not configured; the request goes directly to operations review.'));
  return TB.ui.descList([
      {label:TB.t('lbl.seriesId'), value:st.id},
      {label:TB.t('lbl.productName'), value:d.productName || t('未命名产品','Untitled Product')},
      {label:t('托管方','Custodian'), value:d.custodian || '-'},
      {label:t('发行总面值','Total Face Value'), value:d.faceTotal ? TB.utils.money(d.faceTotal) : '-'},
      {label:TB.t('lbl.maturityDate'), value:d.maturityDate || '-'},
      {label:t('窗口天数','Window Days'), value:d.windowDays || '-'},
      {label:t('卖方收益率','Seller Yield'), value:d.sellerYield ? TB.utils.yield(d.sellerYield) : '-'},
      {label:t('参考市场收益率','Reference Yield'), value:d.refYield ? TB.utils.yield(d.refYield) : '-'},
      {label:t('参考价格','Mark Price'), value:d.markPrice ? TB.utils.price(d.markPrice) : '-'},
      {label:'CUSIP / ISIN', value:(d.cusip || '-') + ' / ' + (d.isin || '-')},
      {label:t('发行资料','Documents'), value:st.files.length + ' ' + t('份','file(s)')},
      {label:t('风险揭示书版本','Risk Disclosure Version'), value:d.riskVersion || '-'}
    ])
    + TB.ui.formField({label:t('责任确认','Responsibility'), name:'iss_agree', type:'checkbox', checkboxLabel:t('我确认上述发行信息真实、完整，并承担相应责任','I confirm the issuance information above is true and complete'), checked:d.agree !== false})
    + '<div class="mt-4 mb-2 font-bold">'+t('提交后审批路径','Approval Path After Submission')+'</div>'
    + pathHtml;
};

/* ===== Reconciliation (对账管理) ===== */
TB.pages.issuer.reconById = function(id){ return TB.data.reconciliations.find(function(r){ return r.id === id; }); };

TB.pages.issuer.openReconDetail = function(id){
  var t = TB.pages.issuer.t;
  var r = TB.pages.issuer.reconById(id);
  if(!r) return;
  var body = TB.ui.descList([
    {label:t('对账批次号','Batch ID'), value:r.id},
    {label:TB.t('date'), value:r.date},
    {label:TB.t('lbl.seriesId'), value:r.series},
    {label:TB.t('status'), value:TB.ui.statusBadge(r.status)},
    {label:t('差异项数','Diff Items'), value:String(r.diffCount)},
    {label:TB.t('time'), value:r.time}
  ]);
  if(r.diffCount > 0) body += '<div class="mt-4">'+TB.ui.alert('warning', t('存在差异项，请查看并处理。','There are differences that need to be resolved.'))+'</div>';
  TB.ui.modal({ title:t('对账明细','Reconciliation Detail'), body:body, size:'lg', footer:'<button class="btn" onclick="TB.ui.closeModal()">'+TB.t('close')+'</button>' });
};

TB.pages.issuer.openDiffModal = function(id){
  var t = TB.pages.issuer.t;
  var r = TB.pages.issuer.reconById(id);
  if(!r) return;
  if(r.diffCount === 0){
    TB.utils.toast(t('该批次无差异需要处理','This batch has no differences to resolve'), 'info');
    return;
  }
  var body = TB.ui.descList([
    {label:t('对账批次号','Batch ID'), value:r.id},
    {label:TB.t('lbl.seriesId'), value:r.series},
    {label:t('差异项数','Diff Items'), value:TB.ui.badge(r.diffCount, 'error')},
    {label:t('差异类型','Diff Type'), value:t('Token数量不匹配','Token count mismatch')},
    {label:t('差异金额','Diff Amount'), value:TB.utils.money(r.diffCount * 15000)}
  ]);
  body += TB.ui.formField({label:t('处理方式','Resolution'), name:'diff_resolution', type:'select', options:[
    {value:'adjust', label:t('调整Token数量','Adjust token count')},
    {value:'investigate', label:t('转人工调查','Escalate for investigation')},
    {value:'ignore', label:t('忽略差异','Ignore difference')}
  ]});
  body += TB.ui.formField({label:TB.t('remarks'), name:'diff_remark', type:'textarea', placeholder:t('请输入处理说明','Enter resolution note')});
  TB.ui.modal({
    title: t('处理差异','Process Difference'),
    body: body,
    footer: '<button class="btn" onclick="TB.ui.closeModal()">'+TB.t('cancel')+'</button><button class="btn btn-primary" onclick="TB.pages.issuer.resolveDiff(\''+r.id+'\')">'+TB.t('confirm')+'</button>'
  });
};

TB.pages.issuer.resolveDiff = function(id){
  var t = TB.pages.issuer.t;
  var r = TB.pages.issuer.reconById(id);
  if(!r) return;
  var resolution = TB.utils.getInputVal('diff_resolution');
  TB.ui.closeModal();
  if(resolution === 'investigate'){
    TB.utils.toast(t('已转人工调查','Escalated for investigation'), 'info');
    return;
  }
  r.status = 'matched';
  r.diffCount = 0;
  TB.utils.toast(t('差异已处理','Difference resolved'), 'success');
  TB.router.render();
};

TB.pages.issuer.openTriggerRecon = function(){
  var t = TB.pages.issuer.t;
  var body = TB.ui.formField({label:TB.t('lbl.seriesId'), name:'recon_series', type:'select', options:TB.data.series.map(function(s){ return {value:s.id, label:s.id+' · '+s.name}; })})
    + TB.ui.formField({label:TB.t('date'), name:'recon_date', type:'date', value:TB.utils.nowET().slice(0, 10)});
  TB.ui.modal({
    title: t('手动触发对账','Manual Reconciliation'),
    body: body,
    footer: '<button class="btn" onclick="TB.ui.closeModal()">'+TB.t('cancel')+'</button><button class="btn btn-primary" onclick="TB.pages.issuer.runRecon()">'+TB.t('submit')+'</button>'
  });
};

TB.pages.issuer.runRecon = function(){
  var t = TB.pages.issuer.t;
  var series = TB.utils.getInputVal('recon_series');
  var date = TB.utils.getInputVal('recon_date') || TB.utils.nowET().slice(0, 10);
  if(!series){
    TB.utils.toast(t('请选择 Series','Please select a series'), 'error');
    return;
  }
  TB.data.reconciliations.unshift({id:'REC-'+date.replace(/-/g, '')+'-'+(TB.data.reconciliations.length + 1), date:date, series:series, status:'matched', diffCount:0, time:TB.utils.nowET()});
  TB.ui.closeModal();
  TB.utils.toast(t('对账已完成','Reconciliation completed'), 'success');
  TB.router.render();
};

/* ===== EMT Reserve & Cover (EMT管理) =====
 * 口径来自需求说明文档：EMT Cover = 次日到期赎回（checkout/maturity）交易金额 × (1 + 缓冲率)。 */
TB.pages.issuer.emtNoteRequired = function(){
  var t = TB.pages.issuer.t;
  var buf = (TB.data.emtReserve.bufferRate * 100).toFixed(0);
  return t('EMT Cover = 次日到期赎回（checkout / maturity）交易金额 × (1 + 缓冲率 '+buf+'%)；每个交易日收盘后系统自动计算并通知 Bison 备足。','EMT Cover = next-day redemption (checkout / maturity) amount x (1 + '+buf+'% buffer), recalculated after every close and notified to Bison.');
};
TB.pages.issuer.emtNoteGap = function(){
  var t = TB.pages.issuer.t;
  return t('可用余额未覆盖的部分；系统会在收盘后通知 Bison 补充 EMT。','The uncovered portion; the system notifies Bison to top up EMT after the close.');
};
TB.pages.issuer.emtNoteStatus = function(){
  var t = TB.pages.issuer.t;
  return t('按 Group EMT 可用余额自上而下逐行覆盖：充足 / 不足 / 缺口 / 无需Cover。Checkout 需 Cover 充足，否则成员 token 保持锁定并顺延至下一个 close，同时告警运营。','Group EMT availability is allocated top-down: sufficient / short / gap / not needed. Checkout settles only while cover is sufficient; otherwise member tokens stay locked and roll to the next close with an operations alert.');
};

TB.pages.issuer.emtCoverRows = function(){
  var r = TB.data.emtReserve;
  var rows = TB.data.emtCovers.map(function(c){
    return { id:c.id, series:c.series, type:c.type, dueDate:c.dueDate, redemption:c.redemption, required: c.redemption > 0 ? c.redemption * (1 + r.bufferRate) : 0 };
  });
  var remaining = r.available;
  rows.forEach(function(row){
    if(row.required <= 0){ row.status = 'none'; row.gap = 0; return; }
    var covered = Math.min(remaining, row.required);
    remaining -= covered;
    row.gap = Math.max(0, row.required - covered);
    row.status = row.gap === 0 ? 'ok' : (row.gap > row.required * 0.2 ? 'short' : 'warn');
  });
  rows.sort(function(a, b){ return b.gap - a.gap || b.required - a.required; });
  return rows;
};
TB.pages.issuer.emtCoverSummary = function(){
  var rows = TB.pages.issuer.emtCoverRows();
  return {
    required: rows.reduce(function(s, r){ return s + r.required; }, 0),
    redemption: rows.reduce(function(s, r){ return s + r.redemption; }, 0),
    gap: rows.reduce(function(s, r){ return s + r.gap; }, 0),
    holdings: TB.data.series.reduce(function(s, x){ return s + (x.faceTotal - x.faceAvailable); }, 0)
  };
};
TB.pages.issuer.emtStatusLabel = function(status){
  var t = TB.pages.issuer.t;
  var map = { ok:[t('Cover充足','Cover Sufficient'),'success'], warn:[t('Cover不足','Cover Short'),'warning'], short:[t('Cover缺口','Cover Gap'),'error'], none:[t('无需Cover','No Cover Needed'),'default'] };
  var m = map[status] || map.none;
  return TB.ui.badge(m[0], m[1]);
};
TB.pages.issuer.emtTypeLabel = function(k){
  var t = TB.pages.issuer.t;
  var map = { mint:t('铸入EMT','EMT Mint'), payout:t('兑付成员','Member Payout'), withdraw:t('提现换汇','Withdraw to Fiat'), freeze:t('冻结预留','Freeze for Cover') };
  return map[k] || k;
};
/* ===== Burn Management (销毁管理) =====
 * 系统对已到期且全部赎回的周期自动生成销毁确认待办；审核人核对赎回与对账后发起销毁审批。 */
TB.pages.issuer._burnAltKey = function(id){ return id.replace(/^R-/, ''); };
TB.pages.issuer.burnConfirmRows = function(){
  var t = TB.pages.issuer.t;
  return TB.data.burnConfirms.map(function(c){
    var s = TB.data.series.find(function(x){ return x.id === c.series; }) || {};
    var alt = TB.pages.issuer._burnAltKey(c.series);
    var holds = TB.data.holdings.filter(function(h){ return h.series === c.series || h.series === alt; });
    var recons = TB.data.reconciliations.filter(function(r){ return r.series === c.series || r.series === alt; });
    var breaks = recons.filter(function(r){ return r.status === 'break'; }).length;
    return {
      id:c.id, series:c.series, maturity:s.maturityDate || '-', seriesStatus:s.status || '-',
      redemptions:holds.length,
      redeemedAmt:holds.reduce(function(sum, h){ return sum + h.faceValue; }, 0),
      emtPaid:c.emtPaid !== false,
      reconStatus: breaks > 0 ? 'break' : (recons.length ? 'matched' : 'none'),
      reconBatches:recons.length, breaks:breaks,
      generatedAt:c.generatedAt, status:c.status, submittedAt:c.submittedAt || '-'
    };
  });
};
TB.pages.issuer._burnHolds = function(series){
  var alt = TB.pages.issuer._burnAltKey(series);
  return TB.data.holdings.filter(function(h){ return h.series === series || h.series === alt; });
};

/* 前置条件（补充规格 §12 步骤 2）：①Series已到期 ②全部成员赎回完成 ③全部成员EMT兑付完成 ④R-UST归属清零，另加三方对账通过 */
TB.pages.issuer.burnPrereqs = function(row, holds){
  var t = TB.pages.issuer.t;
  var done = ['checkoutCompleted', 'maturityPaid', 'burned'];
  var remain = holds.reduce(function(s, h){ return done.indexOf(h.status) >= 0 ? s : s + (h.tokens || 0); }, 0);
  var matured = ['maturity', 'burned'].indexOf(row.seriesStatus) >= 0 || (!!row.maturity && row.maturity !== '-' && row.maturity <= TB.utils.todayStr());
  return {
    remainTokens: remain,
    items: [
      {key:'matured', ok:matured, label:t('Series已到期','Series Matured'), detail:row.maturity},
      {key:'redeemed', ok:holds.length > 0 && remain === 0, label:t('全部成员赎回完成','All Member Redemptions Complete'), detail:row.redemptions + ' ' + t('笔赎回记录','redemption record(s)')},
      {key:'emtPaid', ok:!!row.emtPaid, label:t('全部成员EMT兑付完成','All Member EMT Payouts Complete'), detail:row.emtPaid ? t('已兑付','Paid') : t('未兑付','Unpaid')},
      {key:'rustCleared', ok:remain === 0, label:t('R-UST归属清零','R-UST Ownership Cleared'), detail:t('剩余 ','Remaining ') + TB.utils.tokens(remain)},
      {key:'recon', ok:row.reconStatus === 'matched', label:t('三方对账通过','Three-way Reconciliation Matched'), detail:row.reconStatus === 'matched' ? t('全部一致','All matched') : (row.reconStatus === 'break' ? row.breaks + ' ' + t('笔差异','break(s)') : t('无对账批次','No reconciliation batch'))}
    ]
  };
};

TB.pages.issuer.burnStatusBadge = function(status){
  var t = TB.pages.issuer.t;
  if(status === 'pending') return TB.ui.badge(t('待确认','Pending Confirmation'), 'orange');
  if(status === 'submitted') return TB.ui.badge(t('已发起审批','Approval Submitted'), 'info');
  if(status === 'rejected') return TB.ui.badge(t('已驳回','Rejected'), 'error');
  return TB.ui.badge(t('已销毁','Burned'), 'default');
};

/* 销毁审核弹窗（补充规格 I-10 销毁管理-销毁审核页）：
 * 审核流程进度 + 申请信息 + 前置条件确认结果 + 成员赎回信息 + 对账情况 + 审核意见（通过选填/驳回必填，≤500字）+ 通过/驳回 */
TB.pages.issuer.openBurnReview = function(id, readonly){
  var t = TB.pages.issuer.t;
  var row = TB.pages.issuer.burnConfirmRows().find(function(r){ return r.id === id; });
  if(!row) return;
  var conf = TB.data.burnConfirms.find(function(c){ return c.id === id; }) || {};
  var holds = TB.pages.issuer._burnHolds(row.series);
  var recons = TB.data.reconciliations.filter(function(r){ return r.series === row.series || r.series === TB.pages.issuer._burnAltKey(row.series); });
  var flow = TB.pages.issuer.flowByType('burn');
  var user = TB.state.user ? TB.state.user.name : '';
  var pre = TB.pages.issuer.burnPrereqs(row, holds);
  var blockers = pre.items.filter(function(p){ return !p.ok; });
  var editable = !readonly && row.status === 'pending';
  var totalTokens = holds.reduce(function(s, h){ return s + (h.tokens || 0); }, 0);
  var body = '';
  if(flow && flow.nodes.length && flow.enabled){
    body += TB.ui.stepIndicator(flow.nodes.map(function(n){ return {label:TB.text(n.name), status:'waiting'}; }))
      + '<div class="text-muted text-sm mt-2 mb-4">' + t('审核确认通过后，从首个节点发起销毁审批','Once this review is confirmed the burn approval starts at the first node') + '：'
      + TB.text(flow.nodes[0].name) + ' · ' + t('审批人','Approvers') + '：' + flow.nodes[0].approvers.join(', ')
      + '（' + TB.pages.issuer.modeLabel(flow.nodes[0].mode) + '）</div>';
  } else {
    body += TB.ui.alert('warning', t('未配置或未启用销毁审批流程，请先在「审核流程配置」中设置。','The burn approval flow is not configured or is disabled; set it up in Review Flow Config first.'));
  }
  if(blockers.length && editable){
    body += TB.ui.alert('error', t('前置条件不满足，暂不可发起销毁审批：','Prerequisites are not met, the burn approval cannot be initiated: ') + blockers.map(function(b){ return b.label; }).join('、'));
  }
  body += TB.ui.descList([
    {label:TB.t('lbl.seriesId'), value:row.series},
    {label:TB.t('lbl.maturityDate'), value:row.maturity},
    {label:t('申请人','Applicant'), value:editable ? user : (conf.reviewer || user)},
    {label:t('生成时间','Generated'), value:row.generatedAt},
    {label:t('销毁数量','Burn Quantity')+TB.utils.note(t('待销毁 R-UST 总量 = 该周期全部成员赎回面值与对应 token 数。','Burn quantity = the redeemed face value of this cycle and the corresponding token amount.')), value:TB.utils.money(row.redeemedAmt) + ' / ' + TB.utils.tokens(totalTokens)},
    {label:t('对账结果','Reconciliation Result'), value:row.reconStatus === 'matched' ? TB.ui.badge(row.reconBatches + ' ' + t('批次全部一致','batch(es) all matched'), 'success') : (row.reconStatus === 'break' ? TB.ui.badge(row.breaks + ' ' + t('笔差异','break(s)'), 'error') : TB.ui.badge(t('无对账批次','No batch'), 'default'))},
    {label:t('当前审核节点','Current Review Node'), value:row.status === 'pending' ? t('未发起（待本次审核确认）','Not started (awaiting this review)') : TB.text(flow && flow.nodes[0] ? flow.nodes[0].name : {zh:'-',en:'-'})},
    {label:TB.t('status'), value:TB.pages.issuer.burnStatusBadge(row.status)}
  ]);
  body += '<div class="font-bold mt-4 mb-2">' + (editable ? t('前置条件确认','Prerequisite Attestation') : t('前置条件确认结果','Prerequisite Confirmation'))
    + TB.utils.note(editable
      ? t('系统已给出下方各项的校验数据，请审核人逐项核对后勾选确认；未全部勾选前不可发起销毁审批。','The system shows the check data below; the reviewer must verify and tick each item. Submission stays disabled until all are ticked.')
      : t('审核人逐项勾选确认后的留痕。','Attestation trail ticked by the reviewer.')) + '</div>';
  if(editable){
    body += '<div class="pre-check-list">' + pre.items.map(function(p){
      return '<label class="form-checkbox pre-check-item' + (p.ok ? '' : ' pre-check-bad') + '"><input type="checkbox" id="pre_' + p.key + '"' + (p.ok ? '' : ' disabled') + ' onchange="TB.pages.issuer._syncBurnConfirm(\'' + id + '\')">'
        + '<span>' + p.label + ' <span class="text-muted text-sm">（' + TB.utils.esc(p.detail) + '）</span>'
        + (p.ok ? '' : ' ' + TB.ui.badge(t('系统校验未通过，不可勾选','System check failed; cannot tick'), 'error')) + '</span></label>';
    }).join('') + '</div>';
  } else {
    var sign = conf.prereqSign || {};
    body += TB.ui.descList(pre.items.map(function(p){
      var badge = sign[p.key] ? TB.ui.badge('✓ ' + t('已确认','Attested'), 'success') : (p.ok ? TB.ui.badge('✓', 'success') : TB.ui.badge('✗', 'error'));
      return {label:p.label, value:badge + ' ' + p.detail};
    }));
    if(conf.reviewer) body += '<div class="text-muted text-sm mt-2">' + t('确认人','Attested by') + '：' + TB.utils.esc(conf.reviewer) + ' · ' + TB.utils.dt(conf.reviewedAt || row.submittedAt) + '</div>';
  }
  body += '<div class="font-bold mt-4 mb-2">' + t('成员赎回信息','Member Redemption Info') + '</div>'
    + (holds.length ? TB.ui.table({ columns:[
        {key:'member', label:t('成员','Member')},
        {key:'faceValue', label:TB.t('lbl.faceValue'), align:'right', render:function(r){ return TB.utils.money(r.faceValue); }},
        {key:'tokens', label:t('Token数量','Tokens'), align:'right', render:function(r){ return TB.utils.tokens(r.tokens); }},
        {key:'checkin', label:t('起息日','Value Date')},
        {key:'maturityDate', label:t('赎回日期','Redemption Date')},
        {key:'status', label:TB.t('status'), render:function(r){ return TB.ui.statusBadge(r.status); }}
      ], data:holds, paginate:false }) : TB.ui.emptyState('📭', t('无赎回记录','No redemption records')));
  body += '<div class="font-bold mt-4 mb-2">' + t('对账情况','Reconciliation Status') + '</div>'
    + (recons.length ? TB.ui.table({ columns:[
        {key:'id', label:t('对账批次号','Batch ID')},
        {key:'date', label:TB.t('date')},
        {key:'status', label:TB.t('status'), render:function(r){ return TB.ui.statusBadge(r.status); }},
        {key:'diffCount', label:t('差异项数','Diff Items'), align:'right'}
      ], data:recons, paginate:false }) : TB.ui.emptyState('📭', t('无对账批次','No reconciliation batches')));
  body += '<div class="mt-4">' + (editable
    ? TB.ui.formField({label:t('审核意见','Review Comment'), name:'burn_review_comment', type:'textarea', placeholder:t('通过时选填，驳回时必填；最多 500 字','Optional when approving, required when rejecting; up to 500 characters')})
    : '<div class="font-bold mb-2">' + t('审核意见','Review Comment') + '</div><div class="text-sm" style="color:var(--text-secondary)">' + TB.utils.esc(conf.reviewComment || t('无','None')) + '</div>'
      + (conf.reviewer ? '<div class="text-muted text-sm mt-2">' + t('审核人','Reviewer') + '：' + TB.utils.esc(conf.reviewer) + ' · ' + TB.utils.dt(conf.reviewedAt || row.submittedAt) + '</div>' : '')) + '</div>';
  var footer = '<button class="btn" onclick="TB.ui.closeModal()">' + (editable ? TB.t('cancel') : TB.t('close')) + '</button>';
  if(editable){
    footer += '<button class="btn btn-danger" onclick="TB.pages.issuer.rejectBurnConfirm(\'' + id + '\')">' + t('驳回','Reject') + '</button>'
      + '<button class="btn btn-primary" id="burn_confirm_btn"' + (blockers.length || !flow || !flow.nodes.length || !flow.enabled ? ' disabled' : '') + ' onclick="TB.pages.issuer.confirmBurnReview(\'' + id + '\')">' + t('确认无误并发起销毁审批','Confirm & Submit Burn Approval') + '</button>';
  }
  TB.ui.modal({ title:t('销毁审核','Burn Review') + ' · ' + row.series, body:body, size:'lg', footer:footer });
  if(editable) TB.pages.issuer._syncBurnConfirm(id);
};

/* 前置条件须由审核人逐项勾选后才可提交；系统校验未通过的项不可勾选 */
TB.pages.issuer._syncBurnConfirm = function(id){
  var btn = document.getElementById('burn_confirm_btn');
  if(!btn) return;
  var boxes = Array.prototype.filter.call(document.querySelectorAll('#modal-container .pre-check-item input'), function(b){ return !b.disabled; });
  btn.disabled = !(boxes.length && boxes.every(function(b){ return b.checked; }));
};

TB.pages.issuer.confirmBurnReview = function(id){
  var t = TB.pages.issuer.t;
  var row = TB.pages.issuer.burnConfirmRows().find(function(r){ return r.id === id; });
  if(!row) return;
  var comment = TB.utils.getInputVal('burn_review_comment') || '';
  if(comment.length > 500){
    TB.utils.toast(t('审核意见最多 500 字','The review comment is limited to 500 characters'), 'error');
    return;
  }
  var pre = TB.pages.issuer.burnPrereqs(row, TB.pages.issuer._burnHolds(row.series));
  var bad = pre.items.filter(function(p){ return !p.ok; });
  if(bad.length){
    TB.utils.toast(t('前置条件不满足：','Prerequisites not met: ') + bad[0].label, 'error');
    return;
  }
  var sign = {}, missing = [];
  pre.items.forEach(function(p){
    var box = document.getElementById('pre_' + p.key);
    if(box && !box.disabled){
      if(box.checked) sign[p.key] = true; else missing.push(p.label);
    }
  });
  if(missing.length){
    TB.utils.toast(t('请先逐项勾选确认前置条件：','Please tick each prerequisite to attest it: ') + missing.join('、'), 'error');
    return;
  }
  TB.pages.issuer._burnSign = sign;
  TB.pages.issuer._burnComment = comment;
  TB.pages.issuer._submitBurnDone(id);
};

TB.pages.issuer.rejectBurnConfirm = function(id){
  var t = TB.pages.issuer.t;
  var comment = TB.utils.getInputVal('burn_review_comment') || '';
  if(!comment){
    TB.utils.toast(t('驳回时必须填写审核意见','A review comment is required to reject'), 'error');
    return;
  }
  TB.pages.issuer._burnComment = comment;
  TB.ui.confirmModal(t('驳回销毁确认','Reject Burn Confirmation'), t('确认驳回此销毁申请？驳回后退回发起人修改。','Reject this burn request? It will be returned to the initiator for revision.'), 'TB.pages.issuer._rejectBurnDone(\'' + id + '\')', 'danger');
};

TB.pages.issuer._rejectBurnDone = function(id){
  var t = TB.pages.issuer.t;
  var conf = TB.data.burnConfirms.find(function(c){ return c.id === id; });
  if(!conf) return;
  conf.status = 'rejected';
  conf.reviewComment = TB.pages.issuer._burnComment || '';
  conf.reviewer = TB.state.user ? TB.state.user.name : '';
  conf.reviewedAt = TB.utils.nowET();
  TB.ui.closeModal();
  TB.utils.toast(t('已驳回，退回发起人修改','Rejected and returned to the initiator'), 'error');
  TB.router.render();
};

TB.pages.issuer._submitBurnDone = function(id){
  var t = TB.pages.issuer.t;
  var conf = TB.data.burnConfirms.find(function(c){ return c.id === id; });
  var row = TB.pages.issuer.burnConfirmRows().find(function(r){ return r.id === id; });
  if(!conf || !row) return;
  var user = TB.state.user ? TB.state.user.name : '';
  var brnId = 'BRN-' + String(TB.data.burnRequests.length + 1).padStart(3, '0');
  TB.data.burnRequests.unshift({ id:brnId, series:row.series, applicant:user, applyTime:TB.utils.nowET(), node:'Maker', status:'pending', completeTime:'-', amount:row.redeemedAmt, reviewComment:TB.pages.issuer._burnComment || '' });
  var flow = TB.pages.issuer.flowByType('burn');
  if(flow && flow.nodes.length && flow.enabled) TB.pages.issuer._startApproval('burn', brnId, user, 'High');
  conf.status = 'submitted';
  conf.submittedAt = TB.utils.nowET();
  conf.reviewComment = TB.pages.issuer._burnComment || '';
  conf.prereqSign = TB.pages.issuer._burnSign || {};
  conf.reviewer = user;
  conf.reviewedAt = TB.utils.nowET();
  TB.ui.closeModal();
  TB.utils.toast(t('已发起销毁审批：','Burn approval submitted: ') + brnId, 'success');
  TB.router.render();
};

TB.pages.issuer.renderIssuanceDrawer = function(){
  var t = TB.pages.issuer.t;
  var st = TB.pages.issuer._issuance;
  if(!st) return;
  var steps = TB.pages.issuer.issuanceSteps;
  var step = steps[st.step];
  var body = TB.ui.stepIndicator(steps.map(function(s, i){
    return { label:t(s.labelZh, s.labelEn), status: i < st.step ? 'done' : (i === st.step ? 'pending' : 'waiting') };
  }));
  body += '<div class="text-muted text-sm mt-2 mb-4">'+(st.step + 1)+' / '+steps.length+' · '+t(step.labelZh, step.labelEn)+' · '+st.id+'</div>';
  body += TB.pages.issuer._issuanceStepBody(st, step);
  var last = st.step === steps.length - 1;
  var footer = '<button class="btn" onclick="TB.pages.issuer.saveDraftIssuance()">'+t('暂存','Save Draft')+'</button>'
    + '<div class="flex gap-2">'
    + (st.step > 0 ? '<button class="btn" onclick="TB.pages.issuer.gotoIssuanceStep(-1)">'+TB.t('previous')+'</button>' : '')
    + (last ? '<button class="btn btn-primary" onclick="TB.pages.issuer.submitIssuance()">'+TB.t('submit')+'</button>'
            : '<button class="btn btn-primary" onclick="TB.pages.issuer.gotoIssuanceStep(1)">'+TB.t('next')+'</button>')
    + '</div>';
  TB.ui.drawer({ title:t('产品发行','Product Issuance'), body:body, footer:footer, width:720 });
};

/* 草稿与被驳回的产品在列表中点击后回到抽屉继续编辑 */
TB.pages.issuer.openSeriesRow = function(id){
  var row = TB.data.series.find(function(s){ return s.id === id; });
  if(row && (row.status === 'draft' || row.status === 'rejected')){ TB.pages.issuer.openIssuance(id); return; }
  TB.pages.issuer.viewSeries(id);
};
TB.pages.issuer._lastSync = null;
TB.pages.issuer.syncQuotes = function(){
  var t = TB.pages.issuer.t;
  var base = Date.now();
  var quoteTime = TB.utils.etStamp(base, true);
  var validUntil = TB.utils.etStamp(base + 5 * 60 * 1000, true);
  TB.data.quotes.forEach(function(q){
    if(q.status === 'pending') return;
    q.quoteTime = quoteTime;
    q.validUntil = validUntil;
    q.status = 'valid';
  });
  TB.pages.issuer._lastSync = quoteTime;
  TB.utils.toast(t('报价已同步刷新','Quotes synced successfully'), 'success');
  TB.router.render();
};

/* ===== Approval Management (审批管理) ===== */
TB.pages.issuer._flowSel = 'AF-ISSU';

TB.pages.issuer.flowById = function(id){ return TB.data.approvalFlows.find(function(f){ return f.id === id; }); };
TB.pages.issuer.flowByType = function(type){ return TB.data.approvalFlows.find(function(f){ return f.type === type; }); };
TB.pages.issuer.taskById = function(id){ return TB.data.approvalTasks.find(function(x){ return x.id === id; }); };
TB.pages.issuer.orgAccounts = function(){ return TB.data.accounts.filter(function(a){ return a.org === 'Bison Bank' && a.status === 'active'; }); };
TB.pages.issuer.now = function(){ return TB.utils.nowET(); };
TB.pages.issuer.modeLabel = function(mode){
  var t = TB.pages.issuer.t;
  return mode === 'all' ? t('会签 · 需全部通过','AND · all must approve') : t('或签 · 任一人通过','OR · any one approves');
};
TB.pages.issuer.taskNodeName = function(task){
  var flow = TB.pages.issuer.flowById(task.flow);
  var node = flow && flow.nodes[task.nodeOrder - 1];
  return node ? TB.text(node.name) : '-';
};
TB.pages.issuer.selectFlow = function(id){ TB.pages.issuer._flowSel = id; TB.router.render(); };

/* 审核流程状态机（补充规格第五章 §6）：草稿 → 待<节点>审核 →（节点通过后自动流转下一节点）→ 已审批通过 / 已拒绝 / 已退回。
 * 会签节点在全部审批人签署前停留在「<节点>会签中 (已签/应签)」。 */
TB.pages.issuer.taskState = function(task){
  var t = TB.pages.issuer.t;
  var flow = TB.pages.issuer.flowById(task.flow);
  var node = flow && flow.nodes[task.nodeOrder - 1];
  var nodeName = node ? TB.text(node.name) : t('审核','Review');
  if(task.status === 'approved') return {key:'approved', label:t('已审批通过','Approved'), tone:'success', node:nodeName};
  if(task.status === 'rejected') return {key:'rejected', label:t('已拒绝','Rejected'), tone:'error', node:nodeName};
  if(task.status === 'returned') return {key:'returned', label:t('已退回','Returned'), tone:'orange', node:nodeName};
  var signed = (task.nodeApprovals || []).length;
  var need = node ? node.approvers.length : 1;
  if(node && node.mode === 'all' && signed > 0 && signed < need){
    return {key:'countersign', label:t(nodeName+'会签中','Co-signing · '+nodeName)+' ('+signed+'/'+need+')', tone:'info', node:nodeName, signed:signed, need:need};
  }
  return {key:'nodePending', label:t('待'+nodeName,'Awaiting '+nodeName), tone:'info', node:nodeName, signed:signed, need:need};
};

/* 审核中心数据源：审核流程任务 + 业务待办，统一归为待处理 / 已处理 */
TB.pages.issuer.reviewItems = function(){
  var t = TB.pages.issuer.t;
  var user = TB.state.user ? TB.state.user.name : '';
  var bizTone = {pending:'orange', processed:'default', approved:'success', rejected:'error', returned:'orange'};
  var items = [];
  TB.data.approvalTasks.forEach(function(k){
    var flow = TB.pages.issuer.flowById(k.flow);
    var st = TB.pages.issuer.taskState(k);
    var iSigned = (k.nodeApprovals || []).indexOf(user) >= 0;
    items.push({
      id:k.id, source:t('审核流程','Approval Flow'),
      type:flow ? TB.text(flow.name) : t('审核','Review'),
      desc:k.ref,
      status:k.status,
      statusLabel:st.label, statusTone:st.tone,
      handler:k.decidedBy && k.decidedBy !== '-' ? k.decidedBy : k.approvers.join(', '),
      time:k.status === 'pending' ? k.submittedAt : k.completedAt,
      route:k.flow === 'AF-BURN' ? '#/burn' : '#/series',
      mine:k.status === 'pending' && !iSigned && k.approvers.indexOf(user) >= 0,
      taskId:k.id
    });
  });
  TB.data.issuerTasks.forEach(function(x){
    var label = TB.i18n['st.' + x.status] ? TB.t('st.' + x.status) : TB.utils.enumLabel(x.status);
    items.push({ id:x.id, source:t('业务待办','Business Task'), type:TB.text(x.type), desc:TB.text(x.desc), status:x.status, statusLabel:label, statusTone:bizTone[x.status] || 'default', handler:typeof x.handler === 'object' ? TB.text(x.handler) : x.handler, time:x.time, route:x.route, mine:false, taskId:null });
  });
  items.sort(function(a, b){ return a.time < b.time ? 1 : -1; });
  return items;
};

TB.pages.issuer.openNodeModal = function(nodeId){
  var t = TB.pages.issuer.t;
  var flow = TB.pages.issuer.flowById(TB.pages.issuer._flowSel);
  if(!flow) return;
  var node = nodeId ? flow.nodes.find(function(n){ return n.id === nodeId; }) : null;
  var body = TB.ui.formField({label:TB.t('lbl.nodeName'), name:'node_name', required:true, value:node ? TB.text(node.name) : '', hint:t('节点名称将展示在审批步骤条与流转记录中','Node name appears in the approval stepper and trail')})
    + TB.ui.formField({label:TB.t('lbl.signMode'), name:'node_mode', type:'select', options:[
        {value:'any', label:t('或签 · 任一人通过','OR · any one approves'), selected:!node || node.mode === 'any'},
        {value:'all', label:t('会签 · 需全部通过','AND · all must approve'), selected:node && node.mode === 'all'}
      ]})
    + TB.ui.formField({label:TB.t('lbl.approvers'), name:'node_approvers', type:'checkbox-group', required:true,
        options: TB.pages.issuer.orgAccounts().map(function(a){
          return {value:a.name, label:a.name+' · '+a.role, checked:node && node.approvers.indexOf(a.name) >= 0};
        }),
        hint:t('审批人仅能从本机构已启用的账号中选择','Approvers can only be active accounts of your organization')});
  TB.ui.modal({
    title: node ? t('编辑审批节点','Edit Approval Node') : t('新增审批节点','Add Approval Node'),
    body: body,
    footer: '<button class="btn" onclick="TB.ui.closeModal()">'+TB.t('cancel')+'</button><button class="btn btn-primary" onclick="TB.pages.issuer.saveNode('+(node ? '\''+node.id+'\'' : '')+')">'+TB.t('save')+'</button>'
  });
};

TB.pages.issuer.saveNode = function(nodeId){
  var t = TB.pages.issuer.t;
  var flow = TB.pages.issuer.flowById(TB.pages.issuer._flowSel);
  if(!flow) return;
  var name = TB.utils.getInputVal('node_name');
  var mode = TB.utils.getInputVal('node_mode');
  var approvers = [];
  document.querySelectorAll('#node_approvers input:checked').forEach(function(input){ approvers.push(input.value); });
  if(!name || approvers.length === 0){
    TB.utils.toast(t('请填写节点名称并至少选择一名审批人','Node name and at least one approver are required'), 'error');
    return;
  }
  if(nodeId){
    var node = flow.nodes.find(function(n){ return n.id === nodeId; });
    if(node){ node.name = {en:name, zh:name}; node.mode = mode; node.approvers = approvers; }
  } else {
    var maxN = flow.nodes.reduce(function(m, n){ var v = parseInt(n.id.replace(/\D/g,''), 10); return Math.max(m, isNaN(v) ? 0 : v); }, 0);
    flow.nodes.push({id:'N'+(maxN+1), order:flow.nodes.length+1, name:{en:name, zh:name}, mode:mode, approvers:approvers});
  }
  flow.updatedAt = TB.pages.issuer.now();
  TB.ui.closeModal();
  TB.utils.toast(TB.t('msg.saveSuccess'), 'success');
  TB.router.render();
};

TB.pages.issuer.deleteNode = function(nodeId){
  var t = TB.pages.issuer.t;
  var flow = TB.pages.issuer.flowById(TB.pages.issuer._flowSel);
  if(!flow) return;
  TB.ui.confirmModal(t('删除审批节点','Delete Node'), t('确认删除该审批节点？删除后流程将立即生效。','Delete this approval node? The flow takes effect immediately.'), 'TB.pages.issuer._deleteNodeDone(\''+nodeId+'\')', 'danger');
};
TB.pages.issuer._deleteNodeDone = function(nodeId){
  var flow = TB.pages.issuer.flowById(TB.pages.issuer._flowSel);
  if(!flow) return;
  flow.nodes = flow.nodes.filter(function(n){ return n.id !== nodeId; });
  flow.nodes.forEach(function(n, i){ n.order = i + 1; });
  flow.updatedAt = TB.pages.issuer.now();
  TB.utils.toast(TB.t('msg.operationSuccess'), 'success');
  TB.router.render();
};

TB.pages.issuer.saveFlowStatus = function(){
  var t = TB.pages.issuer.t;
  var flow = TB.pages.issuer.flowById(TB.pages.issuer._flowSel);
  if(!flow) return;
  var el = document.getElementById('flow_enabled');
  flow.enabled = !!(el && el.checked);
  flow.updatedAt = TB.pages.issuer.now();
  if(flow.enabled && flow.nodes.length === 0){
    TB.utils.toast(t('流程已启用但尚未配置审批节点','Flow enabled but no approval node configured'), 'error');
    TB.router.render();
    return;
  }
  TB.utils.toast(TB.t('msg.saveSuccess'), 'success');
  TB.router.render();
};

TB.pages.issuer.openDecide = function(taskId, decision){
  var t = TB.pages.issuer.t;
  var task = TB.pages.issuer.taskById(taskId);
  if(!task) return;
  var flow = TB.pages.issuer.flowById(task.flow);
  var act = {
    approved:{title:t('通过审批','Approve'), btn:TB.t('approve'), cls:'btn-primary'},
    returned:{title:t('退回发起人','Return to Initiator'), btn:t('退回','Return'), cls:''},
    rejected:{title:t('拒绝申请','Reject'), btn:TB.t('reject'), cls:'btn-danger'}
  }[decision] || {title:t('审核','Review'), btn:TB.t('confirm'), cls:'btn-primary'};
  var st = TB.pages.issuer.taskState(task);
  TB.ui.modal({
    title: act.title,
    body: TB.ui.descList([
      {label:t('编号','ID'), value:task.id},
      {label:t('关联单号','Reference'), value:task.ref},
      {label:TB.t('lbl.flow'), value:flow ? TB.text(flow.name) : task.flow},
      {label:TB.t('lbl.node'), value:TB.pages.issuer.taskNodeName(task)},
      {label:TB.t('status'), value:TB.ui.badge(st.label, st.tone)},
      {label:TB.t('lbl.approvers'), value:task.approvers.join(', ') + (flow && flow.nodes[task.nodeOrder - 1] ? '（' + TB.pages.issuer.modeLabel(flow.nodes[task.nodeOrder - 1].mode) + '）' : '')}
    ]) + TB.ui.formField({label:t('审批意见','Remarks'), name:'decide_remarks', type:'textarea', placeholder:t('退回或拒绝时必填','Required when returning or rejecting')})
      + (decision === 'returned' ? '<div class="form-hint">'+t('退回后申请回到发起人，修改并重新提交将从首个审核节点重新流转。','After a return the request goes back to the initiator; resubmission restarts the flow from the first node.')+'</div>' : ''),
    footer: '<button class="btn" onclick="TB.ui.closeModal()">'+TB.t('cancel')+'</button><button class="btn '+act.cls+'" onclick="TB.pages.issuer.confirmDecide(\''+taskId+'\',\''+decision+'\')">'+act.btn+'</button>'
  });
};

/* 退回：统一退回发起人修改（补充规格 §6 Returned），关联业务对象回到可重新提交状态 */
TB.pages.issuer._returnToInitiator = function(task){
  var s = TB.data.series.find(function(x){ return x.id === task.ref; });
  if(s && (s.status === 'approving' || s.status === 'minting')) s.status = 'draft';
  var brn = TB.data.burnRequests.find(function(x){ return x.id === task.ref; });
  if(brn && brn.status === 'pending'){
    brn.status = 'returned';
    var conf = TB.data.burnConfirms.find(function(c){ return c.series === brn.series && c.status === 'submitted'; });
    if(conf) conf.status = 'pending';
  }
};

/* 提交/重新提交审批：已在流转中则复用；已退回或已拒绝的按状态机回到首个审核节点；否则新建任务 */
TB.pages.issuer._startApproval = function(flowType, ref, applicant, priority){
  var flow = TB.pages.issuer.flowByType(flowType);
  if(!flow || !flow.nodes.length) return null;
  var existing = TB.data.approvalTasks.find(function(x){ return x.ref === ref && x.flow === flow.id; });
  if(existing && existing.status === 'pending') return existing;
  if(existing && (existing.status === 'returned' || existing.status === 'rejected')){
    existing.status = 'pending';
    existing.nodeOrder = 1;
    existing.approvers = flow.nodes[0].approvers.slice();
    existing.nodeApprovals = [];
    existing.applicant = applicant;
    existing.submittedAt = TB.utils.nowET();
    existing.completedAt = '-';
    existing.decidedBy = '-';
    return existing;
  }
  var task = { id:'APR-' + String(TB.data.approvalTasks.length + 1).padStart(3, '0'), flow:flow.id, ref:ref, applicant:applicant, submittedAt:TB.utils.nowET(), nodeOrder:1, approvers:flow.nodes[0].approvers.slice(), status:'pending', priority:priority || 'Medium', completedAt:'-', decidedBy:'-', nodeApprovals:[], trail:[] };
  TB.data.approvalTasks.unshift(task);
  return task;
};

TB.pages.issuer.confirmDecide = function(taskId, decision){
  var t = TB.pages.issuer.t;
  var task = TB.pages.issuer.taskById(taskId);
  if(!task) return;
  var flow = TB.pages.issuer.flowById(task.flow);
  var remarks = TB.utils.getInputVal('decide_remarks');
  if(decision !== 'approved' && !remarks){
    TB.utils.toast(t('退回或拒绝时必须填写原因','A reason is required to return or reject'), 'error');
    return;
  }
  var user = TB.state.user ? TB.state.user.name : '';
  var node = flow && flow.nodes[task.nodeOrder - 1];
  task.trail = task.trail || [];
  task.trail.push({node: node ? node.name : {en:'-',zh:'-'}, approver:user, decision:decision, time:TB.pages.issuer.now(), remarks:remarks});
  var msg, tone = 'success';
  if(decision === 'rejected'){
    task.status = 'rejected';
    task.decidedBy = user;
    task.completedAt = TB.pages.issuer.now();
    msg = t('已拒绝','Rejected');
    tone = 'error';
  } else if(decision === 'returned'){
    task.status = 'returned';
    task.decidedBy = user;
    task.completedAt = TB.pages.issuer.now();
    TB.pages.issuer._returnToInitiator(task);
    msg = t('已退回发起人，可修改后重新提交','Returned to the initiator for revision and resubmission');
  } else {
    task.nodeApprovals = task.nodeApprovals || [];
    if(task.nodeApprovals.indexOf(user) < 0) task.nodeApprovals.push(user);
    if(node && node.mode === 'all' && task.nodeApprovals.length < node.approvers.length){
      msg = t('已记录会签','Co-signature recorded') + ' (' + task.nodeApprovals.length + '/' + node.approvers.length + ')';
    } else if(flow && task.nodeOrder < flow.nodes.length){
      task.nodeOrder = task.nodeOrder + 1;
      task.approvers = flow.nodes[task.nodeOrder - 1].approvers.slice();
      task.nodeApprovals = [];
      msg = t('本节点已通过，自动流转至','Node approved; auto-routed to ') + TB.text(flow.nodes[task.nodeOrder - 1].name);
    } else {
      task.status = 'approved';
      task.decidedBy = user;
      task.completedAt = TB.pages.issuer.now();
      msg = t('已审批通过','Approved');
    }
  }
  TB.ui.closeModal();
  TB.utils.toast(msg, tone);
  TB.router.render();
};

TB.pages.issuer.viewApprovalDetail = function(taskId){
  var t = TB.pages.issuer.t;
  var task = TB.pages.issuer.taskById(taskId);
  if(!task) return;
  var flow = TB.pages.issuer.flowById(task.flow);
  var state = TB.pages.issuer.taskState(task);
  var statusBadge = TB.ui.badge(state.label, state.tone);
  var node = flow && flow.nodes[task.nodeOrder - 1];
  var info = TB.ui.descList([
    {label:t('编号','ID'), value:task.id},
    {label:TB.t('lbl.flow'), value:flow ? TB.text(flow.name) : task.flow},
    {label:t('关联单号','Reference'), value:task.ref},
    {label:TB.t('lbl.applicant'), value:task.applicant},
    {label:t('提交时间','Submitted'), value:task.submittedAt},
    {label:TB.t('status'), value:statusBadge},
    {label:TB.t('lbl.node'), value:TB.pages.issuer.taskNodeName(task) + (node ? '（' + TB.pages.issuer.modeLabel(node.mode) + '）' : '')},
    {label:t('会签进度','Co-sign Progress'), value:node && node.mode === 'all' ? (task.nodeApprovals || []).length + ' / ' + node.approvers.length : t('不适用（或签）','N/A (OR-sign)')},
    {label:TB.t('lbl.decidedBy'), value:task.decidedBy || '-'},
    {label:TB.t('lbl.completedAt'), value:task.completedAt || '-'}
  ]);
  var stepsHtml = '';
  if(flow && flow.nodes.length){
    stepsHtml = '<div class="mb-4">' + TB.ui.stepIndicator(flow.nodes.map(function(n, i){
      var st = 'waiting';
      if(i < task.nodeOrder - 1) st = 'done';
      else if(i === task.nodeOrder - 1) st = task.status === 'approved' ? 'done' : 'pending';
      return {label:TB.text(n.name), status:st};
    })) + '</div>';
  }
  var trailHtml = (task.trail || []).map(function(tr){
    var dec = tr.decision === 'approved' ? TB.ui.badge(t('通过','Approved'),'success')
      : (tr.decision === 'returned' ? TB.ui.badge(t('退回','Returned'),'orange') : TB.ui.badge(t('拒绝','Rejected'),'error'));
    return '<div class="timeline-item completed"><div class="timeline-time">'+TB.utils.dt(tr.time)+'</div><div class="timeline-title">'+TB.text(tr.node)+' · '+tr.approver+'</div><div class="timeline-desc">'+dec+(tr.remarks ? ' — '+tr.remarks : '')+'</div></div>';
  }).join('');
  var timeline = trailHtml ? '<div class="timeline">'+trailHtml+'</div>' : TB.ui.emptyState('⏳', t('暂无审批记录','No records yet'));
  TB.ui.modal({
    title: t('审批详情','Approval Detail'),
    body: info + stepsHtml + '<div class="font-bold mb-2">'+t('流转记录','Trail')+'</div>' + timeline,
    footer: '<button class="btn" onclick="TB.ui.closeModal()">'+TB.t('close')+'</button>'
  });
};

TB.router.register('issuer', {
  '/dashboard': function(){
    var active = TB.data.series.filter(function(s){ return s.status === 'open' || s.status === 'minting'; });
    var total = TB.data.series.reduce(function(sum, s){ return sum + s.faceTotal; }, 0);
    var held = TB.data.series.reduce(function(sum, s){ return sum + (s.faceTotal - s.faceAvailable); }, 0);
    var pending = TB.pages.issuer.reviewItems().filter(function(x){ return x.status === 'pending'; });
    var tasks = pending.slice(0, 6);
    var html = TB.utils.contentHeader(TB.pages.issuer.t('发行方首页','Issuer Dashboard'));
    html += '<div class="stat-grid">';
    html += TB.ui.statCard(TB.pages.issuer.t('活跃Series','Active Series'), String(active.length), '+1', 'up');
    html += TB.ui.statCard(TB.pages.issuer.t('总发行量','Total Issuance'), TB.utils.moneyShort(total));
    html += TB.ui.statCard(TB.pages.issuer.t('卖方持仓','Seller Positions'), TB.utils.moneyShort(held));
    var reserve = TB.data.emtReserve;
    html += TB.ui.statCard(TB.pages.issuer.t('EMT余额','EMT Balance')+TB.utils.note(TB.pages.issuer.t('EMT 储备可用余额；次日赎回 Cover 不足时由 Bison 在收盘后补足。','Available EMT reserve balance; Bison tops it up after the close when the next-day cover is short.')), TB.utils.moneyShort(reserve.available), TB.pages.issuer.t('冻结 ','Frozen ') + TB.utils.moneyShort(reserve.frozen));
    var emt = TB.pages.issuer.emtCoverSummary();
    html += TB.ui.statCard(TB.pages.issuer.t('EMT Cover需求','EMT Cover Required')+TB.utils.note(TB.pages.issuer.emtNoteRequired()), TB.utils.moneyShort(emt.required), TB.pages.issuer.t('次日赎回 ','Next-day ') + TB.utils.moneyShort(emt.redemption), 'up');
    html += TB.ui.statCard(TB.pages.issuer.t('Cover缺口','Cover Gap')+TB.utils.note(TB.pages.issuer.emtNoteGap()), TB.utils.moneyShort(emt.gap), emt.gap > 0 ? TB.pages.issuer.t('待补充','Top-up pending') : TB.pages.issuer.t('已覆盖','Covered'), emt.gap > 0 ? 'down' : 'up');
    html += '</div>';
    var taskHtml = tasks.map(function(task){ return '<div class="todo-item"><div class="todo-item-main">'+TB.ui.badge(task.type, 'orange')+'<span class="todo-item-text">'+TB.utils.esc(task.source+' · '+task.desc)+'</span></div><div class="todo-item-time">'+TB.utils.dt(task.time)+'</div></div>'; }).join('');
    var viewAll = function(route){ return '<div class="todo-more"><span class="tag-link" onclick="TB.router.navigate(\''+route+'\')">'+TB.pages.issuer.t('查看全部','View All')+' ›</span></div>'; };
    var seriesTable = TB.ui.table({ columns:[
      {key:'id', label:TB.t('lbl.seriesId'), render:function(r){ return '<span class="row-plain" onclick="TB.pages.issuer.viewSeries(\''+r.id+'\')">'+r.id+'</span>'; }},
      {key:'name', label:TB.t('lbl.productName'), render:function(r){ return '<span class="row-plain" onclick="TB.pages.issuer.viewSeries(\''+r.id+'\')">'+TB.utils.esc(r.name)+'</span>'; }},
      {key:'status', label:TB.t('status'), render:function(r){ return TB.ui.statusBadge(r.status); }},
      {key:'faceAvailable', label:TB.pages.issuer.t('剩余额度','Remaining'), render:function(r){ return TB.utils.moneyShort(r.faceAvailable); }},
      {key:'maturityDate', label:TB.t('lbl.maturityDate')}
    ], data: active, paginate: false });
    html += '<div class="dash-split">';
    html += '<div class="dash-split-narrow">'+TB.ui.card(TB.pages.issuer.t('待办事项','Pending Tasks')+' ('+pending.length+')', '<div class="dash-rows" id="dash-tasks">'+taskHtml+'</div>'+viewAll('#/review-center'))+'</div>';
    html += '<div class="dash-split-wide">'+TB.ui.card(TB.pages.issuer.t('活跃Series列表','Active Series List'), '<div id="dash-series">'+seriesTable+'</div>'+viewAll('#/series'))+'</div>';
    html += '</div>';
    return html;
  },
  '/review-center': function(){
    var t = TB.pages.issuer.t;
    var all = TB.pages.issuer.reviewItems();
    var pending = all.filter(function(x){ return x.status === 'pending'; });
    var done = all.filter(function(x){ return x.status !== 'pending'; });
    var mine = pending.filter(function(x){ return x.mine; });
    var table = function(list, isPending){
      return TB.ui.table({ columns:[
        {key:'id', label:t('编号','ID')},
        {key:'source', label:t('来源','Source')},
        {key:'type', label:t('类型','Type')},
        {key:'desc', label:t('事项','Item')},
        {key:'status', label:TB.t('status'), render:function(r){ return TB.ui.badge(r.statusLabel, r.statusTone); }},
        {key:'handler', label:t('处理人','Handler')},
        {key:'time', label:isPending ? t('提交时间','Submitted') : t('完成时间','Completed')},
        {key:'go', label:TB.t('actions'), render:function(r){
          var detail = r.taskId
            ? '<span class="tag-link" onclick="TB.pages.issuer.viewApprovalDetail(\''+r.taskId+'\')">'+t('详情','Detail')+'</span>'
            : '<span class="tag-link" onclick="TB.router.navigate(\''+r.route+'\')">'+t('查看','View')+'</span>';
          if(!isPending) return detail;
          if(r.taskId){
            if(!r.mine) return detail;
            return '<button class="btn btn-sm btn-primary" onclick="TB.pages.issuer.openDecide(\''+r.taskId+'\',\'approved\')">'+TB.t('approve')+'</button> '+
              '<button class="btn btn-sm" onclick="TB.pages.issuer.openDecide(\''+r.taskId+'\',\'returned\')">'+t('退回','Return')+'</button> '+
              '<button class="btn btn-sm btn-danger" onclick="TB.pages.issuer.openDecide(\''+r.taskId+'\',\'rejected\')">'+TB.t('reject')+'</button> '+detail;
          }
          return '<span class="tag-link" onclick="TB.router.navigate(\''+r.route+'\')">'+t('去处理','Handle')+'</span>';
        }}
      ], data: list });
    };
    var html = TB.utils.contentHeader(t('审核中心','Review Center'));
    html += '<div class="stat-grid">';
    html += TB.ui.statCard(t('待处理','Pending'), String(pending.length));
    html += TB.ui.statCard(t('待我审核','Awaiting Me'), String(mine.length));
    html += TB.ui.statCard(t('已处理','Processed'), String(done.length));
    html += TB.ui.statCard(t('合计','Total'), String(all.length));
    html += '</div>';
    html += TB.ui.tabs({ items:[
      {key:'pending', label:t('待处理','Pending')+' ('+pending.length+')', active:true},
      {key:'done', label:t('已处理','Processed')+' ('+done.length+')'}
    ], content:{ pending: table(pending, true), done: table(done, false) } });
    return html;
  },
  '/series': function(){
    var t = TB.pages.issuer.t;
    var click = function(r, text){ return '<span class="row-plain" onclick="TB.pages.issuer.openSeriesRow(\''+r.id+'\')">'+text+'</span>'; };
    return TB.utils.contentHeader(t('Series发行管理','Series Issuance Management'), '<button class="btn btn-primary" onclick="TB.pages.issuer.openIssuance()">'+t('新建产品','New Product')+'</button>')
      + TB.ui.filterBar({ fields:[
          {name:'status', label:TB.t('status'), type:'select', options:[
            {value:'',label:TB.t('all')},
            {value:'draft',label:TB.t('st.draft')},
            {value:'approving',label:TB.t('st.approving')},
            {value:'rejected',label:TB.t('st.rejected')},
            {value:'minting',label:TB.t('st.minting')},
            {value:'open',label:TB.utils.enumLabel('open')},
            {value:'closed',label:TB.utils.enumLabel('closed')}
          ]},
          {name:'date', label:TB.t('date'), type:'date'},
          {name:'keyword', label:t('关键词','Keyword'), type:'text'}
        ], exportBtn:true })
      + TB.ui.table({ columns:[
          {key:'id', label:TB.t('lbl.seriesId'), render:function(r){ return click(r, r.id); }},
          {key:'name', label:TB.t('lbl.productName'), render:function(r){ return click(r, TB.utils.esc(r.name)); }},
          {key:'status', label:TB.t('status'), render:function(r){ return TB.ui.statusBadge(r.status); }},
          {key:'faceTotal', label:t('面值总额','Total Face'), render:function(r){ return TB.utils.moneyShort(r.faceTotal); }},
          {key:'faceAvailable', label:t('剩余额度','Remaining'), render:function(r){ return TB.utils.moneyShort(r.faceAvailable); }},
          {key:'maturityDate', label:TB.t('lbl.maturityDate')},
          {key:'createdAt', label:TB.t('created')}
        ], data:TB.data.series });
  },
  '/series/:id': function(p){
    var s = TB.pages.issuer.seriesById(p.id);
    return TB.utils.contentHeader(s.name) + TB.ui.card(TB.pages.issuer.t('Series详情','Series Detail'), TB.ui.descList([{label:TB.t('lbl.seriesId'), value:s.id},{label:TB.t('lbl.productName'), value:s.name},{label:TB.t('status'), value:TB.ui.statusBadge(s.status)},{label:TB.t('lbl.faceValue'), value:TB.utils.money(s.faceTotal)}])) + TB.ui.tabs({ items:[{key:'basic', label:TB.pages.issuer.t('基本信息','Basic Info'), active:true},{key:'life', label:TB.pages.issuer.t('生命周期','Lifecycle')},{key:'cap', label:TB.pages.issuer.t('容量','Capacity')},{key:'hold', label:TB.pages.issuer.t('持仓','Holdings')},{key:'quote', label:TB.pages.issuer.t('报价','Quotes')},{key:'doc', label:TB.pages.issuer.t('文档','Documents')}], content:{ basic: TB.ui.card(TB.pages.issuer.t('基本信息','Basic Info'), TB.ui.descList([{label:'CUSIP', value:s.cusip},{label:'ISIN', value:s.isin},{label:TB.t('lbl.issuer'), value:s.issuer},{label:TB.t('lbl.custodian'), value:s.custodian}])), life: TB.ui.timeline([{time:s.createdAt,title:TB.pages.issuer.t('创建','Created'),status:'completed'},{time:'2026-11-01',title:TB.pages.issuer.t('审核通过','Approved'),status:'completed'},{time:'2026-11-02',title:TB.pages.issuer.t('铸币中','Minting'),status:'active'}]), cap: (function(){
        var soldFace = s.faceTotal - s.faceAvailable;
        var usage = s.faceTotal > 0 ? Math.round(soldFace / s.faceTotal * 100) : 0;
        var holds = TB.data.holdings.filter(function(h){ return h.series === s.id; });
        var heldFace = holds.reduce(function(sum, h){ return sum + (h.faceValue || 0); }, 0);
        return TB.ui.descList([
          {label:TB.pages.issuer.t('发行总面值','Total Face'), value:TB.utils.money(s.faceTotal)},
          {label:TB.pages.issuer.t('已售面值','Sold Face'), value:TB.utils.money(soldFace)},
          {label:TB.pages.issuer.t('当前持仓面值','Current Held Face')+TB.utils.note(TB.pages.issuer.t('当前仍由成员持有的面值；已售与持仓之差为已赎回或到期退出的部分。','Face still held by members; the difference from sold face has been redeemed or matured out.')), value:TB.utils.money(heldFace)},
          {label:TB.pages.issuer.t('剩余可售','Available'), value:TB.utils.money(s.faceAvailable)},
          {label:TB.pages.issuer.t('容量使用率','Capacity Usage')+TB.utils.note(TB.pages.issuer.t('容量使用率 = 已售面值 ÷ 发行总面值。','Capacity usage = sold face ÷ total face.')), value:usage + '%'}
        ]) + TB.ui.progress(usage)
        + '<div class="font-bold mt-4 mb-2">'+TB.pages.issuer.t('成员机构持有情况监控','Member Holdings Monitor')+'</div>'
        + (holds.length ? TB.ui.table({ columns:[
            {key:'member', label:TB.pages.issuer.t('成员机构','Member')},
            {key:'faceValue', label:TB.t('lbl.faceValue'), align:'right', render:function(r){ return TB.utils.money(r.faceValue); }},
            {key:'share', label:TB.pages.issuer.t('持有占比','Share'), align:'right', render:function(r){ return (heldFace > 0 ? Math.round(r.faceValue / heldFace * 100) : 0) + '%'; }},
            {key:'tokens', label:TB.pages.issuer.t('Token数量','Tokens'), align:'right', render:function(r){ return TB.utils.tokens(r.tokens); }},
            {key:'checkin', label:TB.pages.issuer.t('起息日','Value Date')},
            {key:'maturityDate', label:TB.pages.issuer.t('赎回日期','Redemption Date')},
            {key:'status', label:TB.t('status'), render:function(r){ return TB.ui.statusBadge(r.status); }}
          ], data:holds, paginate:false }) : TB.ui.emptyState('📭', TB.pages.issuer.t('暂无成员持有','No member holdings yet')));
      })(), hold: TB.ui.table({ columns:[{key:'member',label:TB.pages.issuer.t('成员','Member')},{key:'faceValue',label:TB.t('lbl.faceValue'),render:function(r){ return TB.utils.money(r.faceValue); }},{key:'status',label:TB.t('status'),render:function(r){ return TB.ui.statusBadge(r.status); }}], data:TB.data.holdings.filter(function(h){ return h.series === s.id; }) }), quote: TB.ui.table({ columns:[{key:'id',label:'Quote ID'},{key:'sellerYield',label:TB.t('lbl.yield'),render:function(r){ return TB.utils.yield(r.sellerYield); }},{key:'markPrice',label:TB.t('lbl.price'),render:function(r){ return TB.utils.price(r.markPrice); }},{key:'status',label:TB.t('status'),render:function(r){ return TB.ui.statusBadge(r.status); }}], data:TB.data.quotes.filter(function(q){ return q.series === s.id; }) }), doc: TB.ui.alert('info', TB.pages.issuer.t('发行资料已上传并归档。','Documents uploaded and archived.')) } }) ;
  },
  '/quotes': function(){
    var t = TB.pages.issuer.t;
    var html = TB.utils.contentHeader(t('报价管理','Quote Management'), '<button class="btn btn-primary" onclick="TB.pages.issuer.syncQuotes()">'+t('同步刷新','Sync Refresh')+'</button>');
    html += '<div class="text-muted text-sm mb-4">'+t('最近同步','Last sync')+'：'+(TB.pages.issuer._lastSync ? TB.utils.dt(TB.pages.issuer._lastSync) : t('尚未同步','never'))+'</div>';
    html += TB.ui.filterBar({ fields:[{name:'status', label:TB.t('status'), type:'select', options:[{value:'',label:TB.t('all')},{value:'valid',label:TB.utils.enumLabel('valid')},{value:'expired',label:TB.utils.enumLabel('expired')}]},{name:'series', label:TB.t('lbl.seriesId'), type:'text'}], exportBtn:true }) + TB.ui.table({ columns:[{key:'id', label:'Quote ID'},{key:'series', label:TB.t('lbl.seriesId')},{key:'sellerYield', label:TB.t('lbl.yield'), render:function(r){ return TB.utils.yield(r.sellerYield); }},{key:'markPrice', label:TB.t('lbl.price'), render:function(r){ return TB.utils.price(r.markPrice); }},{key:'quoteTime', label:t('报价时间','Quote Time')+TB.utils.note(t('报价由价格源 Bison Treasury Desk 自动推送，发行方无需上传报价表。','Quotes are pushed automatically by Bison Treasury Desk; no file upload is required.'))},{key:'validUntil', label:t('有效期至','Valid Until')},{key:'status', label:TB.t('status'), render:function(r){ return TB.ui.statusBadge(r.status); }}], data:TB.data.quotes, actions:[{label:TB.t('viewDetail'), onClick:'TB.pages.issuer.viewQuote', type:'text'}] });
    return html;
  },
  '/burn': function(){
    var t = TB.pages.issuer.t;
    var confirms = TB.pages.issuer.burnConfirmRows();
    var confirmTable = TB.ui.table({ columns:[
      {key:'id', label:t('确认单号','Confirmation ID')},
      {key:'series', label:TB.t('lbl.seriesId'), render:function(r){ return '<span class="row-plain" onclick="TB.pages.issuer.viewSeries(\''+r.series+'\')">'+r.series+'</span>'; }},
      {key:'maturity', label:TB.t('lbl.maturityDate')},
      {key:'redemptions', label:t('成员赎回笔数','Member Redemptions'), align:'right'},
      {key:'redeemedAmt', label:t('赎回总额','Redeemed Total'), align:'right', render:function(r){ return TB.utils.money(r.redeemedAmt); }},
      {key:'emtPaid', label:t('EMT兑付','EMT Payout')+TB.utils.note(t('全部成员 EMT 兑付完成后才允许发起销毁审批。','Burn approval can only be initiated after all member EMT payouts complete.')), render:function(r){ return r.emtPaid ? TB.ui.badge(t('已兑付','Paid'),'success') : TB.ui.badge(t('未兑付','Unpaid'),'error'); }},
      {key:'recon', label:t('对账情况','Reconciliation')+TB.utils.note(t('该周期托管账与平台账的对账批次；存在差异须先在对账管理处理。','Recon batches for this cycle; breaks must be resolved in Reconciliation first.')), render:function(r){ return r.reconStatus === 'matched' ? TB.ui.badge(t('全部一致','All matched'),'success') : (r.reconStatus === 'break' ? TB.ui.badge(r.breaks+' '+t('笔差异','break(s)'),'error') : TB.ui.badge(t('无批次','No batch'),'default')); }},
      {key:'generatedAt', label:t('生成时间','Generated')},
      {key:'status', label:TB.t('status'), render:function(r){ return TB.pages.issuer.burnStatusBadge(r.status); }},
      {key:'go', label:TB.t('actions'), render:function(r){
        return r.status === 'pending'
          ? '<span class="tag-link" onclick="TB.pages.issuer.openBurnReview(\''+r.id+'\')">'+t('去处理','Handle')+'</span>'
          : '<span class="tag-link" onclick="TB.pages.issuer.openBurnReview(\''+r.id+'\', true)">'+t('查看明细','Detail')+'</span>';
      }}
    ], data: confirms });
    var historyTable = TB.ui.table({ columns:[
      {key:'id', label:'Burn ID'},
      {key:'series', label:TB.t('lbl.seriesId')},
      {key:'amount', label:TB.t('lbl.faceValue'), align:'right', render:function(r){ return TB.utils.money(r.amount); }},
      {key:'applicant', label:t('申请人','Applicant')},
      {key:'applyTime', label:t('申请时间','Applied')},
      {key:'status', label:TB.t('status'), render:function(r){ return TB.ui.statusBadge(r.status); }},
      {key:'completeTime', label:t('完成时间','Completed')}
    ], data: TB.data.burnRequests });
    var html = TB.utils.contentHeader(t('销毁管理','Burn Management'));
    html += TB.ui.tabs({ items:[
      {key:'confirm', label:t('销毁确认待办','Burn Confirmation Tasks')+' ('+confirms.length+')', active:true},
      {key:'history', label:t('销毁申请记录','Burn Request Records')+' ('+TB.data.burnRequests.length+')'}
    ], content:{ confirm: confirmTable, history: historyTable } });
    return html;
  },
  '/positions': function(){
    return TB.utils.contentHeader(TB.pages.issuer.t('持仓监控','Position Monitor')) + '<div class="stat-grid">'+TB.ui.statCard(TB.pages.issuer.t('卖方总持仓','Seller Holdings'), TB.utils.moneyShort(35000000))+TB.ui.statCard(TB.pages.issuer.t('成员总持仓','Member Holdings'), TB.utils.moneyShort(18000000))+TB.ui.statCard(TB.pages.issuer.t('次日赎回','Next-day Redemption'), TB.utils.moneyShort(2000000))+TB.ui.statCard(TB.pages.issuer.t('Cover状态','Cover Status'), TB.pages.issuer.t('正常','Normal'))+'</div>' + TB.ui.table({ columns:[{key:'series',label:TB.t('lbl.seriesId')},{key:'faceValue',label:TB.t('lbl.faceValue'),render:function(r){ return TB.utils.money(r.faceValue); }},{key:'status',label:TB.t('status'),render:function(r){ return TB.ui.statusBadge(r.status); }}], data:TB.data.holdings });
  },
  '/emt': function(){
    var t = TB.pages.issuer.t;
    var r = TB.data.emtReserve;
    var rows = TB.pages.issuer.emtCoverRows();
    var sum = TB.pages.issuer.emtCoverSummary();
    var noteRequired = TB.pages.issuer.emtNoteRequired();
    var noteStatus = TB.pages.issuer.emtNoteStatus();
    var noteGap = TB.pages.issuer.emtNoteGap();
    var html = TB.utils.contentHeader(t('EMT管理','EMT Reserve'));
    html += '<div class="stat-grid">';
    html += TB.ui.statCard(t('总持仓面值','Seller Holdings'), TB.utils.moneyShort(sum.holdings));
    html += TB.ui.statCard(t('EMT可用余额','EMT Available'), TB.utils.moneyShort(r.available));
    html += TB.ui.statCard(t('EMT Cover需求','EMT Cover Required')+TB.utils.note(noteRequired), TB.utils.moneyShort(sum.required), t('次日赎回 ','Next-day ') + TB.utils.moneyShort(sum.redemption), 'up');
    html += TB.ui.statCard(t('Cover缺口','Cover Gap')+TB.utils.note(noteGap), TB.utils.moneyShort(sum.gap), sum.gap > 0 ? t('待补充','Top-up pending') : t('已覆盖','Covered'), sum.gap > 0 ? 'down' : 'up');
    html += '</div>';
    if(sum.gap > 0){
      html += TB.ui.alert('error', t('次日 EMT Cover 存在缺口，系统已通知 Bison 补充 EMT；补足前相关 Checkout 将顺延至下一个 close 结算。','The next-day EMT cover has a gap. The system has notified Bison to top up EMT; affected checkouts roll to the next close until it is covered.'));
    }
    var coverTable = TB.ui.table({ columns:[
      {key:'series', label:TB.t('lbl.seriesId')},
      {key:'type', label:TB.t('type')+TB.utils.note(t('到期兑付按每 token USB 1 支付，由到期法币到账后实时 mint EMT，不需 pre-funding。','Maturity pays USB 1 per token from real-time minted EMT once the fiat lands; no pre-funding.')), render:function(x){ return TB.ui.badge(x.type === 'maturity' ? t('到期兑付','Maturity') : t('次日赎回','Checkout'), x.type === 'maturity' ? 'purple' : 'info'); }},
      {key:'dueDate', label:t('赎回日','Redemption Date')},
      {key:'redemption', label:t('次日赎回金额','Redemption Amount'), align:'right', render:function(x){ return x.redemption > 0 ? TB.utils.money(x.redemption) : '-'; }},
      {key:'required', label:t('EMT Cover需求','EMT Cover Required')+TB.utils.note(noteRequired), align:'right', render:function(x){ return x.required > 0 ? TB.utils.money(x.required) : '-'; }},
      {key:'status', label:t('Cover状态','Cover Status')+TB.utils.note(noteStatus), render:function(x){ return TB.pages.issuer.emtStatusLabel(x.status); }},
      {key:'gap', label:t('Cover缺口','Cover Gap')+TB.utils.note(noteGap), align:'right', render:function(x){ return x.gap > 0 ? TB.ui.badge(TB.utils.money(x.gap), 'error') : TB.utils.money(0); }}
    ], data: rows });
    var overview = TB.ui.descList([
      {label:t('EMT总余额','EMT Total Balance'), value:TB.utils.money(r.available + r.frozen)},
      {label:t('EMT可用余额','EMT Available'), value:TB.utils.money(r.available)},
      {label:t('EMT冻结金额','EMT Frozen')+TB.utils.note(t('冻结额度用于已确认的次日赎回 Cover，兑付完成后自动解冻。','Frozen EMT is reserved for confirmed next-day redemptions and released after payout.')), value:TB.utils.money(r.frozen)},
      {label:t('Cover缓冲率','Cover Buffer')+TB.utils.note(t('缓冲系数默认 5%，可在运营端系统参数中调整。','Buffer rate defaults to 5% and is configurable in operations system parameters.')), value:(r.bufferRate * 100).toFixed(0) + '%'},
      {label:t('最近收盘重算','Last Close Run')+TB.utils.note(t('每个交易日收盘后系统自动重算并通知 Bison 备足次日 EMT。','The system recalculates cover after every trading close and notifies Bison.')), value:r.lastCloseRun},
      {label:t('次日 Cover 需求','Next-day Cover Required')+TB.utils.note(noteRequired), value:TB.utils.money(sum.required)},
      {label:t('Cover缺口','Cover Gap')+TB.utils.note(noteGap), value:sum.gap > 0 ? TB.ui.badge(TB.utils.money(sum.gap), 'error') : TB.utils.money(0)}
    ]);
    var flowsTable = TB.ui.table({ columns:[
      {key:'id', label:t('流水号','Movement ID')},
      {key:'time', label:TB.t('time')},
      {key:'type', label:TB.t('type'), render:function(x){ return TB.pages.issuer.emtTypeLabel(x.type); }},
      {key:'direction', label:t('方向','Direction'), render:function(x){ return TB.ui.badge(x.direction === 'in' ? t('入账','In') : t('出账','Out'), x.direction === 'in' ? 'success' : 'warning'); }},
      {key:'amount', label:TB.t('amount'), align:'right', render:function(x){ return (x.direction === 'in' ? '+' : '-') + TB.utils.money(x.amount); }},
      {key:'channel', label:t('渠道','Channel')},
      {key:'status', label:TB.t('status'), render:function(x){ return TB.ui.statusBadge(x.status); }},
      {key:'remarks', label:TB.t('remarks')}
    ], data: TB.data.emtFlows });
    var ledger = TB.data.emtLedger;
    var inflow = ledger.filter(function(x){ return x.direction === 'in'; }).reduce(function(s, x){ return s + x.amount; }, 0);
    var outflow = ledger.filter(function(x){ return x.direction === 'out'; }).reduce(function(s, x){ return s + x.amount; }, 0);
    var ledgerTable = TB.ui.table({ columns:[
      {key:'id', label:t('明细编号','Entry ID')},
      {key:'time', label:TB.t('time')},
      {key:'item', label:t('业务事项','Business Item'), render:function(x){ return TB.text(x.item); }},
      {key:'series', label:TB.t('lbl.seriesId')},
      {key:'counterparty', label:t('对手方','Counterparty')},
      {key:'direction', label:t('收支','In / Out'), render:function(x){ return TB.ui.badge(x.direction === 'in' ? t('收入','Inflow') : t('支出','Outflow'), x.direction === 'in' ? 'success' : 'warning'); }},
      {key:'amount', label:TB.t('amount'), align:'right', render:function(x){ return (x.direction === 'in' ? '+' : '-') + TB.utils.money(x.amount); }},
      {key:'remarks', label:TB.t('remarks'), render:function(x){ return TB.text(x.remarks); }}
    ], data: ledger });
    html += TB.ui.tabs({ items:[
      {key:'overview', label:t('EMT 储备概览','EMT Reserve Overview'), active:true},
      {key:'cover', label:t('EMT Cover 监控','EMT Cover Monitor')},
      {key:'movements', label:t('EMT 储备流水','EMT Reserve Movements')},
      {key:'ledger', label:t('EMT 收支明细','EMT Cash Ledger')}
    ], content:{
      overview: overview,
      cover: TB.ui.filterBar({ fields:[
        {name:'series', label:TB.t('lbl.seriesId'), type:'select', options:[{value:'',label:TB.t('all')}].concat(TB.data.series.map(function(s){ return {value:s.id, label:s.id}; }))},
        {name:'cover', label:t('Cover状态','Cover Status'), type:'select', options:[{value:'',label:TB.t('all')},{value:'ok',label:t('充足','Sufficient')},{value:'warn',label:t('不足','Short')},{value:'short',label:t('缺口','Gap')},{value:'none',label:t('无需','Not needed')}]}
      ], exportBtn:true }) + coverTable,
      movements: TB.ui.filterBar({ fields:[
        {name:'type', label:TB.t('type'), type:'select', options:[{value:'',label:TB.t('all')},{value:'mint',label:TB.pages.issuer.emtTypeLabel('mint')},{value:'payout',label:TB.pages.issuer.emtTypeLabel('payout')},{value:'withdraw',label:TB.pages.issuer.emtTypeLabel('withdraw')},{value:'freeze',label:TB.pages.issuer.emtTypeLabel('freeze')}]},
        {name:'date', label:TB.t('date'), type:'date'}
      ], exportBtn:true }) + flowsTable,
      ledger: '<div class="flex gap-4 mb-4"><div>'+t('收入合计','Total inflow')+'：<strong class="text-lg">'+TB.utils.money(inflow)+'</strong></div>'+
        '<div>'+t('支出合计','Total outflow')+'：<strong class="text-lg">'+TB.utils.money(outflow)+'</strong></div>'+
        '<div>'+t('净额','Net')+'：<strong class="text-lg">'+TB.utils.money(inflow - outflow)+'</strong></div></div>' + ledgerTable
    } });
    return html;
  },
  '/reconciliation': function(){
    var t = TB.pages.issuer.t;
    var rows = TB.data.reconciliations;
    var matched = rows.filter(function(r){ return r.status === 'matched'; }).length;
    var breaks = rows.filter(function(r){ return r.status === 'break'; }).length;
    var diffItems = rows.reduce(function(sum, r){ return sum + r.diffCount; }, 0);
    var html = TB.utils.contentHeader(t('对账管理','Reconciliation'), '<button class="btn btn-primary" onclick="TB.pages.issuer.openTriggerRecon()">'+t('手动触发对账','Manual Reconciliation')+'</button>');
    html += '<div class="stat-grid">';
    html += TB.ui.statCard(t('对账批次','Batches'), String(rows.length));
    html += TB.ui.statCard(t('一致','Matched'), String(matched));
    html += TB.ui.statCard(t('存在差异','With Breaks'), String(breaks));
    html += TB.ui.statCard(t('差异项合计','Diff Items'), String(diffItems));
    html += '</div>';
    html += TB.ui.filterBar({ fields:[
      {name:'date', label:TB.t('date'), type:'date'},
      {name:'series', label:TB.t('lbl.seriesId'), type:'select', options:[{value:'',label:TB.t('all')}].concat(TB.data.series.map(function(s){ return {value:s.id, label:s.id}; }))},
      {name:'status', label:TB.t('status'), type:'select', options:[{value:'',label:TB.t('all')},{value:'matched',label:TB.t('st.matched')},{value:'break',label:TB.t('st.break')}]}
    ], exportBtn:true });
    html += TB.ui.table({ columns:[
      {key:'id', label:t('对账批次号','Batch ID')},
      {key:'date', label:TB.t('date')},
      {key:'series', label:TB.t('lbl.seriesId')},
      {key:'status', label:TB.t('status')+TB.utils.note(t('核对发行方托管账与平台 Token 账的结果。','Compares issuer custody records against platform token balances.')), render:function(r){ return TB.ui.statusBadge(r.status); }},
      {key:'diffCount', label:t('差异项数','Diff Items')+TB.utils.note(t('差异由发行方在本页处理。','Breaks are resolved on this page.')), align:'right', render:function(r){ return r.diffCount > 0 ? TB.ui.badge(r.diffCount, 'error') : '0'; }},
      {key:'time', label:t('对账时间','Recon Time')}
    ], data: rows, actions:[
      {label:t('查看明细','Detail'), onClick:'TB.pages.issuer.openReconDetail', type:'text'},
      {label:t('处理差异','Resolve'), onClick:'TB.pages.issuer.openDiffModal', type:'text'}
    ] });
    return html;
  },
  '/accounts': function(){
    var t = TB.pages.issuer.t;
    var roleName = function(r){
      var role = (TB.data.roles.issuer || []).find(function(x){ return x.id === r; });
      return role ? TB.text(role.name) : r;
    };
    return TB.utils.contentHeader(t('账号管理','Account Management'), '<button class="btn btn-primary" onclick="TB.pages.issuer.newAccount()">'+TB.t('create')+'</button>') + TB.ui.table({ columns:[
      {key:'name', label:t('账号名','Account')},
      {key:'email', label:TB.t('lbl.email')},
      {key:'role', label:TB.t('lbl.role'), render:function(r){ return roleName(r.role); }},
      {key:'org', label:t('所属机构','Organization')},
      {key:'status', label:TB.t('status'), render:function(r){ return TB.ui.statusBadge(r.status); }},
      {key:'created', label:TB.t('created')},
      {key:'lastLogin', label:TB.t('lastLogin')},
      {key:'go', label:TB.t('actions'), render:function(r){
        var off = r.status !== 'active';
        return '<span class="tag-link" onclick="TB.pages.issuer.managePermissions(\''+r.id+'\')">'+t('权限管理','Permissions')+'</span> '
          + '<span class="tag-link" onclick="TB.pages.issuer.toggleAccountStatus(\''+r.id+'\')">'+(off ? t('启用','Enable') : t('停用','Disable'))+'</span> '
          + '<span class="tag-link" onclick="TB.pages.issuer.resetAccountPwd(\''+r.id+'\')">'+TB.t('resetPwd')+'</span>';
      }}
    ], data:TB.data.accounts.filter(function(a){ return a.org === 'Bison Bank'; }) });
  },
  '/accounts/:accountId/permissions': function(p){
    var a = TB.data.accounts.find(function(x){ return x.id === p.accountId; }) || TB.data.accounts[0];
    return TB.ui.permPage('issuer', a);
  },
  '/notifications': function(){
    return TB.utils.contentHeader(TB.pages.issuer.t('通知中心','Notifications'), '<button class="btn btn-primary" onclick="TB.pages.issuer.markAllReadNotif()">'+TB.t('markAllRead')+'</button>') + TB.ui.table({ columns:[{key:'title',label:'Title'},{key:'desc',label:TB.t('remarks')},{key:'time',label:TB.t('time')},{key:'status',label:TB.t('status')}], data:TB.data.notifications, actions:[{label:TB.t('delete'), onClick:'TB.pages.issuer.deleteNotif', type:'danger'}] });
  },
  '/approvals/flows': function(){
    var t = TB.pages.issuer.t;
    var flows = TB.data.approvalFlows;
    if(!TB.pages.issuer.flowById(TB.pages.issuer._flowSel)) TB.pages.issuer._flowSel = flows[0] && flows[0].id;
    var flow = TB.pages.issuer.flowById(TB.pages.issuer._flowSel);
    var html = TB.utils.contentHeader(t('审批流程配置','Approval Flows'));
    var user = TB.state.user ? TB.state.user.name : '';
    var listHtml = '<div style="width:240px;flex-shrink:0">';
    flows.forEach(function(f){
      var active = f.id === flow.id ? ' active' : '';
      listHtml += '<div class="menu-item'+active+'" onclick="TB.pages.issuer.selectFlow(\''+f.id+'\')">'+
        '<div style="display:flex;justify-content:space-between;align-items:center;gap:8px">'+
        '<span>'+TB.text(f.name)+'</span>'+
        '<span class="badge '+(f.enabled ? 'badge-success' : 'badge-default')+'">'+(f.enabled ? TB.t('enable') : TB.t('disable'))+'</span>'+
        '</div></div>';
    });
    listHtml += '</div>';
    var nodeBody = flow.nodes.length === 0
      ? TB.ui.emptyState('📋', t('尚未配置审批节点，请新增至少一个节点。','No approval nodes yet. Add at least one node.'))
      : TB.ui.table({
        columns:[
          {key:'order', label:t('顺序','Order'), align:'center'},
          {key:'name', label:TB.t('lbl.nodeName'), render:function(r){ return TB.text(r.name); }},
          {key:'approvers', label:TB.t('lbl.approvers')+TB.utils.note(t('审批人从本机构已启用账号中选择；保存后新提交的申请按最新流程流转。','Approvers are selected from active accounts of this organization; new requests follow the latest flow after saving.')), render:function(r){ return r.approvers.map(function(n){ return TB.ui.badge(n, n === user ? 'orange' : 'info'); }).join(' ') || '<span class="text-muted">'+t('未配置','Unassigned')+'</span>'; }},
          {key:'mode', label:TB.t('lbl.signMode'), render:function(r){ return TB.pages.issuer.modeLabel(r.mode); }},
          {key:'returnTarget', label:t('退回目标','Return Target'), render:function(){ return '<span class="text-muted">'+t('发起人','Initiator')+'</span>'; }}
        ],
        data: flow.nodes,
        actions:[
          {label:t('配置审批人','Approvers'), onClick:'TB.pages.issuer.openNodeModal', type:'text'},
          {label:TB.t('delete'), onClick:'TB.pages.issuer.deleteNode', type:'danger'}
        ]
      });
    var rightHtml = TB.ui.card(t('审批节点配置','Approval Node Configuration'), nodeBody, '<button class="btn btn-sm btn-primary" onclick="TB.pages.issuer.openNodeModal()">'+t('新增节点','Add Node')+'</button>');
    rightHtml += TB.ui.card(t('流程状态','Flow Status'),
      '<label class="form-checkbox"><input type="checkbox" id="flow_enabled"'+(flow.enabled ? ' checked' : '')+'> '+t('启用该审批流程','Enable this approval flow')+'</label>'+
      '<div class="form-hint">'+t('停用后，该类业务申请提交时不再经过机构内部审批。','When disabled, this type of request skips internal approval on submission.')+'</div>'+
      '<div class="mt-2"><button class="btn btn-primary btn-sm" onclick="TB.pages.issuer.saveFlowStatus()">'+TB.t('save')+'</button></div>');
    html += '<div class="flex gap-4" style="align-items:flex-start">'+listHtml+'<div style="flex:1;min-width:0">'+rightHtml+'</div></div>';
    return html;
  }
});

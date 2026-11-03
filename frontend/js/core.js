/* ============================================================
 * TokenBank Frontend Core — Framework / i18n / Mock Data / Router / Components
 * ============================================================ */
var TB = TB || {};

/* ====== State ====== */
TB.state = { user: null, lang: 'en', route: '', portal: '', tablePages: {}, _tableSeq: 0, routeHistory: [], _backing: false };

/* ====== i18n ====== */
TB.i18n = {
  // common
  'search':{en:'Search',zh:'搜索'},'reset':{en:'Reset',zh:'重置'},'export':{en:'Export',zh:'导出'},'refresh':{en:'Refresh',zh:'刷新'},
  'viewDetail':{en:'View Detail',zh:'查看详情'},'edit':{en:'Edit',zh:'编辑'},'delete':{en:'Delete',zh:'删除'},'save':{en:'Save',zh:'保存'},
  'cancel':{en:'Cancel',zh:'取消'},'confirm':{en:'Confirm',zh:'确认'},'close':{en:'Close',zh:'关闭'},'back':{en:'Back',zh:'返回'},
  'next':{en:'Next',zh:'下一步'},'previous':{en:'Previous',zh:'上一步'},'submit':{en:'Submit',zh:'提交'},'create':{en:'Create',zh:'新建'},
  'approve':{en:'Approve',zh:'通过'},'reject':{en:'Reject',zh:'拒绝'},'enable':{en:'Enable',zh:'启用'},'disable':{en:'Disable',zh:'停用'},
  'all':{en:'All',zh:'全部'},'unread':{en:'Unread',zh:'未读'},'read':{en:'Read',zh:'已读'},'actions':{en:'Actions',zh:'操作'},
  'status':{en:'Status',zh:'状态'},'type':{en:'Type',zh:'类型'},'time':{en:'Time',zh:'时间'},'date':{en:'Date',zh:'日期'},
  'created':{en:'Created',zh:'创建时间'},'lastLogin':{en:'Last Login',zh:'最近登录'},
  'amount':{en:'Amount',zh:'金额'},'remarks':{en:'Remarks',zh:'备注'},'loading':{en:'Loading...',zh:'加载中...'},
  'noData':{en:'No data',zh:'暂无数据'},'total':{en:'Total',zh:'共'},'items':{en:'items',zh:'条'},
  'yes':{en:'Yes',zh:'是'},'no':{en:'No',zh:'否'},'optional':{en:'Optional',zh:'选填'},'required':{en:'Required',zh:'必填'},
  // buttons
  'login':{en:'Login',zh:'登录'},'logout':{en:'Logout',zh:'退出'},'purchase':{en:'Purchase',zh:'购买'},
  'bookAhead':{en:'Book Ahead',zh:'预定'},'deposit':{en:'Deposit',zh:'充值'},'withdraw':{en:'Withdraw',zh:'提现'},
  'newProduct':{en:'New Product',zh:'新建产品'},'upload':{en:'Upload',zh:'上传'},'review':{en:'Review',zh:'审核'},
  'process':{en:'Process',zh:'处理'},'publish':{en:'Publish',zh:'发布'},'markAllRead':{en:'Mark All Read',zh:'全部已读'},
  'viewAll':{en:'View All',zh:'查看全部'},'saveDraft':{en:'Save Draft',zh:'保存草稿'},'resetPwd':{en:'Reset Password',zh:'重置密码'},
  'assign':{en:'Assign',zh:'分配'},'viewList':{en:'View List',zh:'返回列表'},'complete':{en:'Complete',zh:'完成'},
  'finishSetup':{en:'Finish Setup',zh:'完成设置'},'activate':{en:'Activate',zh:'激活'},
  // status
  'st.draft':{en:'Draft',zh:'草稿'},'st.pending':{en:'Pending',zh:'待处理'},'st.active':{en:'Active',zh:'活跃'},
  'st.suspended':{en:'Suspended',zh:'暂停'},'st.completed':{en:'Completed',zh:'已完成'},'st.failed':{en:'Failed',zh:'失败'},
  'st.open':{en:'Open',zh:'开放中'},'st.closed':{en:'Closed',zh:'停止购买'},'st.approved':{en:'Approved',zh:'已通过'},
  'st.rejected':{en:'Rejected',zh:'已拒绝'},'st.returned':{en:'Returned',zh:'已退回'},'st.minting':{en:'Minting',zh:'铸币中'},'st.minted':{en:'Minted',zh:'已铸币'},
  'st.maturity':{en:'Maturity',zh:'到期'},'st.checkout':{en:'Checkout',zh:'赎回中'},'st.burned':{en:'Burned',zh:'已销毁'},
  'st.approving':{en:'Under Approval',zh:'审批中'},
  'st.settled':{en:'Settled',zh:'已结算'},'st.frozen':{en:'Frozen',zh:'已冻结'},'st.cancelled':{en:'Cancelled',zh:'已取消'},
  'st.checkoutCompleted':{en:'Checked Out',zh:'已赎回'},'st.maturityPaid':{en:'Maturity Paid',zh:'到期已付'},
  'st.pendingActivation':{en:'Pending Activation',zh:'待激活'},'st.deactivated':{en:'Deactivated',zh:'已停用'},
  'st.bookingConfirmed':{en:'Booking Confirmed',zh:'预定已确认'},'st.depositTaken':{en:'Deposit Taken',zh:'定金已收取'},
  'st.pendingSettlement':{en:'Pending Settlement',zh:'待结算'},'st.checkoutPending':{en:'Checkout Pending',zh:'赎回处理中'},
  'st.valid':{en:'Valid',zh:'有效'},'st.expired':{en:'Expired',zh:'已过期'},
  'st.matched':{en:'Matched',zh:'对账一致'},'st.break':{en:'Break',zh:'对账差异'},
  'st.processing':{en:'Processing',zh:'处理中'},'st.resolved':{en:'Resolved',zh:'已解决'},
  'st.processed':{en:'Processed',zh:'已处理'},
  // member nav
  'nav.dashboard':{en:'Dashboard',zh:'首页'},'nav.market':{en:'Product Market',zh:'产品市场'},
  'nav.holdings':{en:'Holdings',zh:'持仓管理'},'nav.wallet':{en:'Wallet',zh:'钱包与资金'},
  'nav.accounts':{en:'Accounts',zh:'账号管理'},'nav.notifications':{en:'Notifications',zh:'通知中心'},
  'nav.compliance':{en:'Compliance',zh:'合规与安全'},'nav.settings':{en:'Settings',zh:'个人设置'},
  'nav.transactions':{en:'Transactions',zh:'交易记录'},'nav.bookAheadList':{en:'Bookings',zh:'预定管理'},
  // issuer nav
  'nav.series':{en:'Series Issuance',zh:'Series发行管理'},
  'nav.quotes':{en:'Quotes',zh:'报价管理'},'nav.burn':{en:'Burn',zh:'销毁管理'},
  'nav.positionMonitor':{en:'Position Monitor',zh:'持仓监控'},'nav.issuerAccounts':{en:'Accounts',zh:'账号管理'},
  'nav.emtMgmt':{en:'EMT Reserve',zh:'EMT管理'},
  'nav.issuerNotif':{en:'Notifications',zh:'通知中心'},
  'nav.approvalConfig':{en:'Review Flow Config',zh:'审核流程配置'},
  'nav.reviewCenter':{en:'Review Center',zh:'审核中心'},
  // ops nav
  'nav.opsDashboard':{en:'Dashboard',zh:'运营看板'},'nav.members':{en:'Members',zh:'成员管理'},
  'nav.seriesReview':{en:'Series Review',zh:'Series审核'},'nav.capacity':{en:'Capacity',zh:'容量/库存'},
  'nav.reconciliation':{en:'Reconciliation',zh:'对账管理'},'nav.quoteMonitor':{en:'Quote Monitor',zh:'报价监控'},
  'nav.checkoutMaturity':{en:'Product Monitoring',zh:'产品监控'},
'nav.platformAccounts':{en:'Accounts',zh:'账号管理'},
  'nav.roles':{en:'Roles',zh:'角色权限'},'nav.auditConfig':{en:'Audit Config',zh:'审核流程配置'},
  'nav.systemParams':{en:'System Params',zh:'系统参数'},'nav.auditLog':{en:'Audit Log',zh:'审计日志'},
  'nav.announcements':{en:'Announcements',zh:'公告管理'},
  // groups
  'grp.product':{en:'Product Market',zh:'产品市场'},'grp.holdings':{en:'Holdings',zh:'持仓管理'},
  'grp.wallet':{en:'Wallet & Funds',zh:'钱包与资金'},'grp.account':{en:'Account',zh:'账号管理'},
  'grp.compliance':{en:'Compliance & Security',zh:'合规与安全'},
  'grp.rustMgmt':{en:'R-UST Management',zh:'R-UST管理'},
  'grp.reviewMgmt':{en:'Review Management',zh:'审核管理'},'grp.opsMgmt':{en:'Operations',zh:'运营管理'},
  'grp.sysMgmt':{en:'System',zh:'系统管理'},'grp.announce':{en:'Announcements',zh:'公告与通知'},
  // labels
  'lbl.seriesId':{en:'Series ID',zh:'Series编号'},'lbl.productName':{en:'Product Name',zh:'产品名称'},
  'lbl.faceValue':{en:'Face Value',zh:'面值'},'lbl.yield':{en:'Yield',zh:'收益率'},'lbl.maturityDate':{en:'Maturity Date',zh:'到期日'},
  'lbl.price':{en:'Price',zh:'价格'},'lbl.checkout':{en:'Check-out',zh:'Check-out'},'lbl.checkin':{en:'Check-in',zh:'Check-in'},
  'lbl.valueDate':{en:'Value Date',zh:'起息日'},'lbl.redemptionDate':{en:'Redemption Date',zh:'赎回日期'},
  'lbl.balance':{en:'Balance',zh:'余额'},'lbl.available':{en:'Available',zh:'可用'},'lbl.frozen':{en:'Frozen',zh:'冻结'},
  'lbl.memberName':{en:'Member',zh:'成员机构'},'lbl.remiId':{en:'Remi ID',zh:'Remi ID'},'lbl.kyb':{en:'KYB',zh:'KYB'},
  'lbl.country':{en:'Country',zh:'注册国家'},'lbl.email':{en:'Email',zh:'邮箱'},'lbl.role':{en:'Role',zh:'角色'},
  'lbl.created':{en:'Created',zh:'创建时间'},'lbl.lastLogin':{en:'Last Login',zh:'最后登录'},
  'lbl.applicant':{en:'Applicant',zh:'申请人'},'lbl.node':{en:'Node',zh:'当前节点'},'lbl.priority':{en:'Priority',zh:'优先级'},
  'lbl.cusip':{en:'CUSIP',zh:'CUSIP'},'lbl.isin':{en:'ISIN',zh:'ISIN'},'lbl.issuer':{en:'Issuer',zh:'发行方'},
  'lbl.custodian':{en:'Custodian',zh:'托管方'},'lbl.window':{en:'Window',zh:'窗口天数'},
  'lbl.flow':{en:'Approval Flow',zh:'审批流程'},'lbl.nodeName':{en:'Node Name',zh:'节点名称'},
  'lbl.approvers':{en:'Approvers',zh:'审批人'},'lbl.signMode':{en:'Sign Mode',zh:'签批方式'},
  'lbl.decidedBy':{en:'Decided By',zh:'最终审批人'},'lbl.completedAt':{en:'Completed At',zh:'完成时间'},
  // messages
  'msg.saveSuccess':{en:'Saved successfully',zh:'保存成功'},'msg.submitSuccess':{en:'Submitted successfully',zh:'提交成功'},
  'msg.confirmDelete':{en:'Are you sure you want to delete?',zh:'确认删除？'},'msg.confirmSubmit':{en:'Are you sure you want to submit?',zh:'确认提交？'},
  'msg.confirmApprove':{en:'Are you sure you want to approve?',zh:'确认通过？'},'msg.confirmReject':{en:'Are you sure you want to reject?',zh:'确认拒绝？'},
  'msg.noPermission':{en:'You do not have permission',zh:'您无权限执行此操作'},'msg.loginExpired':{en:'Login expired',zh:'登录已过期'},
  'msg.requiredFields':{en:'Please fill in required fields',zh:'请填写必填字段'},'msg.insufficientBalance':{en:'Insufficient balance',zh:'可用余额不足'},
  'msg.quoteExpired':{en:'Quote expired, please refresh',zh:'报价已过期，请刷新'},'msg.operationSuccess':{en:'Operation successful',zh:'操作成功'},
  // portal
  'portal.member':{en:'Member Portal',zh:'成员机构端'},'portal.issuer':{en:'Issuer Portal',zh:'发行机构端'},'portal.ops':{en:'Operations Portal',zh:'运营管理端'},
};
TB.t = function(k){var i=TB.i18n[k];return i?i[TB.state.lang]||i.en:k;};
TB.text = function(v){
  if(typeof v === 'object' && v){
    return v[TB.state.lang] || v.en || v.zh || '';
  }
  if(typeof v === 'string' && TB.i18n[v]){
    return TB.t(v);
  }
  return v == null ? '' : String(v);
};
TB.icon = function(name){
  var icons = {
    dashboard:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="2"></rect><rect x="14" y="3" width="7" height="5" rx="2"></rect><rect x="14" y="12" width="7" height="9" rx="2"></rect><rect x="3" y="14" width="7" height="7" rx="2"></rect></svg>',
    market:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 18 10 12l4 4 6-8"></path><path d="M18 8h2v2"></path><path d="M3 3v18h18"></path></svg>',
    holdings:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16"></path><path d="M4 12h16"></path><path d="M4 17h10"></path><rect x="3" y="4" width="18" height="16" rx="3"></rect></svg>',
    wallet:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M19 7V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1"></path><path d="M3 8h18v8H3z"></path><circle cx="16" cy="12" r="1.5"></circle></svg>',
    account:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="3.5"></circle><path d="M5 19a7 7 0 0 1 14 0"></path></svg>',
    issuance:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18"></path><path d="M7 8l5-5 5 5"></path><path d="M7 16l5 5 5-5"></path></svg>',
    series:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="5" width="16" height="4" rx="1.5"></rect><rect x="4" y="11" width="16" height="4" rx="1.5"></rect><rect x="4" y="17" width="10" height="3" rx="1.5"></rect></svg>',
    quotes:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19h16"></path><path d="M7 16V8"></path><path d="M12 16V5"></path><path d="M17 16v-6"></path></svg>',
    burn:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3s4 3.5 4 7.5S13.5 18 12 18s-4-1.5-4-5.5S12 3 12 3Z"></path><path d="M10 14c.6.8 1.3 1.2 2 1.2 1.4 0 2.5-1.4 2.5-3.2"></path><path d="M8 21h8"></path></svg>',
    positions:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M5 19V9"></path><path d="M12 19V5"></path><path d="M19 19v-8"></path></svg>',
    notification:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 1 1 12 0c0 7 3 7 3 9H3c0-2 3-2 3-9"></path><path d="M10 20a2 2 0 0 0 4 0"></path></svg>',
    members:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M16 19a4 4 0 0 0-8 0"></path><circle cx="12" cy="11" r="3"></circle><path d="M5 19a3 3 0 0 1 3-3"></path><path d="M19 19a3 3 0 0 0-3-3"></path></svg>',
    review:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 4 4L19 6"></path></svg>',
    queue:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6h12"></path><path d="M8 12h12"></path><path d="M8 18h12"></path><circle cx="4" cy="6" r="1"></circle><circle cx="4" cy="12" r="1"></circle><circle cx="4" cy="18" r="1"></circle></svg>',
    reconcile:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 15.36-6.36L21 8"></path><path d="M21 12a9 9 0 0 1-15.36 6.36L3 16"></path></svg>',
    rotate:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M20 7v5h-5"></path><path d="M4 17v-5h5"></path><path d="M7 7a8 8 0 0 1 13 2"></path><path d="M17 17a8 8 0 0 1-13-2"></path></svg>',
    warning:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4 3 20h18L12 4Z"></path><path d="M12 9v4"></path><circle cx="12" cy="16.5" r=".8" fill="currentColor" stroke="none"></circle></svg>',
    roles:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M7 14a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z"></path><path d="m11 10 10 10"></path><path d="m17 14 3-3"></path></svg>',
    settings:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-.4-1.1 1.7 1.7 0 0 0-1-.6 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.1-.4H2.8a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.1-.4 1.7 1.7 0 0 0 .6-1 1.7 1.7 0 0 0-.34-1.87l-.06-.06A2 2 0 1 1 7.03 3.4l.06.06A1.7 1.7 0 0 0 9 4.6c.38 0 .74-.14 1-.4.28-.28.44-.66.4-1.06V3a2 2 0 1 1 4 0v.1c-.04.4.12.78.4 1.06.26.26.62.4 1 .4a1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 9c0 .38.14.74.4 1 .28.28.66.44 1.06.4H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.1.4 1.7 1.7 0 0 0-.4 1Z"></path></svg>',
    logs:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6h12"></path><path d="M8 12h12"></path><path d="M8 18h12"></path><path d="M4 6h.01"></path><path d="M4 12h.01"></path><path d="M4 18h.01"></path></svg>',
    megaphone:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11v2a2 2 0 0 0 2 2h2l5 4V5l-5 4H5a2 2 0 0 0-2 2Z"></path><path d="M16 9a5 5 0 0 1 0 6"></path><path d="M18.5 6.5a8.5 8.5 0 0 1 0 11"></path></svg>'
  };
  return icons[name] || icons.dashboard;
};

/* ====== Utilities ====== */
TB.utils = {
  money: function(v, cur){ if(v==null) return '-'; var n=parseFloat(v).toFixed(2); var parts=n.split('.'); parts[0]=parts[0].replace(/\B(?=(\d{3})+(?!\d))/g,','); return (cur||'USB')+' '+parts.join('.'); },
  moneyShort: function(v){ if(v==null) return '-'; var n=parseFloat(v); if(n>=1e9) return 'USB '+(n/1e9).toFixed(2)+'B'; if(n>=1e6) return 'USB '+(n/1e6).toFixed(2)+'M'; if(n>=1e3) return 'USB '+(n/1e3).toFixed(1)+'K'; return 'USB '+n.toFixed(2); },
  yield: function(v){ if(v==null) return '-'; return (parseFloat(v)*100).toFixed(3)+'%'; },
  yieldFmt: function(v){ if(v==null) return '-'; return parseFloat(v).toFixed(3)+'%'; },
  price: function(v){ if(v==null) return '-'; return parseFloat(v).toFixed(4); },
  tokens: function(v){ if(v==null) return '-'; return parseFloat(v).toFixed(6).replace(/\.?0+$/,''); },
  date: function(d){ if(!d) return '-'; return d; },
  dateTime: function(d){ return TB.utils.dt(d); },
  indicative: function(v, fmt){ var s = fmt ? fmt(v) : v; return s + ' <span class="indicative">(Indicative)</span>'; },
  avatar: function(name){ return name ? name.charAt(0).toUpperCase() : 'U'; },
  esc: function(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); },
};

/* ====== Time Zone ======
 * 后端时间戳统一按美东时间(ET)存储；界面按登录机器本地时区展示，并在括号内以「时间 ET」标注美东时间。
 * 只有日期的业务值（到期日、估值日、起息日/赎回日等）按美债现货收盘时点 TB.ET_CLOSE 作为美东基准换算。 */
TB.TIME_ZONE = 'America/New_York';
TB.ET_CLOSE = '17:00:00';
TB.DATETIME_RE = /^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}/;
TB.DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

TB.utils.tzParts = function(epochMs, timeZone){
  var dtf = new Intl.DateTimeFormat('en-CA', {timeZone:timeZone, hourCycle:'h23', year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit', second:'2-digit'});
  var p = {};
  dtf.formatToParts(new Date(epochMs)).forEach(function(x){ if(x.type !== 'literal') p[x.type] = x.value; });
  return p;
};
TB.utils.localZone = function(){ return Intl.DateTimeFormat().resolvedOptions().timeZone; };
TB.utils.etOffset = function(epochMs){
  var p = TB.utils.tzParts(epochMs, TB.TIME_ZONE);
  return Date.UTC(+p.year, +p.month-1, +p.day, +p.hour, +p.minute, +p.second) - epochMs;
};
/* 把 "YYYY-MM-DD HH:mm[:ss]" 当作 ET 墙上时间解析为时间戳；非时间戳返回 null */
TB.utils.parseET = function(str){
  var m = String(str).match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?/);
  if(!m) return null;
  var naive = Date.UTC(+m[1], +m[2]-1, +m[3], +m[4], +m[5], +(m[6]||0));
  var epoch = naive - TB.utils.etOffset(naive);
  epoch = naive - TB.utils.etOffset(epoch);
  return epoch;
};
TB.utils.stamp = function(epochMs, timeZone, withSeconds){
  var p = TB.utils.tzParts(epochMs, timeZone);
  var s = p.year+'-'+p.month+'-'+p.day+' '+p.hour+':'+p.minute;
  return withSeconds ? s+':'+p.second : s;
};
TB.utils.etStamp = function(epochMs, withSeconds){ return TB.utils.stamp(epochMs, TB.TIME_ZONE, withSeconds); };
TB.utils.nowET = function(){ return TB.utils.etStamp(Date.now(), true); };
TB.utils.tzNote = function(){
  var z = TB.utils.localZone();
  return TB.state.lang === 'zh'
    ? '时间按本机时区 '+z+' 展示，括号内为美东时间 ET。'
    : 'Times display in your local timezone '+z+' with US Eastern (ET) in parentheses.';
};
/* 展示用：统一为 本地时间 (美东时间 ET)。带时间戳按 ET 解析换算；纯日期为美东业务日，
 * 以美债现货收盘 / 系统 cut-off 时点 TB.ET_CLOSE 为基准换算，到期日、估值日、报价日等口径一致 */
TB.utils.dt = function(str){
  if(str == null || str === '' || str === '-') return str || '-';
  var src = TB.DATE_RE.test(str) ? str + ' ' + TB.ET_CLOSE : str;
  if(!TB.DATETIME_RE.test(src)) return String(str);
  var epoch = TB.utils.parseET(src);
  if(epoch === null) return String(str);
  return TB.utils.stamp(epoch, TB.utils.localZone()) + ' (' + TB.utils.etStamp(epoch) + ' ET)';
};

/* ====== Enum Labels (KYB / 优先级 / 结果 等数据枚举的双语翻译) ====== */
TB.enumLabels = {
  'passed':{en:'Passed',zh:'已通过'},'review':{en:'Review',zh:'审核中'},
  'active':{en:'Active',zh:'活跃'},'pending':{en:'Pending',zh:'待处理'},
  'suspended':{en:'Suspended',zh:'暂停'},
  'success':{en:'Success',zh:'成功'},'failed':{en:'Failed',zh:'失败'},
  'high':{en:'High',zh:'高'},'medium':{en:'Medium',zh:'中'},'mid':{en:'Mid',zh:'中'},'low':{en:'Low',zh:'低'},
  'open':{en:'Open',zh:'开放中'},'closed':{en:'Closed',zh:'停止购买'},'soldout':{en:'Sold Out',zh:'售罄'},
  'valid':{en:'Valid',zh:'有效'},'expired':{en:'Expired',zh:'已过期'}
};
TB.utils.enumLabel = function(v){
  if(v == null || v === '') return '';
  var e = TB.enumLabels[String(v).toLowerCase().replace(/\s+/g,'')];
  return e ? (e[TB.state.lang] || e.en) : String(v);
};

/* ====== Mock Data ====== */
TB.data = {
  users: [
    {id:'M001',name:'John Smith',email:'john@alpha-fund.com',role:'member_admin',portal:'member',org:'Alpha Fund Management',remiId:'RM-ALPHA-001'},
    {id:'M002',name:'Sarah Lee',email:'sarah@alpha-fund.com',role:'member_staff',portal:'member',org:'Alpha Fund Management',remiId:'RM-ALPHA-001'},
    {id:'I001',name:'James Wilson',email:'jwilson@bisonbank.com',role:'issuer_admin',portal:'issuer',org:'Bison Bank',remiId:'RM-BISON-001'},
    {id:'I002',name:'Maria Garcia',email:'mgarcia@bisonbank.com',role:'issuer_staff',portal:'issuer',org:'Bison Bank',remiId:'RM-BISON-001'},
    {id:'I003',name:'Robert Taylor',email:'rtaylor@bisonbank.com',role:'issuer_compliance',portal:'issuer',org:'Bison Bank',remiId:'RM-BISON-001'},
    {id:'I004',name:'Linda Chen',email:'lchen@bisonbank.com',role:'issuer_treasury',portal:'issuer',org:'Bison Bank',remiId:'RM-BISON-001'},
    {id:'O001',name:'Admin User',email:'admin@tokenbank.io',role:'sys_admin',portal:'ops',org:'TokenBank Operations',remiId:'TB-ADMIN'},
    {id:'O002',name:'Review Manager',email:'review@tokenbank.io',role:'reviewer',portal:'ops',org:'TokenBank Operations',remiId:'TB-REVIEW'},
  ],
  series: [
    {id:'R-UST-2026-001',name:'R-UST Bond Series 2026-001',cusip:'912810QT4',isin:'US912810QT40',issuer:'Bison Bank',custodian:'Bison Bank',maturityDate:'2026-12-15',faceTotal:50000000,faceAvailable:12000000,sellerYield:0.0525,refYield:0.0475,bpSpread:50,markPrice:0.9985,windowDays:27,quoteProvider:'Bison Bank',priceSource:'Bison Treasury Desk',quoteTime:'2026-11-02 09:30:00',quoteValidUntil:'2026-11-02 09:35:00',valuationDate:'2026-11-02',status:'open',createdAt:'2026-10-15'},
    {id:'R-UST-2026-002',name:'R-UST Bond Series 2026-002',cusip:'912810QU2',isin:'US912810QU25',issuer:'Bison Bank',custodian:'Bison Bank',maturityDate:'2027-01-12',faceTotal:30000000,faceAvailable:8000000,sellerYield:0.0550,refYield:0.0500,bpSpread:50,markPrice:0.9975,windowDays:27,quoteProvider:'Bison Bank',priceSource:'Bison Treasury Desk',quoteTime:'2026-11-02 09:30:00',quoteValidUntil:'2026-11-02 09:35:00',valuationDate:'2026-11-02',status:'open',createdAt:'2026-10-20'},
    {id:'R-UST-2026-003',name:'R-UST Bond Series 2026-003',cusip:'912810QV0',isin:'US912810QV08',issuer:'Bison Bank',custodian:'Bison Bank',maturityDate:'2027-02-09',faceTotal:20000000,faceAvailable:0,sellerYield:0.0575,refYield:0.0525,bpSpread:50,markPrice:0.9965,windowDays:27,quoteProvider:'Bison Bank',priceSource:'Bison Treasury Desk',quoteTime:'2026-11-01 09:30:00',quoteValidUntil:'2026-11-01 09:35:00',valuationDate:'2026-11-01',status:'closed',createdAt:'2026-10-25'},
    {id:'R-UST-2026-004',name:'R-UST Bond Series 2026-004',cusip:'912810QW8',isin:'US912810QW81',issuer:'Bison Bank',custodian:'Bison Bank',maturityDate:'2026-11-28',faceTotal:10000000,faceAvailable:5000000,sellerYield:0.0480,refYield:0.0430,bpSpread:50,markPrice:0.9990,windowDays:27,quoteProvider:'Bison Bank',priceSource:'Bison Treasury Desk',quoteTime:'2026-11-02 09:30:00',quoteValidUntil:'2026-11-02 09:35:00',valuationDate:'2026-11-02',status:'open',createdAt:'2026-10-28'},
    {id:'R-UST-2026-005',name:'R-UST Bond Series 2026-005',cusip:'912810QX6',isin:'US912810QX64',issuer:'Bison Bank',custodian:'Bison Bank',maturityDate:'2026-12-05',faceTotal:15000000,faceAvailable:0,sellerYield:0.0510,refYield:0.0460,bpSpread:50,markPrice:0.9980,windowDays:27,quoteProvider:'Bison Bank',priceSource:'Bison Treasury Desk',quoteTime:'2026-10-30 09:30:00',quoteValidUntil:'2026-10-30 09:35:00',valuationDate:'2026-10-30',status:'maturity',createdAt:'2026-10-10'},
    {id:'R-UST-2026-006',name:'R-UST Bond Series 2026-006',cusip:'912810QY4',isin:'US912810QY47',issuer:'Bison Bank',custodian:'Bison Bank',maturityDate:'2026-10-15',faceTotal:8000000,faceAvailable:0,sellerYield:0.0490,refYield:0.0440,bpSpread:50,markPrice:0.9995,windowDays:27,quoteProvider:'Bison Bank',priceSource:'Bison Treasury Desk',quoteTime:'2026-09-15 09:30:00',quoteValidUntil:'2026-09-15 09:35:00',valuationDate:'2026-09-15',status:'burned',createdAt:'2026-09-01'},
    {id:'R-UST-2026-007',name:'R-UST Bond Series 2026-007',cusip:'912810QZ2',isin:'US912810QZ29',issuer:'Bison Bank',custodian:'Bison Bank',maturityDate:'2027-03-15',faceTotal:25000000,faceAvailable:25000000,sellerYield:0.0580,refYield:0.0530,bpSpread:50,markPrice:0.9960,windowDays:27,quoteProvider:'Bison Bank',priceSource:'Bison Treasury Desk',quoteTime:'2026-11-02 09:30:00',quoteValidUntil:'2026-11-02 09:35:00',valuationDate:'2026-11-02',status:'approving',createdAt:'2026-11-01'},
    {id:'R-UST-2026-008',name:'R-UST Bond Series 2026-008',cusip:'912810RA1',isin:'US912810RA10',issuer:'Bison Bank',custodian:'Bison Bank',maturityDate:'2027-04-12',faceTotal:40000000,faceAvailable:0,sellerYield:0.0600,refYield:0.0550,bpSpread:50,markPrice:0.9950,windowDays:27,quoteProvider:'Bison Bank',priceSource:'Bison Treasury Desk',quoteTime:'2026-10-25 09:30:00',quoteValidUntil:'2026-10-25 09:35:00',valuationDate:'2026-10-25',status:'minting',createdAt:'2026-10-24'},
    {id:'R-UST-2026-009',name:'R-UST Bond Series 2026-009',cusip:'912810RB9',isin:'US912810RB98',issuer:'Bison Bank',custodian:'Bison Bank',maturityDate:'2027-05-10',faceTotal:18000000,faceAvailable:6800000,sellerYield:0.0565,refYield:0.0515,bpSpread:50,markPrice:0.9970,windowDays:27,quoteProvider:'Bison Bank',priceSource:'Bison Treasury Desk',quoteTime:'2026-11-02 10:15:00',quoteValidUntil:'2026-11-02 10:20:00',valuationDate:'2026-11-02',status:'open',createdAt:'2026-11-02'},
    {id:'R-UST-2026-010',name:'R-UST Bond Series 2026-010',cusip:'912810RC7',isin:'US912810RC76',issuer:'Bison Bank',custodian:'Bison Bank',maturityDate:'2027-06-14',faceTotal:22000000,faceAvailable:0,sellerYield:0.0570,refYield:0.0520,bpSpread:50,markPrice:0.9968,windowDays:27,quoteProvider:'Bison Bank',priceSource:'Bison Treasury Desk',quoteTime:'2026-11-01 11:00:00',quoteValidUntil:'2026-11-01 11:05:00',valuationDate:'2026-11-01',status:'closed',createdAt:'2026-10-29'},
    {id:'R-UST-2026-011',name:'R-UST Bond Series 2026-011',cusip:'912810RD5',isin:'US912810RD54',issuer:'Bison Bank',custodian:'Bison Bank',maturityDate:'2027-07-12',faceTotal:26000000,faceAvailable:10500000,sellerYield:0.0545,refYield:0.0495,bpSpread:50,markPrice:0.9982,windowDays:27,quoteProvider:'Bison Bank',priceSource:'Bison Treasury Desk',quoteTime:'2026-11-02 11:30:00',quoteValidUntil:'2026-11-02 11:35:00',valuationDate:'2026-11-02',status:'open',createdAt:'2026-11-02'},
    {id:'R-UST-2026-012',name:'R-UST Bond Series 2026-012',cusip:'912810RE3',isin:'US912810RE31',issuer:'Bison Bank',custodian:'Bison Bank',maturityDate:'2027-08-09',faceTotal:32000000,faceAvailable:0,sellerYield:0.0590,refYield:0.0540,bpSpread:50,markPrice:0.9958,windowDays:27,quoteProvider:'Bison Bank',priceSource:'Bison Treasury Desk',quoteTime:'2026-10-28 10:20:00',quoteValidUntil:'2026-10-28 10:25:00',valuationDate:'2026-10-28',status:'closed',createdAt:'2026-10-21'},
    {id:'R-UST-2026-013',name:'R-UST Bond Series 2026-013',cusip:'912810RF1',isin:'US912810RF18',issuer:'Bison Bank',custodian:'Bison Bank',maturityDate:'2027-09-13',faceTotal:14000000,faceAvailable:3400000,sellerYield:0.0535,refYield:0.0485,bpSpread:50,markPrice:0.9988,windowDays:27,quoteProvider:'Bison Bank',priceSource:'Bison Treasury Desk',quoteTime:'2026-11-02 12:10:00',quoteValidUntil:'2026-11-02 12:15:00',valuationDate:'2026-11-02',status:'open',createdAt:'2026-11-02'},
    {id:'R-UST-2026-014',name:'R-UST Bond Series 2026-014',cusip:'912810RG9',isin:'US912810RG97',issuer:'Bison Bank',custodian:'Bison Bank',maturityDate:'2027-10-11',faceTotal:36000000,faceAvailable:0,sellerYield:0.0605,refYield:0.0555,bpSpread:50,markPrice:0.9952,windowDays:27,quoteProvider:'Bison Bank',priceSource:'Bison Treasury Desk',quoteTime:'2026-10-27 09:45:00',quoteValidUntil:'2026-10-27 09:50:00',valuationDate:'2026-10-27',status:'closed',createdAt:'2026-10-15'},
    {id:'R-UST-2026-015',name:'R-UST Bond Series 2026-015',cusip:'912810RH7',isin:'US912810RH75',issuer:'Bison Bank',custodian:'Bison Bank',maturityDate:'2027-11-08',faceTotal:20000000,faceAvailable:20000000,sellerYield:0.0598,refYield:0.0548,bpSpread:50,markPrice:0.9955,windowDays:27,quoteProvider:'Bison Bank',priceSource:'Bison Treasury Desk',quoteTime:'2026-11-02 09:30:00',quoteValidUntil:'2026-11-02 09:35:00',valuationDate:'2026-11-02',status:'approving',createdAt:'2026-11-02'},
    {id:'R-UST-2026-016',name:'R-UST Bond Series 2026-016',cusip:'912810RJ3',isin:'US912810RJ33',issuer:'Bison Bank',custodian:'Bison Bank',maturityDate:'2027-12-13',faceTotal:28000000,faceAvailable:21400000,sellerYield:0.0572,refYield:0.0522,bpSpread:50,markPrice:0.9969,windowDays:27,quoteProvider:'Bison Bank',priceSource:'Bison Treasury Desk',quoteTime:'2026-11-02 11:20:00',quoteValidUntil:'2026-11-02 11:25:00',valuationDate:'2026-11-02',status:'open',createdAt:'2026-11-01'},
    {id:'R-UST-2026-017',name:'R-UST Bond Series 2026-017',cusip:'912810RK1',isin:'US912810RK16',issuer:'Bison Bank',custodian:'Bison Bank',maturityDate:'2028-01-10',faceTotal:34000000,faceAvailable:29800000,sellerYield:0.0588,refYield:0.0538,bpSpread:50,markPrice:0.9961,windowDays:27,quoteProvider:'Bison Bank',priceSource:'Bison Treasury Desk',quoteTime:'2026-11-02 13:05:00',quoteValidUntil:'2026-11-02 13:10:00',valuationDate:'2026-11-02',status:'open',createdAt:'2026-11-02'},
    {id:'R-UST-2026-018',name:'R-UST Bond Series 2026-018',cusip:'912810RL9',isin:'US912810RL99',issuer:'Bison Bank',custodian:'Bison Bank',maturityDate:'2028-02-08',faceTotal:16000000,faceAvailable:16000000,sellerYield:0.0612,refYield:0.0562,bpSpread:50,markPrice:0.9948,windowDays:27,quoteProvider:'Bison Bank',priceSource:'Bison Treasury Desk',quoteTime:'2026-10-30 09:30:00',quoteValidUntil:'2026-10-30 09:35:00',valuationDate:'2026-10-30',status:'rejected',createdAt:'2026-10-29'},
  ],
  members: [
    {id:'MEM-001',name:'Alpha Fund Management',remiId:'RM-ALPHA-001',type:'Member',country:'Singapore',kyb:'Passed',subStatus:'Active',emtBalance:12500000,createdAt:'2026-08-15',status:'active'},
    {id:'MEM-002',name:'Beta Capital Partners',remiId:'RM-BETA-002',type:'Member',country:'Hong Kong',kyb:'Passed',subStatus:'Active',emtBalance:8300000,createdAt:'2026-08-20',status:'active'},
    {id:'MEM-003',name:'Gamma Wealth Advisory',remiId:'RM-GAMMA-003',type:'Member',country:'Switzerland',kyb:'Passed',subStatus:'Active',emtBalance:5600000,createdAt:'2026-09-01',status:'active'},
    {id:'MEM-004',name:'Delta Asset Management',remiId:'RM-DELTA-004',type:'Member',country:'United Kingdom',kyb:'Passed',subStatus:'Active',emtBalance:3200000,createdAt:'2026-10-28',status:'active'},
    {id:'MEM-005',name:'Epsilon Investments',remiId:'RM-EPSI-005',type:'Member',country:'Japan',kyb:'Passed',subStatus:'Active',emtBalance:15200000,createdAt:'2026-07-10',status:'active'},
    {id:'MEM-006',name:'Zeta Financial Group',remiId:'RM-ZETA-006',type:'Issuer',country:'Luxembourg',kyb:'Passed',subStatus:'Active',emtBalance:50000000,createdAt:'2026-06-01',status:'active'},
    {id:'MEM-007',name:'Bison Bank',remiId:'RM-BISON-001',type:'Issuer',country:'Luxembourg',kyb:'Passed',subStatus:'Active',emtBalance:18500000,createdAt:'2026-05-20',status:'active'},
  ],
  transactions: [
    {id:'TX-20261102-001',time:'2026-11-02 10:15:00',type:'Purchase',amount:500000,fee:20,status:'settled',series:'R-UST-2026-001',member:'Alpha Fund Management',remarks:'DVP settled'},
    {id:'TX-20261102-002',time:'2026-11-02 09:45:00',type:'Deposit',amount:2000000,fee:0,status:'completed',series:'-',member:'Alpha Fund Management',remarks:'EMT deposit from Remi Core'},
    {id:'TX-20261101-003',time:'2026-11-01 14:30:00',type:'Checkout',amount:1020000,fee:0,status:'checkoutCompleted',series:'R-UST-2026-005',member:'Beta Capital Partners',remarks:'Auto checkout'},
    {id:'TX-20261101-004',time:'2026-11-01 11:20:00',type:'Withdraw',amount:1000000,fee:15,status:'completed',series:'-',member:'Gamma Wealth Advisory',remarks:'Withdraw to Remi Core'},
    {id:'TX-20261031-005',time:'2026-10-31 15:45:00',type:'Maturity',amount:8000000,fee:0,status:'maturityPaid',series:'R-UST-2026-006',member:'Alpha Fund Management',remarks:'Maturity payout'},
    {id:'TX-20261031-006',time:'2026-10-31 09:00:00',type:'Purchase',amount:1000000,fee:20,status:'settled',series:'R-UST-2026-001',member:'Beta Capital Partners',remarks:'DVP settled'},
    {id:'TX-20261030-007',time:'2026-10-30 16:20:00',type:'Book Ahead',amount:2000000,fee:1250,status:'bookingConfirmed',series:'R-UST-2026-002',member:'Alpha Fund Management',remarks:'Deposit taken'},
    {id:'TX-20261030-008',time:'2026-10-30 10:10:00',type:'Deposit',amount:5000000,fee:0,status:'completed',series:'-',member:'Delta Asset Management',remarks:'EMT deposit'},
  ],
  holdings: [
    {id:'HLD-001',series:'R-UST-2026-001',faceValue:5000000,tokens:5008754.392152,checkin:'2026-10-29',maturityDate:'2026-12-15',valuation:4993756.25,sellerYield:0.0525,expectedReturn:21875.00,status:'settled',member:'Alpha Fund Management'},
    {id:'HLD-002',series:'R-UST-2026-002',faceValue:2000000,tokens:2003502.626533,checkin:'2026-10-22',maturityDate:'2027-01-12',valuation:1995002.63,sellerYield:0.0550,expectedReturn:12054.79,status:'settled',member:'Alpha Fund Management'},
    {id:'HLD-003',series:'R-UST-2026-001',faceValue:1000000,tokens:1001750.878430,checkin:'2026-10-29',maturityDate:'2026-12-15',valuation:998751.13,sellerYield:0.0525,expectedReturn:4375.00,status:'checkoutPending',member:'Beta Capital Partners'},
    {id:'HLD-004',series:'R-UST-2026-004',faceValue:3000000,tokens:3002253.390083,checkin:'2026-10-30',maturityDate:'2026-11-28',valuation:2997002.26,sellerYield:0.0480,expectedReturn:11835.62,status:'settled',member:'Alpha Fund Management'},
    {id:'HLD-005',series:'R-UST-2026-005',faceValue:1500000,tokens:1502626.974799,checkin:'2026-10-15',maturityDate:'2026-12-05',valuation:1497000.00,sellerYield:0.0510,expectedReturn:6575.34,status:'checkoutCompleted',member:'Gamma Wealth Advisory'},
  ],
  bookings: [
    {id:'BK-20261102-001',series:'UST-2026-001',faceValue:1000000,checkin:'2026-11-10',checkout:'2026-11-17',windowDays:7,deposit:1250,status:'bookingConfirmed',submittedAt:'2026-11-02 08:00:00',member:'Alpha Fund Management'},
    {id:'BK-20261101-002',series:'UST-2026-002',faceValue:2000000,checkin:'2026-11-14',checkout:'2026-11-21',windowDays:7,deposit:2500,status:'depositTaken',submittedAt:'2026-11-01 14:30:00',member:'Alpha Fund Management'},
    {id:'BK-20261031-003',series:'UST-2026-004',faceValue:500000,checkin:'2026-11-07',checkout:'2026-12-05',windowDays:28,status:'pendingSettlement',submittedAt:'2026-10-31 09:00:00',member:'Beta Capital Partners'},
    {id:'BK-20261030-004',series:'UST-2026-001',faceValue:1000000,checkin:'2026-10-25',checkout:'2026-10-29',windowDays:4,deposit:1250,status:'cancelled',submittedAt:'2026-10-30 10:00:00',member:'Gamma Wealth Advisory'},
  ],
  quotes: [
    {id:'QT-001',series:'UST-2026-001',sellerYield:0.0525,markPrice:0.9985,quoteTime:'2026-11-02 09:30:00',validUntil:'2026-11-02 09:35:00',status:'valid',provider:'Bison Bank'},
    {id:'QT-002',series:'UST-2026-002',sellerYield:0.0550,markPrice:0.9975,quoteTime:'2026-11-02 09:30:00',validUntil:'2026-11-02 09:35:00',status:'valid',provider:'Bison Bank'},
    {id:'QT-003',series:'UST-2026-003',sellerYield:0.0575,markPrice:0.9965,quoteTime:'2026-11-01 09:30:00',validUntil:'2026-11-01 09:35:00',status:'expired',provider:'Bison Bank'},
    {id:'QT-004',series:'UST-2026-004',sellerYield:0.0480,markPrice:0.9990,quoteTime:'2026-11-02 09:30:00',validUntil:'2026-11-02 09:35:00',status:'valid',provider:'Bison Bank'},
    {id:'QT-005',series:'UST-2026-007',sellerYield:0.0580,markPrice:0.9960,quoteTime:'2026-11-02 09:30:00',validUntil:'2026-11-02 09:35:00',status:'pending',provider:'Bison Bank'},
  ],
  notifications: [
    {id:'N-001',type:'booking',title:'Booking Confirmed',desc:'Your booking BK-20261102-001 has been confirmed.',time:'2026-11-02 08:15:00',read:false,priority:'high'},
    {id:'N-002',type:'fund',title:'Deposit Received',desc:'USB 2,000,000.00 has been credited to your wallet.',time:'2026-11-02 09:50:00',read:false,priority:'medium'},
    {id:'N-003',type:'order',title:'Checkout Reminder',desc:'Your holding in UST-2026-005 will checkout on 2026-12-05.',time:'2026-11-01 16:00:00',read:true,priority:'high'},
    {id:'N-004',type:'system',title:'Series Status Change',desc:'UST-2026-003 has been closed for booking.',time:'2026-11-01 10:00:00',read:true,priority:'low'},
    {id:'N-005',type:'approval',title:'Approval Timeout',desc:'Series review for UST-2026-007 has been pending for 24 hours.',time:'2026-11-02 06:00:00',read:false,priority:'high'},
    {id:'N-006',type:'fund',title:'Withdraw Completed',desc:'USB 1,000,000.00 withdrawal completed.',time:'2026-11-01 11:30:00',read:true,priority:'high'},
  ],
  accounts: [
    {id:'ACC-001',name:'John Smith',email:'john@alpha-fund.com',role:'Admin',org:'Alpha Fund Management',status:'active',created:'2026-08-15',lastLogin:'2026-11-02 08:00:00'},
    {id:'ACC-002',name:'Sarah Lee',email:'sarah@alpha-fund.com',role:'Trader',org:'Alpha Fund Management',status:'active',created:'2026-08-16',lastLogin:'2026-11-01 14:00:00'},
    {id:'ACC-003',name:'Mike Chen',email:'mike@alpha-fund.com',role:'Viewer',org:'Alpha Fund Management',status:'suspended',created:'2026-09-01',lastLogin:'2026-10-15 09:00:00'},
    {id:'ACC-004',name:'James Wilson',email:'jwilson@bisonbank.com',role:'Admin',org:'Bison Bank',status:'active',created:'2026-06-01',lastLogin:'2026-11-02 07:30:00'},
    {id:'ACC-005',name:'Maria Garcia',email:'mgarcia@bisonbank.com',role:'Officer',org:'Bison Bank',status:'active',created:'2026-06-05',lastLogin:'2026-11-01 16:00:00'},
    {id:'ACC-006',name:'Admin User',email:'admin@tokenbank.io',role:'Sys Admin',org:'TokenBank',status:'active',created:'2026-01-01',lastLogin:'2026-11-02 08:30:00'},
    {id:'ACC-007',name:'Review Manager',email:'review@tokenbank.io',role:'Reviewer',org:'TokenBank',status:'active',created:'2026-01-01',lastLogin:'2026-11-02 07:00:00'},
    {id:'ACC-008',name:'Ops Staff',email:'ops@tokenbank.io',role:'Operations',org:'TokenBank',status:'active',created:'2026-03-01',lastLogin:'2026-10-31 17:00:00'},
    {id:'ACC-009',name:'Robert Taylor',email:'rtaylor@bisonbank.com',role:'Compliance',org:'Bison Bank',status:'active',created:'2026-07-01',lastLogin:'2026-11-01 09:00:00'},
    {id:'ACC-010',name:'Linda Chen',email:'lchen@bisonbank.com',role:'Treasury',org:'Bison Bank',status:'active',created:'2026-08-01',lastLogin:'2026-11-02 08:45:00'},
    {id:'ACC-011',name:'Anna Wong',email:'anna@beta-cap.com',role:'Admin',org:'Beta Capital Partners',status:'active',created:'2026-08-22',lastLogin:'2026-11-02 09:00:00'},
    {id:'ACC-012',name:'Leo Zhang',email:'leo@beta-cap.com',role:'Trader',org:'Beta Capital Partners',status:'active',created:'2026-09-05',lastLogin:'2026-11-01 10:30:00'},
    {id:'ACC-013',name:'Nina Keller',email:'nina@gamma-wealth.ch',role:'Admin',org:'Gamma Wealth Advisory',status:'active',created:'2026-09-10',lastLogin:'2026-10-30 15:00:00'},
    {id:'ACC-014',name:'Omar Haddad',email:'omar@delta-am.co.uk',role:'Admin',org:'Delta Asset Management',status:'active',created:'2026-10-28',lastLogin:'-'},
    {id:'ACC-015',name:'Ken Sato',email:'ken@epsilon-inv.jp',role:'Admin',org:'Epsilon Investments',status:'active',created:'2026-07-12',lastLogin:'2026-11-02 10:20:00'},
    {id:'ACC-016',name:'Claire Dubois',email:'claire@zeta-fg.lu',role:'Admin',org:'Zeta Financial Group',status:'active',created:'2026-06-15',lastLogin:'2026-11-02 07:45:00'},
  ],
  reconciliations: [
    {id:'REC-20261102',date:'2026-11-02',series:'UST-2026-001',status:'matched',diffCount:0,time:'2026-11-02 06:30:00'},
    {id:'REC-20261102-2',date:'2026-11-02',series:'UST-2026-002',status:'matched',diffCount:0,time:'2026-11-02 06:32:00'},
    {id:'REC-20261102-3',date:'2026-11-02',series:'UST-2026-001',status:'break',diffCount:2,time:'2026-11-02 06:35:00'},
    {id:'REC-20261101',date:'2026-11-01',series:'UST-2026-005',status:'matched',diffCount:0,time:'2026-11-01 06:30:00'},
    {id:'REC-20261031',date:'2026-10-31',series:'UST-2026-006',status:'matched',diffCount:0,time:'2026-10-31 06:30:00'},
  ],
  announcements: [
    {id:'ANN-001',title:'Market Hours Update for November 2026',type:'System',audience:'All Members',status:'published',time:'2026-11-01 09:00:00',author:'Admin User'},
    {id:'ANN-002',title:'New Series UST-2026-007 Available',type:'Product',audience:'All Members',status:'published',time:'2026-11-01 10:30:00',author:'Admin User'},
    {id:'ANN-003',title:'Scheduled Maintenance on Nov 5',type:'Maintenance',audience:'All Users',status:'published',time:'2026-10-31 16:00:00',author:'Admin User'},
    {id:'ANN-004',title:'Year-End Settlement Guidelines',type:'Policy',audience:'All Members',status:'draft',time:'2026-10-30 14:00:00',author:'Admin User'},
  ],
  auditLogs: [
    {id:'LOG-001',user:'John Smith',type:'Purchase',ref:'TX-20261102-001',time:'2026-11-02 10:15:00',result:'Success',ip:'103.21.244.10'},
    {id:'LOG-002',user:'Admin User',type:'Config Update',ref:'Trading Params',time:'2026-11-02 09:00:00',result:'Success',ip:'10.0.0.1'},
    {id:'LOG-003',user:'James Wilson',type:'Issuance Submit',ref:'UST-2026-007',time:'2026-11-01 17:00:00',result:'Success',ip:'203.45.67.89'},
    {id:'LOG-004',user:'Review Manager',type:'Approval',ref:'UST-2026-008',time:'2026-11-01 11:00:00',result:'Success',ip:'10.0.0.2'},
    {id:'LOG-005',user:'Sarah Lee',type:'Withdraw',ref:'TX-20261101-004',time:'2026-11-01 11:20:00',result:'Success',ip:'103.21.244.11'},
    {id:'LOG-006',user:'System',type:'Auto Checkout',ref:'UST-2026-005',time:'2026-11-01 00:00:00',result:'Failed',ip:'10.0.0.1'},
  ],
  burnRequests: [
    {id:'BRN-001',series:'UST-2026-006',applicant:'James Wilson',applyTime:'2026-10-20 10:00:00',node:'Burned',status:'burned',completeTime:'2026-10-22 14:00:00',amount:8000000},
    {id:'BRN-002',series:'UST-2026-005',applicant:'James Wilson',applyTime:'2026-11-02 08:00:00',node:'Pending Review',status:'pending',completeTime:'-',amount:15000000},
  ],
  reviewTasks: [
    {id:'REV-001',type:'Series Issuance',ref:'UST-2026-007',applicant:'James Wilson',node:'Maker',time:'2026-11-01 17:00:00',priority:'High',status:'pending'},
    {id:'REV-002',type:'Burn Request',ref:'BRN-002',applicant:'James Wilson',node:'Maker',time:'2026-11-02 08:00:00',priority:'High',status:'pending'},
    {id:'REV-004',type:'Series Issuance',ref:'UST-2026-008',applicant:'James Wilson',node:'Approver',time:'2026-10-24 15:00:00',priority:'High',status:'completed'},
  ],
  emtReserve: {available:18500000, frozen:2500000, bufferRate:0.05, lastCloseRun:'2026-11-02 16:00:00'},
  emtCovers: [
    {id:'ECC-001',series:'R-UST-2026-001',type:'checkout',redemption:4200000,dueDate:'2026-11-03'},
    {id:'ECC-002',series:'R-UST-2026-002',type:'checkout',redemption:2600000,dueDate:'2026-11-03'},
    {id:'ECC-003',series:'R-UST-2026-005',type:'maturity',redemption:1500000,dueDate:'2026-11-03'},
    {id:'ECC-004',series:'R-UST-2026-004',type:'checkout',redemption:900000,dueDate:'2026-11-03'},
    {id:'ECC-005',series:'R-UST-2026-013',type:'checkout',redemption:0,dueDate:'-'},
  ],
  emtLedger: [
    {id:'LED-001',time:'2026-11-02 09:15:00',item:{zh:'成员 Checkout 兑付',en:'Member checkout payout'},series:'R-UST-2026-005',counterparty:'Beta Capital Partners',direction:'out',amount:1020000,remarks:{zh:'含收益结算',en:'Including accrued return'}},
    {id:'LED-002',time:'2026-11-02 06:30:00',item:{zh:'USB 入金铸入 EMT',en:'USB deposit minted to EMT'},series:'-',counterparty:'Bison Bank',direction:'in',amount:5000000,remarks:{zh:'Remi Core 入金确认',en:'Remi Core deposit confirmed'}},
    {id:'LED-003',time:'2026-11-01 16:40:00',item:{zh:'EMT 提现换汇',en:'EMT withdrawn to fiat'},series:'-',counterparty:'Bison Bank',direction:'out',amount:3000000,remarks:{zh:'兑换法币再购美债',en:'Redeemed to buy next Treasury'}},
    {id:'LED-004',time:'2026-11-01 14:05:00',item:{zh:'成员购买收款',en:'Member purchase inflow'},series:'R-UST-2026-001',counterparty:'Alpha Fund Management',direction:'in',amount:500000,remarks:{zh:'DVP 扣款',en:'DVP debit'}},
    {id:'LED-005',time:'2026-11-01 11:20:00',item:{zh:'成员提现兑付',en:'Member withdrawal payout'},series:'-',counterparty:'Gamma Wealth Advisory',direction:'out',amount:1000000,remarks:{zh:'提现出金',en:'Withdrawal credit'}},
    {id:'LED-006',time:'2026-10-31 15:45:00',item:{zh:'到期兑付支出',en:'Maturity payout'},series:'R-UST-2026-006',counterparty:'Alpha Fund Management',direction:'out',amount:8000000,remarks:{zh:'按 USB 1 兑付',en:'Paid at USB 1 per token'}},
    {id:'LED-007',time:'2026-10-30 10:10:00',item:{zh:'成员预定定金',en:'Booking deposit inflow'},series:'R-UST-2026-002',counterparty:'Alpha Fund Management',direction:'in',amount:2500000,remarks:{zh:'预定 check-in',en:'Booking check-in'}},
  ],
  emtFlows: [
    {id:'EMT-001',time:'2026-11-02 06:30:00',type:'mint',direction:'in',channel:'Remi Core',amount:5000000,status:'completed',remarks:'USB 入金后 Bison 实时 mint EMT'},
    {id:'EMT-002',time:'2026-11-02 09:15:00',type:'payout',direction:'out',channel:'Token Bank',amount:1020000,status:'completed',remarks:'Checkout 兑付 Beta Capital Partners'},
    {id:'EMT-003',time:'2026-11-01 16:40:00',type:'withdraw',direction:'out',channel:'Remi Core',amount:3000000,status:'settled',remarks:'EMT 提现换回法币再购美债'},
    {id:'EMT-004',time:'2026-11-01 11:20:00',type:'payout',direction:'out',channel:'Token Bank',amount:1000000,status:'completed',remarks:'成员提现兑付 Gamma Wealth'},
    {id:'EMT-005',time:'2026-10-31 15:05:00',type:'freeze',direction:'out',channel:'Token Bank',amount:2000000,status:'active',remarks:'次日赎回 Cover 冻结'},
  ],
  issuerTasks: [
    {id:'TSK-001',type:{zh:'Series审核',en:'Series Review'},desc:{zh:'UST-2026-007 待审核',en:'UST-2026-007 awaiting review'},status:'pending',handler:'-',time:'2026-11-01 17:00:00',route:'#/series/R-UST-2026-007'},
    {id:'TSK-002',type:{zh:'销毁审核',en:'Burn Review'},desc:{zh:'BRN-002 待审核',en:'BRN-002 awaiting review'},status:'pending',handler:'-',time:'2026-11-02 08:00:00',route:'#/burn'},
    {id:'TSK-003',type:{zh:'报价过期',en:'Quote Expired'},desc:{zh:'QT-003 已过期，需刷新后购买',en:'QT-003 expired; refresh before purchase'},status:'pending',handler:'-',time:'2026-11-01 09:35:00',route:'#/quotes'},
    {id:'TSK-004',type:{zh:'Series铸币中',en:'Series Minting'},desc:{zh:'UST-2026-008 铸币处理中',en:'UST-2026-008 minting in progress'},status:'pending',handler:{zh:'Maria Garcia',en:'Maria Garcia'},time:'2026-10-24 15:00:00',route:'#/series/R-UST-2026-008'},
    {id:'TSK-005',type:{zh:'容量预警',en:'Capacity Alert'},desc:{zh:'UST-2026-001 剩余额度 24%',en:'UST-2026-001 24% capacity remaining'},status:'pending',handler:'-',time:'2026-11-02 07:45:00',route:'#/positions'},
    {id:'TSK-006',type:{zh:'到期兑付准备',en:'Maturity Prep'},desc:{zh:'UST-2026-005 12-05 到期，需备足 EMT',en:'UST-2026-005 matures 12-05; prepare EMT cover'},status:'pending',handler:'-',time:'2026-11-01 16:10:00',route:'#/emt'},
    {id:'TSK-007',type:{zh:'发行资料补充',en:'Issuance Documents'},desc:{zh:'UST-2026-015 已提交发行审批',en:'UST-2026-015 submitted for issuance approval'},status:'approved',handler:{zh:'James Wilson',en:'James Wilson'},time:'2026-11-02 10:40:00',route:'#/series/R-UST-2026-015'},
    {id:'TSK-008',type:{zh:'EMT补充申请',en:'EMT Top-up'},desc:{zh:'次日 Cover 缺口 3.66M 已申请',en:'Next-day cover gap 3.66M requested'},status:'processed',handler:{zh:'Linda Chen',en:'Linda Chen'},time:'2026-11-02 09:20:00',route:'#/emt'},
    {id:'TSK-009',type:{zh:'对账差异处理',en:'Reconciliation Break'},desc:{zh:'REC-20261102-3 差异已核销',en:'REC-20261102-3 difference resolved'},status:'processed',handler:{zh:'Robert Taylor',en:'Robert Taylor'},time:'2026-11-02 08:10:00',route:'#/reconciliation'},
    {id:'TSK-010',type:{zh:'销毁审核',en:'Burn Review'},desc:{zh:'BRN-001 审核通过并已销毁',en:'BRN-001 approved and burned'},status:'approved',handler:{zh:'James Wilson',en:'James Wilson'},time:'2026-10-22 14:00:00',route:'#/burn'},
    {id:'TSK-011',type:{zh:'报价同步',en:'Quote Sync'},desc:{zh:'QT-001 / QT-002 已刷新',en:'QT-001 / QT-002 refreshed'},status:'processed',handler:{zh:'Maria Garcia',en:'Maria Garcia'},time:'2026-11-02 09:30:00',route:'#/quotes'},
    {id:'TSK-012',type:{zh:'风险揭示书发布',en:'Risk Disclosure'},desc:{zh:'v2 版本已发布并留痕',en:'Version v2 published and recorded'},status:'processed',handler:{zh:'Maria Garcia',en:'Maria Garcia'},time:'2026-10-30 11:00:00',route:'#/series'},
    {id:'TSK-013',type:{zh:'停止购买',en:'Stop Purchase'},desc:{zh:'UST-2026-003 已停止购买',en:'UST-2026-003 purchase stopped'},status:'processed',handler:{zh:'James Wilson',en:'James Wilson'},time:'2026-11-01 15:20:00',route:'#/series/R-UST-2026-003'},
    {id:'TSK-014',type:{zh:'成员赎回确认',en:'Member Redemption'},desc:{zh:'UST-2026-006 全部成员 EMT 兑付完成',en:'UST-2026-006 all member EMT paid out'},status:'approved',handler:{zh:'Robert Taylor',en:'Robert Taylor'},time:'2026-10-31 15:45:00',route:'#/reconciliation'},
  ],
  burnConfirms: [
    {id:'BC-001',series:'R-UST-2026-005',generatedAt:'2026-11-02 06:00:00',status:'pending',emtPaid:true},
    {id:'BC-002',series:'R-UST-2026-006',generatedAt:'2026-10-16 06:00:00',status:'completed',emtPaid:true,submittedAt:'2026-10-18 09:00:00'},
  ],
  approvalFlows: [
    {id:'AF-ISSU',type:'issuance',name:{en:'Issuance Approval',zh:'发行申请审批'},enabled:true,updatedAt:'2026-10-20 11:00:00',nodes:[
      {id:'N1',order:1,name:{en:'Maker Review',zh:'Maker初审'},approvers:['Maria Garcia'],mode:'any'},
      {id:'N2',order:2,name:{en:'Compliance Review',zh:'合规复核'},approvers:['Robert Taylor'],mode:'all'},
      {id:'N3',order:3,name:{en:'Final Approval',zh:'终审'},approvers:['James Wilson','Linda Chen'],mode:'any'}
    ]},
    {id:'AF-BURN',type:'burn',name:{en:'Burn Approval',zh:'销毁申请审批'},enabled:true,updatedAt:'2026-10-18 09:30:00',nodes:[
      {id:'N1',order:1,name:{en:'Maker Review',zh:'Maker初审'},approvers:['Maria Garcia'],mode:'any'},
      {id:'N2',order:2,name:{en:'Burn Review',zh:'销毁复核'},approvers:['James Wilson','Robert Taylor'],mode:'all'},
      {id:'N3',order:3,name:{en:'Final Approval',zh:'终审'},approvers:['James Wilson'],mode:'all'}
    ]}
  ],
  approvalTasks: [
    {id:'APR-001',flow:'AF-BURN',ref:'BRN-002',applicant:'James Wilson',submittedAt:'2026-11-02 08:00:00',nodeOrder:2,approvers:['James Wilson','Robert Taylor'],status:'pending',priority:'High',completedAt:'-',decidedBy:'-',nodeApprovals:['James Wilson'],trail:[
      {node:{en:'Maker Review',zh:'Maker初审'},approver:'Maria Garcia',decision:'approved',time:'2026-11-02 08:30:00',remarks:'Documents complete'},
      {node:{en:'Burn Review',zh:'销毁复核'},approver:'James Wilson',decision:'approved',time:'2026-11-02 09:10:00',remarks:'Redemption and reconciliation verified'}
    ]},
    {id:'APR-002',flow:'AF-ISSU',ref:'R-UST-2026-007',applicant:'James Wilson',submittedAt:'2026-11-01 17:00:00',nodeOrder:2,approvers:['Robert Taylor'],status:'pending',priority:'High',completedAt:'-',decidedBy:'-',nodeApprovals:[],trail:[
      {node:{en:'Maker Review',zh:'Maker初审'},approver:'Maria Garcia',decision:'approved',time:'2026-11-01 17:40:00',remarks:'OK'}
    ]},
    {id:'APR-003',flow:'AF-ISSU',ref:'R-UST-2026-015',applicant:'Maria Garcia',submittedAt:'2026-11-02 14:00:00',nodeOrder:3,approvers:['James Wilson','Linda Chen'],status:'pending',priority:'Medium',completedAt:'-',decidedBy:'-',nodeApprovals:[],trail:[
      {node:{en:'Maker Review',zh:'Maker初审'},approver:'Maria Garcia',decision:'approved',time:'2026-11-02 14:20:00',remarks:'Product basics complete'},
      {node:{en:'Compliance Review',zh:'合规复核'},approver:'Robert Taylor',decision:'approved',time:'2026-11-02 16:05:00',remarks:'Risk disclosure v3 attached'}
    ]},
    {id:'APR-004',flow:'AF-ISSU',ref:'R-UST-2026-004',applicant:'Maria Garcia',submittedAt:'2026-10-27 10:00:00',nodeOrder:2,approvers:['Robert Taylor'],status:'rejected',priority:'Medium',completedAt:'2026-10-28 11:00:00',decidedBy:'Robert Taylor',nodeApprovals:[],trail:[
      {node:{en:'Maker Review',zh:'Maker初审'},approver:'Maria Garcia',decision:'approved',time:'2026-10-27 10:30:00',remarks:'OK'},
      {node:{en:'Compliance Review',zh:'合规复核'},approver:'Robert Taylor',decision:'rejected',time:'2026-10-28 11:00:00',remarks:'Risk disclosure version outdated'}
    ]},
    {id:'APR-005',flow:'AF-ISSU',ref:'R-UST-2026-018',applicant:'Linda Chen',submittedAt:'2026-10-30 09:20:00',nodeOrder:2,approvers:['Robert Taylor'],status:'returned',priority:'Medium',completedAt:'2026-10-30 15:40:00',decidedBy:'Robert Taylor',nodeApprovals:[],trail:[
      {node:{en:'Maker Review',zh:'Maker初审'},approver:'Maria Garcia',decision:'approved',time:'2026-10-30 10:00:00',remarks:'OK'},
      {node:{en:'Compliance Review',zh:'合规复核'},approver:'Robert Taylor',decision:'returned',time:'2026-10-30 15:40:00',remarks:'Underlying CUSIP does not match the term sheet; returned to the initiator'}
    ]}
  ],
};

/* ====== Permission Catalog & Roles ====== */
TB.data.permCatalog = {
  member: [
    { group:{zh:'产品市场',en:'Product Market'}, items:[
      {key:'market.view', label:{zh:'查看产品与报价',en:'View products & quotes'}},
      {key:'market.buy', label:{zh:'购买',en:'Purchase'}},
      {key:'market.book', label:{zh:'Book Ahead 预定',en:'Book ahead'}},
    ]},
    { group:{zh:'持仓与钱包',en:'Holdings & Wallet'}, items:[
      {key:'holdings.view', label:{zh:'查看持仓与估值',en:'View holdings & valuation'}},
      {key:'wallet.view', label:{zh:'查看钱包余额',en:'View wallet balance'}},
      {key:'wallet.deposit', label:{zh:'充值',en:'Deposit'}},
      {key:'wallet.withdraw', label:{zh:'提现',en:'Withdraw'}},
    ]},
    { group:{zh:'机构管理',en:'Organization'}, items:[
      {key:'accounts.manage', label:{zh:'子账号管理',en:'Manage sub-accounts'}},
      {key:'accounts.perm', label:{zh:'权限分配',en:'Assign permissions'}},
      {key:'compliance.view', label:{zh:'合规与安全',en:'Compliance & security'}},
      {key:'notif.manage', label:{zh:'通知管理',en:'Manage notifications'}},
    ]},
  ],
  issuer: [
    { group:{zh:'R-UST 管理',en:'R-UST Management'}, items:[
      {key:'series.view', label:{zh:'查看 Series',en:'View series'}},
      {key:'series.issue', label:{zh:'产品发行（新建/暂存/提交）',en:'Issue product (create / draft / submit)'}},
      {key:'series.control', label:{zh:'上架 / 停止购买',en:'Open / stop purchase'}},
      {key:'quotes.view', label:{zh:'查看报价',en:'View quotes'}},
      {key:'quotes.sync', label:{zh:'同步刷新报价',en:'Sync quotes'}},
      {key:'positions.view', label:{zh:'持仓监控',en:'Position monitor'}},
    ]},
    { group:{zh:'销毁与对账',en:'Burn & Reconciliation'}, items:[
      {key:'burn.apply', label:{zh:'销毁申请',en:'Burn apply'}},
      {key:'burn.review', label:{zh:'销毁审核',en:'Burn review'}},
      {key:'recon.view', label:{zh:'对账查看',en:'View reconciliation'}},
      {key:'recon.handle', label:{zh:'对账差异处理',en:'Resolve reconciliation breaks'}},
    ]},
    { group:{zh:'审核',en:'Review'}, items:[
      {key:'review.handle', label:{zh:'审核中心处理',en:'Handle review tasks'}},
      {key:'review.config', label:{zh:'审核流程配置',en:'Configure review flows'}},
    ]},
    { group:{zh:'资金与机构',en:'Treasury & Organization'}, items:[
      {key:'emt.view', label:{zh:'EMT 管理查看',en:'View EMT reserve'}},
      {key:'accounts.manage', label:{zh:'账号管理',en:'Manage accounts'}},
      {key:'accounts.perm', label:{zh:'权限分配',en:'Assign permissions'}},
    ]},
  ],
  ops: [
    { group:{zh:'运营管理',en:'Operations'}, items:[
      {key:'ops.dashboard', label:{zh:'运营看板',en:'Dashboard'}},
      {key:'ops.members', label:{zh:'成员管理（机构基本信息与账号）',en:'Member management (org info & accounts)'}},
      {key:'ops.seriesReview', label:{zh:'Series审核',en:'Series review'}},
      {key:'ops.monitor', label:{zh:'产品监控',en:'Product monitoring'}},
      {key:'ops.capacity', label:{zh:'容量/库存',en:'Capacity / inventory'}},
      {key:'ops.quotes', label:{zh:'报价监控',en:'Quote monitor'}},
    ]},
    { group:{zh:'系统管理',en:'System'}, items:[
      {key:'ops.accounts', label:{zh:'平台账号（运营内部）',en:'Platform accounts (internal ops)'}},
      {key:'ops.roles', label:{zh:'角色权限与运营端功能权限配置',en:'Roles & ops permission configuration'}},
      {key:'ops.flowConfig', label:{zh:'审核流程节点配置',en:'Approval flow node config'}},
      {key:'ops.params', label:{zh:'系统参数',en:'System parameters'}},
      {key:'ops.audit', label:{zh:'审计日志',en:'Audit log'}},
      {key:'ops.announce', label:{zh:'公告管理',en:'Announcements'}},
    ]},
  ],
};
/* 平台默认角色：分端设置，成员/发行端 Admin 默认持有各自门户全量功能，
 * 运营端 Admin 持有运营端全量功能并负责运营端功能权限配置，系统运维仅持系统管理类功能。 */
TB.data.platformRoles = [
  {id:'ops_admin', portal:'ops', name:{zh:'运营端 Admin',en:'Ops Admin'}, desc:{zh:'运营端全部功能，并可配置运营端功能权限',en:'All ops functions; configures ops permissions'}, grants:{ops:'all'}},
  {id:'member_admin', portal:'member', fixed:true, name:{zh:'成员机构端 Admin',en:'Member Admin'}, desc:{zh:'成员机构端全部页面功能',en:'All member-portal functions'}, grants:{member:'all'}},
  {id:'issuer_admin', portal:'issuer', fixed:true, name:{zh:'发行方端 Admin',en:'Issuer Admin'}, desc:{zh:'发行方端全部页面功能',en:'All issuer-portal functions'}, grants:{issuer:'all'}},
  {id:'sys_ops', portal:'ops', name:{zh:'系统运维',en:'System Operations'}, desc:{zh:'运营端系统管理类功能',en:'Ops system-management functions'}, grants:{ops:['ops.accounts','ops.roles','ops.params','ops.audit','ops.monitor','ops.announce']}},
];
TB.data.roles = {
  member: [
    {id:'Admin', name:{zh:'管理员',en:'Admin'}, perms:'all'},
    {id:'Trader', name:{zh:'交易员',en:'Trader'}, perms:['market.view','market.buy','market.book','holdings.view','wallet.view','wallet.deposit','notif.manage']},
    {id:'Viewer', name:{zh:'只读',en:'Viewer'}, perms:['market.view','holdings.view','wallet.view']},
  ],
  issuer: [
    {id:'Admin', name:{zh:'管理员',en:'Admin'}, perms:'all'},
    {id:'Officer', name:{zh:'业务经办',en:'Officer'}, perms:['series.view','series.issue','quotes.view','quotes.sync','positions.view','burn.apply','recon.view','emt.view']},
    {id:'Compliance', name:{zh:'合规',en:'Compliance'}, perms:['series.view','review.handle','review.config','recon.view','recon.handle']},
    {id:'Treasury', name:{zh:'资金',en:'Treasury'}, perms:['series.view','quotes.view','quotes.sync','positions.view','emt.view','recon.view']},
    {id:'Viewer', name:{zh:'只读',en:'Viewer'}, perms:['series.view','quotes.view','positions.view','recon.view','emt.view']},
  ],
};
TB.utils.allPermKeys = function(portal){
  var keys = [];
  (TB.data.permCatalog[portal] || []).forEach(function(g){ g.items.forEach(function(i){ keys.push(i.key); }); });
  return keys;
};
TB.utils.rolePerms = function(portal, roleId){
  var role = (TB.data.roles[portal] || []).find(function(r){ return r.id === roleId; });
  if(!role) return [];
  return role.perms === 'all' ? TB.utils.allPermKeys(portal) : role.perms.slice();
};
TB.utils.setAccountRole = function(portal, id, roleId){
  var acc = TB.data.accounts.find(function(a){ return a.id === id; });
  if(!acc) return;
  acc.role = roleId;
  acc.perms = TB.utils.rolePerms(portal, roleId);
  TB.router.render();
};
TB.utils.toggleAccountPerm = function(portal, id, key, on){
  var acc = TB.data.accounts.find(function(a){ return a.id === id; });
  if(!acc) return;
  if(!acc.perms) acc.perms = TB.utils.rolePerms(portal, acc.role);
  var i = acc.perms.indexOf(key);
  if(on && i < 0) acc.perms.push(key);
  if(!on && i >= 0) acc.perms.splice(i, 1);
};
TB.utils.resetAccountPerms = function(portal, id){
  var acc = TB.data.accounts.find(function(a){ return a.id === id; });
  if(!acc) return;
  acc.perms = TB.utils.rolePerms(portal, acc.role);
  TB.router.render();
};
TB.utils.saveAccountPerms = function(){
  TB.utils.toast(TB.t('msg.saveSuccess'), 'success');
};

/* ====== Navigation Configs ====== */
TB.nav = {
  member: [
    { group:null, items:[
      { label:'nav.dashboard', icon:'dashboard', route:'#/dashboard' },
      { label:'nav.market', icon:'market', route:'#/market' },
      { label:'nav.holdings', icon:'holdings', route:'#/holdings' },
      { label:'nav.wallet', icon:'wallet', route:'#/wallet' },
      { label:{en:'Account & Security',zh:'账户与安全'}, icon:'account', route:'#/account-security' },
    ]},
  ],
  issuer: [
    { group:null, items:[
      { label:'nav.dashboard', icon:'dashboard', route:'#/dashboard' },
    ]},
    { group:'grp.rustMgmt', items:[
      { label:'nav.series', icon:'series', route:'#/series' },
      { label:'nav.positionMonitor', icon:'positions', route:'#/positions' },
      { label:'nav.quotes', icon:'quotes', route:'#/quotes' },
      { label:'nav.burn', icon:'burn', route:'#/burn' },
    ]},
    { group:'grp.reviewMgmt', items:[
      { label:'nav.reviewCenter', icon:'queue', route:'#/review-center' },
      { label:'nav.approvalConfig', icon:'settings', route:'#/approvals/flows' },
    ]},
    { group:null, items:[
      { label:'nav.reconciliation', icon:'reconcile', route:'#/reconciliation' },
      { label:'nav.emtMgmt', icon:'wallet', route:'#/emt' },
      { label:'nav.issuerAccounts', icon:'account', route:'#/accounts' },
      { label:'nav.issuerNotif', icon:'notification', route:'#/notifications' },
    ]},
  ],
  ops: [
    { group:null, items:[
      { label:'nav.opsDashboard', icon:'dashboard', route:'#/dashboard' },
    ]},
    { group:null, items:[
      { label:'nav.members', icon:'members', route:'#/members' },
    ]},
    { group:'grp.reviewMgmt', items:[
      { label:'nav.seriesReview', icon:'review', route:'#/series-review' },
    ]},
    { group:'grp.opsMgmt', items:[
      { label:'nav.capacity', icon:'positions', route:'#/capacity' },
      { label:'nav.quoteMonitor', icon:'quotes', route:'#/quote-monitor' },
      { label:'nav.checkoutMaturity', icon:'rotate', route:'#/product-monitor' },
    ]},
    { group:'grp.sysMgmt', items:[
      { label:'nav.platformAccounts', icon:'account', route:'#/accounts' },
      { label:'nav.roles', icon:'roles', route:'#/roles' },
      { label:'nav.auditConfig', icon:'settings', route:'#/audit-config' },
      { label:'nav.systemParams', icon:'settings', route:'#/system-params' },
      { label:'nav.auditLog', icon:'logs', route:'#/audit-log' },
    ]},
    { group:'grp.announce', items:[
      { label:'nav.announcements', icon:'megaphone', route:'#/announcements' },
    ]},
  ],
};

/* ====== UI Components ====== */
TB.ui = {
  statCard: function(label, value, change, changeType, extra){
    var ch = change ? '<div class="stat-card-change '+(changeType||'up')+'">'+change+'</div>' : '';
    var ex = extra ? '<div class="text-sm text-muted mt-2">'+extra+'</div>' : '';
    return '<div class="stat-card"><div class="stat-card-label">'+label+'</div><div class="stat-card-value">'+value+'</div>'+ch+ex+'</div>';
  },

  table: function(cfg){
    var cols = cfg.columns || [];
    var data = cfg.data || [];
    var paginate = cfg.paginate !== false && (cfg.pagination || TB.state.portal === 'issuer' || TB.state.portal === 'ops');
    var pageSize = (cfg.pagination && cfg.pagination.pageSize) || 10;
    var key = TB.state.route + '|t' + (TB.state._tableSeq++);
    var pages = Math.max(1, Math.ceil(data.length / pageSize));
    var page = Math.min(TB.state.tablePages[key] || 1, pages);
    var view = (paginate && data.length > pageSize) ? data.slice((page - 1) * pageSize, page * pageSize) : data;
    var html = '<div class="table-wrap"><table class="data-table"><thead><tr>';
    cols.forEach(function(c){
      html += '<th'+(c.width?' style="width:'+c.width+'"':'')+'>'+c.label+'</th>';
    });
    if(cfg.actions) html += '<th class="col-actions">'+TB.t('actions')+'</th>';
    html += '</tr></thead><tbody>';
    if(view.length === 0){
      html += '<tr><td colspan="'+(cols.length+(cfg.actions?1:0))+'" class="text-center text-muted" style="padding:24px">'+TB.t('noData')+'</td></tr>';
    } else {
      view.forEach(function(row){
        var cls = cfg.rowClick ? ' class="row-link"' : '';
        html += '<tr'+cls+'>';
        cols.forEach(function(c){
          var val = row[c.key];
          if(c.render) val = c.render(row);
          else if(typeof val === 'string' && (TB.DATETIME_RE.test(val) || TB.DATE_RE.test(val))) val = TB.utils.dt(val);
          html += '<td'+(c.align?' style="text-align:'+c.align+'"':'')+'>'+(val==null?'-':val)+'</td>';
        });
        if(cfg.actions){
          html += '<td class="col-actions">';
          cfg.actions.forEach(function(a){
            if(a.type === 'danger')
              html += '<button class="btn btn-sm btn-danger" onclick="'+a.onClick+'(\''+row.id+'\')">'+a.label+'</button> ';
            else if(a.type === 'text')
              html += '<span class="tag-link" onclick="'+a.onClick+'(\''+row.id+'\')">'+a.label+'</span> ';
            else
              html += '<button class="btn btn-sm" onclick="'+a.onClick+'(\''+row.id+'\')">'+a.label+'</button> ';
          });
          html += '</td>';
        }
        html += '</tr>';
      });
    }
    html += '</tbody></table></div>';
    if(paginate){
      html += TB.ui.pagination({total: data.length, pageSize: pageSize, current: page, key: key});
    }
    return html;
  },

  filterBar: function(cfg){
    var html = '<div class="filter-bar">';
    (cfg.fields||[]).forEach(function(f){
      html += '<div class="form-group" style="min-width:'+(f.width||160)+'px">';
      html += '<label class="form-label text-sm">'+f.label+'</label>';
      if(f.type === 'select'){
        html += '<select class="form-select" id="filter_'+f.name+'">';
        (f.options||[]).forEach(function(o){ html += '<option value="'+o.value+'">'+o.label+'</option>'; });
        html += '</select>';
      } else if(f.type === 'date'){
        html += '<input type="date" class="form-input" id="filter_'+f.name+'">';
      } else {
        html += '<input type="text" class="form-input" id="filter_'+f.name+'" placeholder="'+(f.placeholder||'')+'">';
      }
      html += '</div>';
    });
    html += '<div class="filter-actions">';
    html += '<button class="btn btn-sm" onclick="TB.utils.toast(\'Filtering...\")">'+TB.t('search')+'</button>';
    html += '<button class="btn btn-sm" onclick="TB.utils.toast(\'Reset\')">'+TB.t('reset')+'</button>';
    if(cfg.exportBtn) html += '<button class="btn btn-sm" onclick="TB.utils.toast(\'Exporting...\')">'+TB.t('export')+'</button>';
    html += '</div></div>';
    return html;
  },

  tabs: function(cfg){
    var html = '<div class="tabs">';
    (cfg.items||[]).forEach(function(t,i){
      html += '<div class="tab-item'+(t.active?' active':'')+'" onclick="TB.ui.switchTab(this,\''+t.key+'\')">'+t.label+'</div>';
    });
    html += '</div>';
    (cfg.items||[]).forEach(function(t){
      html += '<div class="tab-content'+(t.active?' active':'')+'" id="tab_'+t.key+'">'+(cfg.content[t.key]||'')+'</div>';
    });
    return html;
  },

  switchTab: function(el, key){
    var container = el.parentNode;
    var tabs = container.querySelectorAll('.tab-item');
    tabs.forEach(function(t){ t.classList.remove('active'); });
    el.classList.add('active');
    var contents = container.parentNode.querySelectorAll('.tab-content');
    contents.forEach(function(c){ c.classList.remove('active'); });
    var target = document.getElementById('tab_'+key);
    if(target) target.classList.add('active');
  },

  modal: function(cfg){
    var sizeClass = cfg.size === 'lg' ? ' modal-lg' : (cfg.size === 'sm' ? ' modal-sm' : '');
    var html = '<div class="modal-overlay" id="modal_overlay" onclick="if(event.target===this)TB.ui.closeModal()">';
    html += '<div class="modal'+sizeClass+'">';
    html += '<div class="modal-header"><span class="modal-title">'+cfg.title+'</span><button class="modal-close" onclick="TB.ui.closeModal()">&times;</button></div>';
    html += '<div class="modal-body">'+cfg.body+'</div>';
    if(cfg.footer){
      html += '<div class="modal-footer">'+cfg.footer+'</div>';
    }
    html += '</div></div>';
    document.getElementById('modal-container').innerHTML = html;
  },

  closeModal: function(){
    document.getElementById('modal-container').innerHTML = '';
  },

  drawer: function(cfg){
    var width = cfg.width || 680;
    var html = '<div class="drawer-overlay" onclick="if(event.target===this)TB.ui.closeModal()">';
    html += '<div class="drawer" style="width:'+width+'px">';
    html += '<div class="drawer-header"><span class="drawer-title">'+cfg.title+'</span><button class="modal-close" onclick="TB.ui.closeModal()">&times;</button></div>';
    html += '<div class="drawer-body">'+cfg.body+'</div>';
    if(cfg.footer) html += '<div class="drawer-footer">'+cfg.footer+'</div>';
    html += '</div></div>';
    document.getElementById('modal-container').innerHTML = html;
  },

  confirmModal: function(title, message, onConfirm, confirmType){
    var btnClass = confirmType === 'danger' ? 'btn-danger' : 'btn-primary';
    var btnLabel = confirmType === 'danger' ? TB.t('confirm') : TB.t('confirm');
    TB.ui.modal({
      title: title,
      body: '<p>'+message+'</p>',
      footer: '<button class="btn" onclick="TB.ui.closeModal()">'+TB.t('cancel')+'</button><button class="btn '+btnClass+'" onclick="TB.ui.closeModal();('+onConfirm+')()">'+btnLabel+'</button>',
      size: 'sm'
    });
  },

  formField: function(cfg){
    var html = '<div class="form-group">';
    html += '<label class="form-label">'+cfg.label+(cfg.required?' <span class="req">*</span>':'')+'</label>';
    if(cfg.type === 'select'){
      html += '<select class="form-select" id="'+cfg.name+'"'+(cfg.disabled?' disabled':'')+'>';
      (cfg.options||[]).forEach(function(o){ html += '<option value="'+o.value+'"'+(o.selected?' selected':'')+'>'+o.label+'</option>'; });
      html += '</select>';
    } else if(cfg.type === 'textarea'){
      html += '<textarea class="form-textarea" id="'+cfg.name+'" placeholder="'+(cfg.placeholder||'')+'">'+(cfg.value||'')+'</textarea>';
    } else if(cfg.type === 'checkbox'){
      html += '<label class="form-checkbox"><input type="checkbox" id="'+cfg.name+'"'+(cfg.checked?' checked':'')+'>'+(cfg.checkboxLabel||cfg.label)+'</label>';
    } else if(cfg.type === 'checkbox-group'){
      html += '<div class="checkbox-group" id="'+cfg.name+'">';
      (cfg.options||[]).forEach(function(o){
        html += '<label class="form-checkbox"><input type="checkbox" value="'+o.value+'"'+(o.checked?' checked':'')+'>'+o.label+'</label>';
      });
      html += '</div>';
    } else {
      var itype = cfg.type || 'text';
      var ival = cfg.value || '';
      var iph = cfg.placeholder || '';
      var idis = cfg.disabled ? ' disabled' : '';
      html += '<input type="'+itype+'" class="form-input" id="'+cfg.name+'" value="'+ival+'" placeholder="'+iph+'"'+idis+'>';
    }
    if(cfg.hint) html += '<div class="form-hint">'+cfg.hint+'</div>';
    html += '</div>';
    return html;
  },

  wizard: function(cfg){
    var html = '<div class="wizard-steps">';
    (cfg.steps||[]).forEach(function(s,i){
      var cls = i < cfg.current ? 'completed' : (i === cfg.current ? 'active' : '');
      html += '<div class="wizard-step '+cls+'"><div class="wizard-step-dot">'+(i<cfg.current?'✓':(i+1))+'</div><div class="wizard-step-label">'+s.label+'</div></div>';
    });
    html += '</div>';
    html += '<div class="wizard-content">'+cfg.content+'</div>';
    html += '<div class="wizard-footer">';
    if(cfg.current > 0) html += '<button class="btn" onclick="'+(cfg.onPrev||'history.back()')+'">'+TB.t('previous')+'</button>';
    else html += '<div></div>';
    if(cfg.current < (cfg.steps||[]).length - 1){
      html += '<button class="btn btn-primary" onclick="'+(cfg.onNext||'')+'">'+TB.t('next')+'</button>';
    } else {
      html += '<button class="btn btn-primary" onclick="'+(cfg.onFinish||'')+'">'+TB.t('complete')+'</button>';
    }
    html += '</div>';
    return html;
  },

  timeline: function(items){
    var html = '<div class="timeline">';
    (items||[]).forEach(function(t){
      html += '<div class="timeline-item '+t.status+'">';
      html += '<div class="timeline-time">'+TB.utils.dt(t.time)+'</div>';
      html += '<div class="timeline-title">'+t.title+'</div>';
      if(t.desc) html += '<div class="timeline-desc">'+t.desc+'</div>';
      html += '</div>';
    });
    html += '</div>';
    return html;
  },

  stepIndicator: function(steps){
    var html = '<div class="step-indicator">';
    (steps||[]).forEach(function(s,i){
      if(i > 0){
        html += '<div class="step-ind-line '+(s.status==='done'?'done':'')+'"></div>';
      }
      var icon = s.status === 'done' ? '✓' : (i+1);
      html += '<div class="step-ind-item"><div class="step-ind-dot '+s.status+'">'+icon+'</div><span class="step-ind-label '+s.status+'">'+s.label+'</span></div>';
    });
    html += '</div>';
    return html;
  },

  badge: function(text, type){
    return '<span class="badge badge-'+(type||'default')+'">'+text+'</span>';
  },

  statusBadge: function(status){
    var map = {
      'draft':'default','pending':'orange','active':'success','suspended':'warning','completed':'success','failed':'error',
      'open':'success','closed':'warning','approved':'success','rejected':'error','minting':'info','minted':'info','approving':'orange',
      'maturity':'info','checkout':'purple','burned':'default','settled':'success','frozen':'warning','cancelled':'default',
      'checkoutCompleted':'success','checkoutPending':'info','maturityPaid':'success','pendingActivation':'default',
      'deactivated':'error','bookingConfirmed':'success','depositTaken':'info','pendingSettlement':'info','valid':'success',
      'expired':'error','matched':'success','break':'error','resolved':'success','processing':'info','resolved':'success','processed':'default',
    };
    var key = 'st.'+status;
    var label = TB.i18n[key] ? TB.t(key) : TB.utils.enumLabel(status);
    return TB.ui.badge(label, map[status] || 'default');
  },

  emptyState: function(icon, text){
    return '<div class="empty-state"><div class="empty-state-icon">'+(icon||'📭')+'</div><div class="empty-state-text">'+(text||TB.t('noData'))+'</div></div>';
  },

  pagination: function(cfg){
    var total = cfg.total || 0, ps = cfg.pageSize || 10, cur = cfg.current || 1;
    var pages = Math.max(1, Math.ceil(total / ps));
    var html = '<div class="pagination"><span class="pagination-info">'+TB.t('total')+' '+total+' '+TB.t('items');
    if(pages > 1) html += ' · '+cur+' / '+pages;
    html += '</span>';
    if(pages > 1){
      var btn = function(p, label, disabled){
        return '<button class="page-btn'+(p === cur ? ' active' : '')+'"'+(disabled ? ' disabled' : '')+' onclick="TB.utils.setTablePage(\''+cfg.key+'\','+p+')">'+label+'</button>';
      };
      html += btn(cur - 1, '‹', cur <= 1);
      var start = Math.max(1, Math.min(cur - 2, pages - 4));
      var end = Math.min(pages, start + 4);
      for(var i = start; i <= end; i++) html += btn(i, i, false);
      html += btn(cur + 1, '›', cur >= pages);
    }
    html += '</div>';
    return html;
  },

  alert: function(type, message){
    return '<div class="alert alert-'+type+'">'+message+'</div>';
  },

  descList: function(items){
    var html = '<dl class="desc-list">';
    (items||[]).forEach(function(it){
      var v = (typeof it.value === 'string' && (TB.DATETIME_RE.test(it.value) || TB.DATE_RE.test(it.value))) ? TB.utils.dt(it.value) : it.value;
      html += '<dt>'+it.label+'</dt><dd>'+v+'</dd>';
    });
    html += '</dl>';
    return html;
  },

  card: function(title, body, actions){
    /* 产品口径：成员机构端不展示卡片小标题 */
    if(TB.state.portal === 'member') title = null;
    var html = '<div class="card">';
    if(title){
      html += '<div class="card-header"><span class="card-title">'+title+'</span>';
      if(actions) html += '<div>'+actions+'</div>';
      html += '</div>';
    }
    html += '<div class="card-body">'+body+'</div></div>';
    return html;
  },

  progress: function(percent){
    return '<div class="progress"><div class="progress-bar" style="width:'+percent+'%"></div></div>';
  },
};

TB.ui.permPage = function(portal, acc){
  var t = function(zh, en){ return TB.state.lang === 'zh' ? zh : en; };
  var catalog = TB.data.permCatalog[portal];
  var roles = TB.data.roles[portal];
  if(!acc.perms) acc.perms = TB.utils.rolePerms(portal, acc.role);
  var html = TB.utils.contentHeader(t('权限管理','Permission Management') + ' · ' + acc.name);
  html += TB.ui.card(null, TB.ui.descList([
    {label:t('账号','Account'), value:TB.utils.esc(acc.name) + ' · ' + TB.utils.esc(acc.email)},
    {label:t('所属机构','Organization'), value:TB.utils.esc(acc.org)},
    {label:t('角色','Role'), value:'<select class="form-select" style="max-width:220px;display:inline-block" onchange="TB.utils.setAccountRole(\''+portal+'\',\''+acc.id+'\',this.value)">'+roles.map(function(r){ return '<option value="'+r.id+'"'+(acc.role === r.id ? ' selected' : '')+'>'+TB.text(r.name)+'</option>'; }).join('')+'</select>'},
    {label:t('已授权限','Granted'), value:acc.perms.length + ' / ' + TB.utils.allPermKeys(portal).length}
  ]));
  catalog.forEach(function(g){
    var body = '<div class="perm-grid">';
    g.items.forEach(function(it){
      var checked = acc.perms.indexOf(it.key) >= 0;
      body += '<label class="form-checkbox perm-item"><input type="checkbox"'+(checked ? ' checked' : '')+' onchange="TB.utils.toggleAccountPerm(\''+portal+'\',\''+acc.id+'\',\''+it.key+'\',this.checked)"><span>'+TB.text(it.label)+'</span></label>';
    });
    body += '</div>';
    html += '<div class="section-head">'+TB.text(g.group)+'</div>' + TB.ui.card(null, body);
  });
  html += '<div class="flex gap-2"><button class="btn btn-primary" onclick="TB.utils.saveAccountPerms()">'+TB.t('save')+'</button>'
    + '<button class="btn" onclick="TB.utils.resetAccountPerms(\''+portal+'\',\''+acc.id+'\')">'+t('恢复角色默认','Reset to Role Default')+'</button></div>';
  return html;
};

/* ====== Utility Methods ====== */
TB.utils.toast = function(msg, type){
  var el = document.createElement('div');
  el.className = 'toast '+(type ? 'toast-'+type : 'toast-info');
  el.textContent = msg;
  document.getElementById('toast-container').appendChild(el);
  setTimeout(function(){ el.remove(); }, 3000);
};

TB.utils.getInputVal = function(id){
  var el = document.getElementById(id);
  if(!el) return '';
  return el.value;
};

TB.utils.setTablePage = function(key, page){
  TB.state.tablePages[key] = Math.max(1, page);
  TB.router.render();
};

TB.utils.goBack = function(){
  var h = TB.state.routeHistory;
  if(!h.length) return;
  TB.state._backing = true;
  TB.router.navigate(h.pop());
};

/* 字段级注解：在字段名后加 ⓘ 提示，替代页面顶部的解释横幅 */
TB.utils.note = function(text){ return ' <span class="tooltip-icon" title="'+TB.utils.esc(text)+'">ⓘ</span>'; };

/* 交易日历口径：周末与美债市场休市日不可交易 */
TB.NON_TRADING = ['2026-11-11', '2026-11-26', '2026-12-25', '2027-01-01', '2027-01-18', '2027-02-15'];
TB.utils.isTradingDay = function(str){
  if(!str) return false;
  var d = new Date(str + 'T00:00:00');
  if(isNaN(d.getTime())) return false;
  var dow = d.getDay();
  if(dow === 0 || dow === 6) return false;
  return TB.NON_TRADING.indexOf(str) < 0;
};
TB.utils.fmtDate = function(d){
  function p(n){ return (n < 10 ? '0' : '') + n; }
  return d.getFullYear()+'-'+p(d.getMonth()+1)+'-'+p(d.getDate());
};
TB.utils.todayStr = function(){ return TB.utils.fmtDate(new Date()); };
TB.utils.nextTradingDay = function(fromStr){
  var d = new Date((fromStr || TB.utils.todayStr()) + 'T00:00:00');
  for(var i = 0; i < 14; i++){
    var s = TB.utils.fmtDate(d);
    if(TB.utils.isTradingDay(s)) return s;
    d.setDate(d.getDate() + 1);
  }
  return TB.utils.fmtDate(d);
};
TB.utils.prevTradingDay = function(fromStr){
  var d = new Date((fromStr || TB.utils.todayStr()) + 'T00:00:00');
  for(var i = 0; i < 14; i++){
    var s = TB.utils.fmtDate(d);
    if(TB.utils.isTradingDay(s)) return s;
    d.setDate(d.getDate() - 1);
  }
  return TB.utils.fmtDate(d);
};
/* 从某日期往前数 n 个交易日 */
TB.utils.minusTradingDays = function(dateStr, n){
  var d = new Date(dateStr + 'T00:00:00');
  var c = 0;
  while(c < n){
    d.setDate(d.getDate() - 1);
    if(TB.utils.isTradingDay(TB.utils.fmtDate(d))) c++;
  }
  return TB.utils.fmtDate(d);
};
/* 默认交易日：今天若非交易日则顺延到下一个交易日 */
TB.utils.defaultTradingDay = function(){ return TB.utils.nextTradingDay(); };

/* ====== Date Picker (非交易日置灰) ====== */
TB.ui._dp = {};
TB.ui.datePicker = function(cfg){
  return '<div class="dp-wrap">'
    + '<input type="text" class="form-input" id="'+cfg.id+'" readonly value="'+(cfg.value || '')+'" placeholder="YYYY-MM-DD" onclick="TB.ui.openDatePicker(\''+cfg.id+'\')">'
    + '<span class="dp-cal" onclick="TB.ui.openDatePicker(\''+cfg.id+'\')">📅</span>'
    + '<div class="dp-pop" id="dp_pop_'+cfg.id+'"></div>'
    + '</div>';
};
TB.ui.openDatePicker = function(id){
  var pop = document.getElementById('dp_pop_' + id);
  if(!pop) return;
  if(pop.classList.contains('show')){ pop.classList.remove('show'); return; }
  var input = document.getElementById(id);
  var cur = input ? input.value : '';
  var base = TB.utils.isTradingDay(cur) ? cur : TB.utils.defaultTradingDay();
  var d = new Date(base + 'T00:00:00');
  TB.ui._dp[id] = { y:d.getFullYear(), m:d.getMonth() };
  TB.ui._renderDp(id);
  pop.classList.add('show');
};
TB.ui.dpNav = function(id, delta){
  var st = TB.ui._dp[id];
  if(!st) return;
  st.m += delta;
  if(st.m < 0){ st.m = 11; st.y--; }
  if(st.m > 11){ st.m = 0; st.y++; }
  TB.ui._renderDp(id);
};
TB.ui._renderDp = function(id){
  var st = TB.ui._dp[id];
  var pop = document.getElementById('dp_pop_' + id);
  var input = document.getElementById(id);
  if(!st || !pop) return;
  var sel = input ? input.value : '';
  var days = new Date(st.y, st.m + 1, 0).getDate();
  var startDow = (new Date(st.y, st.m, 1).getDay() + 6) % 7;
  var heads = TB.state.lang === 'zh' ? ['一','二','三','四','五','六','日'] : ['Mo','Tu','We','Th','Fr','Sa','Su'];
  var html = '<div class="dp-head"><span class="dp-nav" onclick="TB.ui.dpNav(\''+id+'\',-1)">‹</span><span>'+st.y+'-'+String(st.m+1).padStart(2,'0')+'</span><span class="dp-nav" onclick="TB.ui.dpNav(\''+id+'\',1)">›</span></div><div class="dp-grid">';
  heads.forEach(function(h){ html += '<span class="dp-dow">'+h+'</span>'; });
  for(var i = 0; i < startDow; i++) html += '<span></span>';
  for(var d = 1; d <= days; d++){
    var ds = st.y+'-'+String(st.m+1).padStart(2,'0')+'-'+String(d).padStart(2,'0');
    var off = !TB.utils.isTradingDay(ds);
    var cls = 'dp-day'+(off ? ' off' : '')+(ds === sel ? ' sel' : '')+(ds === TB.utils.todayStr() ? ' today' : '');
    html += off ? '<span class="'+cls+'">'+d+'</span>' : '<span class="'+cls+'" onclick="TB.ui.dpPick(\''+id+'\',\''+ds+'\')">'+d+'</span>';
  }
  html += '</div>';
  pop.innerHTML = html;
};
TB.ui.dpPick = function(id, ds){
  var input = document.getElementById(id);
  if(input){
    input.value = ds;
    input.dispatchEvent(new Event('change'));
  }
  var pop = document.getElementById('dp_pop_' + id);
  if(pop) pop.classList.remove('show');
};

TB.utils.showLoading = function(){
  document.getElementById('main-content').innerHTML = '<div class="empty-state"><div class="empty-state-icon">⏳</div><div class="empty-state-text">'+TB.t('loading')+'</div></div>';
};

/* ====== Auth ====== */
TB.auth = {
  login: function(portal, userId){
    var user = TB.data.users.find(function(u){ return u.portal === portal && u.id === userId; });
    if(!user) user = TB.data.users.find(function(u){ return u.portal === portal; });
    if(user){
      TB.state.user = user;
      TB.state.portal = portal;
      TB.auth.showApp();
      var route = portal === 'member' ? '#/dashboard' : (portal === 'issuer' ? '#/dashboard' : '#/dashboard');
      TB.router.navigate(route);
    }
  },

  logout: function(){
    TB.state.user = null;
    TB.state.portal = '';
    document.getElementById('app-shell').style.display = 'none';
    TB.auth.showLogin();
  },

  showLogin: function(){
    var portal = TB.state.lang === 'zh' ? '选择入口' : 'Select Portal';
    var memberT = TB.t('portal.member'), issuerT = TB.t('portal.issuer'), opsT = TB.t('portal.ops');
    var loginT = TB.t('login'), pwdT = TB.state.lang === 'zh' ? '密码' : 'Password', twofaT = TB.state.lang === 'zh' ? '2FA验证码' : '2FA Code';
    var emailPh = TB.state.lang === 'zh' ? '请输入邮箱' : 'Enter email';
    var pwdPh = TB.state.lang === 'zh' ? '请输入密码' : 'Enter password';
    var twofaPh = TB.state.lang === 'zh' ? '请输入6位验证码' : '6-digit code';
    var demoNote = TB.state.lang === 'zh' ? '演示模式：选择入口后直接点击Login即可登录' : 'Demo mode: select a portal and click Login';

    document.getElementById('login-screen').innerHTML = '\
      <div class="login-shell">\
        <section class="login-hero">\
          <div class="login-hero-top">\
            <div class="login-logo">TokenBank</div>\
          </div>\
          <div>\
            <div class="login-hero-title">'+(TB.state.lang==='zh'?'面向成员、发行与运营的美债代币管理平台':'A tokenized R-UST platform for members, issuers, and operations')+'</div>\
            <div class="login-hero-desc">'+(TB.state.lang==='zh'?'R-UST 产品、发行、对账与销毁的一体化平台。':'An integrated platform for R-UST products, issuance, reconciliation and burn.')+'</div>\
          </div>\
          <div>\
            <div class="login-hero-footer">\
              '+TB.utils.langSelect('lang-select login-lang')+'\
              <button class="btn" onclick="TB.utils.toast(\''+(TB.state.lang==='zh'?'演示模式已启用':'Demo mode enabled')+'\',\'info\')">'+(TB.state.lang==='zh'?'查看演示说明':'Demo Info')+'</button>\
            </div>\
            <div class="login-hero-note">'+(TB.state.lang==='zh'?'适配桌面端与窄屏 Web 端，登录卡片将自动重排。':'Responsive for desktop and narrow web screens; the login layout adapts automatically.')+'</div>\
          </div>\
        </section>\
        <section class="login-card">\
          <div class="login-header">\
            <div class="login-form-title">'+(TB.state.lang==='zh'?'登录到 TokenBank':'Sign in to TokenBank')+'</div>\
            <div class="login-form-desc">'+(TB.state.lang==='zh'?'选择入口并登录，系统将按角色展示不同工作台。':'Choose a portal and sign in to open a role-specific workspace.')+'</div>\
          </div>\
          <div class="login-body">\
            <div class="login-tabs">\
              <div class="login-tab active" onclick="TB.auth.selectLoginPortal(\'member\',this)">'+memberT+'</div>\
              <div class="login-tab" onclick="TB.auth.selectLoginPortal(\'issuer\',this)">'+issuerT+'</div>\
              <div class="login-tab" onclick="TB.auth.selectLoginPortal(\'ops\',this)">'+opsT+'</div>\
            </div>\
            <div class="login-meta-row">\
              <span>'+portal+'</span>\
              <span>EN / 中文</span>\
            </div>\
            <div id="login-form">\
              <div class="form-group"><input type="text" class="form-input" id="login_email" placeholder="'+emailPh+'" value="john@alpha-fund.com"></div>\
              <div class="form-group"><input type="password" class="form-input" id="login_pwd" placeholder="'+pwdPh+'" value="demo1234"></div>\
              <div class="form-group"><input type="text" class="form-input" id="login_2fa" placeholder="'+twofaPh+'" value="123456" maxlength="6"></div>\
              <button class="btn btn-primary btn-block btn-lg" onclick="TB.auth.doLogin()">'+loginT+'</button>\
            </div>\
            <div style="text-align:center;margin-top:16px;font-size:12px;color:var(--text-muted)">'+demoNote+'</div>\
          </div>\
        </section>\
      </div>';
    TB.auth._loginPortal = 'member';
  },

  selectLoginPortal: function(portal, el){
    TB.auth._loginPortal = portal;
    var tabs = el.parentNode.querySelectorAll('.login-tab');
    tabs.forEach(function(t){ t.classList.remove('active'); });
    el.classList.add('active');
    var emailMap = { member:'john@alpha-fund.com', issuer:'jwilson@bisonbank.com', ops:'admin@tokenbank.io' };
    document.getElementById('login_email').value = emailMap[portal];
  },

  doLogin: function(){
    TB.auth.login(TB.auth._loginPortal || 'member');
  },

  showApp: function(){
    document.getElementById('login-screen').innerHTML = '';
    document.getElementById('app-shell').style.display = 'flex';
    TB.auth.renderShell();
  },

  forceLoginView: function(){
    TB.state.user = null;
    TB.state.portal = '';
    document.getElementById('app-shell').style.display = 'none';
    TB.auth.showLogin();
  },

  renderShell: function(){
    var u = TB.state.user;
    var portalName = TB.t('portal.'+TB.state.portal);
    var notifCount = TB.data.notifications.filter(function(n){return !n.read;}).length;
    var topNavHtml = '';
    if(TB.state.portal === 'member'){
      var memberNav = (TB.nav.member[0] && TB.nav.member[0].items) || [];
      topNavHtml = '<div class="topbar-nav">' + memberNav.map(function(item){
        var active = TB.state.route === item.route ? ' active' : '';
        return '<div class="topbar-nav-item'+active+'" onclick="TB.router.navigate(\''+item.route+'\')">'+TB.text(item.label)+'</div>';
      }).join('') + '</div>';
    }
    document.getElementById('topbar').innerHTML =
      '<span class="topbar-logo">TokenBank</span>'+
      '<span class="topbar-portal-name">'+portalName+'</span>'+
      topNavHtml+
      '<div class="topbar-right">'+
        TB.utils.langSelect('lang-select')+
        '<button class="topbar-icon-btn" onclick="TB.utils.toggleNotif(event)"><span class="ui-icon">'+TB.icon('notification')+'</span>'+(notifCount?'<span class="topbar-badge"></span>':'')+'</button>'+
        '<div class="topbar-user" onclick="TB.router.navigate(\'#/settings\')">'+
          '<div class="topbar-user-avatar">'+TB.utils.avatar(u.name)+'</div>'+
          '<span class="topbar-user-name">'+u.name+'</span>'+
        '</div>'+
        '<button class="btn btn-sm" onclick="TB.auth.logout()">'+TB.t('logout')+'</button>'+
      '</div>';
    TB.auth.renderSidebar();
  },

  renderSidebar: function(){
    var content = document.getElementById('main-content');
    if(TB.state.portal === 'member'){
      document.getElementById('sidebar').innerHTML = '';
      document.getElementById('sidebar').style.display = 'none';
      content.style.removeProperty('margin-left');
      content.style.removeProperty('width');
      content.classList.add('content-centered');
      return;
    }
    document.getElementById('sidebar').style.display = 'block';
    content.classList.remove('content-centered');
    content.style.marginLeft = 'var(--sidebar-w)';
    content.style.width = 'calc(100vw - var(--sidebar-w))';
    var nav = TB.nav[TB.state.portal] || [];
    var html = '';
    nav.forEach(function(g){
      if(g.group) html += '<div class="menu-group-title">'+TB.t(g.group)+'</div>';
      (g.items||[]).forEach(function(item){
        var active = TB.state.route === item.route ? ' active' : '';
        html += '<div class="menu-item'+active+'" onclick="TB.router.navigate(\''+item.route+'\')">'+
          '<span class="menu-item-icon">'+TB.icon(item.icon)+'</span>'+
          '<span>'+TB.text(item.label)+'</span></div>';
      });
    });
    document.getElementById('sidebar').innerHTML = html;
  },
};

/* ====== Router ====== */
TB.router = {
  routes: {},

  register: function(portal, routes){
    if(!TB.router.routes[portal]) TB.router.routes[portal] = {};
    for(var key in routes){
      TB.router.routes[portal][key] = routes[key];
    }
  },

  navigate: function(hash){
    window.location.hash = hash;
    TB.router.render();
  },

  render: function(){
    var hash = window.location.hash || '#/dashboard';
    var portal = TB.state.portal;
    if(!portal){
      TB.auth.showLogin();
      return;
    }
    // normalize route
    var route = hash.replace(/^#/, '');
    var prevRoute = TB.state.route;
    if(!TB.state._backing && prevRoute && prevRoute !== hash){
      TB.state.routeHistory.push(prevRoute);
      if(TB.state.routeHistory.length > 30) TB.state.routeHistory.shift();
    }
    TB.state._backing = false;
    TB.state.route = hash;

    // find matching route handler
    var routes = TB.router.routes[portal] || {};
    var handler = null;
    var params = {};

    // try exact match first
    if(routes[route]){
      handler = routes[route];
    } else {
      // try pattern match (e.g., /market/:productId)
      for(var pattern in routes){
        if(pattern.indexOf(':') === -1) continue;
        var regex = new RegExp('^' + pattern.replace(/:[^/]+/g, '([^/]+)') + '$');
        var match = route.match(regex);
        if(match){
          handler = routes[pattern];
          var paramNames = (pattern.match(/:[^/]+/g) || []).map(function(p){ return p.substring(1); });
          paramNames.forEach(function(name, i){
            params[name] = decodeURIComponent(match[i+1]);
          });
          break;
        }
      }
    }

    // update sidebar active state
    TB.auth.renderSidebar();
    if(prevRoute !== hash) TB.ui.closeModal();

    // render page
    var content = document.getElementById('main-content');
    TB.state._tableSeq = 0;
    if(handler){
      try {
        content.innerHTML = handler(params);
        if(TB.state.portal === 'member' && hash !== '#/dashboard' && TB.state.routeHistory.length){
          var bar = document.createElement('div');
          bar.className = 'member-back';
          bar.innerHTML = '<button class="btn btn-sm" onclick="TB.utils.goBack()">‹ '+(TB.state.lang === 'zh' ? '返回' : 'Back')+'</button>';
          content.insertBefore(bar, content.firstChild);
        }
        if(TB.pages[portal] && TB.pages[portal].afterRender){ TB.pages[portal].afterRender(); }
      } catch(e){
        content.innerHTML = '<div class="alert alert-error">Error: '+e.message+'</div>';
      }
    } else {
      // default to dashboard
      if(routes['/dashboard']){
        content.innerHTML = routes['/dashboard']({});
      } else {
        content.innerHTML = TB.ui.emptyState('🚫', 'Page not found: '+route);
      }
    }
    window.scrollTo(0, 0);
  },
};

/* ====== Language Select ====== */
TB.utils.langSelect = function(cls){
  var cur = TB.state.lang;
  return '<select class="'+cls+'" onchange="TB.utils.setLang(this.value)">'+
    '<option value="en"'+(cur === 'en' ? ' selected' : '')+'>English</option>'+
    '<option value="zh"'+(cur === 'zh' ? ' selected' : '')+'>中文</option>'+
    '</select>';
};
TB.utils.setLang = function(lang){
  TB.state.lang = lang;
  if(TB.state.user){
    TB.auth.renderShell();
    TB.router.render();
  } else {
    TB.auth.showLogin();
  }
};

/* ====== Notification Dropdown ====== */
TB.utils.toggleNotif = function(e){
  e.stopPropagation();
  var dd = document.getElementById('notif-dropdown');
  if(dd.classList.contains('show')){
    dd.classList.remove('show');
    return;
  }
  var html = '<div style="padding:12px 16px;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center">'+
    '<span class="font-bold">'+TB.t('nav.notifications')+'</span>'+
    '<span class="tag-link" onclick="TB.utils.markAllRead()">'+TB.t('markAllRead')+'</span></div>';
  TB.data.notifications.slice(0,8).forEach(function(n){
    html += '<div class="notif-item'+(n.read?'':' unread')+'" onclick="TB.utils.toast(\''+n.title+'\')">'+
      '<div class="notif-item-title">'+n.title+'</div>'+
      '<div class="notif-item-desc">'+n.desc+'</div>'+
      '<div class="notif-item-time">'+TB.utils.dt(n.time)+'</div></div>';
  });
  html += '<div style="padding:8px 16px;text-align:center"><span class="tag-link" onclick="TB.utils.closeNotif();TB.router.navigate(\'#/notifications\')">'+TB.t('viewAll')+'</span></div>';
  dd.innerHTML = html;
  dd.classList.add('show');
};

TB.utils.closeNotif = function(){
  document.getElementById('notif-dropdown').classList.remove('show');
};

TB.utils.markAllRead = function(){
  TB.data.notifications.forEach(function(n){ n.read = true; });
  TB.utils.closeNotif();
  TB.auth.renderShell();
  TB.utils.toast(TB.t('msg.operationSuccess'), 'success');
};

// close notification when clicking outside
document.addEventListener('click', function(e){
  var dd = document.getElementById('notif-dropdown');
  if(dd && dd.classList.contains('show') && !e.target.closest('.topbar-icon-btn') && !e.target.closest('#notif-dropdown')){
    dd.classList.remove('show');
  }
  if(!e.target.closest('.dp-wrap')){
    document.querySelectorAll('.dp-pop.show').forEach(function(p){ p.classList.remove('show'); });
  }
});

/* ====== Init ====== */
TB.init = function(){
  window.addEventListener('hashchange', TB.router.render);
  TB.auth.showLogin();
};

/* ====== Page Helpers ====== */
TB.pages = TB.pages || {};

TB.utils.contentHeader = function(title, actions){
  var html = '<div class="content-header"><h1 class="content-title">'+title+'</h1>';
  if(actions) html += '<div class="content-actions">'+actions+'</div>';
  html += '</div>';
  return html;
};

// start app
if(document.readyState !== 'loading'){
  TB.init();
} else {
  document.addEventListener('DOMContentLoaded', TB.init);
}

TB.auth.forceLoginView();

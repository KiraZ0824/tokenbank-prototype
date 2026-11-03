/* ============================================================
 * TokenBank Operations Portal — Routes & Page Handlers
 * ------------------------------------------------------------
 * Registers all 20 operation portal pages with the TB router.
 * Each page is fully interactive using TB framework components:
 *   - TB.ui.* components (statCard, table, filterBar, tabs, modal,
 *     formField, timeline, stepIndicator, badge, statusBadge,
 *     emptyState, pagination, alert, descList, card,
 *     progress, confirmModal)
 *   - TB.data.* mock data
 *   - TB.utils.* formatting helpers
 *   - TB.t() i18n translations
 * ============================================================ */
var TB = TB || {};
TB.ops = TB.ops || {};

/* ====== Local i18n helper for ops-specific labels ====== */
TB.ops._t = function(zh, en) {
  return TB.state.lang === 'zh' ? zh : en;
};

/* ====== Generic Action Helpers ====== */
TB.ops._toastSaved = function() {
  TB.ui.closeModal();
  TB.utils.toast(TB.t('msg.saveSuccess'), 'success');
};
TB.ops._toastSubmitted = function() {
  TB.ui.closeModal();
  TB.utils.toast(TB.t('msg.submitSuccess'), 'success');
};
TB.ops._toastSuccess = function() {
  TB.ui.closeModal();
  TB.utils.toast(TB.t('msg.operationSuccess'), 'success');
};
TB.ops._toastExport = function() {
  TB.utils.toast(TB.ops._t('导出中...', 'Exporting...'), 'info');
};
TB.ops._toastRefresh = function() {
  TB.utils.toast(TB.ops._t('刷新中...', 'Refreshing...'), 'info');
};
TB.ops._toastQuery = function() {
  TB.utils.toast(TB.ops._t('查询中...', 'Querying...'), 'info');
};
TB.ops._toastReset = function() {
  TB.utils.toast(TB.t('reset'), 'info');
};
TB.ops._toastFilter = function() {
  TB.utils.toast(TB.ops._t('筛选中...', 'Filtering...'), 'info');
};
TB.ops._confirmSuccess = function() {
  TB.utils.toast(TB.t('msg.operationSuccess'), 'success');
};

/* ====== Navigation Helpers ====== */
TB.ops.navMember = function(id) { TB.router.navigate('#/members/' + id); };
TB.ops.navMembers = function() { TB.router.navigate('#/members'); };
TB.ops.navSeries = function(id) { TB.router.navigate('#/series/' + id); };
TB.ops.navSeriesReview = function() { TB.router.navigate('#/series-review'); };

/* ====== Dashboard Helpers ====== */
TB.ops.refreshDashboard = function() { TB.ops._toastRefresh(); };
TB.ops.exportDashboard = function() { TB.ops._toastExport(); };

/* ====== Member Helpers ====== */
TB.ops.exportMembers = function() { TB.ops._toastExport(); };
TB.ops.toggleMemberStatus = function(id) {
  var m = TB.data.members.find(function(x) { return x.id === id; });
  if (!m) return;
  var isActive = m.status === 'active';
  var title = isActive ? TB.t('disable') : TB.t('enable');
  var msg = isActive
    ? TB.ops._t('确认停用成员「', 'Confirm to disable member "') + m.name + TB.ops._t('」？', '"?')
    : TB.ops._t('确认启用成员「', 'Confirm to enable member "') + m.name + TB.ops._t('」？', '"?');
  TB.ui.confirmModal(title, msg, 'TB.ops._confirmSuccess');
};
TB.ops.exportMemberReport = function(id) { TB.ops._toastExport(); };

/* ====== Series Review Helpers ====== */
TB.ops.openSeriesReview = function(id) {
  var body = TB.ui.descList([
    {label: TB.t('lbl.seriesId'), value: id},
    {label: TB.t('lbl.productName'), value: TB.ops._t('美债Series', 'R-UST Bond Series')},
    {label: TB.t('lbl.issuer'), value: 'Bison Bank'},
    {label: TB.t('lbl.faceValue'), value: TB.utils.money(25000000)},
    {label: TB.t('status'), value: TB.ui.statusBadge('pending')},
  ]);
  body += TB.ui.formField({
    label: TB.ops._t('审核意见', 'Review Comment'),
    name: 'review_comment',
    type: 'textarea',
    placeholder: TB.ops._t('请输入审核意见', 'Enter review comment'),
  });
  var footer = '<button class="btn" onclick="TB.ui.closeModal()">'+TB.t('cancel')+'</button>' +
    '<button class="btn btn-danger" onclick="TB.ui.closeModal();TB.utils.toast(\''+TB.t('msg.confirmReject')+'\',\'error\')">'+TB.t('reject')+'</button>' +
    '<button class="btn btn-primary" onclick="TB.ops._toastSuccess()">'+TB.t('approve')+'</button>';
  TB.ui.modal({ title: TB.ops._t('Series审核', 'Series Review'), body: body, footer: footer, size: 'lg' });
};
TB.ops.exportSeriesReview = function() { TB.ops._toastExport(); };

/* ====== Series Detail Helpers ====== */
TB.ops.listSeries = function(id) {
  TB.ui.confirmModal(
    TB.ops._t('上架Series', 'List Series'),
    TB.ops._t('确认上架该Series？上架后成员可购买。', 'Confirm to list this Series? Members can purchase after listing.'),
    'TB.ops._confirmSuccess'
  );
};
TB.ops.stopPurchase = function(id) {
  TB.ui.confirmModal(
    TB.ops._t('停止购买', 'Stop Purchase'),
    TB.ops._t('确认停止购买？成员将无法继续购买该Series。', 'Confirm to stop purchase? Members cannot buy this Series anymore.'),
    'TB.ops._confirmSuccess', 'danger'
  );
};
TB.ops.resumePurchase = function(id) {
  TB.ui.confirmModal(
    TB.ops._t('恢复购买', 'Resume Purchase'),
    TB.ops._t('确认恢复购买？', 'Confirm to resume purchase?'),
    'TB.ops._confirmSuccess'
  );
};
TB.ops.forceDelist = function(id) {
  TB.ui.confirmModal(
    TB.ops._t('强制下架', 'Force Delist'),
    TB.ops._t('确认强制下架？此操作不可逆。', 'Confirm to force delist? This action is irreversible.'),
    'TB.ops._confirmSuccess', 'danger'
  );
};

/* ====== Capacity Helpers ====== */
TB.ops.openCapacityModal = function(id) {
  var s = TB.data.series.find(function(x) { return x.id === id; });
  var body = TB.ui.descList([
    {label: TB.t('lbl.seriesId'), value: id},
    {label: TB.t('lbl.productName'), value: s ? s.name : '-'},
    {label: TB.ops._t('当前总量', 'Current Total'), value: TB.utils.money(s ? s.faceTotal : 0)},
    {label: TB.ops._t('已售', 'Sold'), value: TB.utils.money(s ? (s.faceTotal - s.faceAvailable) : 0)},
  ]);
  body += TB.ui.formField({
    label: TB.ops._t('调整后总量', 'New Total Capacity'),
    name: 'new_capacity',
    type: 'text',
    placeholder: TB.ops._t('请输入新的总量', 'Enter new total capacity'),
    required: true,
  });
  body += TB.ui.formField({
    label: TB.t('remarks'),
    name: 'capacity_reason',
    type: 'textarea',
    placeholder: TB.ops._t('请输入调整原因', 'Enter reason for adjustment'),
  });
  var footer = '<button class="btn" onclick="TB.ui.closeModal()">'+TB.t('cancel')+'</button>' +
    '<button class="btn btn-primary" onclick="TB.ops._toastSaved()">'+TB.t('confirm')+'</button>';
  TB.ui.modal({ title: TB.ops._t('调整容量', 'Adjust Capacity'), body: body, footer: footer });
};
TB.ops.viewCapacityDetail = function(id) { TB.router.navigate('#/series/' + id); };
TB.ops.exportCapacity = function() { TB.ops._toastExport(); };


/* ====== Quote Monitor Helpers ====== */
TB.ops.viewQuoteDetail = function(id) {
  var q = TB.data.quotes.find(function(x) { return x.id === id; });
  if (!q) return;
  var body = TB.ui.descList([
    {label: TB.ops._t('报价编号', 'Quote ID'), value: q.id},
    {label: TB.t('lbl.seriesId'), value: q.series},
    {label: TB.ops._t('报价方', 'Provider'), value: q.provider},
    {label: TB.t('lbl.yield'), value: TB.utils.yield(q.sellerYield)},
    {label: TB.t('lbl.price'), value: TB.utils.price(q.markPrice)},
    {label: TB.t('time'), value: q.quoteTime},
    {label: TB.ops._t('有效期至', 'Valid Until'), value: q.validUntil},
    {label: TB.t('status'), value: TB.ui.statusBadge(q.status)},
  ]);
  TB.ui.modal({ title: TB.ops._t('报价详情', 'Quote Detail'), body: body, size: 'lg' });
};
TB.ops.exportQuotes = function() { TB.ops._toastExport(); };
TB.ops.refreshQuotes = function() { TB.ops._toastRefresh(); };

/* ====== Review Queue Helpers ====== */
TB.ops.openReviewTask = function(id) {
  var task = TB.data.reviewTasks.find(function(x) { return x.id === id; });
  if (!task) return;
  var body = TB.ui.descList([
    {label: TB.ops._t('任务编号', 'Task ID'), value: task.id},
    {label: TB.t('type'), value: task.type},
    {label: TB.ops._t('业务对象', 'Object'), value: task.ref},
    {label: TB.t('lbl.applicant'), value: task.applicant},
    {label: TB.t('lbl.node'), value: task.node},
    {label: TB.t('lbl.priority'), value: TB.ui.badge(task.priority, task.priority === 'High' ? 'error' : 'warning')},
    {label: TB.t('time'), value: task.time},
  ]);
  body += TB.ui.formField({
    label: TB.ops._t('审核意见', 'Review Comment'),
    name: 'task_comment',
    type: 'textarea',
    placeholder: TB.ops._t('请输入审核意见', 'Enter review comment'),
  });
  var footer = '<button class="btn" onclick="TB.ui.closeModal()">'+TB.t('cancel')+'</button>' +
    '<button class="btn btn-danger" onclick="TB.ui.closeModal();TB.utils.toast(\''+TB.t('msg.confirmReject')+'\',\'error\')">'+TB.t('reject')+'</button>' +
    '<button class="btn btn-primary" onclick="TB.ops._toastSuccess()">'+TB.t('approve')+'</button>';
  TB.ui.modal({ title: TB.ops._t('审核任务', 'Review Task'), body: body, footer: footer, size: 'lg' });
};
TB.ops.viewReviewDetail = function(id) {
  var task = TB.data.reviewTasks.find(function(x) { return x.id === id; });
  if (!task) return;
  if (task.type === 'Series Issuance') { TB.router.navigate('#/series/' + task.ref); }
  else { TB.ops.openReviewTask(id); }
};
TB.ops.openBatchApprove = function() {
  var pending = TB.data.reviewTasks.filter(function(t) { return t.status === 'pending'; });
  var body = '<p>'+TB.ops._t('将批量通过以下', 'Batch approve the following ')+' '+pending.length+' '+TB.t('items')+'：</p>';
  body += TB.ui.table({
    columns: [
      {key: 'id', label: TB.ops._t('任务编号', 'Task ID')},
      {key: 'type', label: TB.t('type')},
      {key: 'ref', label: TB.ops._t('业务对象', 'Object')},
    ],
    data: pending,
  });
  var footer = '<button class="btn" onclick="TB.ui.closeModal()">'+TB.t('cancel')+'</button>' +
    '<button class="btn btn-primary" onclick="TB.ops._toastSuccess()">'+TB.t('approve')+'</button>';
  TB.ui.modal({ title: TB.ops._t('批量通过', 'Batch Approve'), body: body, footer: footer, size: 'lg' });
};

/* ====== Checkout/Maturity Helpers ====== */
TB.ops.viewCheckoutDetail = function(id) {
  var body = TB.ui.descList([
    {label: TB.ops._t('处理编号', 'Task ID'), value: id},
    {label: TB.ops._t('处理类型', 'Type'), value: TB.ops._t('到期兑付', 'Maturity Settlement')},
    {label: TB.t('status'), value: TB.ui.statusBadge('processing')},
    {label: TB.ops._t('兑付进度', 'Progress'), value: '45%'},
  ]);
  body += TB.ui.progress(45);
  TB.ui.modal({ title: TB.ops._t('处理详情', 'Process Detail'), body: body, size: 'lg' });
};
TB.ops.openTriggerCheckout = function(id) {
  var body = TB.ui.descList([
    {label: TB.t('lbl.seriesId'), value: id},
    {label: TB.ops._t('处理类型', 'Type'), value: TB.t('lbl.checkout')},
  ]);
  body += TB.ui.formField({
    label: TB.ops._t('处理说明', 'Note'),
    name: 'checkout_note',
    type: 'textarea',
    placeholder: TB.ops._t('请输入处理说明', 'Enter note'),
  });
  var footer = '<button class="btn" onclick="TB.ui.closeModal()">'+TB.t('cancel')+'</button>' +
    '<button class="btn btn-primary" onclick="TB.ops._toastSubmitted()">'+TB.t('submit')+'</button>';
  TB.ui.modal({ title: TB.ops._t('触发Checkout', 'Trigger Checkout'), body: body, footer: footer });
};
TB.ops.openTriggerMaturity = function(id) {
  var body = TB.ui.descList([
    {label: TB.t('lbl.seriesId'), value: id},
    {label: TB.ops._t('处理类型', 'Type'), value: TB.ops._t('到期处理', 'Maturity')},
  ]);
  body += TB.ui.formField({
    label: TB.ops._t('处理说明', 'Note'),
    name: 'maturity_note',
    type: 'textarea',
    placeholder: TB.ops._t('请输入处理说明', 'Enter note'),
  });
  var footer = '<button class="btn" onclick="TB.ui.closeModal()">'+TB.t('cancel')+'</button>' +
    '<button class="btn btn-primary" onclick="TB.ops._toastSubmitted()">'+TB.t('submit')+'</button>';
  TB.ui.modal({ title: TB.ops._t('触发Maturity', 'Trigger Maturity'), body: body, footer: footer });
};
TB.ops.exportCheckout = function() { TB.ops._toastExport(); };

/* ====== Exception Helpers ====== */
TB.ops.openAssignModal = function(id) {
  var body = TB.ui.formField({
    label: TB.ops._t('处理人', 'Assignee'),
    name: 'assignee',
    type: 'select',
    options: [
      {value: 'ops', label: 'Ops Staff'},
      {value: 'review', label: 'Review Manager'},
      {value: 'admin', label: 'Admin User'},
    ],
  });
  var footer = '<button class="btn" onclick="TB.ui.closeModal()">'+TB.t('cancel')+'</button>' +
    '<button class="btn btn-primary" onclick="TB.ops._toastSaved()">'+TB.t('assign')+'</button>';
  TB.ui.modal({ title: TB.ops._t('分配处理人', 'Assign Handler'), body: body, footer: footer });
};
TB.ops.addExceptionRecord = function() {
  var val = TB.utils.getInputVal('exc_record');
  if (!val) {
    TB.utils.toast(TB.t('msg.requiredFields'), 'error');
    return;
  }
  TB.utils.toast(TB.t('msg.operationSuccess'), 'success');
};
TB.ops.openUpdateStatus = function(id) {
  var body = TB.ui.formField({
    label: TB.ops._t('更新状态', 'New Status'),
    name: 'exc_status',
    type: 'select',
    options: [
      {value: 'processing', label: TB.t('st.processing') || 'Processing'},
      {value: 'resolved', label: TB.t('st.resolved') || 'Resolved'},
      {value: 'open', label: TB.t('st.open')},
    ],
  });
  body += TB.ui.formField({
    label: TB.t('remarks'),
    name: 'exc_status_remark',
    type: 'textarea',
  });
  var footer = '<button class="btn" onclick="TB.ui.closeModal()">'+TB.t('cancel')+'</button>' +
    '<button class="btn btn-primary" onclick="TB.ops._toastSaved()">'+TB.t('confirm')+'</button>';
  TB.ui.modal({ title: TB.ops._t('更新状态', 'Update Status'), body: body, footer: footer });
};
TB.ops.openAssignHandler = function(id) { TB.ops.openAssignModal(id); };

/* ====== Account Helpers ====== */
TB.ops.openCreateAccount = function() {
  var body = TB.ui.formField({label: TB.ops._t('账号名', 'Account Name'), name: 'acc_name', required: true}) +
    TB.ui.formField({label: TB.t('lbl.email'), name: 'acc_email', type: 'email', required: true}) +
    TB.ui.formField({
      label: TB.t('lbl.role'), name: 'acc_role', type: 'select',
      options: [
        {value: 'admin', label: 'Sys Admin'},
        {value: 'reviewer', label: 'Reviewer'},
        {value: 'operations', label: 'Operations'},
        {value: 'compliance', label: 'Compliance'},
      ],
    }) +
    TB.ui.formField({
      label: TB.ops._t('所属机构', 'Organization'), name: 'acc_org', type: 'select',
      options: [
        {value: 'tb', label: 'TokenBank'},
        {value: 'alpha', label: 'Alpha Fund Management'},
        {value: 'bison', label: 'Bison Bank'},
      ],
    }) +
    TB.ui.formField({
      label: TB.ops._t('账号类型', 'Account Type'), name: 'acc_type', type: 'select',
      options: [
        {value: 'ops', label: TB.t('portal.ops')},
        {value: 'member', label: TB.t('portal.member')},
        {value: 'issuer', label: TB.t('portal.issuer')},
      ],
    });
  var footer = '<button class="btn" onclick="TB.ui.closeModal()">'+TB.t('cancel')+'</button>' +
    '<button class="btn btn-primary" onclick="TB.ops._toastSaved()">'+TB.t('create')+'</button>';
  TB.ui.modal({ title: TB.t('create'), body: body, footer: footer, size: 'lg' });
};
TB.ops.openEditAccount = function(id) {
  var a = TB.data.accounts.find(function(x) { return x.id === id; });
  if (!a) return;
  var body = TB.ui.formField({label: TB.ops._t('账号名', 'Account Name'), name: 'edit_acc_name', value: a.name}) +
    TB.ui.formField({label: TB.t('lbl.email'), name: 'edit_acc_email', value: a.email, type: 'email'}) +
    TB.ui.formField({
      label: TB.t('lbl.role'), name: 'edit_acc_role', type: 'select',
      options: [
        {value: 'admin', label: 'Sys Admin', selected: a.role === 'Sys Admin'},
        {value: 'reviewer', label: 'Reviewer', selected: a.role === 'Reviewer'},
        {value: 'operations', label: 'Operations', selected: a.role === 'Operations'},
      ],
    });
  var footer = '<button class="btn" onclick="TB.ui.closeModal()">'+TB.t('cancel')+'</button>' +
    '<button class="btn btn-primary" onclick="TB.ops._toastSaved()">'+TB.t('save')+'</button>';
  TB.ui.modal({ title: TB.t('edit'), body: body, footer: footer, size: 'lg' });
};
TB.ops.toggleAccountStatus = function(id) {
  var a = TB.data.accounts.find(function(x) { return x.id === id; });
  if (!a) return;
  var isActive = a.status === 'active';
  var title = isActive ? TB.t('disable') : TB.t('enable');
  var msg = isActive
    ? TB.ops._t('确认停用账号 ', 'Confirm to disable account ') + a.name + '?'
    : TB.ops._t('确认启用账号 ', 'Confirm to enable account ') + a.name + '?';
  TB.ui.confirmModal(title, msg, 'TB.ops._confirmSuccess');
};
TB.ops.resetAccountPwd = function(id) {
  TB.ui.confirmModal(
    TB.t('resetPwd'),
    TB.ops._t('确认重置该账号的密码？重置后将发送临时密码至邮箱。', 'Confirm to reset password? A temporary password will be sent to the email.'),
    'TB.ops._confirmSuccess'
  );
};
TB.ops.unlockAccount = function(id) {
  TB.ui.confirmModal(
    TB.ops._t('解锁账号', 'Unlock Account'),
    TB.ops._t('确认解锁该账号？', 'Confirm to unlock this account?'),
    'TB.ops._confirmSuccess'
  );
};

/* ====== Role Helpers ====== */
TB.ops.openCreateRole = function() {
  var body = TB.ui.formField({label: TB.ops._t('角色名称', 'Role Name'), name: 'role_name', required: true}) +
    TB.ui.formField({label: TB.ops._t('角色描述', 'Description'), name: 'role_desc', type: 'textarea'});
  var footer = '<button class="btn" onclick="TB.ui.closeModal()">'+TB.t('cancel')+'</button>' +
    '<button class="btn btn-primary" onclick="TB.ops._toastSaved()">'+TB.t('create')+'</button>';
  TB.ui.modal({ title: TB.t('create'), body: body, footer: footer });
};
TB.ops.savePermissions = function() {
  TB.ui.confirmModal(
    TB.ops._t('保存权限', 'Save Permissions'),
    TB.ops._t('确认保存当前角色的权限配置？', 'Confirm to save permission settings for current role?'),
    'TB.ops._confirmSuccess'
  );
};
TB.ops.openEditRole = function(id) {
  var body = TB.ui.formField({label: TB.ops._t('角色名称', 'Role Name'), name: 'edit_role_name', value: id}) +
    TB.ui.formField({label: TB.ops._t('角色描述', 'Description'), name: 'edit_role_desc', type: 'textarea'});
  var footer = '<button class="btn" onclick="TB.ui.closeModal()">'+TB.t('cancel')+'</button>' +
    '<button class="btn btn-primary" onclick="TB.ops._toastSaved()">'+TB.t('save')+'</button>';
  TB.ui.modal({ title: TB.t('edit'), body: body, footer: footer });
};
TB.ops.openDeleteRole = function(id) {
  TB.ui.confirmModal(
    TB.t('delete'),
    TB.t('msg.confirmDelete'),
    'TB.ops._confirmSuccess', 'danger'
  );
};
TB.ops.openAssignMember = function(id) {
  var body = TB.ui.formField({
    label: TB.ops._t('选择成员', 'Select Member'),
    name: 'role_member',
    type: 'select',
    options: TB.data.accounts.map(function(a) { return {value: a.id, label: a.name + ' (' + a.email + ')'}; }),
  });
  var footer = '<button class="btn" onclick="TB.ui.closeModal()">'+TB.t('cancel')+'</button>' +
    '<button class="btn btn-primary" onclick="TB.ops._toastSaved()">'+TB.t('assign')+'</button>';
  TB.ui.modal({ title: TB.ops._t('分配成员', 'Assign Member'), body: body, footer: footer });
};

/* ====== Audit Config Helpers ======
 * 运营端只规定审批节点；节点上的审核人由发行机构在发行端自行配置。 */
TB.ops.openAddNode = function() {
  var body = TB.ui.formField({
    label: TB.ops._t('节点名称', 'Node Name'), name: 'node_name', required: true,
    hint: TB.ops._t('节点顺序按新增先后自动排列，可在列表中调整。', 'Node order follows creation and can be adjusted in the list.'),
  }) +
  TB.ui.formField({
    label: TB.ops._t('退回目标', 'Return Target'), name: 'node_return', value: TB.ops._t('发起人', 'Initiator'), disabled: true,
    hint: TB.ops._t('退回目标固定为发起人，不可修改。', 'Return target is fixed to initiator and cannot be modified.'),
  });
  var footer = '<button class="btn" onclick="TB.ui.closeModal()">'+TB.t('cancel')+'</button>' +
    '<button class="btn btn-primary" onclick="TB.ops._toastSaved()">'+TB.t('save')+'</button>';
  TB.ui.modal({ title: TB.ops._t('新增节点', 'Add Node'), body: body, footer: footer });
};
TB.ops.saveAuditConfig = function() {
  TB.ui.confirmModal(
    TB.ops._t('保存配置', 'Save Config'),
    TB.ops._t('确认保存审核流程配置？', 'Confirm to save audit flow configuration?'),
    'TB.ops._confirmSuccess'
  );
};
TB.ops.openDeleteNode = function(id) {
  TB.ui.confirmModal(
    TB.t('delete'),
    TB.ops._t('确认删除该审核节点？', 'Confirm to delete this audit node?'),
    'TB.ops._confirmSuccess', 'danger'
  );
};

/* ====== System Params Helpers ====== */
TB.ops.saveParams = function() {
  TB.ui.confirmModal(
    TB.t('save'),
    TB.ops._t('确认保存交易参数配置？', 'Confirm to save trading parameters?'),
    'TB.ops._confirmSuccess'
  );
};
TB.ops.resetParamsDefault = function() {
  TB.ui.confirmModal(
    TB.ops._t('重置默认', 'Reset Default'),
    TB.ops._t('确认将所有参数重置为默认值？', 'Confirm to reset all parameters to default values?'),
    'TB.ops._confirmSuccess'
  );
};
TB.ops.openAddHoliday = function() {
  var body = TB.ui.formField({
    label: TB.ops._t('节假日名称', 'Holiday Name'), name: 'holiday_name', required: true,
  }) +
  TB.ui.formField({
    label: TB.t('date'), name: 'holiday_date', type: 'date', required: true,
  });
  var footer = '<button class="btn" onclick="TB.ui.closeModal()">'+TB.t('cancel')+'</button>' +
    '<button class="btn btn-primary" onclick="TB.ops._toastSaved()">'+TB.t('save')+'</button>';
  TB.ui.modal({ title: TB.ops._t('新增节假日', 'Add Holiday'), body: body, footer: footer });
};
TB.ops.openDeleteHoliday = function(id) {
  TB.ui.confirmModal(
    TB.t('delete'),
    TB.t('msg.confirmDelete'),
    'TB.ops._confirmSuccess', 'danger'
  );
};
TB.ops.saveCalendar = function() {
  TB.ui.confirmModal(
    TB.t('save'),
    TB.ops._t('确认保存日历配置？', 'Confirm to save calendar configuration?'),
    'TB.ops._confirmSuccess'
  );
};

/* ====== Audit Log Helpers ====== */
TB.ops.queryAuditLog = function() { TB.ops._toastQuery(); };
TB.ops.resetQuery = function() { TB.ops._toastReset(); };
TB.ops.openLogDetail = function(id) {
  var log = TB.data.auditLogs.find(function(x) { return x.id === id; });
  if (!log) return;
  var body = TB.ui.descList([
    {label: TB.ops._t('日志编号', 'Log ID'), value: log.id},
    {label: TB.ops._t('操作人', 'Operator'), value: log.user},
    {label: TB.t('type'), value: log.type},
    {label: TB.ops._t('业务对象', 'Object'), value: log.ref},
    {label: TB.t('time'), value: log.time},
    {label: TB.ops._t('结果', 'Result'), value: TB.ui.badge(TB.utils.enumLabel(log.result), log.result === 'Success' ? 'success' : 'error')},
    {label: 'IP', value: log.ip},
  ]);
  TB.ui.modal({ title: TB.ops._t('日志详情', 'Log Detail'), body: body, size: 'lg' });
};
TB.ops.exportAuditLog = function() { TB.ops._toastExport(); };

/* ====== Announcement Helpers ====== */
TB.ops.openPublishAnn = function() {
  var body = TB.ui.formField({label: TB.ops._t('标题', 'Title'), name: 'ann_title', required: true}) +
    TB.ui.formField({
      label: TB.t('type'), name: 'ann_type', type: 'select',
      options: [
        {value: 'system', label: 'System'},
        {value: 'product', label: 'Product'},
        {value: 'maintenance', label: 'Maintenance'},
        {value: 'policy', label: 'Policy'},
      ],
    }) +
    TB.ui.formField({
      label: TB.ops._t('目标受众', 'Audience'), name: 'ann_audience', type: 'select',
      options: [
        {value: 'all_members', label: 'All Members'},
        {value: 'all_users', label: 'All Users'},
        {value: 'issuers', label: 'Issuers'},
      ],
    }) +
    TB.ui.formField({
      label: TB.ops._t('内容', 'Content'), name: 'ann_content', type: 'textarea',
      placeholder: TB.ops._t('请输入公告内容', 'Enter announcement content'),
    });
  var footer = '<button class="btn" onclick="TB.ui.closeModal()">'+TB.t('cancel')+'</button>' +
    '<button class="btn btn-primary" onclick="TB.ops._toastSubmitted()">'+TB.t('publish')+'</button>';
  TB.ui.modal({ title: TB.ops._t('发布公告', 'Publish Announcement'), body: body, footer: footer, size: 'lg' });
};
TB.ops.openEditAnn = function(id) {
  var ann = TB.data.announcements.find(function(x) { return x.id === id; });
  if (!ann) return;
  var body = TB.ui.formField({label: TB.ops._t('标题', 'Title'), name: 'edit_ann_title', value: ann.title}) +
    TB.ui.formField({
      label: TB.t('type'), name: 'edit_ann_type', type: 'select',
      options: [
        {value: 'system', label: 'System', selected: ann.type === 'System'},
        {value: 'product', label: 'Product', selected: ann.type === 'Product'},
        {value: 'maintenance', label: 'Maintenance', selected: ann.type === 'Maintenance'},
        {value: 'policy', label: 'Policy', selected: ann.type === 'Policy'},
      ],
    }) +
    TB.ui.formField({
      label: TB.ops._t('内容', 'Content'), name: 'edit_ann_content', type: 'textarea',
      value: TB.ops._t('公告正文内容...', 'Announcement body content...'),
    });
  var footer = '<button class="btn" onclick="TB.ui.closeModal()">'+TB.t('cancel')+'</button>' +
    '<button class="btn btn-primary" onclick="TB.ops._toastSaved()">'+TB.t('save')+'</button>';
  TB.ui.modal({ title: TB.t('edit'), body: body, footer: footer, size: 'lg' });
};
TB.ops.openPreviewAnn = function(id) {
  var ann = TB.data.announcements.find(function(x) { return x.id === id; });
  if (!ann) return;
  var body = '<h2 style="margin-bottom:8px">'+ann.title+'</h2>' +
    '<div class="text-sm text-muted mb-4">'+ann.type+' · '+ann.audience+' · '+TB.utils.dt(ann.time)+'</div>' +
    '<p>'+TB.ops._t('这是公告的预览内容。实际公告内容将在发布时展示给目标受众。', 'This is a preview of the announcement. The actual content will be displayed to the target audience upon publishing.')+'</p>';
  TB.ui.modal({ title: TB.ops._t('预览公告', 'Preview Announcement'), body: body, size: 'lg' });
};
TB.ops.openUnpublishAnn = function(id) {
  TB.ui.confirmModal(
    TB.ops._t('下线公告', 'Unpublish'),
    TB.ops._t('确认下线该公告？', 'Confirm to unpublish this announcement?'),
    'TB.ops._confirmSuccess'
  );
};
TB.ops.openDeleteAnn = function(id) {
  TB.ui.confirmModal(
    TB.t('delete'),
    TB.t('msg.confirmDelete'),
    'TB.ops._confirmSuccess', 'danger'
  );
};

/* ============================================================
 * Route Registration — 20 Pages
 * ============================================================ */
TB.router.register('ops', {

  /* ---- 1. /dashboard — Operations Dashboard ---- */
  '/dashboard': function(params) {
    var memberCount = TB.data.members.length;
    var activeSeries = TB.data.series.filter(function(s) { return s.status === 'open'; }).length;
    var txVolume = 0;
    TB.data.transactions.forEach(function(t) { txVolume += t.amount; });
    var totalFace = 0, totalAvail = 0;
    TB.data.series.forEach(function(s) { totalFace += s.faceTotal; totalAvail += s.faceAvailable; });
    var capRate = totalFace > 0 ? Math.round((totalFace - totalAvail) / totalFace * 100) : 0;
    var reviewCount = TB.data.reviewTasks.filter(function(t) { return t.status === 'pending'; }).length;

    var html = TB.utils.contentHeader(TB.t('nav.opsDashboard'), '<button class="btn btn-sm" onclick="TB.ops.refreshDashboard()">'+TB.t('refresh')+'</button>' +
      '<button class="btn btn-sm" onclick="TB.ops.exportDashboard()">'+TB.t('export')+'</button>');

    /* 6 Stat Cards */
    html += '<div class="stat-grid">';
    html += TB.ui.statCard(TB.t('nav.members'), memberCount, '+1 '+TB.t('lbl.created'), 'up', TB.ops._t('本月新增', 'New this month'));
    html += TB.ui.statCard(TB.ops._t('活跃Series', 'Active Series'), activeSeries, '', '', TB.ops._t('开放购买中', 'Open for purchase'));
    html += TB.ui.statCard(TB.ops._t('交易量', 'Tx Volume'), TB.utils.moneyShort(txVolume), '+12.5%', 'up', TB.ops._t('近30天', 'Last 30 days'));
    html += TB.ui.statCard(TB.ops._t('容量率', 'Capacity Rate'), capRate + '%', '', '', totalAvail > 0 ? TB.utils.moneyShort(totalAvail) + TB.ops._t(' 可用', ' available') : '');
    html += TB.ui.statCard(TB.ops._t('审核数', 'Pending Reviews'), reviewCount, '', '', TB.ops._t('待审核任务', 'Pending tasks'));
    html += '</div>';

    /* Series Status Distribution */
    var statusGroups = {};
    TB.data.series.forEach(function(s) {
      if (!statusGroups[s.status]) statusGroups[s.status] = 0;
      statusGroups[s.status]++;
    });
    var distData = [];
    for (var st in statusGroups) {
      distData.push({id: st, status: st, count: statusGroups[st]});
    }
    html += TB.ui.card(
      TB.ops._t('Series状态分布', 'Series Status Distribution'),
      TB.ui.table({
        columns: [
          {key: 'status', label: TB.t('status'), render: function(r) { return TB.ui.statusBadge(r.status); }},
          {key: 'count', label: TB.ops._t('数量', 'Count'), align: 'right'},
        ],
        data: distData,
      })
    );

    /* Pending Reviews */
    html += TB.ui.card(
      TB.ops._t('待审核事项', 'Pending Reviews'),
      TB.ui.table({
        columns: [
          {key: 'id', label: TB.ops._t('任务编号', 'Task ID')},
          {key: 'type', label: TB.t('type')},
          {key: 'ref', label: TB.ops._t('业务对象', 'Object')},
          {key: 'applicant', label: TB.t('lbl.applicant')},
          {key: 'priority', label: TB.t('lbl.priority'), render: function(r) { return TB.ui.badge(TB.utils.enumLabel(r.priority), r.priority === 'High' ? 'error' : 'warning'); }},
          {key: 'time', label: TB.t('time')},
        ],
        data: TB.data.reviewTasks.filter(function(t) { return t.status === 'pending'; }),
        actions: [
          {label: TB.t('review'), onClick: 'TB.ops.openReviewTask'},
          {label: TB.t('viewDetail'), onClick: 'TB.ops.viewReviewDetail', type: 'text'},
        ],
      })
    );

    return html;
  },

  /* ---- 2. /members — Member Management List ---- */
  '/members': function(params) {
    var html = TB.utils.contentHeader(TB.t('nav.members'), '<button class="btn btn-sm" onclick="TB.ops.exportMembers()">'+TB.t('export')+'</button>');

    html += TB.ui.filterBar({
      fields: [
        {name: 'status', label: TB.t('status'), type: 'select', options: [
          {value: '', label: TB.t('all')},
          {value: 'active', label: TB.t('st.active')},
          {value: 'pendingActivation', label: TB.t('st.pendingActivation')},
          {value: 'suspended', label: TB.t('st.suspended')},
        ]},
        {name: 'type', label: TB.t('type'), type: 'select', options: [
          {value: '', label: TB.t('all')},
          {value: 'Member', label: 'Member'},
          {value: 'Issuer', label: 'Issuer'},
        ]},
        {name: 'country', label: TB.t('lbl.country'), type: 'select', options: [
          {value: '', label: TB.t('all')},
          {value: 'Singapore', label: 'Singapore'},
          {value: 'Hong Kong', label: 'Hong Kong'},
          {value: 'Switzerland', label: 'Switzerland'},
          {value: 'United Kingdom', label: 'United Kingdom'},
          {value: 'Japan', label: 'Japan'},
          {value: 'Luxembourg', label: 'Luxembourg'},
        ]},
        {name: 'keyword', label: TB.ops._t('关键词', 'Keyword'), placeholder: TB.ops._t('成员名称/Remi ID', 'Name / Remi ID')},
      ],
      exportBtn: false,
    });

    html += TB.ui.table({
      columns: [
        {key: 'name', label: TB.t('lbl.memberName')},
        {key: 'remiId', label: TB.t('lbl.remiId')},
        {key: 'type', label: TB.ops._t('机构类型', 'Org Type')},
        {key: 'country', label: TB.t('lbl.country')},
        {key: 'kyb', label: TB.t('lbl.kyb'), render: function(r) {
          return TB.ui.badge(TB.utils.enumLabel(r.kyb), r.kyb === 'Passed' ? 'success' : 'warning');
        }},
        {key: 'subStatus', label: TB.ops._t('订阅状态', 'Sub Status'), render: function(r) {
          return TB.ui.badge(TB.utils.enumLabel(r.subStatus), r.subStatus === 'Active' ? 'success' : 'warning');
        }},
        {key: 'emtBalance', label: TB.ops._t('EMT总余额', 'EMT Balance'), align: 'right', render: function(r) {
          return TB.utils.money(r.emtBalance);
        }},
        {key: 'createdAt', label: TB.ops._t('入驻时间', 'Onboarded')},
      ],
      data: TB.data.members,
      actions: [
        {label: TB.t('viewDetail'), onClick: 'TB.ops.navMember', type: 'text'},
      ],
      pagination: {total: TB.data.members.length, pageSize: 10, current: 1},
    });

    return html;
  },

  /* ---- 3. /members/:id — Member Detail ---- */
  '/members/:id': function(params) {
    var m = TB.data.members.find(function(x) { return x.id === params.id; });
    if (!m) {
      return TB.utils.contentHeader(TB.t('nav.members'), '') + TB.ui.emptyState('🔍', TB.t('noData'));
    }

    var actions = '<button class="btn btn-sm" onclick="TB.ops.navMembers()">'+TB.t('viewList')+'</button>' +
      '<button class="btn btn-sm" onclick="TB.ops.exportMemberReport(\''+m.id+'\')">'+TB.t('export')+'</button>' +
      '<button class="btn btn-sm '+(m.status === 'active' ? 'btn-danger' : 'btn-primary')+'" onclick="TB.ops.toggleMemberStatus(\''+m.id+'\')">'+(m.status === 'active' ? TB.t('disable') : TB.t('enable'))+'</button>';
    var html = TB.utils.contentHeader(m.name, actions);

    /* Summary Card */
    html += TB.ui.card(
      TB.ops._t('成员摘要', 'Member Summary'),
      TB.ui.descList([
        {label: TB.t('lbl.memberName'), value: m.name},
        {label: TB.t('lbl.remiId'), value: m.remiId},
        {label: TB.ops._t('机构类型', 'Org Type'), value: m.type},
        {label: TB.t('lbl.country'), value: m.country},
        {label: TB.t('lbl.kyb'), value: TB.ui.badge(TB.utils.enumLabel(m.kyb), m.kyb === 'Passed' ? 'success' : 'warning')},
        {label: TB.ops._t('订阅状态', 'Sub Status'), value: TB.ui.badge(TB.utils.enumLabel(m.subStatus), m.subStatus === 'Active' ? 'success' : 'warning')},
        {label: TB.ops._t('EMT总余额', 'EMT Balance'), value: TB.utils.money(m.emtBalance)},
        {label: TB.ops._t('入驻时间', 'Onboarded'), value: m.createdAt},
        {label: TB.t('status'), value: TB.ui.statusBadge(m.status)},
      ])
    );

    /* Tabs */
    var memberTxs = TB.data.transactions.filter(function(t) { return t.member === m.name; });
    var memberHoldings = TB.data.holdings.filter(function(h) { return h.member === m.name; });

    html += TB.ui.tabs({
      items: [
        {key: 'basic', label: TB.ops._t('基本信息', 'Basic Info'), active: true},
        {key: 'kyb', label: TB.t('lbl.kyb') + TB.ops._t('合规', ' Compliance')},
        {key: 'wallet', label: TB.ops._t('钱包资金', 'Wallet & Funds')},
        {key: 'tx', label: TB.t('nav.transactions')},
        {key: 'holdings', label: TB.t('nav.holdings')},
        {key: 'subacc', label: TB.ops._t('子账号', 'Sub-accounts')},
      ],
      content: {
        basic: TB.ui.descList([
          {label: TB.t('lbl.memberName'), value: m.name},
          {label: TB.t('lbl.remiId'), value: m.remiId},
          {label: TB.ops._t('机构类型', 'Org Type'), value: m.type},
          {label: TB.t('lbl.country'), value: m.country},
          {label: TB.ops._t('入驻时间', 'Onboarded'), value: m.createdAt},
        ]),
        kyb: TB.ui.descList([
          {label: TB.t('lbl.kyb'), value: TB.ui.badge(TB.utils.enumLabel(m.kyb), m.kyb === 'Passed' ? 'success' : 'warning')},
          {label: TB.ops._t('合规等级', 'Compliance Level'), value: 'Tier 2'},
          {label: TB.ops._t('审核日期', 'Review Date'), value: m.createdAt},
          {label: TB.ops._t('有效期至', 'Valid Until'), value: '2027-08-15'},
        ]),
        wallet: TB.ui.descList([
          {label: TB.t('lbl.balance'), value: TB.utils.money(m.emtBalance)},
          {label: TB.t('lbl.available'), value: TB.utils.money(m.emtBalance)},
          {label: TB.t('lbl.frozen'), value: TB.utils.money(0)},
        ]),
        tx: memberTxs.length > 0 ? TB.ui.table({
          columns: [
            {key: 'id', label: TB.ops._t('交易编号', 'Tx ID')},
            {key: 'time', label: TB.t('time')},
            {key: 'type', label: TB.t('type')},
            {key: 'amount', label: TB.t('amount'), align: 'right', render: function(r) { return TB.utils.money(r.amount); }},
            {key: 'status', label: TB.t('status'), render: function(r) { return TB.ui.statusBadge(r.status); }},
          ],
          data: memberTxs,
        }) : TB.ui.emptyState('📋', TB.t('noData')),
        holdings: memberHoldings.length > 0 ? TB.ui.table({
          columns: [
            {key: 'series', label: TB.t('lbl.seriesId')},
            {key: 'faceValue', label: TB.t('lbl.faceValue'), align: 'right', render: function(r) { return TB.utils.money(r.faceValue); }},
            {key: 'valuation', label: TB.ops._t('估值', 'Valuation'), align: 'right', render: function(r) { return TB.utils.money(r.valuation); }},
            {key: 'sellerYield', label: TB.t('lbl.yield'), render: function(r) { return TB.utils.yield(r.sellerYield); }},
            {key: 'status', label: TB.t('status'), render: function(r) { return TB.ui.statusBadge(r.status); }},
          ],
          data: memberHoldings,
        }) : TB.ui.emptyState('📋', TB.t('noData')),
        subacc: TB.ui.table({
          columns: [
            {key: 'id', label: TB.ops._t('子账号ID', 'Sub-account ID')},
            {key: 'name', label: TB.ops._t('账号名', 'Name')},
            {key: 'role', label: TB.t('lbl.role')},
          ],
          data: TB.data.accounts.filter(function(a) { return a.org === m.name; }),
        }),
      },
    });

    return html;
  },

  /* ---- 4. /series-review — Series Review List ---- */
  '/series-review': function(params) {
    var html = TB.utils.contentHeader(TB.t('nav.seriesReview'), '<button class="btn btn-sm" onclick="TB.ops.exportSeriesReview()">'+TB.t('export')+'</button>');

    html += TB.ui.filterBar({
      fields: [
        {name: 'status', label: TB.ops._t('审核状态', 'Review Status'), type: 'select', options: [
          {value: '', label: TB.t('all')},
          {value: 'pending', label: TB.t('st.pending')},
          {value: 'approving', label: TB.t('st.approving')},
          {value: 'minting', label: TB.t('st.minting')},
          {value: 'approved', label: TB.t('st.approved')},
          {value: 'rejected', label: TB.t('st.rejected')},
        ]},
        {name: 'date', label: TB.ops._t('申请时间', 'Apply Date'), type: 'date'},
        {name: 'name', label: TB.ops._t('Series名称', 'Series Name'), placeholder: TB.t('lbl.seriesId')},
      ],
    });

    /* Build review data from series with approving/pending/minting status */
    var reviewData = TB.data.series.filter(function(s) {
      return s.status === 'approving' || s.status === 'pending' || s.status === 'minting';
    }).map(function(s) {
      var inReview = s.status === 'approving' || s.status === 'pending';
      return {
        id: 'SR-' + s.id,
        seriesId: s.id,
        name: s.name,
        issuer: s.issuer,
        faceTotal: s.faceTotal,
        reviewStatus: inReview ? 'pending' : 'processing',
        node: inReview ? TB.ops._t('待审核', 'Pending Review') : TB.ops._t('铸币中', 'Minting'),
        createdAt: s.createdAt,
      };
    });

    html += TB.ui.table({
      columns: [
        {key: 'id', label: TB.ops._t('申请编号', 'Application ID')},
        {key: 'seriesId', label: TB.t('lbl.seriesId')},
        {key: 'name', label: TB.t('lbl.productName')},
        {key: 'issuer', label: TB.t('lbl.issuer')},
        {key: 'faceTotal', label: TB.t('lbl.faceValue'), align: 'right', render: function(r) { return TB.utils.money(r.faceTotal); }},
        {key: 'reviewStatus', label: TB.ops._t('审核状态', 'Review Status'), render: function(r) { return TB.ui.statusBadge(r.reviewStatus); }},
        {key: 'node', label: TB.t('lbl.node')},
        {key: 'createdAt', label: TB.ops._t('申请时间', 'Applied')},
      ],
      data: reviewData,
      actions: [
        {label: TB.t('review'), onClick: 'TB.ops.openSeriesReview'},
        {label: TB.t('viewDetail'), onClick: 'TB.ops.navSeries', type: 'text'},
      ],
      pagination: {total: reviewData.length, pageSize: 10, current: 1},
    });

    return html;
  },

  /* ---- 5. /series/:id — Series Detail (Ops View) ---- */
  '/series/:id': function(params) {
    var s = TB.data.series.find(function(x) { return x.id === params.id; });
    if (!s) {
      return TB.utils.contentHeader(TB.t('nav.seriesReview'), '') + TB.ui.emptyState('🔍', TB.t('noData'));
    }

    var html = TB.utils.contentHeader(s.name, '<button class="btn btn-sm" onclick="TB.ops.navSeriesReview()">'+TB.t('viewList')+'</button>');

    /* Summary Card */
    html += TB.ui.card(
      TB.ops._t('Series摘要', 'Series Summary'),
      TB.ui.descList([
        {label: TB.t('lbl.seriesId'), value: s.id},
        {label: TB.t('lbl.productName'), value: s.name},
        {label: TB.t('lbl.issuer'), value: s.issuer},
        {label: TB.t('lbl.cusip'), value: s.cusip},
        {label: TB.t('lbl.isin'), value: s.isin},
        {label: TB.t('lbl.maturityDate'), value: s.maturityDate},
        {label: TB.t('lbl.faceValue'), value: TB.utils.money(s.faceTotal)},
        {label: TB.t('lbl.yield'), value: TB.utils.yield(s.sellerYield)},
        {label: TB.t('lbl.window'), value: s.windowDays + ' ' + TB.ops._t('天', 'days')},
        {label: TB.t('status'), value: TB.ui.statusBadge(s.status)},
      ])
    );

    /* Review Timeline */
    var reviewTimeline = [
      {time: s.createdAt, title: TB.ops._t('提交申请', 'Application Submitted'), desc: TB.ops._t('发行方提交Series发行申请', 'Issuer submitted series issuance application'), status: 'completed'},
      {time: s.createdAt, title: TB.ops._t('Maker审核', 'Maker Review'), desc: TB.ops._t('发行方内部审核通过', 'Issuer internal review passed'), status: 'completed'},
      {time: s.createdAt, title: TB.ops._t('合规审核', 'Compliance Review'), desc: TB.ops._t('平台合规团队审核', 'Platform compliance team review'), status: (s.status === 'pending' || s.status === 'approving') ? 'active' : 'completed'},
      {time: s.status === 'open' ? s.createdAt : '-', title: TB.ops._t('最终审批', 'Final Approval'), desc: TB.ops._t('审批通过并上架', 'Approved and listed'), status: s.status === 'open' || s.status === 'closed' ? 'completed' : 'active'},
    ];

    /* Holdings filtered by this series */
    var seriesHoldings = TB.data.holdings.filter(function(h) { return h.series === s.id; });
    var seriesQuotes = TB.data.quotes.filter(function(q) { return q.series === s.id; });

    html += TB.ui.tabs({
      items: [
        {key: 'basic', label: TB.ops._t('基本信息', 'Basic Info'), active: true},
        {key: 'review', label: TB.ops._t('审核记录', 'Review Records')},
        {key: 'lifecycle', label: TB.ops._t('生命周期', 'Lifecycle')},
        {key: 'capacity', label: TB.ops._t('容量', 'Capacity')},
        {key: 'holdings', label: TB.t('nav.holdings')},
        {key: 'quotes', label: TB.t('nav.quotes')},
      ],
      content: {
        basic: TB.ui.descList([
          {label: TB.t('lbl.seriesId'), value: s.id},
          {label: TB.t('lbl.productName'), value: s.name},
          {label: TB.t('lbl.issuer'), value: s.issuer},
          {label: TB.t('lbl.custodian'), value: s.custodian},
          {label: TB.t('lbl.cusip'), value: s.cusip},
          {label: TB.t('lbl.isin'), value: s.isin},
          {label: TB.t('lbl.maturityDate'), value: s.maturityDate},
          {label: TB.t('lbl.window'), value: s.windowDays + ' ' + TB.ops._t('天', 'days')},
          {label: TB.t('status'), value: TB.ui.statusBadge(s.status)},
          {label: TB.ops._t('创建时间', 'Created'), value: s.createdAt},
        ]),
        review: TB.ui.timeline(reviewTimeline),
        lifecycle: TB.ui.stepIndicator([
          {label: TB.ops._t('申请', 'Apply'), status: 'done'},
          {label: TB.ops._t('审核', 'Review'), status: 'done'},
          {label: TB.ops._t('铸币', 'Mint'), status: s.status === 'minting' || s.status === 'open' || s.status === 'closed' || s.status === 'maturity' || s.status === 'burned' ? 'done' : 'waiting'},
          {label: TB.ops._t('上架', 'List'), status: s.status === 'open' || s.status === 'closed' || s.status === 'maturity' || s.status === 'burned' ? 'done' : 'waiting'},
          {label: TB.ops._t('到期', 'Maturity'), status: s.status === 'maturity' || s.status === 'burned' ? 'done' : 'waiting'},
          {label: TB.ops._t('销毁', 'Burn'), status: s.status === 'burned' ? 'done' : 'waiting'},
        ]),
        capacity: TB.ui.descList([
          {label: TB.t('lbl.faceValue'), value: TB.utils.money(s.faceTotal)},
          {label: TB.t('lbl.available'), value: TB.utils.money(s.faceAvailable)},
          {label: TB.ops._t('已售', 'Sold'), value: TB.utils.money(s.faceTotal - s.faceAvailable)},
          {label: TB.ops._t('使用率', 'Utilization'), value: s.faceTotal > 0 ? Math.round((s.faceTotal - s.faceAvailable) / s.faceTotal * 100) + '%' : '0%'},
        ]) + '<div class="mt-4">' + TB.ui.progress(s.faceTotal > 0 ? Math.round((s.faceTotal - s.faceAvailable) / s.faceTotal * 100) : 0) + '</div>',
        holdings: seriesHoldings.length > 0 ? TB.ui.table({
          columns: [
            {key: 'id', label: TB.ops._t('持仓编号', 'Holding ID')},
            {key: 'member', label: TB.t('lbl.memberName')},
            {key: 'faceValue', label: TB.t('lbl.faceValue'), align: 'right', render: function(r) { return TB.utils.money(r.faceValue); }},
            {key: 'tokens', label: TB.ops._t('Token数量', 'Tokens'), render: function(r) { return TB.utils.tokens(r.tokens); }},
            {key: 'status', label: TB.t('status'), render: function(r) { return TB.ui.statusBadge(r.status); }},
          ],
          data: seriesHoldings,
        }) : TB.ui.emptyState('📋', TB.t('noData')),
        quotes: seriesQuotes.length > 0 ? TB.ui.table({
          columns: [
            {key: 'id', label: TB.ops._t('报价编号', 'Quote ID')},
            {key: 'sellerYield', label: TB.t('lbl.yield'), render: function(r) { return TB.utils.yield(r.sellerYield); }},
            {key: 'markPrice', label: TB.t('lbl.price'), render: function(r) { return TB.utils.price(r.markPrice); }},
            {key: 'quoteTime', label: TB.t('time')},
            {key: 'status', label: TB.t('status'), render: function(r) { return TB.ui.statusBadge(r.status); }},
          ],
          data: seriesQuotes,
        }) : TB.ui.emptyState('📋', TB.t('noData')),
      },
    });

    /* Ops Action Area */
    html += TB.ui.card(
      TB.ops._t('运营操作', 'Operations Actions'),
      '<div class="flex gap-2">' +
      '<button class="btn btn-primary btn-sm" onclick="TB.ops.listSeries(\''+s.id+'\')">'+TB.ops._t('上架', 'List')+'</button>' +
      '<button class="btn btn-sm" onclick="TB.ops.stopPurchase(\''+s.id+'\')">'+TB.ops._t('停止购买', 'Stop Purchase')+'</button>' +
      '<button class="btn btn-sm" onclick="TB.ops.resumePurchase(\''+s.id+'\')">'+TB.ops._t('恢复购买', 'Resume Purchase')+'</button>' +
      '<button class="btn btn-danger btn-sm" onclick="TB.ops.forceDelist(\''+s.id+'\')">'+TB.ops._t('强制下架', 'Force Delist')+'</button>' +
      '</div>'
    );

    return html;
  },

  /* ---- 6. /capacity — Capacity Management ---- */
  '/capacity': function(params) {
    var html = TB.utils.contentHeader(TB.t('nav.capacity'), '<button class="btn btn-sm" onclick="TB.ops.exportCapacity()">'+TB.t('export')+'</button>');

    html += TB.ui.filterBar({
      fields: [
        {name: 'series', label: TB.t('lbl.seriesId'), type: 'select', options: [
          {value: '', label: TB.t('all')},
        ].concat(TB.data.series.map(function(s) { return {value: s.id, label: s.id}; }))},
        {name: 'status', label: TB.t('status'), type: 'select', options: [
          {value: '', label: TB.t('all')},
          {value: 'open', label: TB.t('st.open')},
          {value: 'closed', label: TB.t('st.closed')},
          {value: 'maturity', label: TB.t('st.maturity')},
          {value: 'burned', label: TB.t('st.burned')},
        ]},
      ],
    });

    var capData = TB.data.series.map(function(s) {
      var sold = s.faceTotal - s.faceAvailable;
      var rate = s.faceTotal > 0 ? Math.round(sold / s.faceTotal * 100) : 0;
      return {
        id: s.id,
        seriesId: s.id,
        name: s.name,
        total: s.faceTotal,
        sold: sold,
        available: s.faceAvailable,
        rate: rate,
        status: s.status,
      };
    });

    html += TB.ui.table({
      columns: [
        {key: 'seriesId', label: TB.t('lbl.seriesId')},
        {key: 'name', label: TB.t('lbl.productName')},
        {key: 'total', label: TB.ops._t('总量', 'Total'), align: 'right', render: function(r) { return TB.utils.money(r.total); }},
        {key: 'sold', label: TB.ops._t('已售', 'Sold'), align: 'right', render: function(r) { return TB.utils.money(r.sold); }},
        {key: 'available', label: TB.ops._t('剩余', 'Available'), align: 'right', render: function(r) { return TB.utils.money(r.available); }},
        {key: 'rate', label: TB.ops._t('使用率', 'Utilization'), render: function(r) {
          return r.rate + '% ' + TB.ui.progress(r.rate);
        }},
        {key: 'status', label: TB.t('status'), render: function(r) { return TB.ui.statusBadge(r.status); }},
      ],
      data: capData,
      actions: [
        {label: TB.ops._t('调整容量', 'Adjust'), onClick: 'TB.ops.openCapacityModal'},
        {label: TB.t('viewDetail'), onClick: 'TB.ops.viewCapacityDetail', type: 'text'},
      ],
      pagination: {total: capData.length, pageSize: 10, current: 1},
    });

    return html;
  },


  /* ---- 8. /quote-monitor — Quote Monitor ---- */
  '/quote-monitor': function(params) {
    var validCount = TB.data.quotes.filter(function(q) { return q.status === 'valid'; }).length;
    var expiringCount = TB.data.quotes.filter(function(q) { return q.status === 'pending'; }).length;
    var usedCount = TB.data.quotes.filter(function(q) { return q.status === 'expired'; }).length;

    var html = TB.utils.contentHeader(TB.t('nav.quoteMonitor'), '<button class="btn btn-sm" onclick="TB.ops.refreshQuotes()">'+TB.t('refresh')+'</button>' +
      '<button class="btn btn-sm" onclick="TB.ops.exportQuotes()">'+TB.t('export')+'</button>');

    /* 3 Metric Cards */
    html += '<div class="stat-grid">';
    html += TB.ui.statCard(TB.ops._t('有效报价', 'Valid Quotes'), validCount, '', '', TB.ops._t('当前有效', 'Currently valid'));
    html += TB.ui.statCard(TB.ops._t('即将过期', 'Expiring Soon'), expiringCount, '', '', TB.ops._t('待确认', 'Pending'));
    html += TB.ui.statCard(TB.ops._t('已使用', 'Used/Expired'), usedCount, '', '', TB.ops._t('已过期', 'Expired'));
    html += '</div>';


    html += TB.ui.filterBar({
      fields: [
        {name: 'series', label: TB.t('lbl.seriesId'), type: 'select', options: [
          {value: '', label: TB.t('all')},
        ].concat(TB.data.series.map(function(s) { return {value: s.id, label: s.id}; }))},
        {name: 'status', label: TB.t('status'), type: 'select', options: [
          {value: '', label: TB.t('all')},
          {value: 'valid', label: TB.t('st.active')},
          {value: 'expired', label: TB.t('st.failed')},
          {value: 'pending', label: TB.t('st.pending')},
        ]},
      ],
    });

    html += TB.ui.table({
      columns: [
        {key: 'id', label: TB.ops._t('报价编号', 'Quote ID')},
        {key: 'series', label: TB.t('lbl.seriesId')},
        {key: 'provider', label: TB.t('lbl.issuer')},
        {key: 'sellerYield', label: TB.t('lbl.yield'), render: function(r) { return TB.utils.yield(r.sellerYield); }},
        {key: 'quoteTime', label: TB.ops._t('报价时间', 'Quote Time')},
        {key: 'validUntil', label: TB.ops._t('有效期至', 'Valid Until')},
        {key: 'status', label: TB.t('status'), render: function(r) { return TB.ui.statusBadge(r.status); }},
      ],
      data: TB.data.quotes,
      actions: [
        {label: TB.t('viewDetail'), onClick: 'TB.ops.viewQuoteDetail', type: 'text'},
      ],
      pagination: {total: TB.data.quotes.length, pageSize: 10, current: 1},
    });

    return html;
  },

  /* ---- 9. /review-queue — Review Queue ---- */
  '/review-queue': function(params) {
    var html = TB.utils.contentHeader(TB.t('nav.reviewQueue'), '<button class="btn btn-sm" onclick="TB.ops.openBatchApprove()">'+TB.ops._t('批量通过', 'Batch Approve')+'</button>');

    /* Left sidebar navigation + right content */
    var pendingAll = TB.data.reviewTasks.filter(function(t) { return t.status === 'pending'; });
    var pendingIssuance = pendingAll.filter(function(t) { return t.type === 'Series Issuance'; });
    var pendingBurn = pendingAll.filter(function(t) { return t.type === 'Burn Request'; });
    var pendingMember = pendingAll.filter(function(t) { return t.type === 'Member Activation'; });
    var pendingOther = pendingAll.filter(function(t) {
      return t.type !== 'Series Issuance' && t.type !== 'Burn Request' && t.type !== 'Member Activation';
    });

    var navItems = [
      {key: 'all', label: TB.t('all'), count: pendingAll.length},
      {key: 'issuance', label: TB.ops._t('发行审核', 'Issuance Review'), count: pendingIssuance.length},
      {key: 'burn', label: TB.ops._t('销毁审核', 'Burn Review'), count: pendingBurn.length},
      {key: 'member', label: TB.ops._t('成员审核', 'Member Review'), count: pendingMember.length},
      {key: 'other', label: TB.ops._t('其他', 'Other'), count: pendingOther.length},
    ];

    var sidebarHtml = '<div style="width:200px;flex-shrink:0">';
    navItems.forEach(function(n, i) {
      sidebarHtml += '<div class="menu-item' + (i === 0 ? ' active' : '') + '" onclick="TB.ops._toastFilter()" style="display:flex;justify-content:space-between;align-items:center">' +
        '<span>' + n.label + '</span>' +
        '<span class="badge badge-default">' + n.count + '</span></div>';
    });
    sidebarHtml += '</div>';

    html += '<div class="flex gap-4" style="align-items:flex-start">';
    html += sidebarHtml;
    html += '<div style="flex:1">';
    html += TB.ui.table({
      columns: [
        {key: 'id', label: TB.ops._t('任务编号', 'Task ID')},
        {key: 'type', label: TB.t('type')},
        {key: 'ref', label: TB.ops._t('业务对象', 'Object')},
        {key: 'applicant', label: TB.t('lbl.applicant')},
        {key: 'node', label: TB.t('lbl.node')},
        {key: 'time', label: TB.t('time')},
        {key: 'priority', label: TB.t('lbl.priority'), render: function(r) {
          return TB.ui.badge(TB.utils.enumLabel(r.priority), r.priority === 'High' ? 'error' : 'warning');
        }},
      ],
      data: pendingAll,
      actions: [
        {label: TB.t('review'), onClick: 'TB.ops.openReviewTask'},
        {label: TB.t('viewDetail'), onClick: 'TB.ops.viewReviewDetail', type: 'text'},
      ],
    });
    html += '</div>';
    html += '</div>';

    return html;
  },

  /* ---- 10. /checkout-maturity — Checkout/Maturity Processing ---- */
  '/checkout-maturity': function(params) {
    var html = TB.utils.contentHeader(TB.t('nav.checkoutMaturity'), '<button class="btn btn-sm" onclick="TB.ops.exportCheckout()">'+TB.t('export')+'</button>');

    html += TB.ui.filterBar({
      fields: [
        {name: 'series', label: TB.t('lbl.seriesId'), type: 'select', options: [
          {value: '', label: TB.t('all')},
        ].concat(TB.data.series.map(function(s) { return {value: s.id, label: s.id}; }))},
        {name: 'type', label: TB.ops._t('处理类型', 'Process Type'), type: 'select', options: [
          {value: '', label: TB.t('all')},
          {value: 'checkout', label: TB.t('lbl.checkout')},
          {value: 'maturity', label: TB.t('st.maturity')},
        ]},
        {name: 'status', label: TB.ops._t('处理状态', 'Status'), type: 'select', options: [
          {value: '', label: TB.t('all')},
          {value: 'pending', label: TB.t('st.pending')},
          {value: 'processing', label: TB.ops._t('处理中', 'Processing')},
          {value: 'completed', label: TB.t('st.completed')},
        ]},
      ],
    });

    /* Build checkout/maturity tasks from series data */
    var cmData = TB.data.series.filter(function(s) {
      return s.status === 'maturity' || s.status === 'burned' || s.status === 'open' || s.status === 'closed';
    }).map(function(s, i) {
      var isMaturity = s.status === 'maturity' || s.status === 'burned';
      var isCompleted = s.status === 'burned';
      var progress = isCompleted ? 100 : (isMaturity ? 0 : 0);
      var memberCount = TB.data.holdings.filter(function(h) { return h.series === s.id; }).length;
      return {
        id: 'CM-' + ('00' + (i + 1)).slice(-3),
        seriesId: s.id,
        name: s.name,
        maturityDate: s.maturityDate,
        type: isMaturity ? TB.t('st.maturity') : TB.t('lbl.checkout'),
        status: isCompleted ? 'completed' : (isMaturity ? 'pending' : 'processing'),
        progress: progress,
        members: memberCount,
      };
    });

    html += TB.ui.table({
      columns: [
        {key: 'seriesId', label: TB.t('lbl.seriesId')},
        {key: 'name', label: TB.t('lbl.productName')},
        {key: 'maturityDate', label: TB.t('lbl.maturityDate')},
        {key: 'type', label: TB.ops._t('处理类型', 'Type')},
        {key: 'status', label: TB.ops._t('处理状态', 'Status'), render: function(r) {
          return TB.ui.statusBadge(r.status);
        }},
        {key: 'progress', label: TB.ops._t('兑付进度', 'Progress'), render: function(r) {
          return r.progress + '% ' + TB.ui.progress(r.progress);
        }},
        {key: 'members', label: TB.ops._t('成员数', 'Members'), align: 'right'},
      ],
      data: cmData,
      actions: [
        {label: TB.t('viewDetail'), onClick: 'TB.ops.viewCheckoutDetail', type: 'text'},
        {label: TB.t('lbl.checkout'), onClick: 'TB.ops.openTriggerCheckout'},
        {label: TB.t('st.maturity'), onClick: 'TB.ops.openTriggerMaturity'},
      ],
      pagination: {total: cmData.length, pageSize: 10, current: 1},
    });

    return html;
  },

  /* ---- 13. /accounts — Platform Account Management ---- */
  '/accounts': function(params) {
    var html = TB.utils.contentHeader(TB.t('nav.platformAccounts'), '<button class="btn btn-sm btn-primary" onclick="TB.ops.openCreateAccount()">'+TB.t('create')+'</button>');

    html += TB.ui.filterBar({
      fields: [
        {name: 'status', label: TB.t('status'), type: 'select', options: [
          {value: '', label: TB.t('all')},
          {value: 'active', label: TB.t('st.active')},
          {value: 'suspended', label: TB.t('st.suspended')},
        ]},
        {name: 'role', label: TB.t('lbl.role'), type: 'select', options: [
          {value: '', label: TB.t('all')},
          {value: 'admin', label: 'Sys Admin'},
          {value: 'reviewer', label: 'Reviewer'},
          {value: 'operations', label: 'Operations'},
        ]},
        {name: 'org', label: TB.ops._t('所属机构', 'Organization'), type: 'select', options: [
          {value: '', label: TB.t('all')},
          {value: 'alpha', label: 'Alpha Fund Management'},
          {value: 'bison', label: 'Bison Bank'},
          {value: 'tb', label: 'TokenBank'},
        ]},
        {name: 'keyword', label: TB.ops._t('关键词', 'Keyword'), placeholder: TB.ops._t('账号名/邮箱', 'Name / Email')},
      ],
    });

    html += TB.ui.table({
      columns: [
        {key: 'name', label: TB.ops._t('账号名', 'Account Name')},
        {key: 'email', label: TB.t('lbl.email')},
        {key: 'role', label: TB.t('lbl.role')},
        {key: 'org', label: TB.ops._t('所属机构', 'Organization')},
        {key: 'type', label: TB.ops._t('账号类型', 'Account Type'), render: function(r) {
          if (r.org === 'TokenBank') return TB.t('portal.ops');
          if (r.org === 'Bison Bank') return TB.t('portal.issuer');
          return TB.t('portal.member');
        }},
        {key: 'status', label: TB.t('status'), render: function(r) { return TB.ui.statusBadge(r.status); }},
        {key: 'created', label: TB.t('lbl.created')},
        {key: 'lastLogin', label: TB.t('lbl.lastLogin')},
      ],
      data: TB.data.accounts,
      actions: [
        {label: TB.t('edit'), onClick: 'TB.ops.openEditAccount', type: 'text'},
        {label: TB.t('disable'), onClick: 'TB.ops.toggleAccountStatus', type: 'text'},
        {label: TB.t('resetPwd'), onClick: 'TB.ops.resetAccountPwd', type: 'text'},
        {label: TB.ops._t('解锁', 'Unlock'), onClick: 'TB.ops.unlockAccount', type: 'text'},
      ],
      pagination: {total: TB.data.accounts.length, pageSize: 10, current: 1},
    });

    return html;
  },

  /* ---- 14. /roles — Role & Permission Management ---- */
  '/roles': function(params) {
    var roles = [
      {id: 'R1', name: 'System Admin', members: 1, desc: TB.ops._t('全系统访问权限', 'Full system access')},
      {id: 'R2', name: 'Reviewer', members: 1, desc: TB.ops._t('审核与批准任务', 'Review and approve tasks')},
      {id: 'R3', name: 'Operations', members: 1, desc: TB.ops._t('日常运营管理', 'Day-to-day operations')},
      {id: 'R4', name: 'Compliance', members: 0, desc: TB.ops._t('合规监控', 'Compliance monitoring')},
    ];

    var html = TB.utils.contentHeader(TB.t('nav.roles'), '<button class="btn btn-sm btn-primary" onclick="TB.ops.openCreateRole()">'+TB.t('create')+'</button>');

    /* Left: role list | Right: permission matrix */
    var sidebarHtml = '<div style="width:240px;flex-shrink:0">';
    roles.forEach(function(r, i) {
      sidebarHtml += '<div class="menu-item' + (i === 0 ? ' active' : '') + '" onclick="TB.ops._toastFilter()">' +
        '<div><div class="font-bold">' + r.name + '</div>' +
        '<div class="text-sm text-muted">' + r.members + ' ' + TB.ops._t('成员', 'members') + '</div></div></div>';
    });
    sidebarHtml += '</div>';

    /* Permission matrix */
    var modules = [
      {name: TB.ops._t('成员管理', 'Member Mgmt'), perms: [true, true, false, false]},
      {name: TB.ops._t('Series管理', 'Series Mgmt'), perms: [true, true, true, false]},
      {name: TB.ops._t('容量管理', 'Capacity Mgmt'), perms: [true, false, true, false]},
      {name: TB.ops._t('审核管理', 'Review Mgmt'), perms: [true, false, false, false]},
      {name: TB.ops._t('系统管理', 'System Admin'), perms: [true, true, true, true]},
      {name: TB.ops._t('审计与日志', 'Audit & Logs'), perms: [true, false, false, false]},
      {name: TB.ops._t('公告管理', 'Announcements'), perms: [true, true, true, false]},
    ];
    var permLabels = [TB.t('all') === '全部' ? '查看' : 'View', TB.t('create'), TB.t('edit'), TB.t('delete')];

    var matrixHtml = '<table class="data-table"><thead><tr><th>'+TB.ops._t('模块', 'Module')+'</th>';
    permLabels.forEach(function(p) { matrixHtml += '<th style="text-align:center">'+p+'</th>'; });
    matrixHtml += '</tr></thead><tbody>';
    modules.forEach(function(m) {
      matrixHtml += '<tr><td>'+m.name+'</td>';
      m.perms.forEach(function(p) {
        matrixHtml += '<td style="text-align:center"><input type="checkbox" class="form-checkbox" '+(p?'checked':'')+'></td>';
      });
      matrixHtml += '</tr>';
    });
    matrixHtml += '</tbody></table>';

    html += '<div class="flex gap-4" style="align-items:flex-start">';
    html += sidebarHtml;
    html += '<div style="flex:1">';
    html += TB.ui.card(
      TB.ops._t('权限配置', 'Permission Configuration'),
      matrixHtml,
      '<button class="btn btn-sm btn-primary" onclick="TB.ops.savePermissions()">'+TB.t('save')+'</button>'
    );
    html += '</div>';
    html += '</div>';

    /* Bottom: role members table */
    html += TB.ui.card(
      TB.ops._t('角色成员', 'Role Members'),
      TB.ui.table({
        columns: [
          {key: 'name', label: TB.ops._t('账号名', 'Account Name')},
          {key: 'email', label: TB.t('lbl.email')},
          {key: 'role', label: TB.t('lbl.role')},
          {key: 'org', label: TB.ops._t('所属机构', 'Organization')},
          {key: 'status', label: TB.t('status'), render: function(r) { return TB.ui.statusBadge(r.status); }},
        ],
        data: TB.data.accounts.filter(function(a) { return a.org === 'TokenBank'; }),
        actions: [
          {label: TB.ops._t('编辑角色', 'Edit Role'), onClick: 'TB.ops.openEditRole', type: 'text'},
          {label: TB.ops._t('分配成员', 'Assign Member'), onClick: 'TB.ops.openAssignMember', type: 'text'},
          {label: TB.t('delete'), onClick: 'TB.ops.openDeleteRole', type: 'danger'},
        ],
      })
    );

    return html;
  },

  /* ---- 15. /audit-config — Audit Flow Configuration ---- */
  '/audit-config': function(params) {
    var flowTypes = [
      {id: 'F1', name: TB.ops._t('发行审核', 'Issuance Review'), enabled: true},
      {id: 'F2', name: TB.ops._t('销毁审核', 'Burn Review'), enabled: true},
      {id: 'F3', name: TB.ops._t('成员入驻审核', 'Member Onboarding Review'), enabled: true},
      {id: 'F4', name: TB.ops._t('账号激活审核', 'Account Activation Review'), enabled: false},
    ];

    var nodes = [
      {id: 'N1', order: 1, name: TB.ops._t('Maker审核', 'Maker Check')},
      {id: 'N2', order: 2, name: TB.ops._t('合规审核', 'Compliance Review')},
      {id: 'N3', order: 3, name: TB.ops._t('最终审批', 'Final Approval')},
    ];

    var html = TB.utils.contentHeader(TB.t('nav.auditConfig'), '<button class="btn btn-sm" onclick="TB.ops.saveAuditConfig()">'+TB.t('save')+'</button>');

    /* Left: flow type list | Right: node config */
    var sidebarHtml = '<div style="width:240px;flex-shrink:0">';
    flowTypes.forEach(function(f, i) {
      sidebarHtml += '<div class="menu-item' + (i === 0 ? ' active' : '') + '" onclick="TB.ops._toastFilter()">' +
        '<div style="display:flex;justify-content:space-between;align-items:center">' +
        '<span>' + f.name + '</span>' +
        '<span class="badge '+(f.enabled ? 'badge-success' : 'badge-default')+'">'+(f.enabled ? TB.t('enable') : TB.t('disable'))+'</span>' +
        '</div></div>';
    });
    sidebarHtml += '</div>';

    html += '<div class="flex gap-4" style="align-items:flex-start">';
    html += sidebarHtml;
    html += '<div style="flex:1">';

    /* Node config table — 运营端只定义节点，审核人由发行机构在发行端配置 */
    html += TB.ui.card(
      TB.ops._t('审核节点配置', 'Audit Node Configuration'),
      TB.ui.table({
        columns: [
          {key: 'order', label: TB.ops._t('节点顺序', 'Order'), align: 'center'},
          {key: 'name', label: TB.ops._t('节点名称', 'Node Name') + TB.utils.note(TB.ops._t('运营端只规定节点与顺序，具体审核人由发行机构在其审批流程配置中指定。', 'Operations only defines nodes and their order; reviewers are assigned by the issuer in its own approval flow configuration.'))},
          {key: 'returnTarget', label: TB.ops._t('退回目标', 'Return Target'), render: function() {
            return '<span class="text-muted">'+TB.ops._t('发起人', 'Initiator')+'</span>';
          }},
        ],
        data: nodes,
        actions: [
          {label: TB.t('delete'), onClick: 'TB.ops.openDeleteNode', type: 'danger'},
        ],
      }),
      '<button class="btn btn-sm btn-primary" onclick="TB.ops.openAddNode()">'+TB.ops._t('新增节点', 'Add Node')+'</button>'
    );

    /* Enable/Disable Switch */
    html += TB.ui.card(
      TB.ops._t('流程状态', 'Flow Status'),
      '<div class="flex items-center gap-2">' +
      '<label class="form-checkbox"><input type="checkbox" checked> '+TB.ops._t('启用该审核流程', 'Enable this audit flow')+'</label>' +
      '</div>'
    );

    html += '</div>';
    html += '</div>';

    return html;
  },

  /* ---- 16. /system-params — Trading Parameters Config ---- */
  '/system-params': function(params) {
    return TB.ops._renderSystemParams('trading');
  },

  /* ---- 17. /system-params/capacity — Capacity Parameters Config ---- */
  '/system-params/capacity': function(params) {
    return TB.ops._renderSystemParams('capacity');
  },

  /* ---- 18. /system-params/calendar — Market Calendar & Timezone Config ---- */
  '/system-params/calendar': function(params) {
    return TB.ops._renderSystemParams('calendar');
  },

  /* ---- 19. /audit-log — Audit Log Query ---- */
  '/audit-log': function(params) {
    var html = TB.utils.contentHeader(TB.t('nav.auditLog'), '<button class="btn btn-sm" onclick="TB.ops.exportAuditLog()">'+TB.t('export')+'</button>');

    /* Query conditions */
    html += TB.ui.filterBar({
      fields: [
        {name: 'user', label: TB.ops._t('操作人', 'Operator'), placeholder: TB.ops._t('操作人姓名', 'Operator name')},
        {name: 'type', label: TB.t('type'), type: 'select', options: [
          {value: '', label: TB.t('all')},
          {value: 'purchase', label: 'Purchase'},
          {value: 'config', label: 'Config Update'},
          {value: 'issuance', label: 'Issuance'},
          {value: 'approval', label: 'Approval'},
          {value: 'withdraw', label: 'Withdraw'},
          {value: 'auto', label: 'Auto'},
        ]},
        {name: 'start', label: TB.ops._t('开始时间', 'Start Date'), type: 'date'},
        {name: 'end', label: TB.ops._t('结束时间', 'End Date'), type: 'date'},
        {name: 'ref', label: TB.ops._t('业务对象', 'Object'), placeholder: TB.ops._t('业务对象', 'Business object')},
        {name: 'keyword', label: TB.ops._t('关键词', 'Keyword'), placeholder: TB.ops._t('关键词', 'Keyword')},
      ],
    });

    html += TB.ui.table({
      columns: [
        {key: 'id', label: TB.ops._t('日志编号', 'Log ID')},
        {key: 'user', label: TB.ops._t('操作人', 'Operator')},
        {key: 'type', label: TB.ops._t('操作类型', 'Action Type')},
        {key: 'ref', label: TB.ops._t('业务对象', 'Object')},
        {key: 'time', label: TB.t('time')},
        {key: 'result', label: TB.ops._t('结果', 'Result'), render: function(r) {
          return TB.ui.badge(TB.utils.enumLabel(r.result), r.result === 'Success' ? 'success' : 'error');
        }},
        {key: 'ip', label: TB.ops._t('IP地址', 'IP Address')},
      ],
      data: TB.data.auditLogs,
      actions: [
        {label: TB.t('viewDetail'), onClick: 'TB.ops.openLogDetail', type: 'text'},
      ],
      pagination: {total: TB.data.auditLogs.length, pageSize: 10, current: 1},
    });

    return html;
  },

  /* ---- 20. /announcements — Announcement Management ---- */
  '/announcements': function(params) {
    var html = TB.utils.contentHeader(TB.t('nav.announcements'), '<button class="btn btn-sm btn-primary" onclick="TB.ops.openPublishAnn()">'+TB.t('publish')+'</button>');

    html += TB.ui.filterBar({
      fields: [
        {name: 'status', label: TB.t('status'), type: 'select', options: [
          {value: '', label: TB.t('all')},
          {value: 'published', label: TB.t('st.active')},
          {value: 'draft', label: TB.t('st.draft')},
        ]},
        {name: 'type', label: TB.t('type'), type: 'select', options: [
          {value: '', label: TB.t('all')},
          {value: 'system', label: 'System'},
          {value: 'product', label: 'Product'},
          {value: 'maintenance', label: 'Maintenance'},
          {value: 'policy', label: 'Policy'},
        ]},
        {name: 'time', label: TB.t('time'), type: 'date'},
      ],
    });

    html += TB.ui.table({
      columns: [
        {key: 'id', label: TB.ops._t('公告编号', 'Ann ID')},
        {key: 'title', label: TB.ops._t('标题', 'Title')},
        {key: 'type', label: TB.t('type')},
        {key: 'audience', label: TB.ops._t('目标受众', 'Audience')},
        {key: 'status', label: TB.t('status'), render: function(r) {
          return TB.ui.statusBadge(r.status === 'published' ? 'active' : 'draft');
        }},
        {key: 'time', label: TB.ops._t('发布时间', 'Published')},
        {key: 'author', label: TB.ops._t('创建人', 'Author')},
      ],
      data: TB.data.announcements,
      actions: [
        {label: TB.ops._t('预览', 'Preview'), onClick: 'TB.ops.openPreviewAnn', type: 'text'},
        {label: TB.t('edit'), onClick: 'TB.ops.openEditAnn', type: 'text'},
        {label: TB.ops._t('下线', 'Unpublish'), onClick: 'TB.ops.openUnpublishAnn', type: 'text'},
        {label: TB.t('delete'), onClick: 'TB.ops.openDeleteAnn', type: 'danger'},
      ],
      pagination: {total: TB.data.announcements.length, pageSize: 10, current: 1},
    });

    return html;
  },
});

/* ============================================================
 * System Params Shared Renderer (Tab switching for 3 sub-pages)
 * ============================================================ */
TB.ops._renderSystemParams = function(activeTab) {
  var html = TB.utils.contentHeader(TB.t('nav.systemParams'), '<button class="btn btn-sm" onclick="TB.ops.resetParamsDefault()">'+TB.ops._t('重置默认', 'Reset Default')+'</button>' +
    '<button class="btn btn-sm btn-primary" onclick="TB.ops.saveParams()">'+TB.t('save')+'</button>');

  /* Trading Params Tab Content */
  var tradingContent = TB.ui.formField({
    label: TB.ops._t('面值步进', 'Face Value Step'), name: 'p_faceStep', value: '1000', hint: TB.ops._t('面值的最小变动单位', 'Minimum face value increment'),
  }) +
  TB.ui.formField({
    label: TB.ops._t('最低额', 'Min Amount'), name: 'p_minAmount', value: '100000', hint: TB.ops._t('单笔最低交易金额', 'Minimum transaction amount'),
  }) +
  TB.ui.formField({
    label: TB.ops._t('最高额', 'Max Amount'), name: 'p_maxAmount', value: '5000000', hint: TB.ops._t('单笔最高交易金额', 'Maximum transaction amount'),
  }) +
  TB.ui.formField({
    label: TB.t('lbl.window'), name: 'p_windowDays', value: '27', hint: TB.ops._t('预定窗口天数', 'Booking window in days'),
  }) +
  TB.ui.formField({
    label: TB.ops._t('Cut-off时间', 'Cut-off Time'), name: 'p_cutoff', value: '17:00', hint: TB.ops._t('每日交易截止时间', 'Daily trading cut-off time'),
  }) +
  TB.ui.formField({
    label: TB.ops._t('报价有效期', 'Quote Validity'), name: 'p_quoteValidity', value: '5', hint: TB.ops._t('报价有效期（分钟）', 'Quote validity period (minutes)'),
  }) +
  TB.ui.formField({
    label: TB.ops._t('交易费', 'Trade Fee'), name: 'p_tradeFee', value: '20', hint: TB.ops._t('每笔交易手续费（USD）', 'Transaction fee per trade (USD)'),
  });

  /* Capacity Params Tab Content */
  var capacityContent = TB.ui.formField({
    label: TB.ops._t('平台总容量', 'Platform Total Capacity'), name: 'c_platformTotal', value: '500000000', hint: TB.ops._t('全平台EMT总容量上限', 'Platform-wide EMT capacity limit'),
  }) +
  TB.ui.formField({
    label: TB.ops._t('单Series上限', 'Per Series Limit'), name: 'c_perSeries', value: '100000000', hint: TB.ops._t('单个Series面值上限', 'Max face value per series'),
  }) +
  TB.ui.formField({
    label: TB.ops._t('日容量限制', 'Daily Capacity Limit'), name: 'c_dailyLimit', value: '50000000', hint: TB.ops._t('每日新增容量上限', 'Daily new capacity limit'),
  }) +
  TB.ui.formField({
    label: TB.ops._t('EMT Cover缓冲率', 'EMT Cover Buffer'), name: 'c_coverBuffer', value: '10', hint: TB.ops._t('EMT Cover缓冲率（%）', 'EMT cover buffer rate (%)'),
  }) +
  TB.ui.formField({
    label: TB.ops._t('超发阈值', 'Overissue Threshold'), name: 'c_overissue', value: '5', hint: TB.ops._t('超发告警阈值（%）', 'Overissue alert threshold (%)'),
  }) +
  TB.ui.formField({
    label: TB.ops._t('单成员持仓上限', 'Per Member Holding Limit'), name: 'c_perMember', value: '20000000', hint: TB.ops._t('单个成员最大持仓面值', 'Max holding face value per member'),
  });

  /* Calendar Tab Content */
  var holidays = [
    {id: 'H1', name: TB.ops._t('元旦', "New Year's Day"), date: '2026-01-01', day: 'Thursday'},
    {id: 'H2', name: TB.ops._t('马丁路德金日', 'MLK Day'), date: '2026-01-19', day: 'Monday'},
    {id: 'H3', name: TB.ops._t('总统日', 'Presidents Day'), date: '2026-02-16', day: 'Monday'},
    {id: 'H4', name: TB.ops._t('独立日', 'Independence Day'), date: '2026-07-04', day: 'Saturday'},
    {id: 'H5', name: TB.ops._t('劳动节', 'Labor Day'), date: '2026-09-07', day: 'Monday'},
    {id: 'H6', name: TB.ops._t('感恩节', 'Thanksgiving'), date: '2026-11-26', day: 'Thursday'},
    {id: 'H7', name: TB.ops._t('圣诞节', 'Christmas'), date: '2026-12-25', day: 'Friday'},
  ];

  /* Build calendar grid for November 2026 */
  var calHtml = '<div style="margin-bottom:16px">';
  calHtml += '<div class="flex items-center justify-between mb-4"><h3>'+TB.ops._t('2026年11月', 'November 2026')+'</h3></div>';
  var weekdays = TB.state.lang === 'zh' ? ['一','二','三','四','五','六','日'] : ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  calHtml += '<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;text-align:center">';
  weekdays.forEach(function(w) { calHtml += '<div class="text-sm font-bold" style="padding:8px;background:var(--surface-alt);border-radius:4px">'+w+'</div>'; });
  /* Nov 2026: 1st is Sunday (day 7) → starts on Mon Oct 26? Let's do Mon=col1 */
  /* Simpler: Nov 1 2026 is a Sunday → week 1 has Mon-Sun = empty,empty,empty,empty,empty,empty,Nov1 */
  var nonTradingDays = {1: true, 6: true, 7: true, 13: true, 14: true, 20: true, 21: true, 26: true, 27: true, 28: true};
  var firstDayOffset = 6; /* Nov 1 is Sunday → offset 6 (Mon=0,...,Sun=6) */
  var daysInMonth = 30;
  var cells = [];
  for (var i = 0; i < firstDayOffset; i++) { cells.push(0); }
  for (var d = 1; d <= daysInMonth; d++) { cells.push(d); }
  while (cells.length % 7 !== 0) { cells.push(0); }
  cells.forEach(function(c) {
    if (c === 0) {
      calHtml += '<div style="padding:12px;min-height:48px;border-radius:4px"></div>';
    } else {
      var isHoliday = nonTradingDays[c];
      var bg = isHoliday ? 'var(--error-light)' : 'var(--success-light)';
      var color = isHoliday ? 'var(--error)' : 'var(--success)';
      calHtml += '<div style="padding:12px;min-height:48px;border-radius:4px;background:'+bg+';color:'+color+';font-weight:600">'+c+'</div>';
    }
  });
  calHtml += '</div>';
  calHtml += '<div class="flex gap-4 mt-4">' +
    '<span class="badge badge-success">'+TB.ops._t('交易日', 'Trading Day')+'</span>' +
    '<span class="badge badge-error">'+TB.ops._t('非交易日', 'Non-trading Day')+'</span>' +
    '</div>';
  calHtml += '</div>';

  var calendarContent = calHtml +
    TB.ui.card(
      TB.ops._t('节假日列表', 'Holiday List'),
      TB.ui.table({
        columns: [
          {key: 'name', label: TB.ops._t('节假日名称', 'Holiday Name')},
          {key: 'date', label: TB.t('date')},
          {key: 'day', label: TB.ops._t('星期', 'Day of Week')},
        ],
        data: holidays,
        actions: [
          {label: TB.t('delete'), onClick: 'TB.ops.openDeleteHoliday', type: 'danger'},
        ],
      }),
      '<button class="btn btn-sm btn-primary" onclick="TB.ops.openAddHoliday()">'+TB.ops._t('新增节假日', 'Add Holiday')+'</button>' +
      '<button class="btn btn-sm" onclick="TB.ops.saveCalendar()">'+TB.t('save')+'</button>'
    ) +
    TB.ui.card(
      TB.ops._t('时区配置', 'Timezone Configuration'),
      TB.ui.formField({
        label: TB.ops._t('系统时区', 'System Timezone'), name: 'tz_system', type: 'select',
        options: [
          {value: 'utc', label: 'UTC'},
          {value: 'est', label: 'America/New_York (EST)'},
          {value: 'cet', label: 'Europe/Zurich (CET)'},
          {value: 'sgt', label: 'Asia/Singapore (SGT)'},
          {value: 'hkt', label: 'Asia/Hong_Kong (HKT)'},
        ],
      }) +
      TB.ui.formField({
        label: TB.ops._t('交易日历基准时区', 'Trading Calendar Base TZ'), name: 'tz_trading', type: 'select',
        options: [
          {value: 'est', label: 'America/New_York (EST)', selected: true},
          {value: 'utc', label: 'UTC'},
        ],
      })
    );

  /* Tabs with all three contents */
  html += TB.ui.tabs({
    items: [
      {key: 'trading', label: TB.ops._t('交易参数', 'Trading Params'), active: activeTab === 'trading'},
      {key: 'capacity', label: TB.ops._t('容量参数', 'Capacity Params'), active: activeTab === 'capacity'},
      {key: 'calendar', label: TB.ops._t('市场日历', 'Market Calendar'), active: activeTab === 'calendar'},
    ],
    content: {
      trading: tradingContent,
      capacity: capacityContent,
      calendar: calendarContent,
    },
  });

  return html;
};

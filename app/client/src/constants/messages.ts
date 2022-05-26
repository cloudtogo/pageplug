export function createMessage(
  format: (...strArgs: any[]) => string,
  ...args: any[]
) {
  return format(...args);
}

/* eslint-disable */
export const ERROR_MESSAGE_SELECT_ACTION = () => `请选择一个动作`;
export const ERROR_MESSAGE_SELECT_ACTION_TYPE = () =>
  `请选择一个动作类型`;
export const ACTION_CREATED_SUCCESS = (actionName: string) =>
  `${actionName} 动作创建成功`;
export const ERROR_ADD_API_INVALID_URL = () =>
  `无法创建API，请在数据源中添加URL`;
export const ERROR_MESSAGE_NAME_EMPTY = () => `名字不能为空`;
export const ERROR_MESSAGE_CREATE_APPLICATION = () =>
  `应用创建失败`;
export const APPLICATION_NAME_UPDATE = () => `应用名更新成功`;
export const ERROR_EMPTY_APPLICATION_NAME = () =>
  `应用名不能为空`;
export const API_PATH_START_WITH_SLASH_ERROR = () => `路径不能用 / 开头`;
export const FIELD_REQUIRED_ERROR = () => `必填`;
export const VALID_FUNCTION_NAME_ERROR = () =>
  `函数名必须符合命名规则（驼峰式）`;
export const UNIQUE_NAME_ERROR = () => `名字必须是独一无二的`;
export const NAME_SPACE_ERROR = () => `名字不能包含空白符`;

export const FORM_VALIDATION_EMPTY_EMAIL = () => `请输入邮箱`;
export const FORM_VALIDATION_INVALID_EMAIL = () =>
  `请提供一个有效的邮箱`;
export const ENTER_VIDEO_URL = () => `请提供一个有效的URL`;

export const FORM_VALIDATION_EMPTY_PASSWORD = () => `请输入密码`;
export const FORM_VALIDATION_PASSWORD_RULE = () =>
  `密码应该不少于6位`;
export const FORM_VALIDATION_INVALID_PASSWORD = FORM_VALIDATION_PASSWORD_RULE;

export const LOGIN_PAGE_SUBTITLE = () => `使用你所属应用组的邮箱`;
export const LOGIN_PAGE_TITLE = () => `欢迎回来`;
export const LOGIN_PAGE_EMAIL_INPUT_LABEL = () => `邮箱`;
export const LOGIN_PAGE_PASSWORD_INPUT_LABEL = () => `密码`;
export const LOGIN_PAGE_EMAIL_INPUT_PLACEHOLDER = () => `请输入你的邮箱`;
export const LOGIN_PAGE_PASSWORD_INPUT_PLACEHOLDER = () => `请输入至少6位密码`;
export const LOGIN_PAGE_INVALID_CREDS_ERROR = () =>
  `密码输入错误😂 如果忘记了密码你可以`;
export const LOGIN_PAGE_INVALID_CREDS_FORGOT_PASSWORD_LINK = () =>
  `重置密码`;
export const NEW_TO_APPSMITH = () => `萌新还没有账号？`;

export const LOGIN_PAGE_LOGIN_BUTTON_TEXT = () => `登录`;
export const LOGIN_PAGE_FORGOT_PASSWORD_TEXT = () => `忘记密码`;
export const LOGIN_PAGE_REMEMBER_ME_LABEL = () => `记住我`;
export const LOGIN_PAGE_SIGN_UP_LINK_TEXT = () => `注册`;
export const SIGNUP_PAGE_TITLE = () => `注册账号`;
export const SIGNUP_PAGE_SUBTITLE = () => `你的应用组邮箱`;
export const SIGNUP_PAGE_EMAIL_INPUT_LABEL = () => `邮箱`;
export const SIGNUP_PAGE_EMAIL_INPUT_PLACEHOLDER = () => `请输入你的邮箱`;
export const SIGNUP_PAGE_NAME_INPUT_PLACEHOLDER = () => `用户名`;
export const SIGNUP_PAGE_NAME_INPUT_LABEL = () => `用户名`;
export const SIGNUP_PAGE_PASSWORD_INPUT_LABEL = () => `密码`;
export const SIGNUP_PAGE_PASSWORD_INPUT_PLACEHOLDER = () => `请输入至少6位密码`;
export const SIGNUP_PAGE_LOGIN_LINK_TEXT = () => `登录`;
export const SIGNUP_PAGE_NAME_INPUT_SUBTEXT = () => `请问如何称呼？`;
export const SIGNUP_PAGE_SUBMIT_BUTTON_TEXT = () => `注册`;
export const ALREADY_HAVE_AN_ACCOUNT = () => `已经有账号了吗？`;

export const SIGNUP_PAGE_SUCCESS = () =>
  `太棒了！注册成功！✨✨✨`;
export const SIGNUP_PAGE_SUCCESS_LOGIN_BUTTON_TEXT = () => `登录`;

export const RESET_PASSWORD_PAGE_PASSWORD_INPUT_LABEL = () => `新密码`;
export const RESET_PASSWORD_PAGE_PASSWORD_INPUT_PLACEHOLDER = () =>
  `请输入至少6位密码`;
export const RESET_PASSWORD_LOGIN_LINK_TEXT = () => `去登录`;
export const RESET_PASSWORD_PAGE_TITLE = () => `重置密码`;
export const RESET_PASSWORD_SUBMIT_BUTTON_TEXT = () => `重置`;
export const RESET_PASSWORD_PAGE_SUBTITLE = () =>
  `这回不要再忘记了哦😁，不过忘记了也没关系，你可以随时过来重置👌`;

export const RESET_PASSWORD_RESET_SUCCESS = () =>
  `密码重置成功`; //`Your password has been reset. Please login` (see next entry));
export const RESET_PASSWORD_RESET_SUCCESS_LOGIN_LINK = () => `登录`;

export const RESET_PASSWORD_EXPIRED_TOKEN = () =>
  `密码重置链接已经过期了，请再次申请重置吧。`;
export const RESET_PASSWORD_INVALID_TOKEN = () =>
  `密码重置链接已经失效了，请再次申请重置吧。`;
export const RESET_PASSWORD_FORGOT_PASSWORD_LINK = () => `忘记密码`;

export const FORGOT_PASSWORD_PAGE_EMAIL_INPUT_LABEL = () => `邮箱`;
export const FORGOT_PASSWORD_PAGE_EMAIL_INPUT_PLACEHOLDER = () => `请输入你的邮箱`;
export const FORGOT_PASSWORD_PAGE_TITLE = () => `重置密码`;
export const FORGOT_PASSWORD_PAGE_SUBTITLE = () =>
  `我们将会往这个邮箱发送一封重置密码的邮件`;
export const FORGOT_PASSWORD_PAGE_SUBMIT_BUTTON_TEXT = () => `重置`;
export const FORGOT_PASSWORD_SUCCESS_TEXT = () =>
  `重置密码的邮件已经发送成功了，快去看看吧`;

export const PRIVACY_POLICY_LINK = () => `隐私政策`;
export const TERMS_AND_CONDITIONS_LINK = () => `服务条款`;

export const ERROR_500 = () =>
  `很抱歉，服务端出错了😱`;
export const ERROR_0 = () =>
  `无法连接到服务器，请检查你的网络连接`;
export const ERROR_401 = () =>
  `我们无法校验你的登录信息，请重新登录吧`;
export const ERROR_403 = () =>
  `无权访问。请联系你的管理员给你添加访问权限`;
export const URL_HTTP_VALIDATION_ERROR = () => `请输入有效的URL`;
export const NAVIGATE_TO_VALIDATION_ERROR = () =>
  `请输入有效的地址或者域名`;
export const PAGE_NOT_FOUND_ERROR = () =>
  `你想访问的页面不存在`;
export const INVALID_URL_ERROR = () => `无效URL`;

export const INVITE_USERS_VALIDATION_EMAIL_LIST = () =>
  `存在无效的邮箱地址`;
export const INVITE_USERS_VALIDATION_ROLE_EMPTY = () => `请选择角色`;

export const INVITE_USERS_EMAIL_LIST_PLACEHOLDER = () =>
  `逗号分隔的邮箱地址`;
export const INVITE_USERS_ROLE_SELECT_PLACEHOLDER = () => `选择角色`;
export const INVITE_USERS_ROLE_SELECT_LABEL = () => `角色`;
export const INVITE_USERS_EMAIL_LIST_LABEL = () => `用户邮箱`;
export const INVITE_USERS_ADD_EMAIL_LIST_FIELD = () => `添加更多`;
export const INVITE_USERS_SUBMIT_BUTTON_TEXT = () => `邀请小伙伴`;
export const INVITE_USERS_SUBMIT_ERROR = () =>
  `无法邀请小伙伴，请稍后重试`;
export const INVITE_USERS_SUBMIT_SUCCESS = () =>
  `成功向小伙伴们发出了邀请`;
export const INVITE_USER_SUBMIT_SUCCESS = () =>
  `成功向小伙伴发出了邀请`;
export const INVITE_USERS_VALIDATION_EMAILS_EMPTY = () =>
  `请告诉我们小伙伴们的邮箱吧`;

export const CREATE_PASSWORD_PAGE_PASSWORD_INPUT_LABEL = () => `新密码`;
export const CREATE_PASSWORD_PAGE_PASSWORD_INPUT_PLACEHOLDER = () =>
  `新密码`;
export const CREATE_PASSWORD_LOGIN_LINK_TEXT = () =>
  `知道密码了吗？马上登录`;
export const CREATE_PASSWORD_PAGE_TITLE = () => `设置密码`;
export const CREATE_PASSWORD_SUBMIT_BUTTON_TEXT = () => `创建`;
export const CREATE_PASSWORD_PAGE_SUBTITLE = () =>
  `设置新密码`;

export const CREATE_PASSWORD_RESET_SUCCESS = () => `密码设置成功`;
export const CREATE_PASSWORD_RESET_SUCCESS_LOGIN_LINK = () => `登录`;

export const CREATE_PASSWORD_EXPIRED_TOKEN = () =>
  `邀请链接已经过期了，请重新邀请吧`;
export const CREATE_PASSWORD_INVALID_TOKEN = () =>
  `邀请链接已经失效了，请重新邀请吧`;

export const DELETING_APPLICATION = () => `正在删除应用...`;
export const DUPLICATING_APPLICATION = () => `正在复制应用...`;

export const CURL_IMPORT_SUCCESS = () => `Curl 命令导入成功`;
export const FORGOT_PASSWORD_PAGE_LOGIN_LINK = () => `登录`;
export const ADD_API_TO_PAGE_SUCCESS_MESSAGE = (actionName: string) =>
  `${actionName} API 添加成功`;
export const INPUT_WIDGET_DEFAULT_VALIDATION_ERROR = () => `无效输入`;

export const AUTOFIT_ALL_COLUMNS = () => `自动调整所有列`;
export const AUTOFIT_THIS_COLUMN = () => `自动调整本列`;
export const AUTOFIT_COLUMN = () => `自动调整列`;

export const DATE_WIDGET_DEFAULT_VALIDATION_ERROR = () => "日期超出范围";

export const TIMEZONE = () => `时区`;
export const ENABLE_TIME = () => `启用时间`;

export const EDIT_APP = () => `编辑`;
export const FORK_APP = () => `复制`;
export const SIGN_IN = () => `登录`;

export const LIGHTNING_MENU_DATA_API = () => `使用接口数据`;
export const LIGHTNING_MENU_DATA_QUERY = () => `使用数据库数据`;
export const LIGHTNING_MENU_DATA_TOOLTIP = () => `快速数据绑定`;
export const LIGHTNING_MENU_DATA_WIDGET = () => `使用组件数据`;
export const LIGHTNING_MENU_QUERY_CREATE_NEW = () => `新建查询`;
export const LIGHTNING_MENU_API_CREATE_NEW = () => `新建接口`;

export const LIGHTNING_MENU_OPTION_TEXT = () => `纯文本`;
export const LIGHTNING_MENU_OPTION_JS = () => `写 JS`;
export const LIGHTNING_MENU_OPTION_HTML = () => `写 HTML`;
export const CHECK_REQUEST_BODY = () => `需要检查请求体吗?`;
export const DONT_SHOW_THIS_AGAIN = () => `不再展示`;
export const SHOW_REQUEST = () => `展示请求`;

export const TABLE_FILTER_COLUMN_TYPE_CALLOUT = () =>
  `请修改列数据类型`;

export const WIDGET_SIDEBAR_TITLE = () => `组件`;
export const WIDGET_SIDEBAR_CAPTION = () =>
  `将组件拖动到右侧画布`;
export const GOOGLE_RECAPTCHA_KEY_ERROR = () =>
  `谷歌鉴权 Token 生成失败！请检查 Re-captcha 站点里的键值`;
export const GOOGLE_RECAPTCHA_DOMAIN_ERROR = () =>
  `谷歌鉴权 Token 生成失败！请检查允许的域名`;

export const SERVER_API_TIMEOUT_ERROR = () =>
  `服务器响应超时！请稍后重试`;
export const DEFAULT_ERROR_MESSAGE = () => `出现了意外的错误`;
export const REMOVE_FILE_TOOL_TIP = () => "删除上传";
export const ERROR_FILE_TOO_LARGE = (fileSize: string) =>
  `文件最大支持 ${fileSize}!`;
export const ERROR_DATEPICKER_MIN_DATE = () =>
  `最小日期不能超过当前设置的日期`;
export const ERROR_DATEPICKER_MAX_DATE = () =>
  `最大日期不能超过当前设置的日期`;
export const ERROR_WIDGET_DOWNLOAD = (err: string) => `下载失败。 ${err}`;
export const ERROR_API_EXECUTE = (actionName: string) =>
  `${actionName} 运行失败😢，请检查它的配置是否正确`;
export const ERROR_FAIL_ON_PAGE_LOAD_ACTIONS = () =>
  `在页面加载的过程中，动作运行失败了😢`;
export const ERROR_ACTION_EXECUTE_FAIL = (actionName: string) =>
  `${actionName} 动作执行失败`;
export const ACTION_DELETE_SUCCESS = (actionName: string) =>
  `${actionName} 动作删除成功`;
export const ACTION_MOVE_SUCCESS = (actionName: string, pageName: string) =>
  `${actionName} 动作成功移动到页面 ${pageName}`;
export const ERROR_ACTION_MOVE_FAIL = (actionName: string) =>
  `移动动作 ${actionName} 失败😢`;
export const ACTION_COPY_SUCCESS = (actionName: string, pageName: string) =>
  `${actionName} 动作成功复制到页面 ${pageName}`;
export const ERROR_ACTION_COPY_FAIL = (actionName: string) =>
  `复制动作 ${actionName} 失败😢`;
export const ERROR_ACTION_RENAME_FAIL = (actionName: string) =>
  `重命名动作 ${actionName} 失败😢`;

export const DATASOURCE_CREATE = (dsName: string) =>
  `${dsName} 数据源创建成功`;
export const DATASOURCE_DELETE = (dsName: string) =>
  `${dsName} 数据源删除成功`;
export const DATASOURCE_UPDATE = (dsName: string) =>
  `${dsName} 数据源更新成功`;
export const DATASOURCE_VALID = (dsName: string) =>
  `${dsName} 数据源校验成功`;

export const ERROR_EVAL_ERROR_GENERIC = () =>
  `解析应用的时候出现了意外的错误`;

export const ERROR_EVAL_TRIGGER = (message: string) =>
  `解析应用触发器的时候出现了错误: ${message}`;

export const WIDGET_DELETE = (widgetName: string) =>
  `${widgetName} 组件删除成功`;
export const WIDGET_BULK_DELETE = (widgetName: string) =>
  `${widgetName} 组件批量删除成功`;
export const WIDGET_COPY = (widgetName: string) => `成功复制 ${widgetName}`;
export const ERROR_WIDGET_COPY_NO_WIDGET_SELECTED = () =>
  `请选择要复制的组件`;
export const ERROR_WIDGET_COPY_NOT_ALLOWED = () =>
  `无法复制选中的组件`;
export const WIDGET_CUT = (widgetName: string) => `剪切 ${widgetName}`;
export const ERROR_WIDGET_CUT_NO_WIDGET_SELECTED = () =>
  `请选择要剪切的组件`;
export const SELECT_ALL_WIDGETS_MSG = () =>
  `已经全部选中页面上的所有组件（包括弹窗）`;
export const ERROR_ADD_WIDGET_FROM_QUERY = () => `添加组件失败`;

export const REST_API_AUTHORIZATION_SUCCESSFUL = () =>
  "鉴权成功";
export const REST_API_AUTHORIZATION_FAILED = () =>
  "鉴权失败😢，请仔细检查你的信息或者重试";
// Todo: improve this for appsmith_error error message
export const REST_API_AUTHORIZATION_APPSMITH_ERROR = () =>
  "好像出现了一些内部错误，不过请放心，我们已经收集了现场情况";

export const SAAS_AUTHORIZATION_SUCCESSFUL = "鉴权成功！";
export const SAAS_AUTHORIZATION_FAILED =
  "鉴权失败😢，请仔细检查你的信息或者重试";
// Todo: improve this for appsmith_error error message
export const SAAS_AUTHORIZATION_APPSMITH_ERROR = "好像出现了一些内部错误，不过请放心，我们已经收集了现场情况";
export const SAAS_APPSMITH_TOKEN_NOT_FOUND = "没有找到系统token";

export const LOCAL_STORAGE_QUOTA_EXCEEDED_MESSAGE = () =>
  "本地存储失败😢，本地存储大小已经超过了浏览器的最大限制";
export const LOCAL_STORAGE_NO_SPACE_LEFT_ON_DEVICE_MESSAGE = () =>
  "本地存储失败😢，磁盘空间不足";
export const LOCAL_STORAGE_NOT_SUPPORTED_APP_MIGHT_NOT_WORK_AS_EXPECTED = () =>
  "你的设备不支持本地存储，系统依赖本地存储的一些功能无法生效";

export const OMNIBAR_PLACEHOLDER = () =>
  "搜索组件、数据、文档等";
export const HELPBAR_PLACEHOLDER = () => "快速搜索导航";
export const NO_SEARCH_DATA_TEXT = () => "暂无搜索结果";

export const WIDGET_BIND_HELP = () =>
  "不清楚如何进行数据绑定吗？";

export const BACK_TO_HOMEPAGE = () => "回到主页";

export const PAGE_NOT_FOUND = () => "找不到页面";

export const RESOLVE = () => "解决";
export const UNRESOLVE = () => "未解决";

// comments
export const ADD_COMMENT_PLACEHOLDER = () => "添加评论，你可以用@去提醒他人";
export const PIN_COMMENT = () => "固定评论";
export const UNPIN_COMMENT = () => "取消固定评论";
export const COPY_LINK = () => "复制链接";
export const DELETE_COMMENT = () => "删除评论";
export const DELETE_THREAD = () => "删除话题";
export const EDIT_COMMENT = () => "编辑评论";
export const COMMENTS = () => "所有评论";
export const VIEW_LATEST = () => "只看最新";
export const POST = () => "提交";
export const CANCEL = () => "取消";
export const NO_COMMENTS_CLICK_ON_CANVAS_TO_ADD = () =>
  `暂无评论 \n 点击画布任意地方 \n开始交流`;
export const LINK_COPIED_SUCCESSFULLY = () => "链接已经复制到粘贴板";
export const FULL_NAME = () => "全名";
export const DISPLAY_NAME = () => "昵称";
export const EMAIL_ADDRESS = () => "邮箱地址";
export const FIRST_AND_LAST_NAME = () => "姓名";
export const MARK_ALL_AS_READ = () => "全部标记已读";
export const INVITE_A_NEW_USER = () => "邀请一个新伙伴";
export const REMOVE = () => "删除";
export const NO_NOTIFICATIONS_TO_SHOW = () => "暂无通知";
export const UNREAD_MESSAGE = () => "未读消息";
export const UNSUBSCRIBE_EMAIL_SUCCESS = () =>
  "话题退订成功";
export const UNSUBSCRIBE_EMAIL_MSG_1 = () =>
  "系统不会再向你发送话题邮件";
export const UNSUBSCRIBE_EMAIL_MSG_2 = () =>
  "如果有人在讨论中标记了你，或者你回复了评论，系统会自动为你订阅话题";
export const UNSUBSCRIBE_EMAIL_CONFIRM_MSG = () =>
  "确定取消订阅吗？";
export const UNSUBSCRIBE_BUTTON_LABEL = () => "取消订阅";

// Showcase Carousel
export const NEXT = () => "下一个";
export const BACK = () => "返回";
export const SKIP = () => "跳过";

// Debugger
export const CLICK_ON = () => "👉 点击 ";
export const PRESS = () => "🎉 点击 ";
export const OPEN_THE_DEBUGGER = () => " 打开调试器";
export const NO_LOGS = () => "💌 暂无日志";
export const NO_ERRORS = () => "🌈 一切顺利！";
export const DEBUGGER_ERRORS = () => "错误";
export const DEBUGGER_LOGS = () => "日志";
export const INSPECT_ENTITY = () => "检查实体";
export const INSPECT_ENTITY_BLANK_STATE = () => "选择一个要检查的实体";
export const ACTION_CONFIGURATION_UPDATED = () => "配置已更新";
export const WIDGET_PROPERTIES_UPDATED = () => "组件属性已更新";
export const EMPTY_RESPONSE_FIRST_HALF = () => "👉 点击";
export const EMPTY_RESPONSE_LAST_HALF = () => "获取响应";
export const INVALID_EMAIL = () => "请输入有效的邮箱";

export const TROUBLESHOOT_ISSUE = () => "答疑解惑";

// Import/Export Application features
export const IMPORT_APPLICATION_MODAL_TITLE = () => "导入应用";

export const DELETE_CONFIRMATION_MODAL_TITLE = () => `请再次确认`;
export const DELETE_CONFIRMATION_MODAL_SUBTITLE = (name?: string | null) =>
  `确定将 ${name} 移出应用组吗？`;

// Generate page from DB Messages

export const UNSUPPORTED_PLUGIN_DIALOG_TITLE = () =>
  `这个数据源不支持自动生成页面`;

export const UNSUPPORTED_PLUGIN_DIALOG_SUBTITLE = () =>
  `你可以继续拖拽组件来设计你的应用`;
export const UNSUPPORTED_PLUGIN_DIALOG_MAIN_HEADING = () => `请注意`;

export const BUILD_FROM_SCRATCH_ACTION_SUBTITLE = () =>
  "通过拖拉拽来创造你的应用";

export const BUILD_FROM_SCRATCH_ACTION_TITLE = () => "空白页面";

export const GENERATE_PAGE_ACTION_TITLE = () => "自动生成页面";

export const GENERATE_PAGE_ACTION_SUBTITLE = () =>
  "通过数据表自动生成增删改查页面";

export const GENERATE_PAGE_FORM_TITLE = () => "数据直接生成页面";
// Actions Right pane
export const SEE_CONNECTED_ENTITIES = () => "显示所有已连接的实体";
export const INCOMING_ENTITIES = () => "输入实体";
export const NO_INCOMING_ENTITIES = () => "暂无输入实体";
export const OUTGOING_ENTITIES = () => "输出实体";
export const NO_OUTGOING_ENTITIES = () => "暂无输出实体";
export const NO_CONNECTIONS = () => "暂无连接";
export const BACK_TO_CANVAS = () => "回到画布";
export const SUGGESTED_WIDGET_DESCRIPTION = () =>
  "添加新组件到画布";
export const ADD_NEW_WIDGET = () => "添加新组件";
export const SUGGESTED_WIDGETS = () => "推荐组件";
export const SUGGESTED_WIDGET_TOOLTIP = () => "添加到画布";

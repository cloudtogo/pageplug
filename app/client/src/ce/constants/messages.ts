export function createMessage(
  format: (...strArgs: any[]) => string,
  ...args: any[]
) {
  return format(...args);
}

export const YES = () => `是的`;
export const ARE_YOU_SURE = () => `确定吗？`;
export const ERROR_ADD_API_INVALID_URL = () =>
  `创建 API 失败！请给你的数据源添加地址`;
export const ERROR_MESSAGE_NAME_EMPTY = () => `请选择一个名字`;
export const ERROR_MESSAGE_CREATE_APPLICATION = () => `应用创建失败`;
export const APPLICATION_NAME_UPDATE = () => `应用名称已更新`;
export const ERROR_EMPTY_APPLICATION_NAME = () => `应用名称不能为空`;
export const API_PATH_START_WITH_SLASH_ERROR = () => `路径不能以 / 开头`;
export const FIELD_REQUIRED_ERROR = () => `必填字段`;
export const INPUT_DEFAULT_TEXT_MAX_CHAR_ERROR = (max: number) =>
  `默认字符最大长度为 ${max}`;
export const INPUT_TEXT_MAX_CHAR_ERROR = (max: number) =>
  `文本长度必须小于 ${max}`;
export const INPUT_DEFAULT_TEXT_MAX_NUM_ERROR = () => `默认文本长度超出最大值`;
export const INPUT_DEFAULT_TEXT_MIN_NUM_ERROR = () => `默认文本长度超出最小值`;
export const VALID_FUNCTION_NAME_ERROR = () => `函数名不符合规范（驼峰式）`;
export const UNIQUE_NAME_ERROR = () => `名字必须唯一`;
export const NAME_SPACE_ERROR = () => `名字中间不能包含空格`;
export const SPECIAL_CHARACTER_ERROR = () => `名字只能包含字母和数字`;

export const FORM_VALIDATION_EMPTY_EMAIL = () => `请填写邮箱地址`;
export const FORM_VALIDATION_INVALID_EMAIL = () => `请填写有效的邮箱地址`;
export const ENTER_VIDEO_URL = () => `请填写有效的地址`;
export const ENTER_AUDIO_URL = () => `请填写有效的地址`;

export const FORM_VALIDATION_EMPTY_PASSWORD = () => `请输入密码`;
export const FORM_VALIDATION_PASSWORD_RULE = () => `密码必须是 6 ~ 42 个字符`;
export const FORM_VALIDATION_INVALID_PASSWORD = FORM_VALIDATION_PASSWORD_RULE;

export const LOGIN_PAGE_SUBTITLE = () => `使用你的团队邮箱`;
export const LOGIN_PAGE_TITLE = () => `登录你的账号`;
export const LOGIN_PAGE_EMAIL_INPUT_LABEL = () => `邮箱`;
export const LOGIN_PAGE_PASSWORD_INPUT_LABEL = () => `密码`;
export const LOGIN_PAGE_EMAIL_INPUT_PLACEHOLDER = () => `请输入邮箱地址`;
export const LOGIN_PAGE_PASSWORD_INPUT_PLACEHOLDER = () => `请输入密码`;
export const LOGIN_PAGE_INVALID_CREDS_ERROR = () =>
  `密码校验失败，请重试，或者点击下面的按钮重置密码`;
export const LOGIN_PAGE_INVALID_CREDS_FORGOT_PASSWORD_LINK = () => `重置密码`;
export const NEW_TO_APPSMITH = () => `是新朋友吗？`;

export const LOGIN_PAGE_LOGIN_BUTTON_TEXT = () => `登录`;
export const LOGIN_PAGE_FORGOT_PASSWORD_TEXT = () => `忘记密码`;
export const LOGIN_PAGE_REMEMBER_ME_LABEL = () => `记住我`;
export const LOGIN_PAGE_SIGN_UP_LINK_TEXT = () => `注册`;
export const SIGNUP_PAGE_TITLE = () => `注册免费账号`;
export const SIGNUP_PAGE_SUBTITLE = () => `使用你的团队邮箱`;
export const SIGNUP_PAGE_EMAIL_INPUT_LABEL = () => `邮箱`;
export const SIGNUP_PAGE_EMAIL_INPUT_PLACEHOLDER = () => `邮箱`;
export const SIGNUP_PAGE_NAME_INPUT_PLACEHOLDER = () => `昵称`;
export const SIGNUP_PAGE_NAME_INPUT_LABEL = () => `昵称`;
export const SIGNUP_PAGE_PASSWORD_INPUT_LABEL = () => `密码`;
export const SIGNUP_PAGE_PASSWORD_INPUT_PLACEHOLDER = () => `密码`;
export const SIGNUP_PAGE_LOGIN_LINK_TEXT = () => `登录`;
export const SIGNUP_PAGE_NAME_INPUT_SUBTEXT = () => `我们应该怎么称呼你？`;
export const SIGNUP_PAGE_SUBMIT_BUTTON_TEXT = () => `注册`;
export const ALREADY_HAVE_AN_ACCOUNT = () => `已经有账号了吗？`;

export const SIGNUP_PAGE_SUCCESS = () => `恭喜注册成功！`;
export const SIGNUP_PAGE_SUCCESS_LOGIN_BUTTON_TEXT = () => `登录`;

export const RESET_PASSWORD_PAGE_PASSWORD_INPUT_LABEL = () => `新密码`;
export const RESET_PASSWORD_PAGE_PASSWORD_INPUT_PLACEHOLDER = () => `新密码`;
export const RESET_PASSWORD_LOGIN_LINK_TEXT = () => `返回登录`;
export const RESET_PASSWORD_PAGE_TITLE = () => `重置密码`;
export const RESET_PASSWORD_SUBMIT_BUTTON_TEXT = () => `重置`;
export const RESET_PASSWORD_PAGE_SUBTITLE = () => `重置你的账号密码 `;

export const RESET_PASSWORD_RESET_SUCCESS = () => `重置成功`; //`Your password has been reset. Please login` (see next entry));
export const RESET_PASSWORD_RESET_SUCCESS_LOGIN_LINK = () => `登录`;

export const RESET_PASSWORD_EXPIRED_TOKEN = () =>
  `密码重置链接已经失效，请重新生成新的链接`;
export const RESET_PASSWORD_INVALID_TOKEN = () =>
  `密码重置链接已经失效，请重新生成新的链接`;
export const RESET_PASSWORD_FORGOT_PASSWORD_LINK = () => `忘记密码`;

export const FORGOT_PASSWORD_PAGE_EMAIL_INPUT_LABEL = () => `邮箱`;
export const FORGOT_PASSWORD_PAGE_EMAIL_INPUT_PLACEHOLDER = () => `邮箱`;
export const FORGOT_PASSWORD_PAGE_TITLE = () => `重置密码`;
export const FORGOT_PASSWORD_PAGE_SUBTITLE = () =>
  `我们会将密码重置链接发送到下面的邮箱`;
export const FORGOT_PASSWORD_PAGE_SUBMIT_BUTTON_TEXT = () => `重置`;
export const FORGOT_PASSWORD_SUCCESS_TEXT = (email: string) =>
  `密码重置链接已经发送到你的邮箱 ${email} ，请查收确认`;

export const PRIVACY_POLICY_LINK = () => `隐私条款`;
export const TERMS_AND_CONDITIONS_LINK = () => `条款协议`;

export const ERROR_500 = () => `抱歉，服务端出错了，我们正在拼命修复`;
export const ERROR_0 = () => `无法连接到服务端，请检查你的网络连接`;
export const ERROR_401 = () => `鉴权失败！请重新登录`;
export const PAGE_NOT_FOUND_ERROR = () => `页面不存在`;
export const INVALID_URL_ERROR = () => `无效地址`;

export const INVITE_USERS_VALIDATION_EMAIL_LIST = () => `包含无效邮箱地址`;
export const INVITE_USERS_VALIDATION_ROLE_EMPTY = () => `请选择角色`;

export const INVITE_USERS_EMAIL_LIST_PLACEHOLDER = () => `邮箱之间用逗号分隔`;
export const INVITE_USERS_ROLE_SELECT_PLACEHOLDER = () => `请选择角色`;
export const INVITE_USERS_ROLE_SELECT_LABEL = () => `角色`;
export const INVITE_USERS_EMAIL_LIST_LABEL = () => `邮箱`;
export const INVITE_USERS_ADD_EMAIL_LIST_FIELD = () => `添加`;
export const INVITE_USERS_SUBMIT_BUTTON_TEXT = () => `邀请小伙伴`;
export const INVITE_USERS_SUBMIT_SUCCESS = () => `邀请成功`;
export const INVITE_USER_SUBMIT_SUCCESS = () => `邀请成功`;
export const INVITE_USERS_VALIDATION_EMAILS_EMPTY = () =>
  `请输入小伙伴们的邮箱`;

export const CREATE_PASSWORD_RESET_SUCCESS = () => `密码重置成功`;
export const CREATE_PASSWORD_RESET_SUCCESS_LOGIN_LINK = () => `登录`;

export const DELETING_APPLICATION = () => `正在删除应用...`;
export const DUPLICATING_APPLICATION = () => `正在拷贝应用...`;

export const FORGOT_PASSWORD_PAGE_LOGIN_LINK = () => `返回登录`;
export const ADD_API_TO_PAGE_SUCCESS_MESSAGE = (actionName: string) =>
  `${actionName} API 添加成功`;
export const INPUT_WIDGET_DEFAULT_VALIDATION_ERROR = () => `无效输入`;

export const AUTOFIT_ALL_COLUMNS = () => `自动填充所有列`;
export const AUTOFIT_THIS_COLUMN = () => `自动填充当前列`;
export const AUTOFIT_COLUMN = () => `自动填充列`;

export const DATE_WIDGET_DEFAULT_VALIDATION_ERROR = () => "日期超出限制";

export const TIMEZONE = () => `时区`;
export const ENABLE_TIME = () => `显示时间`;

export const EDIT_APP = () => `编辑应用`;
export const FORK_APP = () => `复制应用`;
export const SIGN_IN = () => `登录`;

// Homepage
export const CREATE_NEW_APPLICATION = () => `新建应用`;
export const SEARCH_APPS = () => `搜索应用`;
export const GETTING_STARTED = () => `马上开始`;
export const WORKSPACES_HEADING = () => `应用组`;
export const WELCOME_TOUR = () => `欢迎光临`;
export const NO_APPS_FOUND = () => `没有发现相关应用`;

// Lightning menu
export const LIGHTNING_MENU_DATA_API = () => `使用 API 数据`;
export const LIGHTNING_MENU_DATA_QUERY = () => `使用查询数据`;
export const LIGHTNING_MENU_DATA_TOOLTIP = () => `快速绑定数据`;
export const LIGHTNING_MENU_DATA_WIDGET = () => `使用组件数据`;
export const LIGHTNING_MENU_QUERY_CREATE_NEW = () => `新建查询`;
export const LIGHTNING_MENU_API_CREATE_NEW = () => `新建 API`;

export const LIGHTNING_MENU_OPTION_TEXT = () => `纯文本`;
export const LIGHTNING_MENU_OPTION_JS = () => `写 JS`;
export const LIGHTNING_MENU_OPTION_HTML = () => `写 HTML`;
export const CHECK_REQUEST_BODY = () => `请检查你的请求配置参数`;
export const DONT_SHOW_THIS_AGAIN = () => `不再提示`;

export const TABLE_FILTER_COLUMN_TYPE_CALLOUT = () => `修改列类型显示过滤操作`;

export const SAVE_HOTKEY_TOASTER_MESSAGE = () =>
  "不用担心保存的事情，请放心交给我们！";

export const WIDGET_SIDEBAR_TITLE = () => `组件`;
export const WIDGET_SIDEBAR_CAPTION = () => `把组件拖动到画布`;
export const GOOGLE_RECAPTCHA_KEY_ERROR = () =>
  `Google Re-Captcha token 生成失败！请检查 Re-captcha 的键值`;
export const GOOGLE_RECAPTCHA_DOMAIN_ERROR = () =>
  `Google Re-Captcha token 生成失败！请检查允许的域名`;

export const SERVER_API_TIMEOUT_ERROR = () => `服务器超时，请稍后重试`;
export const DEFAULT_ERROR_MESSAGE = () => `未知错误`;
export const REMOVE_FILE_TOOL_TIP = () => "删除上传";
export const ERROR_FILE_TOO_LARGE = (fileSize: string) =>
  `文件大小应该不超过 ${fileSize}!`;
export const ERROR_DATEPICKER_MIN_DATE = () => `超出最小日期限制`;
export const ERROR_DATEPICKER_MAX_DATE = () => `超出最大日期限制`;
export const ERROR_WIDGET_DOWNLOAD = (err: string) => `下载失败！ ${err}`;
export const ERROR_PLUGIN_ACTION_EXECUTE = (actionName: string) =>
  `${actionName} 动作运行失败`;
export const ERROR_FAIL_ON_PAGE_LOAD_ACTIONS = () =>
  `页面加载后关联的动作运行失败`;
export const ERROR_ACTION_EXECUTE_FAIL = (actionName: string) =>
  `${actionName} 动作执行时出错了`;
export const ACTION_MOVE_SUCCESS = (actionName: string, pageName: string) =>
  `成功将动作 ${actionName} 移动到页面 ${pageName}`;
export const ERROR_ACTION_MOVE_FAIL = (actionName: string) =>
  `动作 ${actionName} 移动失败`;
export const ACTION_COPY_SUCCESS = (actionName: string, pageName: string) =>
  `成功将动作 ${actionName} 复制到页面 ${pageName}`;
export const ERROR_ACTION_COPY_FAIL = (actionName: string) =>
  `动作 ${actionName} 复制失败`;
export const ERROR_ACTION_RENAME_FAIL = (actionName: string) =>
  `动作名称更新失败 ${actionName}`;

// Action Names Messages
export const ACTION_NAME_PLACEHOLDER = (type: string) =>
  `${type} 名称（驼峰式）`;
export const ACTION_INVALID_NAME_ERROR = () => "请输入有效名称";
export const ACTION_NAME_CONFLICT_ERROR = (name: string) =>
  `${name} 已经被占用，或者是系统关键字`;
export const ENTITY_EXPLORER_ACTION_NAME_CONFLICT_ERROR = (name: string) =>
  `${name} 已经被占用`;

export const DATASOURCE_CREATE = (dsName: string) => `${dsName} 数据源创建成功`;
export const DATASOURCE_DELETE = (dsName: string) => `${dsName} 数据源删除成功`;
export const DATASOURCE_UPDATE = (dsName: string) => `${dsName} 数据源更新成功`;
export const DATASOURCE_VALID = (dsName: string) => `${dsName} 数据源连接成功`;
export const EDIT_DATASOURCE = () => "编辑数据源";
export const SAVE_DATASOURCE = () => "保存数据源";
export const SAVE_DATASOURCE_MESSAGE = () => "将 API 保存为数据源来启动鉴权";
export const EDIT_DATASOURCE_MESSAGE = () => "编辑数据源鉴权配置";
export const OAUTH_ERROR = () => "OAuth 错误";
export const OAUTH_2_0 = () => "OAuth 2.0";
export const ENABLE = () => "启用";
export const UPGRADE = () => "升级";
export const EDIT = () => "编辑";
export const UNEXPECTED_ERROR = () => "出现了意外的错误";
export const EXPECTED_ERROR = () => "出错了";
export const NO_DATASOURCE_FOR_QUERY = () => `你还没有用来创建查询的数据源`;
export const ACTION_EDITOR_REFRESH = () => "刷新";
export const INVALID_FORM_CONFIGURATION = () => "无效表单配置";
export const ACTION_RUN_BUTTON_MESSAGE_FIRST_HALF = () => "🙌 点击";
export const ACTION_RUN_BUTTON_MESSAGE_SECOND_HALF = () => "在添加你的查询之后";
export const CREATE_NEW_DATASOURCE = () => "新建数据源";

export const ERROR_EVAL_ERROR_GENERIC = () => `应用解析出错了`;

export const ERROR_EVAL_TRIGGER = (message: string) =>
  `解析触发器出错: ${message}`;

export const WIDGET_COPY = (widgetName: string) => `${widgetName} 复制成功`;
export const ERROR_WIDGET_COPY_NO_WIDGET_SELECTED = () => `请选择要复制的组件`;
export const ERROR_WIDGET_COPY_NOT_ALLOWED = () => `不能复制该组件`;
export const WIDGET_CUT = (widgetName: string) => `${widgetName} 剪切成功`;
export const ERROR_WIDGET_CUT_NO_WIDGET_SELECTED = () => `请选择要剪切的组件`;
export const SELECT_ALL_WIDGETS_MSG = () => `已选中页面中所有的组件`;
export const ERROR_ADD_WIDGET_FROM_QUERY = () => `组件添加失败`;

export const REST_API_AUTHORIZATION_SUCCESSFUL = () => "鉴权成功";
export const REST_API_AUTHORIZATION_FAILED = () => "鉴权失败！请查看详情";
// Todo: improve this for appsmith_error error message
export const REST_API_AUTHORIZATION_APPSMITH_ERROR = () => "出错了";

export const OAUTH_AUTHORIZATION_SUCCESSFUL = "鉴权成功";
export const OAUTH_AUTHORIZATION_FAILED = "鉴权失败！请查看详情";
// Todo: improve this for appsmith_error error message
export const OAUTH_AUTHORIZATION_APPSMITH_ERROR = "出错了";
export const OAUTH_APPSMITH_TOKEN_NOT_FOUND = "没有发现 token";

export const LOCAL_STORAGE_QUOTA_EXCEEDED_MESSAGE = () =>
  "本地存储失败！已超出本地最大存储限制";
export const LOCAL_STORAGE_NO_SPACE_LEFT_ON_DEVICE_MESSAGE = () =>
  "本地存储失败！磁盘不足";
export const LOCAL_STORAGE_NOT_SUPPORTED_APP_MIGHT_NOT_WORK_AS_EXPECTED = () =>
  "你的设备不支持本地存储！";

export const OMNIBAR_PLACEHOLDER = () => `搜索组件、查询和文档`;
export const OMNIBAR_PLACEHOLDER_SNIPPETS = () => "搜索代码片段";
export const OMNIBAR_PLACEHOLDER_NAV = () => "搜索组件和查询";
export const OMNIBAR_PLACEHOLDER_DOC = () => "搜索文档";
export const CREATE_NEW_OMNIBAR_PLACEHOLDER = () =>
  "新建查询、API 或者静态 JS 对象";
export const HELPBAR_PLACEHOLDER = () => "快速搜索/导航";
export const NO_SEARCH_DATA_TEXT = () => "没有找到相关内容";

export const WIDGET_BIND_HELP = () => "不知道怎么从组件获取信息吗？";

export const BACK_TO_HOMEPAGE = () => "回到主页";

export const PAGE_NOT_FOUND = () => "未找到页面";

// comments
export const POST = () => "提交";
export const CANCEL = () => "取消";
export const REMOVE = () => "删除";

// Showcase Carousel
export const NEXT = () => "下一步";
export const BACK = () => "上一步";
export const SKIP = () => "跳过";

// Debugger
export const CLICK_ON = () => "🙌 点击 ";
export const PRESS = () => "🎉 点一下 ";
export const OPEN_THE_DEBUGGER = () => " 显示/隐藏调试器";
export const DEBUGGER_QUERY_RESPONSE_SECOND_HALF = () =>
  " 在调试器中显示更多信息";
export const NO_LOGS = () => "暂无日志";
export const NO_ERRORS = () => "🌈 一切顺利！";
export const DEBUGGER_ERRORS = () => "错误";
export const DEBUGGER_LOGS = () => "日志";
export const INSPECT_ENTITY = () => "检查实体";
export const INSPECT_ENTITY_BLANK_STATE = () => "请选择一个实体";
export const VALUE_IS_INVALID = (propertyPath: string) =>
  `${propertyPath} 取值无效`;
export const ACTION_CONFIGURATION_UPDATED = () => "配置已更新";
export const WIDGET_PROPERTIES_UPDATED = () => "组件属性已更新";
export const EMPTY_RESPONSE_FIRST_HALF = () => "🙌 点击";
export const EMPTY_RESPONSE_LAST_HALF = () => "获取响应";
export const EMPTY_JS_RESPONSE_LAST_HALF = () => "查看选中函数的返回值";
export const INVALID_EMAIL = () => "请输入有效邮箱";
export const DEBUGGER_INTERCOM_TEXT = (text: string) =>
  `你好， \n我遇到了下面的问题，你能帮我看看吗？ \n\n${text}`;
export const DEBUGGER_TRIGGER_ERROR = (propertyName: string) =>
  `解析触发器 ${propertyName} 时出错了`;

export const TROUBLESHOOT_ISSUE = () => "答疑解惑";
export const DEBUGGER_SEARCH_GOOGLE = () => "求助搜索引擎";
export const DEBUGGER_COPY_MESSAGE = () => "复制";
export const DEBUGGER_OPEN_DOCUMENTATION = () => "打开文档";
export const DEBUGGER_SEARCH_SNIPPET = () => "查看代码片段";
export const DEBUGGER_APPSMITH_SUPPORT = () => "获取官方支持";

//action creator menu
export const NO_ACTION = () => `无动作`;
export const EXECUTE_A_QUERY = () => `执行查询`;
export const NAVIGATE_TO = () => `跳转到`;
export const SHOW_MESSAGE = () => `消息提示`;
export const OPEN_MODAL = () => `打开弹窗`;
export const CLOSE_MODAL = () => `关闭弹窗`;
export const STORE_VALUE = () => `保存数据`;
export const DOWNLOAD = () => `下载`;
export const COPY_TO_CLIPBOARD = () => `复制`;
export const RESET_WIDGET = () => `重置组件`;
export const EXECUTE_JS_FUNCTION = () => `执行 JS 函数`;
export const SET_INTERVAL = () => `设置定时器`;
export const CLEAR_INTERVAL = () => `清除定时器`;
export const GET_GEO_LOCATION = () => `获取定位`;
export const WATCH_GEO_LOCATION = () => `实时定位`;
export const STOP_WATCH_GEO_LOCATION = () => `停止实时定位`;

//js actions
export const JS_ACTION_COPY_SUCCESS = (actionName: string, pageName: string) =>
  `成功将动作 ${actionName} 复制到页面 ${pageName}`;
export const ERROR_JS_ACTION_COPY_FAIL = (actionName: string) =>
  `${actionName} 复制失败`;
export const JS_ACTION_DELETE_SUCCESS = (actionName: string) =>
  `${actionName} 删除成功`;
export const JS_ACTION_CREATED_SUCCESS = (actionName: string) =>
  `${actionName} 创建成功`;
export const JS_ACTION_MOVE_SUCCESS = (actionName: string, pageName: string) =>
  `成功将动作 ${actionName} 移动到页面 ${pageName}`;
export const ERROR_JS_ACTION_MOVE_FAIL = (actionName: string) =>
  `${actionName} 移动失败`;
export const ERROR_JS_COLLECTION_RENAME_FAIL = (actionName: string) =>
  `不能将 js 集合名称改为 ${actionName}`;
export const PARSE_JS_FUNCTION_ERROR = (message: string) =>
  `语法错误：${message}`;

export const EXECUTING_FUNCTION = () => `执行函数`;
export const UPDATING_JS_COLLECTION = () => `正在更新...`;
export const EMPTY_JS_OBJECT = () => `空空如也。写点 js 代码试试`;
export const EXPORT_DEFAULT_BEGINNING = () => `对象用 export default 开头`;
export const JS_EXECUTION_SUCCESS = () => "JS 函数执行成功";
export const JS_EXECUTION_FAILURE = () => "JS 函数执行失败";
export const JS_EXECUTION_FAILURE_TOASTER = () => "函数执行时出错了";
export const JS_SETTINGS_ONPAGELOAD = () => "页面加载后执行函数 (测试版)";
export const JS_EXECUTION_SUCCESS_TOASTER = (actionName: string) =>
  `${actionName} 执行成功`;
export const JS_SETTINGS_ONPAGELOAD_SUBTEXT = () =>
  "会在每次页面加载后刷新数据";
export const JS_SETTINGS_CONFIRM_EXECUTION = () =>
  "执行函数之前需要用户确认吗？";
export const JS_SETTINGS_CONFIRM_EXECUTION_SUBTEXT = () =>
  "每次刷新数据之前请求用户确认";
export const JS_SETTINGS_EXECUTE_TIMEOUT = () => "函数超时（毫秒）";
export const ASYNC_FUNCTION_SETTINGS_HEADING = () => "异步函数设置";
export const NO_ASYNC_FUNCTIONS = () => "这个 JS 对象中没有异步函数";
export const NO_JS_FUNCTION_TO_RUN = (JSObjectName: string) =>
  `${JSObjectName} 没有函数`;
export const NO_JS_FUNCTION_RETURN_VALUE = (JSFunctionName: string) =>
  `${JSFunctionName} 没有返回任何数据，你给函数添加了返回吗？`;

// Import/Export Application features
export const IMPORT_APPLICATION_MODAL_TITLE = () => "导入应用";
export const IMPORT_APPLICATION_MODAL_LABEL = () => "你想从哪里导入你的应用？";
export const IMPORT_APP_FROM_FILE_TITLE = () => "从文件导入";
export const UPLOADING_JSON = () => "上传 JSON 文件";
export const UPLOADING_APPLICATION = () => "正在上传应用";
export const IMPORT_APP_FROM_GIT_TITLE = () => "从 Git 仓库导入（测试版）";
export const IMPORT_APP_FROM_FILE_MESSAGE = () =>
  "将文件拖拽到这里，或者点击选择上传";
export const IMPORT_APP_FROM_GIT_MESSAGE = () =>
  "通过 SSH URL 从 Git 仓库导入应用";
export const IMPORT_FROM_GIT_REPOSITORY = () => "从 Git 仓库导入";
export const RECONNECT_MISSING_DATASOURCE_CREDENTIALS = () =>
  "重新连接需要数据源鉴权信息";
export const RECONNECT_MISSING_DATASOURCE_CREDENTIALS_DESCRIPTION = () =>
  "请仔细填写，否则应用可能会运行异常";
export const RECONNECT_DATASOURCE_SUCCESS_MESSAGE1 = () => "数据源导入成功！";
export const RECONNECT_DATASOURCE_SUCCESS_MESSAGE2 = () => "请填写缺失的数据源";
export const ADD_MISSING_DATASOURCES = () => "添加缺失的数据源";
export const SKIP_TO_APPLICATION_TOOLTIP_HEADER = () => "这个操作是不可逆的";
export const SKIP_TO_APPLICATION_TOOLTIP_DESCRIPTION = () =>
  `你可以随时重连数据源，只是应用可能会无法使用`;
export const SKIP_TO_APPLICATION = () => "跳过应用";
export const SELECT_A_METHOD_TO_ADD_CREDENTIALS = () => "选择一种鉴权方式";
export const DELETE_CONFIRMATION_MODAL_TITLE = () => `确认`;
export const DELETE_CONFIRMATION_MODAL_SUBTITLE = (name?: string | null) =>
  `你确实想从当前团队中删除 ${name} 吗？`;
export const PARSING_ERROR = () => "语法错误：无法解析代码，请查看错误日志";
export const PARSING_WARNING = () => "格式错误：在使用函数之前请先解决格式问题";
export const JS_FUNCTION_CREATE_SUCCESS = () => "JS 函数创建成功";
export const JS_FUNCTION_UPDATE_SUCCESS = () => "JS 函数更新成功";
export const JS_FUNCTION_DELETE_SUCCESS = () => "JS 函数删除成功";
export const JS_OBJECT_BODY_INVALID = () => "无法解析 JS 对象";
export const JS_ACTION_EXECUTION_ERROR = (jsFunctionName: string) =>
  `执行函数 ${jsFunctionName} 时出错了，具体请查看错误日志`;
//Editor Page
export const EDITOR_HEADER_SAVE_INDICATOR = () => "已保存";

//undo redo
export const WIDGET_REMOVED = (widgetName: string) => `${widgetName} 已删除`;
export const WIDGET_ADDED = (widgetName: string) => `${widgetName} 恢复成功`;
export const BULK_WIDGET_REMOVED = (widgetName: string) =>
  `${widgetName} 已删除`;
export const BULK_WIDGET_ADDED = (widgetName: string) =>
  `${widgetName} 恢复成功`;

// Generate page from DB Messages

export const UNSUPPORTED_PLUGIN_DIALOG_TITLE = () =>
  `无法使用这个数据源自动生成页面`;

export const UNSUPPORTED_PLUGIN_DIALOG_SUBTITLE = () =>
  `你可以继续使用拖拽方式构建你的应用`;
export const UNSUPPORTED_PLUGIN_DIALOG_MAIN_HEADING = () => `请注意`;

export const BUILD_FROM_SCRATCH_ACTION_SUBTITLE = () => "从空白页面开始";

export const BUILD_FROM_SCRATCH_ACTION_TITLE = () => "手动拖拽构建";

export const GENERATE_PAGE_ACTION_TITLE = () => "使用数据表生成";

export const GENERATE_PAGE_ACTION_SUBTITLE = () => "从增删查改页面开始";

export const GENERATE_PAGE_FORM_TITLE = () => "用数据生成";

export const GEN_CRUD_SUCCESS_MESSAGE = () => "恭喜！你的应用已经可以使用了";
export const GEN_CRUD_INFO_DIALOG_TITLE = () => "它是怎么玩的？";
export const GEN_CRUD_INFO_DIALOG_SUBTITLE = () => "增删查改页面已经自动生成";
export const GEN_CRUD_COLUMN_HEADER_TITLE = () => "数据列头已加载";
export const GEN_CRUD_NO_COLUMNS = () => "没有发现数据列";
export const GEN_CRUD_DATASOURCE_DROPDOWN_LABEL = () => "选择数据源";
export const GEN_CRUD_TABLE_HEADER_LABEL = () => "表头索引";
export const GEN_CRUD_TABLE_HEADER_TOOLTIP_DESC = () => "数据表中的索引";
// Actions Right pane
export const SEE_CONNECTED_ENTITIES = () => "查看所有已连接实体";
export const INCOMING_ENTITIES = () => "输入实体";
export const NO_INCOMING_ENTITIES = () => "无输入实体";
export const OUTGOING_ENTITIES = () => "输出实体";
export const NO_OUTGOING_ENTITIES = () => "无输出实体";
export const NO_CONNECTIONS = () => "暂无连接";
export const BACK_TO_CANVAS = () => "返回画布";
export const SUGGESTED_WIDGET_DESCRIPTION = () => "这会在画布中新建一个组件";
export const ADD_NEW_WIDGET = () => "添加新组件";
export const SUGGESTED_WIDGETS = () => "推荐组件";
export const SUGGESTED_WIDGET_TOOLTIP = () => "添加到画布";
export const WELCOME_TOUR_STICKY_BUTTON_TEXT = () => "下一步";

// Data Sources pane
export const EMPTY_ACTIVE_DATA_SOURCES = () => "暂无有效数据源";
export const SCHEMA_NOT_AVAILABLE = () => "Schema 不可用";

export const SNIPPET_EXECUTION_SUCCESS = () => `代码片段执行成功`;

export const SNIPPET_EXECUTION_FAILED = () => `代码片段执行失败`;

export const SNIPPET_INSERT = () => `按 ⏎ 插入`;
export const SNIPPET_COPY = () => `按 ⏎ 复制`;
export const SNIPPET_EXECUTE = () => `按 ⏎ 运行`;
export const APPLY_SEARCH_CATEGORY = () => `⏎ 跳转`;

// Git sync
export const CONNECTED_TO_GIT = () => "已连接到 Git";

export const GIT_DISCONNECT_POPUP_TITLE = () =>
  `这会取消当前应用与 Git 仓库的连接`;

export const GIT_DISCONNECT_POPUP_SUBTITLE = () =>
  `Git 相关功能不会在应用中展示`;
export const GIT_DISCONNECT_POPUP_MAIN_HEADING = () => `确认`;

export const GIT_CONNECTION = () => "Git 连接";
export const GIT_IMPORT = () => "Git 导入";
export const MERGE = () => "合并";
export const GIT_SETTINGS = () => "Git 配置";
export const CONNECT_TO_GIT = () => "连接到 Git 仓库";
export const CONNECT_TO_GIT_SUBTITLE = () => "查看分支、提交、部署应用";
export const REMOTE_URL = () => "远程地址";
export const REMOTE_URL_INFO = () =>
  `新建一个空的 Git 仓库，然后把地址粘贴到这里`;
export const IMPORT_URL_INFO = () => `代码库地址粘贴到这里：`;
export const REMOTE_URL_VIA = () => "代码库地址通过";

export const USER_PROFILE_SETTINGS_TITLE = () => "个人配置";

export const USE_DEFAULT_CONFIGURATION = () => "使用默认配置";
export const AUTHOR_NAME = () => "作者名称";
export const AUTHOR_NAME_CANNOT_BE_EMPTY = () => "作者名称不能未空";
export const AUTHOR_EMAIL = () => "作者邮箱地址";

export const NAME_YOUR_NEW_BRANCH = () => "新分支名称";
export const SWITCH_BRANCHES = () => "切换分支";

export const DOCUMENTATION = () => "文档";
export const DOCUMENTATION_TOOLTIP = () => "在工具栏中打开文档";
export const CONNECT = () => "连接";
export const LATEST_DP_TITLE = () => "最新部署预览";
export const LATEST_DP_SUBTITLE = () => "最近一次部署";
export const CHECK_DP = () => "检查";
export const DEPLOY_TO_CLOUD = () => "发布到云端";
export const DEPLOY_WITHOUT_GIT = () => "不使用版本控制，直接发布你的应用";
export const COMMIT_CHANGES = () => "提交更新";
export const COMMIT_TO = () => "提交到";
export const COMMIT_AND_PUSH = () => "提交 & 推送";
export const PULL_CHANGES = () => "拉取更新";
export const REGENERATE_SSH_KEY = (keyType: string, keySize: number) =>
  `重新生成 ${keyType} ${keySize} key`;
export const GENERATE_SSH_KEY = (keyType: string, keySize: number) =>
  `${keyType} ${keySize} key`;
export const SSH_KEY_PLATFORM = (name: string) => ` (${name})`;
export const SSH_KEY = () => "SSH Key";
export const COPY_SSH_KEY = () => "复制 SSH Key";
export const SSH_KEY_GENERATED = () => "SSH Key 已生成";
export const REGENERATE_KEY_CONFIRM_MESSAGE = () =>
  "这可能会导致应用功能异常，同时你也需要在 Git 仓库里更新 key";
export const DEPLOY_KEY_USAGE_GUIDE_MESSAGE = () =>
  "将 key 拷贝到你的仓库设置中，并给它赋予写权限";
export const COMMITTING_AND_PUSHING_CHANGES = () => "正在提交、推送修改...";
export const DISCARDING_AND_PULLING_CHANGES = () => "正在丢弃、拉取修改...";
export const DISCARD_SUCCESS = () => "修改丢弃成功";

export const IS_MERGING = () => "合并修改...";

export const MERGE_CHANGES = () => "合并修改";
export const SELECT_BRANCH_TO_MERGE = () => "选择要合并的分支";
export const CONNECT_GIT = () => "连接 Git";
export const CONNECT_GIT_BETA = () => "连接 Git （测试版）";
export const RETRY = () => "重试";
export const CREATE_NEW_BRANCH = () => "新建分支";
export const ERROR_WHILE_PULLING_CHANGES = () => "拉取时出错了";
export const SUBMIT = () => "提交";
export const GIT_USER_UPDATED_SUCCESSFULLY = () => "Git 用户更新成功";
export const REMOTE_URL_INPUT_PLACEHOLDER = () =>
  "git@example.com:user/repo.git";
export const GIT_COMMIT_MESSAGE_PLACEHOLDER = () => "你的提交信息";
export const COPIED_SSH_KEY = () => "复制的 SSH Key";
export const INVALID_USER_DETAILS_MSG = () => "请输入有效用户信息";
export const PASTE_SSH_URL_INFO = () => "请输入代码仓库的 SSH 地址";
export const GENERATE_KEY = () => "生成 Key";
export const UPDATE_CONFIG = () => "更新配置";
export const CONNECT_BTN_LABEL = () => "连接";
export const IMPORT_BTN_LABEL = () => "导入";
export const FETCH_GIT_STATUS = () => "查看仓库状态...";
export const FETCH_MERGE_STATUS = () => "检查是否可以合并...";
export const NO_MERGE_CONFLICT = () => "这个分支和基准分支没有冲突";
export const MERGE_CONFLICT_ERROR = () => "发现合并冲突！";
export const FETCH_MERGE_STATUS_FAILURE = () => "拉取合并状态失败";
export const GIT_UPSTREAM_CHANGES = () =>
  "上游仓库有更新，我们将拉取更新并推送到你的仓库";
export const GIT_CONFLICTING_INFO = () => "请在你的仓库中手动解决冲突";
export const CANNOT_PULL_WITH_LOCAL_UNCOMMITTED_CHANGES = () =>
  "你还有未提交的更新，请在拉取前提交更新.";
export const CANNOT_MERGE_DUE_TO_UNCOMMITTED_CHANGES = () =>
  "你当前分支还有未提交的更新，请在合并之前提交更新";

export const DISCONNECT_SERVICE_SUBHEADER = () =>
  "修改这个配置会打断用户鉴权，请谨慎操作";
export const DISCONNECT_SERVICE_WARNING = () => "最主要的鉴权方式会被删除";
export const AUTHENTICATION_METHOD_ENABLED = (methodName: string) => `
  ${methodName} 鉴权方式已生效
`;

export const DISCONNECT_EXISTING_REPOSITORIES = () => "与现有仓库断开连接";
export const DISCONNECT_EXISTING_REPOSITORIES_INFO = () =>
  "你可以删除现有的仓库来给新的仓库腾出空间";
export const CONTACT_SUPPORT = () => "联系我们";
export const CONTACT_SALES_MESSAGE_ON_INTERCOM = (workspaceName: string) =>
  `你好！如果你想为你的团队 ${workspaceName} 扩充私有仓库数量，请告诉我们你想扩充多少个仓库以及扩充的原因，我们会很快回复你。`;
export const REPOSITORY_LIMIT_REACHED = () => "仓库数量达到限制";
export const REPOSITORY_LIMIT_REACHED_INFO = () =>
  "最多免费使用 3 个仓库，如需使用更多仓库请升级";
export const APPLICATION_IMPORT_SUCCESS = (username: string) =>
  `${username}，你的应用已经准备好了！`;
export const APPLICATION_IMPORT_SUCCESS_DESCRIPTION = () =>
  "你所有的数据源都已经准备好了";
export const NONE_REVERSIBLE_MESSAGE = () => "这个操作是不可恢复的，请谨慎操作";
export const CONTACT_SUPPORT_TO_UPGRADE = () =>
  "联系我们进行升级，升级版可以使用无限的私有仓库";
export const DISCONNECT_CAUSE_APPLICATION_BREAK = () =>
  "断开连接可能会导致应用出错";
export const DISCONNECT_GIT = () => "取消访问";
export const DISCONNECT = () => "断开连接";
export const REVOKE = () => "取消";
export const REVOKE_ACCESS = () => "取消访问";
export const GIT_DISCONNECTION_SUBMENU = () => "Git 连接 > 断开连接";
export const DISCONNECT_FROM_GIT = (name: string) =>
  `断开 ${name} 和 Git 的连接`;
export const GIT_REVOKE_ACCESS = (name: string) => `取消访问 ${name}`;
export const GIT_TYPE_REPO_NAME_FOR_REVOKING_ACCESS = (name: string) =>
  `在输入框中输入 “${name}” 来取消访问`;
export const APPLICATION_NAME = () => "应用名称";
export const NOT_OPTIONS = () => "没有可选项！";
export const OPEN_REPO = () => "打开仓库";
export const CONNECTING_REPO = () => "连接到 git 仓库";
export const IMPORTING_APP_FROM_GIT = () => "从 git 导入应用";
export const ERROR_CONNECTING = () => "连接时出错";
export const ERROR_COMMITTING = () => "提交时出错";
export const CONFIRM_SSH_KEY = () => "请确保你的 SSH Key 有写权限";
export const READ_DOCUMENTATION = () => "查看文档";
export const LEARN_MORE = () => "了解更多";
export const GIT_NO_UPDATED_TOOLTIP = () => "没有更新";

export const FIND_OR_CREATE_A_BRANCH = () => "查找或创建一个分支";
export const SYNC_BRANCHES = () => "同步分支";

export const CONFLICTS_FOUND = () => "发现冲突，请解决冲突然后重新拉取";
export const UNCOMMITTED_CHANGES = () => "你有未提交的修改";
export const NO_COMMITS_TO_PULL = () => "已经和远程仓库保持同步";
export const CONFLICTS_FOUND_WHILE_PULLING_CHANGES = () => "拉取更新时发现冲突";
export const NOT_LIVE_FOR_YOU_YET = () => "暂不可用";
export const COMING_SOON = () => "敬请期待！";
export const CONNECTING_TO_REPO_DISABLED = () => "连接 git 仓库功能被禁用";
export const DURING_ONBOARDING_TOUR = () => "在欢迎引导中";
export const MERGED_SUCCESSFULLY = () => "合并成功";
export const DISCARD_CHANGES_WARNING = () =>
  "丢弃这些修改会从 Git 中拉取之前的更新";
export const DISCARD_CHANGES = () => "丢弃修改";

// GIT DEPLOY begin
export const DEPLOY = () => "发布";
export const DEPLOY_YOUR_APPLICATION = () => "发布你的应用";
export const CHANGES_SINCE_LAST_DEPLOYMENT = () => "上次发布以来的修改";
export const CHANGES_ONLY_USER = () => "上次提交以来的用户修改";
export const CHANGES_MADE_SINCE_LAST_COMMIT = () => "上次提交以来的修改";
export const CHANGES_ONLY_MIGRATION = () => "上次提交以来 Appsmith 的更新";
export const CHANGES_USER_AND_MIGRATION = () =>
  "上次提交以来 Appsmith 的更新和用户修改";
export const CURRENT_PAGE_DISCARD_WARNING = (page: string) =>
  `当前页面 (${page}) 在丢弃列表中`;
// GIT DEPLOY end

// GIT CHANGE LIST begin
export const CHANGES_FROM_APPSMITH = () =>
  "Some changes are platform upgrades from Appsmith.";
export const TRY_TO_PULL = () =>
  "We will try to pull before pushing your changes.";
export const NOT_PUSHED_YET = () =>
  "These are the commits that haven't been pushed to remote yet.";
// GIT CHANGE LIST end

// GIT DELETE BRANCH begin
export const DELETE = () => "删除";
export const LOCAL_BRANCHES = () => "本地分支";
export const REMOTE_BRANCHES = () => "远程分支";

export const DELETE_BRANCH_SUCCESS = (branchName: string) =>
  `成功删除分支：${branchName}`;

// warnings
export const DELETE_BRANCH_WARNING_CHECKED_OUT = (currentBranchName: string) =>
  `无法删除当前分支，在删除分支 ${currentBranchName} 之前，请切换到其他分支`;
export const DELETE_BRANCH_WARNING_DEFAULT = (defaultBranchName: string) =>
  `无法删除默认分支：${defaultBranchName}`;
// GIT DELETE BRANCH end

// GIT ERRORS begin
export const ERROR_GIT_AUTH_FAIL = () =>
  "请仓库确认已经添加了重新生成的 SSH key，并且赋予了写权限";
export const ERROR_GIT_INVALID_REMOTE = () => "远程仓库不存在或者无法访问";
// GIT ERRORS end

// JS Snippets
export const SNIPPET_DESCRIPTION = () =>
  `搜索、插入代码片段来快速完成复杂业务动作`;
export const DOC_DESCRIPTION = () => `通过文档找到答案`;
export const NAV_DESCRIPTION = () => `导航到任意页面、组件或者文件`;
export const ACTION_OPERATION_DESCRIPTION = () => `新建查询、API 或者 JS 对象`;

export const TRIGGER_ACTION_VALIDATION_ERROR = (
  functionName: string,
  argumentName: string,
  expectedType: string,
  received: string,
) =>
  `${functionName} 期望 '${argumentName}' 参数是 ${expectedType} 类型的，但拿到的是 ${received} 类型`;

// Comment card tooltips
export const MORE_OPTIONS = () => "更多操作";
export const ADD_REACTION = () => "回复";
export const RESOLVE_THREAD = () => "处理对话";
export const RESOLVED_THREAD = () => "已处理的对话";
export const EMOJI = () => "Emoji表情";

// Sniping mode messages
export const SNIPING_SELECT_WIDGET_AGAIN = () =>
  "无法检测到组件，请重新选择组件";

export const SNIPING_NOT_SUPPORTED = () => "暂不支持绑定该类型组件！";

//First Time User Onboarding
//Checklist page
export enum ONBOARDING_CHECKLIST_ACTIONS {
  CONNECT_A_DATASOURCE = "连接数据源",
  CREATE_A_QUERY = "创建查询",
  ADD_WIDGETS = "添加组件",
  CONNECT_DATA_TO_WIDGET = "给组件绑定数据",
  DEPLOY_APPLICATIONS = "发布应用",
}

export const ONBOARDING_CHECKLIST_BANNER_HEADER = () =>
  "太棒了！看来你已经学会怎么用 PagePlug 啦";
export const ONBOARDING_CHECKLIST_BANNER_BODY = () =>
  "你可以去主页看看你创建的应用";
export const ONBOARDING_CHECKLIST_BANNER_BUTTON = () => "探索主页";

export const ONBOARDING_CHECKLIST_HEADER = () => "👋 欢迎来到 PagePlug ！";
export const ONBOARDING_CHECKLIST_BODY = () =>
  "开始你的第一个应用吧，你可以自由探索，或者跟随指引了解 PagePlug 的基本用法";
export const ONBOARDING_CHECKLIST_COMPLETE_TEXT = () => "完成";

export const ONBOARDING_CHECKLIST_CONNECT_DATA_SOURCE = {
  bold: () => "连接你的数据源",
  normal: () => "开始构建应用",
};

export const ONBOARDING_CHECKLIST_CREATE_A_QUERY = {
  bold: () => "创建查询",
  normal: () => "连接你的数据源",
};

export const ONBOARDING_CHECKLIST_ADD_WIDGETS = {
  bold: () => "可视化构建你的应用",
  normal: () => "使用组件",
};

export const ONBOARDING_CHECKLIST_CONNECT_DATA_TO_WIDGET = {
  bold: () => "给组件绑定数据",
  normal: () => "使用 JavaScript",
};

export const ONBOARDING_CHECKLIST_DEPLOY_APPLICATIONS = {
  bold: () => "发布你的应用",
  normal: () => "你可以看到应用立即可用了",
};

export const ONBOARDING_CHECKLIST_FOOTER = () =>
  "不知道从何下手？请跟随我们的指引进行操作吧";

//Introduction modal
export const HOW_APPSMITH_WORKS = () => "这是 PagePlug 的功能概述";
export const ONBOARDING_INTRO_CONNECT_YOUR_DATABASE = () =>
  "连接你的数据源或者 API";
export const DRAG_AND_DROP = () => "拖拽预置的组件构建 UI";
export const CUSTOMIZE_WIDGET_STYLING = () =>
  "自定义每个组件的样式风格，然后把数据绑定到组件上，使用 JS 轻松完成业务逻辑";
export const ONBOARDING_INTRO_PUBLISH = () => "自由控制权限的发布和分享";
export const CHOOSE_ACCESS_CONTROL_ROLES = () =>
  "马上发布，并和你各种角色的小伙伴们分享应用";
export const BUILD_MY_FIRST_APP = () => "我来部署";
export const ONBOARDING_INTRO_FOOTER = () => "让我们开始构建你的第一个应用吧";
export const START_TUTORIAL = () => "开始";
export const WELCOME_TO_APPSMITH = () => "欢迎来到 PagePlug ！";
export const QUERY_YOUR_DATABASE = () =>
  "查询你的数据库或 API，使用 JS 构建动态查询";

//Statusbar
export const ONBOARDING_STATUS_STEPS_FIRST = () => "第一步：添加数据源";
export const ONBOARDING_STATUS_STEPS_FIRST_ALT = () => "下一步：添加数据源";
export const ONBOARDING_STATUS_STEPS_SECOND = () => "下一步：创建查询";
export const ONBOARDING_STATUS_STEPS_THIRD = () => "下一步：添加组件";
export const ONBOARDING_STATUS_STEPS_THIRD_ALT = () => "第一步：添加组件";
export const ONBOARDING_STATUS_STEPS_FOURTH = () => "下一步：给组件绑定数据";
export const ONBOARDING_STATUS_STEPS_FIVETH = () => "下一步：发布你的应用";
export const ONBOARDING_STATUS_STEPS_SIXTH = () => "完成 🎉";
export const ONBOARDING_STATUS_GET_STARTED = () => "开始";

//Tasks
//1. datasource
export const ONBOARDING_TASK_DATASOURCE_HEADER = () =>
  "开始添加你的第一个数据源";
export const ONBOARDING_TASK_DATASOURCE_BODY = () =>
  "添加数据源能够让你的应用发挥威力，如果你手上没有数据源也不用担心，我们为你准备了一个样例数据库";
export const ONBOARDING_TASK_DATASOURCE_BUTTON = () => "+ 添加数据源";
export const ONBOARDING_TASK_DATASOURCE_FOOTER_ACTION = () => "添加组件";
export const ONBOARDING_TASK_DATASOURCE_FOOTER = () => "第一步";
//2. query
export const ONBOARDING_TASK_QUERY_HEADER = () => "接下来，创建一个查询";
export const ONBOARDING_TASK_QUERY_BODY = () =>
  "非常棒！下一步就是用你的数据源创建一个查询了";
export const ONBOARDING_TASK_QUERY_BUTTON = () => "+ 创建查询";
export const ONBOARDING_TASK_QUERY_FOOTER_ACTION = () => "添加组件";
//2. widget
export const ONBOARDING_TASK_WIDGET_HEADER = () =>
  "然后，添加一个组件来展示数据";
export const ONBOARDING_TASK_WIDGET_BODY = () =>
  "非常棒！下一步就是添加一个组件把你的数据展示出来";
export const ONBOARDING_TASK_WIDGET_BUTTON = () => "+ 添加组件";
export const ONBOARDING_TASK_WIDGET_FOOTER_ACTION = () => "发布你的应用";
export const ONBOARDING_TASK_FOOTER = () => "或者，你也可以";

export const USE_SNIPPET = () => "代码片段";
export const SNIPPET_TOOLTIP = () => "搜索代码片段";

//Welcome page
export const WELCOME_HEADER = () => "欢迎！";
export const WELCOME_BODY = () => "在创建应用之前，请先让我们给你创建一个账号";
export const WELCOME_ACTION = () => "开始吧";

// API Editor
export const API_EDITOR_TAB_TITLES = {
  HEADERS: () => "请求头",
  PARAMS: () => "参数",
  BODY: () => "请求体",
  PAGINATION: () => "分页",
  AUTHENTICATION: () => "鉴权",
  SETTINGS: () => "设置",
};
export const ACTION_EXECUTION_MESSAGE = (actionType: string) =>
  `Sending the ${actionType} request`;

export const WELCOME_FORM_HEADER = () => "让我们更好的了解你！";
export const WELCOME_FORM_FULL_NAME = () => "姓名";
export const WELCOME_FORM_EMAIL_ID = () => "邮箱";
export const WELCOME_FORM_CREATE_PASSWORD = () => "创建密码";
export const WELCOME_FORM_VERIFY_PASSWORD = () => "校验密码";
export const WELCOME_FORM_ROLE_DROPDOWN = () => "你担任何种角色？";
export const WELCOME_FORM_ROLE_DROPDOWN_PLACEHOLDER = () => "- 选择一个角色 -";
export const WELCOME_FORM_ROLE = () => "角色";
export const WELCOME_FORM_CUSTOM_USE_CASE = () => "使用场景";
export const WELCOME_FORM_USE_CASE = () => "请告诉我们你的使用场景";
export const WELCOME_FORM_USE_CASE_PLACEHOLDER = () => "- 选择一个使用场景 -";
export const WELCOME_FORM_DATA_COLLECTION_HEADER = () => "分享使用数据";
export const WELCOME_FORM_DATA_COLLECTION_BODY = () =>
  "分享匿名的使用数据来帮助我们提升产品质量";
export const WELCOME_FORM_DATA_COLLECTION_LINK = () => "看看分享了哪些数据";
export const WELCOME_FORM_DATA_COLLECTION_LABEL_ENABLE = () =>
  "分享数据让 PagePlug 变得更好！";
export const WELCOME_FORM_DATA_COLLECTION_LABEL_DISABLE = () =>
  "不分享任何数据";
export const WELCOME_FORM_NEWLETTER_HEADER = () => "保持联系";
export const WELCOME_FORM_NEWLETTER_LABEL = () =>
  "获取我们的更新，放心，我们不会给你发垃圾邮件的";
export const WELCOME_FORM_SUBMIT_LABEL = () => "创建你的第一个应用";

//help tooltips
export const ACCOUNT_TOOLTIP = () => "你的账号";
export const RENAME_APPLICATION_TOOLTIP = () => "重命名应用";
export const LOGO_TOOLTIP = () => "回到首页";
export const ADD_PAGE_TOOLTIP = () => "新建页面";
export const ADD_DATASOURCE_TOOLTIP = () => "添加数据源或者创建新的查询";
export const ADD_WIDGET_TOOLTIP = () => "查找、添加组件";
export const HELP_RESOURCE_TOOLTIP = () => "帮助资源";
export const COPY_ELEMENT = () => "复制元素";
export const LAYOUT_DROPDOWN_TOOLTIP = () => "选择你的应用宽度";
export const DEPLOY_BUTTON_TOOLTIP = () => "发布应用的当前版本";
export const SHARE_BUTTON_TOOLTIP = () => "邀请你的团队到 PagePlug";
export const SHARE_BUTTON_TOOLTIP_WITH_USER = (length: number) => () =>
  `和 ${length} 位小伙伴共享`;
export const DEBUGGER_TOOLTIP = () => "打开调试器";
export const PAGE_PROPERTIES_TOOLTIP = () => "页面属性";
export const CLEAR_LOG_TOOLTIP = () => "清空日志";
export const ADD_JS_ACTION = () => "新建 JS 对象";
export const ENTITY_MORE_ACTIONS_TOOLTIP = () => "更多操作";
export const NOTIFICATIONS_TOOLTIP = () => "通知";

// Navigation Menu
export const DEPLOY_MENU_OPTION = () => "发布";
export const CURRENT_DEPLOY_PREVIEW_OPTION = () => "当前已发布版本";
export const CONNECT_TO_GIT_OPTION = () => "连接到 Git 仓库";
//
export const GO_TO_PAGE = () => "跳转到页面";
export const DEFAULT_PAGE_TOOLTIP = () => "默认页面";
export const HIDDEN_TOOLTIP = () => "隐藏";
export const CLONE_TOOLTIP = () => "复制";
export const DELETE_TOOLTIP = () => "删除";
export const SETTINGS_TOOLTIP = () => "设置";
//settings
export const ADMIN_SETTINGS = () => "管理员设置";
export const RESTART_BANNER_BODY = () => "请稍等，马上就好了";
export const RESTART_BANNER_HEADER = () => "重启你的服务器";
export const RESTART_ERROR_BODY = () =>
  "你可以再试着重启你的服务器来让你的设置生效";
export const RESTART_ERROR_HEADER = () => "重启失败";
export const RETRY_BUTTON = () => "重试";
export const INFO_VERSION_MISMATCH_FOUND_RELOAD_REQUEST = () =>
  "发现 PagePlug 新版本，请刷新页面试试";
export const TEST_EMAIL_SUCCESS = (email: string) => () =>
  `测试邮件已发送完毕，请前往 ${email} 查收`;
export const TEST_EMAIL_SUCCESS_TROUBLESHOOT = () => "疑难杂症";
export const TEST_EMAIL_FAILURE = () => "测试邮件发送失败";
export const DISCONNECT_AUTH_ERROR = () => "不能断开唯一已连接的鉴权方式";
export const MANDATORY_FIELDS_ERROR = () => "必填字段不能为空";
//
export const WELCOME_FORM_NON_SUPER_USER_ROLE_DROPDOWN = () =>
  "请告诉我们你的工作角色是？";
export const WELCOME_FORM_NON_SUPER_USER_ROLE = () => "角色";
export const WELCOME_FORM_NON_SUPER_USER_USE_CASE = () =>
  "请问你打算用 PagePlug 来做什么应用呢？";
export const QUERY_CONFIRMATION_MODAL_MESSAGE = () => `确定运行吗？`;
export const ENTITY_EXPLORER_TITLE = () => "导航";
export const MULTI_SELECT_PROPERTY_PANE_MESSAGE = () =>
  `选择组件查看它的各种属性`;
export const WIDGET_DEPRECATION_MESSAGE = (widgetName: string) =>
  `${widgetName} 组件已经被废弃`;
export const DEPRECATION_WIDGET_REPLACEMENT_MESSAGE = (
  replacingWidgetName: string,
) => ` 你可以拖拽一个 ${replacingWidgetName} 组件来替换已废弃的组件`;
export const LOCK_ENTITY_EXPLORER_MESSAGE = () => `固定侧边栏`;
export const CLOSE_ENTITY_EXPLORER_MESSAGE = () => `关闭侧边栏`;
export const JS_TOGGLE_DISABLED_MESSAGE = "清空字段回退";
export const PROPERTY_PANE_EMPTY_SEARCH_RESULT_MESSAGE = "没有发现任何属性";

// API Pane
export const API_PANE_NO_BODY = () => "当前请求没有请求体";

export const TABLE_WIDGET_TOTAL_RECORD_TOOLTIP = () =>
  "保存数据表的总行数，用来在分页的时候计算是否还有下一页/上一页";
export const CREATE_DATASOURCE_TOOLTIP = () => "添加新数据源";
export const ADD_QUERY_JS_TOOLTIP = () => "新建";

// Add datasource
export const GENERATE_APPLICATION_TITLE = () => "新建页面";
export const GENERATE_APPLICATION_DESCRIPTION = () =>
  "用你的数据库表快速生成一个增删改查页面";
export const DELETE_WORKSPACE_SUCCESSFUL = () => "应用组删除成功";
// theming
export const CHANGE_APP_THEME = (name: string) => `已切换为 ${name} 风格主题`;
export const SAVE_APP_THEME = (name: string) => `风格主题 ${name} 已保存`;
export const DELETE_APP_THEME = (name: string) => `风格主题 ${name} 已删除`;
export const DELETE_APP_THEME_WARNING = () =>
  `确定删除这个风格主题吗？这个操作不可恢复`;
export const APP_THEME_BETA_CARD_HEADING = () => `🎨 修改应用风格`;
export const APP_THEME_BETA_CARD_CONTENT = () =>
  `自定义全局样式风格，后面对所有组件进行支持`;

export const UPGRADE_TO_EE = (authLabel: string) =>
  `你好，我想升级并且开始使用 ${authLabel} 鉴权`;
export const UPGRADE_TO_EE_GENERIC = () => `你好，我想升级`;
export const ADMIN_AUTH_SETTINGS_TITLE = () => "选择鉴权方式";
export const ADMIN_AUTH_SETTINGS_SUBTITLE = () => "选择一个鉴权协议";
export const DANGER_ZONE = () => "危险操作";
export const DISCONNECT_AUTH_METHOD = () => "断开连接";
export const DISCONNECT_CONFIRMATION = () => "你确定吗？";

// Guided tour
// -- STEPS ---
export const STEP_ONE_TITLE = () =>
  "第一步，查询数据库，现在我们准备从 Postgres 数据库中查询客户数据";
export const STEP_ONE_SUCCESS_TEXT = () =>
  "非常棒！你已经成功从数据库中查询到数据，你可以在下面查看数据详情";
export const STEP_ONE_BUTTON_TEXT = () => "继续下一步";
export const STEP_TWO_TITLE = () =>
  "用表格组件把数据展示出来，请选择我们已经为你添加的表格组件。";
export const STEP_THREE_TITLE = () => "用表格组件把数据展示出来";
export const STEP_THREE_SUCCESS_TEXT = () =>
  "干得漂亮！现在表格组件已经展示了查询出来的数据，你可以在任意输入框内使用 {{ }} 给组件绑定数据";
export const STEP_THREE_SUCCESS_BUTTON_TEXT = () => "继续下一步";
export const STEP_FOUR_TITLE = () => "让我们构建一个表单来更新用户数据";
export const STEP_FOUR_HINT_BUTTON_TEXT = () => "继续";
export const STEP_FOUR_SUCCESS_TEXT = () =>
  "太棒了！你已经把表格的选中行数据绑定到输入框了，输入框会一直显示选中行的信息";
export const STEP_FOUR_SUCCESS_BUTTON_TEXT = () => "继续下一步";
export const STEP_FIVE_TITLE = () => "在更新表单中绑定所有的输入字段";
export const STEP_FIVE_HINT_TEXT = () =>
  `现在让我们把表格选中行数据绑定到容器中的其他组件`;
export const STEP_FIVE_SUCCESS_TEXT = () =>
  "干的漂亮！现在所有的输入框都已经绑定了表格的选中行数据";
export const STEP_FIVE_SUCCESS_BUTTON_TEXT = () => "继续下一步";
export const STEP_SIX_TITLE = () => "添加更新按钮来触发查询";
export const STEP_SIX_SUCCESS_TEXT = () =>
  "完美！你的更新按钮已经准备好触发更新了";
export const STEP_SIX_SUCCESS_BUTTON_TEXT = () => "继续下一步";
export const STEP_SEVEN_TITLE = () => "让按钮绑定触发 updateCustomerInfo 查询";
export const STEP_EIGHT_TITLE = () => "触发更新后，重新查询更新后的用户数据";
export const STEP_EIGHT_SUCCESS_TEXT = () =>
  "完美！现在你已经成功构建了一个可以查询、更新用户数据的应用";
export const STEP_NINE_TITLE = () => "最后一步：测试并且发布你的应用";
export const CONTINUE = () => "继续";
export const PROCEED_TO_NEXT_STEP = () => "继续下一步";
export const PROCEED = () => "继续";
export const COMPLETE = () => "完成";
// -- Modal --
export const DEVIATION = () => "退出教程";
export const END_CONFIRMATION = () => "确定结束吗？";
export const CANCEL_DIALOG = () => "取消";
// -- End Tutorial --
export const END_TUTORIAL = () => "结束";
// -- Intro content --
export const TITLE = () => "我们会在这个教程中创建一个查询用户信息的应用";
export const DESCRIPTION = () =>
  "应用包含一个展示用户数据的表格，还有一个可以更新表格数据的表单，在开始前你可以试用一下这个应用";
export const BUTTON_TEXT = () => "开始吧";
// -- Rating --
export const RATING_TITLE = () =>
  "恭喜！你已经用 PagePlug 构建出了你的第一个应用！";
export const RATING_DESCRIPTION = () =>
  "现在你可以邀请其他小伙伴加入到这个应用";
export const RATING_TEXT = () => "体验评分";
// -- End Message --
export const END_TITLE = () => "下一步是什么？开始构建你自己的应用吧";
export const END_DESCRIPTION = () => "看看各个查询、组件的属性配置吧";
export const END_BUTTON_TEXT = () => "开始构建应用";

export const CONTEXT_EDIT_NAME = () => "编辑名称";
export const CONTEXT_SHOW_BINDING = () => "展示绑定";
export const CONTEXT_MOVE = () => "移动到页面";
export const CONTEXT_COPY = () => "复制到页面";
export const CONTEXT_DELETE = () => "删除";
export const CONFIRM_CONTEXT_DELETE = () => "确定删除吗？";
export const CONTEXT_NO_PAGE = () => "暂无页面";
export const CONTEXT_REFRESH = () => "刷新";
export const CONTEXT_CLONE = () => "克隆";
export const CONTEXT_SET_AS_HOME_PAGE = () => "设置为主页";

// Entity explorer
export const ADD_DATASOURCE_BUTTON = () => "添加数据源";
export const ADD_WIDGET_BUTTON = () => "添加组件";
export const ADD_QUERY_JS_BUTTON = () => "添加查询 / JS 对象";
export const EMPTY_WIDGET_MAIN_TEXT = () => "暂无组件";
export const EMPTY_WIDGET_BUTTON_TEXT = () => "添加组件";
export const EMPTY_QUERY_JS_MAIN_TEXT = () => "暂无查询 / JS 对象";
export const EMPTY_QUERY_JS_BUTTON_TEXT = () => "添加查询 / JS 对象";
export const EMPTY_DATASOURCE_MAIN_TEXT = () => "暂无数据源";
export const EMPTY_DATASOURCE_BUTTON_TEXT = () => "添加数据源";

// Templates
export const MORE = () => "更多";
export const SHOW_LESS = () => "收起";
export const CHOOSE_WHERE_TO_FORK = () => "选择把模板克隆到哪里";
export const SELECT_WORKSPACE = () => "选择应用组";
export const FORK_TEMPLATE = () => "克隆模板";
export const TEMPLATES = () => "模板";
export const FORK_THIS_TEMPLATE = () => "克隆这个模板";
export const COULDNT_FIND_TEMPLATE = () => "找不到你想要的模板吗？";
export const COULDNT_FIND_TEMPLATE_DESCRIPTION = () =>
  "你可以在我们的 github 上给我们提 issue ，告诉我们你想要什么模板";
export const REQUEST_TEMPLATE = () => "模板诉求";
export const SEARCH_TEMPLATES = () => "搜索模板";
export const INTRODUCING_TEMPLATES = () => "介绍模板";
export const TEMPLATE_NOTIFICATION_DESCRIPTION = () =>
  "使用这些模板更快的学习构建应用";
export const GO_BACK = () => "返回";
export const OVERVIEW = () => "概览";
export const FUNCTION = () => "功能";
export const INDUSTRY = () => "行业";
export const DATASOURCES = () => "数据源";
export const NOTE = () => "注意：";
export const NOTE_MESSAGE = () => "你可以添加你自己的数据源";
export const WIDGET_USED = () => "用到的组件";
export const SIMILAR_TEMPLATES = () => "类似模板";
export const VIEW_ALL_TEMPLATES = () => "查看所有模板";
export const FILTERS = () => "过滤";

export const IMAGE_LOAD_ERROR = () => "图片加载失败";

export const REDIRECT_URL_TOOLTIP = () =>
  "这个地址用来配置你的身份认证回调/重定向";
export const ENTITY_ID_TOOLTIP = () => "这个地址用来配置你的身份认证的实体 ID";

export const FORK_APP_MODAL_LOADING_TITLE = () => "正在拉取应用组...";
export const FORK_APP_MODAL_EMPTY_TITLE = () => "没有可用应用组";
export const FORK_APP_MODAL_SUCCESS_TITLE = () => "选择把应用克隆到哪里";
export const FORK = () => `克隆`;

export const CLEAN_URL_UPDATE = {
  name: () => "更新地址",
  shortDesc: () =>
    "你应用的所有地址都会被更新为一个更易读的格式，包括应用名称和页面名称",
  description: [
    () =>
      "你应用的所有地址都会被更新成新的形式，这样会使你的应用更容易被找到、更容易被人记住",
    (url: string) =>
      `当前应用地址更新为：<br /><code style="line-break: anywhere; padding: 2px 4px; line-height: 22px">${url}</code>`,
  ],
  disclaimer: () =>
    "引用了 <strong>appsmith.URL.fullpath</strong> 和 <strong>appsmith.URL.pathname</strong> 的属性会有显示出变化",
};

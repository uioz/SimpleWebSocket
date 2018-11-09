
/**
 * 定义服务端的错误信息
 */
export enum errorCode {
    '请求参数错误' = 10,
    'login:该昵称已经有人使用' = 11,
    'login:类型请求缺少必要的参数' = 12,
    'message:类型请求参数错误' = 13,
    'message:类型请求缺少必要参数' = 14,
    'system:用户不存在' = 100,
};

/**
 * 定义连接状态描述符号
 */
export enum ReadyStateConstants {
    'CONNECTING',
    'OPEN',
    'CLOSING',
    'CLOSED'
};

/**
 * 定义连接状态对应的中文翻译
 */
export enum ReadyStateConstantsTranslated {
    CONNECTING = '连接中',
    OPEN = '打开',
    CLOSING = '关闭中',
    CLOSED = '已关闭'
};
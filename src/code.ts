
/**
 * 定义服务端的错误信息
 */
export enum ErrorCode {
    'system:请求参数错误' = 10,
    'login:该昵称已经有人使用' = 11,
    'login:类型请求缺少必要的参数' = 12,
    'login:昵称必须长度在1到10之间的非空白字符串' = 13,
    'message:类型请求参数错误' = 20,
    'message:类型请求缺少必要参数' = 21,
    'message:消息的长度应该在1到1024个长度之间' = 22,
    'system:用户不存在' = 100,
    'error:数据格式化错误' = 200,
    'error:没有对应的检测器' = 201,
    'error:数据校检错误' = 202
};

/**
 * 定义了响应错误码对应的错误类型
 */
export const ErrorType = {
    10:'system',
    11:'login',
    12:'login',
    13:'message',
    14:'message',
    100:'system'
}

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
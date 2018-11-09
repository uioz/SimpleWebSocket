class dataCompare {
    constructor() {
        /**
         * 保存作为比较的标准
         */
        this.standard = {};
    }
    /**
     * 在内部添加一个比较标准对象并且需要提供一个名字
     *
     * 一个比较标准对象例子:
     * {
     *   key1:'number',
     *   key2:'object',
     *   key3:'array',
     *   key4:'string',
     *   key5:'boolean'
     * }
     *
     * @param name 比较标准的名称
     * @param obj 比较标准的格式
     */
    setStandardCompare(name, obj) {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const type = obj[key];
                switch (type) {
                    case 'string':
                        obj[key] = util_1.isString;
                        break;
                    case 'boolean':
                        obj[key] = util_1.isBoolean;
                        break;
                    case 'object':
                        obj[key] = util_1.isObject;
                        break;
                    case 'array':
                        obj[key] = util_1.isArray;
                        break;
                    case 'number':
                        obj[key] = util_1.isNumber;
                        break;
                }
            }
        }
        this.standard[name] = obj;
    }
    ;
    /**
     * 校验对象是否符合指定的对象标准
     *
     * 当比较成功的时候返回状态码 0 其余的返回大于0的整数.
     *
     * 直接判断成功状态可以使用!compare(name,data)
     *
     * @param name 使用比较标准的名字
     * @param data 被校验的对象
     */
    compare(name, data) {
        const compareStandard = this.standard[name];
        const standardKeys = Object.keys(compareStandard);
        const comparisonKeys = Object.keys(data);
        if (comparisonKeys.length > standardKeys.length) {
            return dataCompare.StateCode['过多参数'];
        }
        if (comparisonKeys.length < standardKeys.length) {
            return dataCompare.StateCode['过少参数'];
        }
        for (const key of standardKeys) {
            if (key in comparisonKeys) {
                if (!compareStandard[key](data[key])) {
                    return dataCompare.StateCode['参数类型不匹配'];
                }
            }
            else {
                return dataCompare.StateCode['参数键名不对'];
            }
        }
        return dataCompare.StateCode['匹配正确'];
    }
    ;
}
/**
 * 状态码
 */
dataCompare.StateCode = {
    '匹配正确': 0,
    '过少参数': 1,
    '过多参数': 2,
    '参数键名不对': 3,
    '参数类型不匹配': 4,
};
exports.dataCompare = dataCompare;
;
const cc = new dataCompare();
cc.setStandardCompare('s', {
    type: 'string',
    auth: 'number',
    user: 'array'
});
const code = cc.compare('s', {
    type: 'hello',
    auth: 123,
    user: []
});
console.log(dataCompare.StateCode[code]);
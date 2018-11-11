"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 循环执行任务类
 */
class circlingTask {
    /**
     * 添加多个任务或单个任务函数
     * @param rest 单个任务函数
     */
    constructor(...rest) {
        this.tasks = [];
        this.timeOutId = false;
        this.delayTime = 0;
        if (rest.length) {
            this.setTask(...rest);
        }
    }
    isTimeOutType(timeOut) {
        return typeof timeOut === 'object';
    }
    /**
     * 添加多个任务或单个任务函数
     * @param rest 单个任务函数
     */
    setTask(...rest) {
        this.tasks.push(...rest);
        return this;
    }
    /**
     * 设置函数循环触发的间隔时间
     */
    setDelayTime(delayTime) {
        delayTime = Math.floor(delayTime);
        if (delayTime < 0) {
            delayTime = 0;
        }
        this.delayTime = delayTime;
        return this;
    }
    /**
     * 执行内部的任务
     */
    start() {
        if (!this.timeOutId && this.tasks.length) {
            this.timeOutId = setInterval(() => {
                if (!this.isTimeOutType(this.timeOutId)) {
                    return;
                }
                for (const task of this.tasks) {
                    task();
                }
            }, this.delayTime);
        }
        return this;
    }
    /**
     * 停止执行内部的任务
     */
    stop() {
        if (this.isTimeOutType(this.timeOutId)) {
            clearInterval(this.timeOutId);
        }
        this.timeOutId = false;
        return this;
    }
    /**
     * 删除内部的函数引用,并且停止执行所有的任务
     */
    distory() {
        this.tasks = [];
        return this.stop();
    }
}
exports.circlingTask = circlingTask;
;

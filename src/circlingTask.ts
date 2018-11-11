type TimeOutId = NodeJS.Timeout;

/**
 * 循环执行任务类
 */
export class circlingTask {

    private tasks: Array<(...args: any) => void> = [];
    private timeOutId: TimeOutId | boolean = false;
    private delayTime: number = 0;

    /**
     * 添加多个任务或单个任务函数
     * @param rest 单个任务函数
     */
    constructor(...rest: Array<(...args: any) => void>) {

        if (rest.length) {
            this.setTask(...rest);
        }

    }

    private isTimeOutType(timeOut: any): timeOut is TimeOutId {
        return typeof timeOut === 'object';
    }

    /**
     * 添加多个任务或单个任务函数
     * @param rest 单个任务函数
     */
    public setTask(...rest: Array<(...args: any) => void>) {
        this.tasks.push(...rest);

        return this;
    }

    /**
     * 设置函数循环触发的间隔时间
     */
    public setDelayTime(delayTime: number) {

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
    public start() {

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
    public stop() {

        if (this.isTimeOutType(this.timeOutId)) {
            clearInterval(this.timeOutId);
        }

        this.timeOutId = false;

        return this;
    }

    /**
     * 删除内部的函数引用,并且停止执行所有的任务
     */
    public distory() {

        this.tasks = [];

        return this.stop();
    }

};

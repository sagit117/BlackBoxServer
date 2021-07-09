"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class StackAccessIP {
    constructor() {
        this.stack = [];
        setInterval(() => {
            let findIndex = 0;
            while (findIndex > -1) {
                findIndex = this.stack.findIndex((item) => new Date().getTime() - item.timeLastRequest.getTime() >
                    60000 * 60);
                this.stack.splice(findIndex, 1);
            }
        }, 60000 * 60);
    }
    addStack(url, ip, timeLifeStack) {
        const findStackItemIndex = this.stack.findIndex((item) => item.ip === ip && item.url === url);
        if (findStackItemIndex > -1 &&
            new Date().getTime() -
                this.stack[findStackItemIndex].timeLastRequest.getTime() >
                timeLifeStack) {
            this.stack.splice(findStackItemIndex, 1);
        }
        const findStackItem = this.stack.find((item) => item.ip === ip && item.url === url);
        if (!findStackItem) {
            const item = {
                url,
                ip,
                timeLastRequest: new Date(),
                countRequest: 1,
            };
            this.stack.push(item);
            return item;
        }
        else {
            Object.assign(findStackItem, {
                timeLastRequest: new Date(),
                countRequest: findStackItem.countRequest + 1,
            });
            return findStackItem;
        }
    }
}
exports.default = new StackAccessIP();

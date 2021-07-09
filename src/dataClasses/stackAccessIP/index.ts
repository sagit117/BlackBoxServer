interface IStackItem {
    url: string
    ip: string
    timeLastRequest: Date
    countRequest: number
}

/**
 * Хранилище запросов IP к url
 */
class StackAccessIP {
    private stack: IStackItem[] = []

    constructor() {
        /**
         * Очистка очереди
         */
        setInterval(() => {
            let findIndex: number = 0

            while (findIndex > -1) {
                findIndex = this.stack.findIndex(
                    (item) =>
                        new Date().getTime() - item.timeLastRequest.getTime() >
                        60000 * 60
                )

                this.stack.splice(findIndex, 1)
            }
        }, 60000 * 60)
    }

    public addStack(url: string, ip: string, timeLifeStack: number) {
        const findStackItemIndex = this.stack.findIndex(
            (item) => item.ip === ip && item.url === url
        )

        /**
         * Если время жизни очереди больше указанного значения, удаляем очередь
         */
        if (
            findStackItemIndex > -1 &&
            new Date().getTime() -
                this.stack[findStackItemIndex].timeLastRequest.getTime() >
                timeLifeStack
        ) {
            this.stack.splice(findStackItemIndex, 1)
        }

        const findStackItem = this.stack.find(
            (item) => item.ip === ip && item.url === url
        )

        if (!findStackItem) {
            const item = {
                url,
                ip,
                timeLastRequest: new Date(),
                countRequest: 1,
            }

            this.stack.push(item)

            return item
        } else {
            Object.assign(findStackItem, {
                timeLastRequest: new Date(),
                countRequest: findStackItem.countRequest + 1,
            })

            return findStackItem
        }
    }
}

export default new StackAccessIP()

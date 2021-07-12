import { Model, Query, UpdateWriteOpResult } from 'mongoose'

/**
 * Базовый класс для сервиса
 */
export default class BaseServiceModel {
    readonly Model: Model<any>

    constructor(model: Model<any>) {
        this.Model = model
    }

    /**
     * Найти все записи модели
     */
    findAll<T>(): Query<T[], any, {}> {
        return this.Model.find()
    }

    /**
     * Поиск записей по одному полю
     * @param fieldName - название поля
     * @param value     - значение поля
     */
    findByOneField<T>(
        fieldName: string,
        value: string | number | null | boolean
    ): Query<T[], any, {}> {
        return this.Model.find({ [fieldName]: value })
    }

    /**
     * Поиск последней записи по полю
     * @param fieldName - название поля
     * @param value     - значение поля
     */
    findLastByOneField<T>(
        fieldName: string,
        value: string | number | null | boolean
    ): Query<T, any, {}, any> {
        return this.Model.findOne({ [fieldName]: value }).sort({ _id: -1 })
    }

    /**
     * Найти последнюю запись
     */
    findLast<T>(limit: number = 1): Query<T[], any, {}> {
        return this.Model.find().sort({ _id: -1 }).limit(limit)
    }

    /**
     * Создание записи
     * @param data  - данные записи
     */
    create<T>(data: T) {
        return new this.Model(data).save()
    }

    /**
     * Создание или обновление записи
     * @param data - данные записи
     */
    createOrUpdateById<T extends { _id: string }>(data: T) {
        if (data._id) {
            return this.Model.updateOne({ _id: data._id }, data).exec()
        }

        return new this.Model(data).save()
    }

    /**
     * Обновить одну запись по фильтру
     * @param filter
     * @param data
     */
    updateOneByFilter<T>(
        filter: object,
        data: object
    ): Query<UpdateWriteOpResult, T, {}, any> {
        return this.Model.updateOne(filter, data)
    }

    /**
     * Удаление записи
     * @param filter
     */
    remove(filter: object): Query<
        { ok?: number | undefined; n?: number | undefined } & {
            deletedCount?: number | undefined
        },
        any,
        {}
    > {
        return this.Model.deleteMany(filter)
    }
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BaseServiceModel {
    constructor(model) {
        this.Model = model;
    }
    findAll() {
        return this.Model.find();
    }
    findByOneField(fieldName, value) {
        return this.Model.find({ [fieldName]: value });
    }
    findLastByOneField(fieldName, value) {
        return this.Model.findOne({ [fieldName]: value }).sort({ _id: -1 });
    }
    findLast(limit = 1) {
        return this.Model.find().sort({ _id: -1 }).limit(limit);
    }
    create(data) {
        return new this.Model(data).save();
    }
    createOrUpdateById(data) {
        if (data._id) {
            return this.Model.updateOne({ _id: data._id }, data).exec();
        }
        return new this.Model(data).save();
    }
    updateOneByFilter(filter, data) {
        return this.Model.updateOne(filter, data);
    }
    remove(filter) {
        return this.Model.deleteMany(filter);
    }
}
exports.default = BaseServiceModel;

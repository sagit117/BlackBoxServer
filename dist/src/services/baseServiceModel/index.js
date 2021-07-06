export default class BaseServiceModel {
    constructor(model) {
        this.Model = model;
    }
    findAll() {
        return this.Model.find();
    }
    findByOneField(fieldName, value) {
        return this.Model.find({ [fieldName]: value });
    }
    findLast(limit = 1) {
        return this.Model.find().sort({ _id: -1 }).limit(limit);
    }
    create(data) {
        return new this.Model(data).save();
    }
    createOrUpdate(data) {
        if (data._id) {
            return this.Model.updateOne({ _id: data._id }, data).exec();
        }
        return new this.Model(data).save();
    }
    updateOneWithFilter(filter, data) {
        return this.Model.updateOne(filter, data);
    }
}

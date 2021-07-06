import { HttpInternalServerException, HttpValidationErrorException, } from '../../dataClasses/httpErrors';
import { BlackBoxApp } from '../../index';
export default class BaseController {
    constructor(request, response, next) {
        this.request = request;
        this.response = response;
        this.next = next || null;
    }
    prepareQueryAndSendResponse(promise) {
        promise
            .then((result) => {
            this.render(result, 200);
        })
            .catch((error) => {
            BlackBoxApp.emit('errorLog', error, 'REQUEST');
            if (error.name === 'ValidationError') {
                throw new HttpValidationErrorException('Данные не проходят проверку', this.response);
            }
            throw new HttpInternalServerException('Произошла внутренняя ошибка сервера', this.response);
        });
    }
    render(result, code) {
        this.response.setHeader('Access-Control-Allow-Origin', '*');
        this.response.status(code).send(result);
    }
}
//# sourceMappingURL=index.js.map
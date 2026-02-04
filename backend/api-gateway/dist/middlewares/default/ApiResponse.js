export default class ApiResponse {
    constructor(success, message, data) {
        this.success = success;
        this.message = message;
        if (data !== undefined) {
            this.data = data;
        }
    }
}
//# sourceMappingURL=ApiResponse.js.map
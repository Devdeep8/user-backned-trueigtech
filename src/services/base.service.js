export class BaseService {
    constructor(error , args , context , db){
        this.error = error
        this.args = args
        this.context = context
        this.db = db
    }

    async run() {
        throw new Error("Method not implemented");
    }
}
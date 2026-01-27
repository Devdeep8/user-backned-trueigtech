export class BaseService {
  constructor(error, args, context, db) {
    this.error = error;
    this.args = args;
    this.context = context;
    this.db = db;
    this.serviceName = this.constructor.name;
  }
  async execute() {
    try {
      return await this.run();
    } catch (error) {
      console.log(error);
    }
  }

  async run() {
    throw new Error("Method not implemented");
  }
}

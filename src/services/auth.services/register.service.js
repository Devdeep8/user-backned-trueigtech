import { TokenService } from "../../utils/token.service.js";
import { BaseService } from "../base.service.js";
import bcrypt from "bcryptjs";

class RegisterService extends BaseService{
    async run(){
        const {name , email , password} = this.args;
        const {config} = this.context;

        if(!name){
            throw new this.error("Name is required" , this.httpStatus.BAD_REQUEST);
        }
        if(!email){
            throw new this.error("Email is required" , this.httpStatus.BAD_REQUEST);
        }
        if(!password){
            throw new this.error("Password is required" , this.httpStatus.BAD_REQUEST);
        }

        const user = await this.db.user.findOne({
            where : {email}
        })
        if(user){
            throw new this.error("User already exists" , this.httpStatus.BAD_REQUEST);
        }

        const role = await this.db.role.findOne({
            where : {name : "user"}
        })
        if(!role){
            throw new this.error("Role not found" , this.httpStatus.NOT_FOUND);
        }

        const hashedPassword = await bcrypt.hash(password , 12);
        const newUser = await this.db.user.create({
            name,
            email,
            password : hashedPassword,
            roleId : role.id
        })

        const tokenService = new TokenService(config);
        const payload = {
            userId : newUser.id,
            role : role.name
        }

        const accessToken = tokenService.createAccessToken(payload);
        const refreshToken = tokenService.createRefreshToken(payload);

        return {accessToken , refreshToken};
    }
}


export default RegisterService;
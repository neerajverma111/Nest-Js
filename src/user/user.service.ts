import { Injectable } from '@nestjs/common';
import { Helper } from './user.helper';
import { RabbitMQService } from 'src/rabbitMq/rabbitmq.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    private readonly helper: Helper,
    private readonly rabbitMQService: RabbitMQService,
  ) {}
  async uploadData(body: any) {
    try {
      const isUserExist = await this.helper.CheckInDb(body);
      if (!isUserExist) {
        const queryResponse = await this.helper.InsertInDb(body);
        if (queryResponse) {
          // Send message to RabbitMQ queue
          await this.rabbitMQService.sendMessage('xyz', body);
          return true;
        }
      }
      return false;
    } catch (err) {
      console.log('Error From services::::', err.message);
    }
  }
  async login(body: any) {
    try {
      const queryResponse: any = await this.helper.isLogin(body);
      if (queryResponse) {
        return queryResponse;
      } else return false;
    } catch (err) {
      // console.log('Error::::', err.message);
    }
  }

  async verifyToken(token: any) {
    const result = await this.helper.tokenVerify(token);
    return result;
  }

  async getUserData(req: any) {
    try {
      const result = await this.helper.getData(req.user);
      if (result) {
        return result;
      }
      return false;
    } catch (error) {
      console.log("error in services ", error.message);
    }
  }
  async getAllUserData(){
    const result = await this.helper.getAllUsersData();
    return result;
  }
}

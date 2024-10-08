import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Redis } from 'ioredis';
import DbConnection from 'src/database/connection';
import { RabbitMQService } from 'src/rabbitMq/rabbitmq.service';
import { v4 as uuidv4 } from 'uuid';

const connect = new DbConnection().connectDb().promise();
@Injectable()
export class Helper {
  constructor(
    @InjectRedis() private readonly redis: Redis, // Inject Redis client
    private readonly rabbitMQService: RabbitMQService,
    private readonly jwtService: JwtService,
  ) {}

  async InsertInDb(body: any) {
    try {
      const { name, email, password, confirm_password } = body;
      // Store user data in the database
      const result = await connect.query(
        'INSERT INTO userData(id, name, email, password, confirm_password) VALUES (?,?,?,?,?)',
        [uuidv4(), name, email, password, confirm_password],
      );
      if (result[1] !== undefined) {
        return false;
      } else {
        const user = { name, email, password, confirm_password };

        //Sending data to Queue in RabbitMQ
        await this.rabbitMQService.sendMessage('xyz', user);

        //Sending the data to Redis
        await this.redis.set(`user_${email}`, JSON.stringify(user), 'EX', 600); // TTL 600 seconds (Time To Load)

        return true;
      }
    } catch (error) {
      console.log('Error From Helper::', error.message);
    }
  }
  async CheckInDb(body: any) {
    try {
      const { email } = body;

      // First, check if the user exists in Redis
      const cachedUser = await this.redis.get(`user_${email}`);
      if (cachedUser) {
        console.log(cachedUser);
        // User exists in Redis, return true
        console.log('User found in Redis');
        return true;
      }

      // If not in Redis, check the database
      const result: any = await connect.query(
        'SELECT email FROM userData WHERE email = (?)',
        [email],
      );

      if (result[0].length > 0) {
        // If the same email exists in the database, store it in Redis for future use
        const dbUser = result[0][0]; // assuming the first result is the user
        console.log(dbUser, ':;');
        await this.redis.set(
          `user_${email}`,
          JSON.stringify(dbUser),
          'EX',
          600,
        ); // TTL 600 seconds
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log('Error::', error.message);
    }
  }
  async isLogin(body: any) {
    const { email, password } = body;
    const result: any = await connect.query(
      'SELECT email FROM userData WHERE email = ? && password = ?',
      [email, password],
    );
    if (result[0].length > 0) {
      const user = await this.validateUser(email, password);
      console.log('user:::::', user.password);
      if (user) {
        const id = user.id.toString();
        // console.log('idddddddddddddddddddddddddddddddd:::::', id);
        const payload = { id, email: user.email, password: user.password };
        const token = this.jwtService.sign(payload, { expiresIn: '1h' });
        console.log('token::::::::::::', token);
        const data = result[0][0];
        await this.redis.set(`user_${email}`, JSON.stringify(data), 'EX', 600);
        return token;
      }
      return null;
    } else return false;
  }
  async validateUser(email: string, password: string): Promise<any> {
    const [result]: any = await connect.query(
      'SELECT id,email, password FROM userData WHERE email = ? && password = ?',
      [email, password],
    );
    if (result.length === 0) {
      return null;
    }
    const user = result[0];
    console.log('User Found: ', user);
    return user;
  }

  async tokenVerify(token: any) {
    // const key:any = process.env.SECRET_KEY;
    const result = this.jwtService.verify(token);
    console.log('token verified>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', result);
    return result;
  }

  async getData(req: any) {
    try {
      const { id } = req;
      const [result]: any = await connect.query(
        'SELECT name, email FROM userData where id =?',
        [id],
      );
      return result[0];
    } catch (error) {
      console.log('Error in helper', error.message);
    }
  }
  async getAllUsersData() {
    try {
      const [result]: any = await connect.query(
        'SELECT id,name,email,password FROM userData',
      );
      console.log('data::::::::::::::', result);
      return result;
    } catch (error) {
      console.log('Error in helper', error.message);
    }
  }
}

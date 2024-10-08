import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log('Inside the Guard.');
    try {
      const request = context.switchToHttp().getRequest();
      const token =  request.headers?.authorization.split(" ")[1];
      if (!token) {
        console.log('token not found!!');
        throw new UnauthorizedException('Authorization Header Missing.');
      }
      const verified = this.jwtService.verify(token);
      request.user = verified;
      console.log('User verified in Guards ');
      return true;
    } catch (error) {
      console.log('Error: ', error.message);
      throw new UnauthorizedException();
    }
  }
}
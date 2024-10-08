import {
  Body,
  Controller,
  Get,
  Post,
  Redirect,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GoogleAuthService } from './google-auth.service';

@Controller('auth')
export class AuthController {
  userData: any;
  constructor(private readonly googleAuthService: GoogleAuthService) {
    let userData = '';
  }

  @Get('google/callback')
  @Redirect()
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req: any) {
    this.userData = req.user;
    // console.log(req.user);
    // Successful authentication, redirect to the dashboard or secure route
    return { url: 'http://localhost:3000/auth/dashboard' };
  }

  @Get('dashboard')
  getDashboard() {
    if (this.userData) {
      return `Name: ${this.userData.firstName}, Email: ${this.userData.email}`;
    }
    return 'User not authenticated';
  }

  @Post('google/verify')
  async verifyGoogleToken(@Body('token') token: string) {
    try {
      const payload = await this.googleAuthService.verifyAccessToken(token);
      console.log('payload::::verified data:::::::::::', payload);
      return {
        message: 'Token Verified',
        user: payload.email,
        isVerified: payload.verified_email,
      };
    } catch (error) {
      return {
        message: 'Invalid token',
        error: error.message,
      };
    }
  }
}

import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class GoogleAuthService {
  async verifyAccessToken(accessToken: string): Promise<any> {
    try {
      // Google tokeninfo endpoint to verify the access token
      const response = await axios.get(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`);

      // Check if the token is valid
      if (response.status === 200) {
        return response.data;  // Return token info if valid
      } else {
        throw new Error('Invalid access token');
      }
    } catch (error) {
      throw new Error('Invalid access token');
    }
  }
}
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  // This is a simple health check endpoint that can be used to verify that the API is running.
  getHealth(): string {
    return 'API is healthy and running!';
  }
}

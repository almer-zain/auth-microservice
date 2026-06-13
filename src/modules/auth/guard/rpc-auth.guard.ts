// guards/rpc-auth.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/common/types/jwt-types';
import { getErrorMessage } from 'src/utils/error.util';

// Define the shape of the data coming through the microservice
export interface AuthenticatedRpcData {
  token?: string;
  user?: JwtPayload;
  [key: string]: any; // Allow other properties like 'id', 'email', etc.
}

@Injectable()
export class RpcAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  private readonly logger = new Logger('RpcAuthGuard');

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1. Tell Nest what type the RPC data is
    const rpcData = context.switchToRpc().getData<AuthenticatedRpcData>();

    const token = rpcData?.token;

    if (!token) {
      return false;
    }

    try {
      // 2. Tell verifyAsync exactly what the payload should look like
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);

      // 3. This is now a "Safe Assignment" because payload is typed
      rpcData.user = payload;

      return true;
    } catch (error: unknown) {
      this.logger.error(
        'RPC Authentication failed: Invalid or expired token.',
        getErrorMessage(error),
      );

      // If token is expired or invalid
      return false;
    }
  }
}

/**
 * 
Usage in Controller:

    @MessagePattern('get.secure.data')
    @UseGuards(RpcAuthGuard)
    getData(@Payload() data: any) {
    console.log('Authorized User:', data.user);
    return { secret: 'Confidential Data' };
    }
    
 */

// guards/rpc-auth.guard.ts
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RpcAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const rpcData = context.switchToRpc().getData();
    const token = rpcData.token; 

    try {
      const payload = await this.jwtService.verifyAsync(token);
      rpcData.user = payload; 
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * Usage in Controller:

    @MessagePattern('get.secure.data')
    @UseGuards(RpcAuthGuard)
    getData(@Payload() data: any) {
      console.log('Authorized User:', data.user);
      return { secret: 'Confidential Data' };
    }
    
 */
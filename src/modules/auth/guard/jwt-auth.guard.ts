import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

/**
 * 
Usage in Controller:

    @Controller('profile')
    export class ProfileController {
        @UseGuards(JwtAuthGuard) // Protects this route
        @Get()
        getProfile(@Request() req) {
            return req.user; // Contains { userId, email } from the Strategy validate()
        }
    }
    
 */

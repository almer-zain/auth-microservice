import { Global, Module } from '@nestjs/common';
import { AppService } from '../app.service';

@Global() // Makes AppService available everywhere without re-importing
@Module({
  providers: [AppService],
  exports: [AppService],
})
export class ConfigManagerModule {}
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReservationModule } from './modules/reservation/reservation.module';
import { AiModule } from './modules/ai/ai.module';

@Module({
  imports: [ReservationModule, AiModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

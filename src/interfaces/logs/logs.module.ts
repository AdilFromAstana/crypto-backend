import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LogsService } from './logs.service';
import { LogEvent, LogEventSchema } from './schemas/log-event.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LogEvent.name, schema: LogEventSchema }, // <-- ЭТО ВАЖНО
    ]),
  ],
  providers: [LogsService],
  exports: [LogsService],
})
export class LogsModule {}
 
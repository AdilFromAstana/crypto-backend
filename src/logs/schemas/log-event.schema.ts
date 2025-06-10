import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LogEventDocument = LogEvent & Document;

@Schema({ timestamps: true })
export class LogEvent {
  @Prop({ required: true })
  type: string;

  @Prop()
  userId?: string;

  @Prop({ type: Object })
  data?: Record<string, any>;
}

export const LogEventSchema = SchemaFactory.createForClass(LogEvent);

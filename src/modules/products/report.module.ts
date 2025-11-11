import { Module } from '@nestjs/common';
import { ReportController } from './report.controller';
import { PubSubService } from '../pub-sub/pub-sub.service';

@Module({
  controllers: [ReportController],
  providers: [PubSubService],
})
export class ReportModule {}

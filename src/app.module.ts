import { Module } from '@nestjs/common';
import { ReportModule } from './modules/reports/report.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ReportModule,
  ],
})
export class AppModule {}

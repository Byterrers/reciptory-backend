import { Module } from '@nestjs/common';
import { ScannerService } from './scanner.service';
import { ScannerController } from './scanner.controller';

@Module({
  providers: [ScannerService],
  controllers: [ScannerController]
})
export class ScannerModule {}

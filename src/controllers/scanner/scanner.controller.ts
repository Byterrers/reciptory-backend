import { Controller, Post, Res, HttpStatus } from '@nestjs/common';

/* Service */
import { ScannerService } from './scanner.service';
import { Http2ServerResponse } from 'http2';

@Controller('scanner')
export class ScannerController {
    constructor(private readonly scannerService: ScannerService) {}

    @Post()
    scan(data: any, @Res() res) {
        const response = this.scannerService.scan(data);
        return res.status(HttpStatus.OK).json(response);
    }
}

import { Injectable } from '@nestjs/common';

@Injectable()
export class ScannerService {
    constructor() {}

    scan(data: any) {
        console.log(data);

        // Do stuff. ^(\d+)\s(\w+\s+)+$
        const regexp = /^(\d+\s\w+)[\s\w]*$/;
        let dataFiltered = data.filter((l) => l.match(regexp));

        dataFiltered = dataFiltered.map(p => {
            return {
            quantity: p[0],
                unit: null,
                name: p.substr(2, p.length)
            };
        });

        console.log(data);

        return dataFiltered;
    }
}

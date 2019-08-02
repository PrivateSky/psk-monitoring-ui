import {Injectable} from '@angular/core';
import {Observable, from} from "rxjs";
import {InfluxConnectionService} from "./influx-connection.service";
import {switchMap} from "rxjs/operators";


@Injectable({
    providedIn: 'root'
})
export class InfluxService {

    private query = 'SELECT message AS "mean_message" FROM "psk_logs"."autogen"."logs" FILL(null)';

    constructor(private influxConnectionService: InfluxConnectionService) {
    }

    public runQuery(): Observable<string[]> {
        return this.influxConnectionService.getConnection()
            .pipe(
                switchMap(connection => {
                    return from(connection.query(this.query)) as unknown as Observable<string[]>;
                })
            );
    }
}



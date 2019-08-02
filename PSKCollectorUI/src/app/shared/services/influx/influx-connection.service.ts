import { Injectable } from '@angular/core';
import {InfluxDiscoveryService} from "./influx-discovery.service";
import {InfluxDB} from 'influx';
import {Observable, of} from "rxjs";
import {switchMap, tap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class InfluxConnectionService {

  private influx: InfluxDB;

  constructor(private influxDiscoveryService: InfluxDiscoveryService) {
  }

  public getConnection(): Observable<InfluxDB> {
    if(this.influx) {
      return of(this.influx);
    }

    return this.influxDiscoveryService.getInfluxDatabaseModel()
        .pipe(
            tap(databaseModel => {
              if(!this.influx) { this.influx = new InfluxDB(databaseModel)}
            }),
            switchMap(() => of(this.influx))
        );
  }
}

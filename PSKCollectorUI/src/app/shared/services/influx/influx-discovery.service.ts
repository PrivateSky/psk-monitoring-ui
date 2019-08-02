import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InfluxDiscoveryService {

  constructor(private http: HttpClient) { }

  public getInfluxDatabaseModel() {
    const url = `${environment.CollectorAddress}/v1/databaseConfig`;

    return this.http.get(url)
  }
}

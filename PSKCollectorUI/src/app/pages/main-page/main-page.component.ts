import { Component, OnInit } from '@angular/core';
import {InfluxService} from "../../shared/services/influx/influx.service";


@Component({
  selector: 'psk-main',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {

  constructor(private influxService: InfluxService) { }

  ngOnInit() {
    this.influxService.runQuery()
        .subscribe(console.log)
  }

}

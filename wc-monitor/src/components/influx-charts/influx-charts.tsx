import {Component, Host, h, Prop} from '@stencil/core';
import {MatchResults} from "@stencil/router";
import {config} from '../../app.config';

@Component({
  tag: 'influx-charts',
  styleUrl: 'influx-charts.css',
  shadow: true
})
export class InfluxCharts {
  @Prop() match: MatchResults;

  render() {
    const url = config.chartPages[this.match.params.pageType]
    return (
      <Host>
        <iframe id="iframe-chart" src={url} />

      </Host>
    );
  }

}

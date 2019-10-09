import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'landing-page',
  styleUrl: 'landing-page.css',
  shadow: true
})
export class LandingPage {

  render() {
    return (
      <Host>
        <div class="floating-thingy">
          <title class="floating-thingy--title">PrivateSky Monitor Tool</title>
          <div class="floating-thingy--body">
            This Web App offers an overview of the nodes and swarms in a PrivateSky Network.
            The main functionalities of the present pages are:
            <ul>
              <li>Logs - offers information about the logs, errors and warning that appeared inside PrivateSky Nodes</li>
              <li>Resources - offers data about the state of the machine that are running the PrivateSky Nodes</li>
              <li>Swarms - offers different metrics about the swarms run by the PrivateSky Nodes</li>
            </ul>
          </div>
          <button class="floating-thingy--button">
            <span>Logs</span>
          </button>
        </div>
      </Host>
    );
  }

}

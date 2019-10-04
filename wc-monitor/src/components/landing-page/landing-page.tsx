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
          <title class="floating-thingy--title">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy </title>
          <div class="floating-thingy--body">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo</div>
          <button class="floating-thingy--button">
            <span>Logs</span>
          </button>
        </div>
      </Host>
    );
  }

}

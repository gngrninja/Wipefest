import { Component } from '@angular/core';

@Component({
  selector: 'wf-footer',
  template: `
  <footer>
    <hr />
    <div class="container mb-3">
      All data is retrieved from <a href="http://warcraftlogs.com" target="_blank" rel="noopener noreferrer">Warcraft Logs</a>. Tooltips from <a href="http://wowhead.com" target="_blank" rel="noopener noreferrer">Wowhead</a>.
    </div>
  </footer>
  `,
  styles: [`hr {border: 0; border-top: 1px solid #222222;}`]
})
export class FooterComponent {}

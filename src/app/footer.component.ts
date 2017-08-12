import { Component } from '@angular/core';

@Component({
    selector: 'wf-footer',
    template: `
  <footer>
    <hr />
    <div class="container mb-3">
      All data is retrieved from <a href="http://warcraftlogs.com" target="_blank">Warcraft Logs</a>. Tooltips from <a href="http://wowhead.com" target="_blank">Wowhead</a>.
    </div>
  </footer>
  `
})
export class FooterComponent { }

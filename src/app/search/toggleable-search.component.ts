import { Component, Input } from '@angular/core';

@Component({
  selector: 'toggleable-search',
  template: `<div class="ml-2 mb-3">
    <button class="btn btn-sm btn-outline-info" (click)="showSearch = !showSearch"><i class="fa fa-search"></i> {{text}}</button>
  </div>

  <search *ngIf="showSearch"></search>`,
  styles: [``]
})
export class ToggleableSearchComponent {

    showSearch = false;
    @Input() text = "Search";

}

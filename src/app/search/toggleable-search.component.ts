import { Component, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'toggleable-search',
  template: `
<div class="ml-2 mb-3">
  <button class="btn btn-sm btn-secondary" (click)="open(content)"><i class="fa fa-search"></i> {{text}}</button>
</div>

<ng-template #content let-c="close" let-d="dismiss">
  <div class="modal-header">
    <h4 class="modal-title">Search</h4>
    <button type="button" class="close" aria-label="Close" (click)="d('Cross click')">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
  <div class="modal-body">
    <search></search>
  </div>
</ng-template>
`,
  styles: [``]
})
export class ToggleableSearchComponent {
  @Input() text = 'Search';

  constructor(private modal: NgbModal) {}

  open(content) {
    this.modal.open(content, { size: 'lg' });
  }
}

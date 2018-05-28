import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'progress-bar',
  template: `
  <div class="progress">
    <div [ngClass]="classes"></div>
  </div>
  `,
  styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent implements OnInit {
  classes: string = 'progress-bar';

  ngOnInit(): void {
    setTimeout(() => {
      this.classes = 'progress-bar loading';
    }, 10);
  }
}

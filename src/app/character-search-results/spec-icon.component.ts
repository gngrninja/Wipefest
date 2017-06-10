import { Component, Input } from '@angular/core';
import { Ability } from "app/fight-events/ability-event";

@Component({
    selector: 'spec-icon',
    template: `
    <img src="https://www.warcraftlogs.com/img/icons/{{class}}-{{spec}}.jpg" alt="{{alt}}" />
  `,
    styles: [`
    a:hover {
      text-decoration: none;
    }

    img {
      width: 20px;
      height: 20px;
      border-radius: 10px;
    }`]
})
export class SpecIconComponent {

    @Input() class: string;
    @Input() spec: string;
    @Input() alt: string;

}

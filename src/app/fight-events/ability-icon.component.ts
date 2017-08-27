import { Component, Input } from '@angular/core';
import { Ability } from "app/fight-events/ability-event";

@Component({
    selector: 'ability-icon',
    template: `
    <a *ngIf="linkToWowhead" href="http://wowhead.com/spell={{abilityId}}" target="_blank" rel="noopener noreferrer">
      <img src="https://www.warcraftlogs.com/img/icons/abilities/{{abilityIcon}}" alt="{{alt}}" />
    </a>
    <img *ngIf="!linkToWowhead" src="https://www.warcraftlogs.com/img/icons/abilities/{{abilityIcon}}" alt="{{alt}}" />
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
export class AbilityIconComponent {

    @Input() abilityId: number;
    @Input() abilityIcon: string;
    @Input() alt: string;
    @Input() linkToWowhead: boolean;

}

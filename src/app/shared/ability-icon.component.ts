import { Component, Input } from '@angular/core';

@Component({
  selector: 'ability-icon',
  template: `
    <a *ngIf="linkToWowhead" href="http://wowhead.com/spell={{abilityId}}" target="_blank" rel="noopener noreferrer">
      <img src="https://dmszsuqyoe6y6.cloudfront.net/img/warcraft/abilities/{{abilityIcon}}" alt="{{alt}}" />
    </a>
    <img *ngIf="!linkToWowhead" src="https://dmszsuqyoe6y6.cloudfront.net/img/warcraft/abilities/{{abilityIcon}}" alt="{{alt}}" />
  `,
  styles: [
    `
    a:hover {
      text-decoration: none;
    }

    img {
      width: 20px;
      height: 20px;
      border-radius: 10px;
    }`
  ]
})
export class AbilityIconComponent {
  @Input() abilityId: number;
  @Input() abilityIcon: string;
  @Input() alt: string;
  @Input() linkToWowhead: boolean;
}

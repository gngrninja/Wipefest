import { Component, Input } from '@angular/core';
import { Ability } from "app/fight-events/ability-event";

@Component({
    selector: 'ability-icon',
    template: `
    <a href="{{ability.url}}" target="_blank">
      <img src="{{ability.iconUrl}}" alt="{{ability.name}}" />
    </a>
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

    @Input() ability: Ability;

}

import { Component, Input } from '@angular/core';
import { FightInfo } from '@wipefest/api-sdk/dist/lib/models';
import { Difficulty } from '../../helpers/difficulty-helper';

@Component({
  selector: 'fight-title',
  template: `
  <div class="title p-2 pl-3" [ngClass]="fightInfo.kill ? 'kill' : 'wipe'">
    <h3 class="mb-0">
      {{Difficulty.ToString(fightInfo.difficulty)}} {{fightInfo.name}}
    </h3>
  </div>
  `,
  styleUrls: ['./fight-title.component.scss']
})
export class FightTitleComponent {
  @Input() fightInfo: FightInfo;
  Difficulty: any = Difficulty;
}

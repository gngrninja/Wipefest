import { Component } from '@angular/core';
import { FightEventComponent } from "../fight-event/fight-event.component";

@Component({
    selector: '[table-fight-event]',
    templateUrl: './table-fight-event.component.html',
    styleUrls: ['../fight-event/fight-event.component.scss', './table-fight-event.component.scss']
})
export class TableFightEventComponent extends FightEventComponent { }

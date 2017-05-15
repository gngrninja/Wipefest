import {Component, Input, Output, EventEmitter} from '@angular/core';
import { Zone, Encounter } from "../warcraft-logs-api/zone";

@Component({
  selector: 'zone',
  templateUrl: './zone.component.html',
  styleUrls: ['./zone.component.css']
})
export class ZoneComponent {

  @Input()
  zone: Zone;

  @Output()
  encounterEmitter: EventEmitter<Encounter> = new EventEmitter<Encounter>();

  private selectEncounter(encounter: Encounter) {
    this.encounterEmitter.emit(encounter);
  }

}

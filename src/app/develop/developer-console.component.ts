import { Component, OnInit } from '@angular/core';
import { Page, WipefestService } from 'app/wipefest.service';
import {
  FightInfo,
  EventDto,
  EventConfig,
  Ability
} from '@wipefest/api-sdk/dist/lib/models';
import { WipefestAPI } from '@wipefest/api-sdk';
import { NgxEditorModel } from 'ngx-monaco-editor';
// tslint:disable-next-line:no-require-imports
const stripJsonComments = require('strip-json-comments');

@Component({
  selector: 'developer-console',
  templateUrl: './developer-console.component.html',
  styleUrls: ['./developer-console.component.scss']
})
export class DeveloperConsoleComponent implements OnInit {
  editorOptions: any = { theme: 'vs-dark', language: 'json', tabSize: 2 };
  code: string = `[
  {
    "id": "0D",
    "name": "Deaths",
    "tags": [ "player" ],
    "show": true,
    "eventType": "death"
  },
  {
    "id": "HS",
    "name": "Healthstone / Healing Tonic",
    "tags": [ "player" ],
    "show": false,
    "eventType": "ability",
    "friendly": true,
    "filter": {
      "type": "cast",
      "ability": {
        "ids": [ 6262, 251645, 188016 ]
      }
    }
  }
]`;

  loading: boolean = false;
  error: string = null;

  trackState: boolean = false;

  fight: FightInfo;
  events: EventDto[] = [];
  configs: EventConfig[] = [];
  abilities: Ability[] = [];

  constructor(
    private wipefestService: WipefestService,
    private wipefestApi: WipefestAPI
  ) {}

  ngOnInit(): void {
    this.wipefestService.selectPage(Page.DeveloperConsole);
  }

  onInit(editor: any): void {
    editor.getModel().updateOptions({ tabSize: 2 });
  }

  run(): void {
    this.loading = true;
    this.error = null;
    this.fight = null;
    this.events = [];
    this.configs = [];
    this.abilities = [];

    let eventConfigs: EventConfig[] = [];
    try {
      eventConfigs = JSON.parse(stripJsonComments(this.code)).map(x => {
        if (!x.group) x.group = 'TEST';
        if (!x.file) x.file = 'code-editor';

        return x;
      });
    } catch (error) {
      this.loading = false;
      this.error = 'Failed to parse event configs. Invalid JSON.';
    }

    this.wipefestApi
      .getFightForEventConfigs('vLaYkKjMJCZ1WfrQ', 4, {
        eventConfigs: eventConfigs
      })
      .then(
        fight => {
          this.fight = fight.info;
          this.events = fight.events;
          this.configs = fight.eventConfigs;
          this.abilities = fight.abilities;

          this.loading = false;
        },
        error => {
          this.loading = false;
          this.error = this.cleanError(error.toString());
        }
      );
  }

  private cleanError(error: string): string {
    const errorToRemove =
      'occured while executing JSON.parse on the response body - ';
    const indexOfErrorToRemove = error.indexOf(errorToRemove);
    if (indexOfErrorToRemove !== -1) {
      error = error.substring(
        indexOfErrorToRemove + errorToRemove.length,
        error.length - 1
      );
    }
    return error;
  }
}

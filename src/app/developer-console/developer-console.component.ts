import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Page, WipefestService } from 'app/wipefest.service';
import {
  FightInfo,
  EventDto,
  EventConfig,
  Ability,
  WorkspaceDto
} from '@wipefest/api-sdk/dist/lib/models';
import { WipefestAPI } from '@wipefest/api-sdk';
import { NgxEditorModel } from 'ngx-monaco-editor';
import { DeveloperConsoleTestCase } from './test-case/developer-console-test-case';
import { DeveloperConsoleExample } from './examples/developer-console-examples.component';
import { DeveloperConsoleWorkspace } from './developer-console-workspace';
import { ActivatedRoute, Params, Router } from '@angular/router';
// tslint:disable-next-line:no-require-imports
const stripJsonComments = require('strip-json-comments');

@Component({
  selector: 'developer-console',
  templateUrl: './developer-console.component.html',
  styleUrls: ['./developer-console.component.scss']
})
export class DeveloperConsoleComponent implements OnInit {
  editor: any;
  ngxEditor: any;
  code: string = `[
  // What events would you love to see in Wipefest?
]`;
  editorModel: NgxEditorModel = {
    value: this.code,
    language: 'json',
    uri: 'event-configs.json'
  };
  editorOptions: any = { theme: 'vs-dark', language: 'json', tabSize: 2 };

  workspaceId: string = null;
  workspaceRevision: number = 0;
  testCases: DeveloperConsoleTestCase[] = [
    {
      name: null,
      reportId: '',
      fightId: 0
    },
    {
      name: null,
      reportId: '',
      fightId: 0
    },
    {
      name: null,
      reportId: '',
      fightId: 0
    },
    {
      name: null,
      reportId: '',
      fightId: 0
    }
  ];

  loading: boolean = false;
  saving: boolean = false;
  errors: DeveloperConsoleError[] = [];
  recentlyChanged: boolean = false;
  recentlyChangedTimer: any;

  trackState: boolean = false;

  fightInfo: FightInfo;
  events: EventDto[] = [];
  configs: EventConfig[] = [];
  abilities: Ability[] = [];

  localStorageKey: string = 'developerConsoleWorkspace';

  get showHelpPanel(): boolean {
    return (
      this.errors.length === 0 && !this.loading && this.events.length === 0
    );
  }

  get workspace(): DeveloperConsoleWorkspace {
    return {
      id: this.workspaceId,
      revision: this.workspaceRevision,
      testCases: this.testCases,
      code: this.code,
      fightInfo: this.fightInfo,
      events: this.events,
      configs: this.configs,
      abilities: this.abilities
    };
  }

  set workspace(workspace: DeveloperConsoleWorkspace) {
    this.workspaceId = workspace.id;
    this.workspaceRevision = workspace.revision;
    this.testCases = workspace.testCases;
    this.code = workspace.code;
    this.fightInfo = workspace.fightInfo;
    this.events = workspace.events;
    this.configs = workspace.configs;
    this.abilities = workspace.abilities;
  }

  constructor(
    private route: ActivatedRoute,
    private wipefestService: WipefestService,
    private wipefestApi: WipefestAPI,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.wipefestService.selectPage(Page.DeveloperConsole);
    this.route.params.subscribe(params => this.handleRoute(params));
  }

  editorOnInit(editor: any): void {
    const model = editor.getModel();
    model.setValue(this.code);
    model.updateOptions({ tabSize: 2 });
    model.onDidChangeContent(e => {
      if (this.recentlyChangedTimer) {
        clearTimeout(this.recentlyChangedTimer);
      }
      this.recentlyChanged = true;
      this.changeDetectorRef.detectChanges();
      this.recentlyChangedTimer = setTimeout(() => {
        this.recentlyChanged = false;
        this.changeDetectorRef.detectChanges();
      }, 500);
    });

    this.editor = (<any>window).monaco.editor;
    this.ngxEditor = editor;
  }

  loadExample(example: DeveloperConsoleExample): void {
    this.code = example.code;
    this.testCases = this.testCases.map((x, index) => {
      if (example.testCases[index]) return example.testCases[index];

      return {
        name: null,
        reportId: '',
        fightId: 0
      };
    });
  }

  run(testCase: DeveloperConsoleTestCase): void {
    if (this.loading || this.recentlyChanged) return;

    this.fightInfo = null;
    this.errors = [];
    this.events = [];
    this.configs = [];
    this.abilities = [];

    const markers = this.editor.getModelMarkers({});
    if (markers.length) {
      this.errors = markers.map(m => {
        return {
          lineNumber: m.startLineNumber,
          position: m.startColumn,
          message: m.message
        };
      });

      return;
    }

    this.loading = true;

    let eventConfigs: EventConfig[] = [];
    try {
      eventConfigs = JSON.parse(stripJsonComments(this.code)).map(x => {
        if (!x.group) x.group = 'TEST';
        if (!x.file) x.file = 'code-editor';

        x.showByDefault = x.show;

        return x;
      });
      eventConfigs = eventConfigs.map(x => {
        if (!x.id) {
          let i = 0;
          while (!x.id || eventConfigs.filter(y => y.id === x.id).length > 1) {
            x.id = this.indexToId(i);
            i++;

            if (i > 500) break;
          }
        }

        return x;
      });
    } catch (error) {
      this.loading = false;
      this.errors = [
        {
          lineNumber: 0,
          position: 0,
          message: 'Failed to parse event configs. Invalid JSON.'
        }
      ];
    }

    if (eventConfigs.length === 0) {
      this.loading = false;
      return;
    }

    this.wipefestApi
      .getFightForEventConfigs(testCase.reportId, testCase.fightId, {
        eventConfigs: eventConfigs
      })
      .then(
        fight => {
          this.fightInfo = fight.info;
          this.events = fight.events;
          this.configs = fight.eventConfigs;
          this.abilities = fight.abilities;

          this.loading = false;
        },
        error => {
          this.loading = false;
          this.errors = [
            {
              lineNumber: 0,
              position: 0,
              message: this.cleanError(error.toString())
            }
          ];
        }
      );
  }

  save(): void {
    this.saving = true;
    this.wipefestApi
      .createWorkspace({
        workspaceDto: this.workspace
      })
      .then(workspace => {
        this.workspaceId = workspace.id;
        window.history.pushState({}, null, '/develop/' + workspace.id);
        setTimeout(() => (this.saving = false), 1000);
      })
      .catch(error => {
        setTimeout(() => (this.saving = false), 1000);
      });
  }

  tidy(): void {
    this.ngxEditor
      .getActions()
      .find(a => a.id === 'editor.action.formatDocument')
      .run();
  }

  copyLink(): void {
    const link = `https://www.wipefest.net/develop/${this.workspaceId}`;
    this.copyToClipboard(link);
  }

  private handleRoute(params: Params): void {
    this.workspaceId = params.workspaceId;

    if (!this.workspaceId) return;

    this.wipefestApi.getWorkspace(this.workspaceId).then(workspace => {
      this.workspace = {
        id: this.workspaceId,
        revision: 0,
        testCases: workspace.testCases.map(x => {
          return {
            name: x.name,
            reportId: x.reportId,
            fightId: x.fightId
          };
        }),
        code: workspace.code,
        fightInfo: workspace.fightInfo,
        events: workspace.events,
        configs: workspace.configs,
        abilities: workspace.abilities
      };
    });
  }

  private indexToId(index: number): string {
    const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const first = Math.floor(index / characters.length);
    const second = index % characters.length;
    return characters[first] + characters[second];
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

  // From: https://hackernoon.com/copying-text-to-clipboard-with-javascript-df4d4988697f
  private copyToClipboard(str: string): void {
    const el = document.createElement('textarea'); // Create a <textarea> element
    el.value = str; // Set its value to the string that you want copied
    el.setAttribute('readonly', ''); // Make it readonly to be tamper-proof
    el.style.position = 'absolute';
    el.style.left = '-9999px'; // Move outside the screen to make it invisible
    document.body.appendChild(el); // Append the <textarea> element to the HTML document
    const selected =
      document.getSelection().rangeCount > 0 // Check if there is any content selected previously
        ? document.getSelection().getRangeAt(0) // Store selection if found
        : false; // Mark as false to know no selection existed before
    el.select(); // Select the <textarea> content
    document.execCommand('copy'); // Copy - only works as a result of a user action (e.g. click events)
    document.body.removeChild(el); // Remove the <textarea> element
    if (selected) {
      // If a selection existed before copying
      document.getSelection().removeAllRanges(); // Unselect everything on the HTML document
      document.getSelection().addRange(selected); // Restore the original selection
    }
  }
}

interface DeveloperConsoleError {
  lineNumber: number;
  position: number;
  message: string;
}

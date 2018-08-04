import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Page, WipefestService } from 'app/wipefest.service';
import {
  FightInfo,
  EventDto,
  EventConfig,
  Ability,
  Workspace,
  FightConfigDto,
  Insight
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
  code: string = `{
  "eventConfigs": [
    // What events would you love to see in Wipefest?
  ],
  "insightConfigs": [
    // What insights can we build from these events?
  ]
}`;
  editorModel: NgxEditorModel = {
    value: this.code,
    language: 'json',
    uri: 'fight-config.json'
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
  insights: Insight[] = [];

  localStorageKey: string = 'developerConsoleWorkspace';

  get showHelpPanel(): boolean {
    return (
      this.errors.length === 0 && !this.loading && this.events.length === 0
    );
  }

  get workspace(): DeveloperConsoleWorkspace {
    return {
      testCases: this.testCases,
      code: this.code,
      fightInfo: this.fightInfo,
      events: this.events,
      insights: this.insights,
      configs: this.configs,
      abilities: this.abilities
    };
  }

  set workspace(workspace: DeveloperConsoleWorkspace) {
    this.testCases = workspace.testCases;
    this.code = workspace.code;
    this.fightInfo = workspace.fightInfo;
    this.events = workspace.events;
    this.insights = workspace.insights;
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
    setTimeout(() => {
      // tslint:disable-next-line:prettier
      const editorContainers = document.getElementsByClassName('editor-container');
      const editorFailedToLoad =
        editorContainers.length > 0 && editorContainers[0].innerHTML === '';

      if (editorFailedToLoad) location.reload();
    }, 1000);
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
    this.insights = [];

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

    let fightConfig: FightConfigDto = {
      eventConfigs: [],
      insightConfigs: []
    };
    try {
      fightConfig = JSON.parse(stripJsonComments(this.code));
      fightConfig.eventConfigs = fightConfig.eventConfigs
        ? fightConfig.eventConfigs
            .map(x => {
              if (!x.group) x.group = 'TEST';
              if (!x.file) x.file = 'code-editor';

              x.showByDefault = x.show;

              return x;
            })
            .map(x => {
              if (!x.id) {
                let i = 0;
                while (
                  !x.id ||
                  fightConfig.eventConfigs.filter(y => y.id === x.id).length > 1
                ) {
                  x.id = this.indexToId(i);
                  i++;

                  if (i > 500) break;
                }
              }

              return x;
            })
        : [];
    } catch (error) {
      this.loading = false;
      this.errors = [
        {
          lineNumber: 0,
          position: 0,
          message: 'Failed to parse fight config. Invalid JSON.'
        }
      ];
    }

    if (!fightConfig.includes) fightConfig.includes = [];
    if (!fightConfig.eventConfigs) fightConfig.eventConfigs = [];
    if (!fightConfig.insightConfigs) fightConfig.insightConfigs = [];

    if (
      fightConfig.includes.length === 0 &&
      fightConfig.eventConfigs.length === 0 &&
      fightConfig.insightConfigs.length === 0
    ) {
      this.loading = false;
      return;
    }

    this.wipefestApi
      .getFightForFightConfig(testCase.reportId, testCase.fightId, {
        fightConfigDto: fightConfig
      })
      .then(
        fight => {
          this.fightInfo = fight.info;
          this.events = fight.events;
          this.configs = fight.eventConfigs;
          this.abilities = fight.abilities;
          this.insights = fight.insights;

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

    let promise: Promise<Workspace> = null;
    if (this.workspaceId) {
      promise = this.wipefestApi.updateWorkspace(this.workspaceId, {
        workspaceDto: this.workspace
      });
    } else {
      promise = this.wipefestApi.createWorkspace({
        workspaceDto: this.workspace
      });
    }

    promise
      .then(workspace => {
        this.workspaceId = workspace.key.id;
        this.workspaceRevision = workspace.key.revision;

        let path = '/develop/' + workspace.key.id;
        if (workspace.key.revision) path += '/' + workspace.key.revision;

        window.history.pushState({}, null, path);
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
    let link = `https://www.wipefest.net/develop/${this.workspaceId}`;
    if (this.workspaceRevision) link += '/' + this.workspaceRevision;

    this.copyToClipboard(link);
  }

  private handleRoute(params: Params): void {
    this.workspaceId = params.workspaceId;
    this.workspaceRevision = params.workspaceRevision
      ? parseInt(params.workspaceRevision)
      : 0;

    if (!this.workspaceId) return;

    this.wipefestApi
      .getWorkspace(this.workspaceId, this.workspaceRevision)
      .then(workspace => {
        this.workspace = {
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
          insights: workspace.insights,
          configs: workspace.configs,
          abilities: workspace.abilities
        };

        this.changeDetectorRef.detectChanges();
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

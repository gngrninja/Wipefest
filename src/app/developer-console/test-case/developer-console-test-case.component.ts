import {
  Component,
  Input,
  Renderer2,
  ChangeDetectorRef,
  OnInit,
  Output,
  EventEmitter
} from '@angular/core';
import { DeveloperConsoleTestCase } from './developer-console-test-case';
import { LinkService } from '@wipefest/core';

@Component({
  selector: 'developer-console-test-case',
  templateUrl: './developer-console-test-case.component.html',
  styleUrls: ['./developer-console-test-case.component.scss']
})
export class DeveloperConsoleTestCaseComponent implements OnInit {
  @Input() index: number;
  @Input() testCase: DeveloperConsoleTestCase;
  @Input() canRun: boolean = true;

  @Output()
  run: EventEmitter<DeveloperConsoleTestCase> = new EventEmitter<
    DeveloperConsoleTestCase
  >();

  editingName: boolean = false;
  errorStyle: string = 'info';
  error: string;

  get url(): string {
    if (!this.testCase.reportId.length) {
      return '';
    }

    return `https://www.wipefest.net/report/${this.testCase.reportId}/fight/${
      this.testCase.fightId
    }`;
  }
  set url(value: string) {
    if (value.trim().length === 0) {
      this.errorStyle = 'info';
      this.error = 'Use a Wipefest / Warcraft Logs URL as a test case';
      return;
    }

    this.errorStyle = 'warning';
    const result = this.linkService.parse(value);
    if (result.isFailure) {
      this.error = result.error;
      return;
    }
    const link = result.value;
    if (link.lastFight) {
      this.error = "Cannot use URLs with a fight of 'last'";
      return;
    }
    if (!link.fightId) {
      this.error = 'URL must include the fight ID';
      return;
    }
    this.testCase.reportId = link.reportId;
    this.testCase.fightId = link.fightId;

    this.errorStyle = 'info';
    this.error = null;

    this.changeDetectorRef.detectChanges();
  }

  constructor(
    private renderer: Renderer2,
    private linkService: LinkService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.setDefaultName();
    if (this.testCase.reportId && this.testCase.fightId) {
      this.error = null;
    } else {
      this.error = 'Use a Wipefest / Warcraft Logs URL as a test case';
    }
  }

  startEditingName(): void {
    this.editingName = true;
    setTimeout(() => {
      this.renderer.selectRootElement(`#name-input-${this.index}`).focus();
    }, 50);
  }

  finishEditingName(): void {
    this.editingName = false;
    this.setDefaultName();
  }

  private setDefaultName(): void {
    if (!this.testCase.name || this.testCase.name.trim().length === 0) {
      this.testCase.name = `Test Case ${this.index + 1}`;
    }
  }
}

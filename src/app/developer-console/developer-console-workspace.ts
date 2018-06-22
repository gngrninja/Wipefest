import { DeveloperConsoleTestCase } from './test-case/developer-console-test-case';
import {
  FightInfo,
  EventDto,
  EventConfig,
  Ability
} from '@wipefest/api-sdk/dist/lib/models';

export interface DeveloperConsoleWorkspace {
  testCases: DeveloperConsoleTestCase[];
  code: string;
  fight: FightInfo;
  events: EventDto[];
  configs: EventConfig[];
  abilities: Ability[];
}

import { DeveloperConsoleTestCase } from './test-case/developer-console-test-case';
import {
  FightInfo,
  EventDto,
  EventConfig,
  Ability
} from '@wipefest/api-sdk/dist/lib/models';

export interface DeveloperConsoleWorkspace {
  id: string;
  revision: number;
  testCases: DeveloperConsoleTestCase[];
  code: string;
  fightInfo: FightInfo;
  events: EventDto[];
  configs: EventConfig[];
  abilities: Ability[];
}

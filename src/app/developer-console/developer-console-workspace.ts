import { DeveloperConsoleTestCase } from './test-case/developer-console-test-case';
import {
  FightInfo,
  EventDto,
  EventConfig,
  Ability,
  Insight
} from '@wipefest/api-sdk/dist/lib/models';

export interface DeveloperConsoleWorkspace {
  testCases: DeveloperConsoleTestCase[];
  code: string;
  fightInfo: FightInfo;
  events: EventDto[];
  insights: Insight[];
  configs: EventConfig[];
  abilities: Ability[];
}

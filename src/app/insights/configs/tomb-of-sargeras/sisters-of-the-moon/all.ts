import { InsightConfig } from 'app/insights/configs/insight-config';
import { AstralVulnerability } from 'app/insights/configs/tomb-of-sargeras/sisters-of-the-moon/astral-vulnerability';
import { GlaiveStorm } from 'app/insights/configs/tomb-of-sargeras/sisters-of-the-moon/glaive-storm';
import { MoonBurn } from 'app/insights/configs/tomb-of-sargeras/sisters-of-the-moon/moon-burn';
import { TwilightGlaive } from 'app/insights/configs/tomb-of-sargeras/sisters-of-the-moon/twilight-glaive';

export namespace SistersOfTheMoonInsightConfigs {
  export function All(): InsightConfig[] {
    return [
      new TwilightGlaive('0'),
      new GlaiveStorm('1'),
      new AstralVulnerability('2'),
      new MoonBurn('3')
    ];
  }
}

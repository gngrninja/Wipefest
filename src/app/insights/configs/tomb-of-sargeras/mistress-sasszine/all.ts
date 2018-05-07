import { Death } from 'app/insights/configs/death';
import { Debuff } from 'app/insights/configs/debuff';
import { DebuffDuration } from 'app/insights/configs/debuff-duration';
import { InsightConfig } from 'app/insights/configs/insight-config';

export namespace MistressSasszineInsightConfigs {
  export function All(): InsightConfig[] {
    return [
      new DebuffDuration(
        '0',
        2037,
        'Delicious Bufferfish',
        'Delicious Bufferfish (Removed)',
        25000
      ),
      new Death('1', 2037, [239436]),
      new Death('2', 2037, [232885]),
      new Death('3', 2037, [232827]),
      new DebuffDuration(
        '4',
        2037,
        'Consuming Hunger',
        'Consuming Hunger (Removed)',
        30000
      ),
      new DebuffDuration(
        '5',
        2037,
        'Thundering Shock',
        'Thundering Shock (Removed)',
        1500
      ),
      new Debuff('6', 2037, ['Slicing Tornado'], [232732])
    ];
  }
}

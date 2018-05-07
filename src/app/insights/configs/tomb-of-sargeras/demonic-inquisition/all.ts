import { Debuff } from 'app/insights/configs/debuff';
import { DebuffDuration } from 'app/insights/configs/debuff-duration';
import { Hit } from 'app/insights/configs/hit';
import { InsightConfig } from 'app/insights/configs/insight-config';
import { Spawn } from 'app/insights/configs/spawn';

export namespace DemonicInquisitionInsightConfigs {
  export function All(): InsightConfig[] {
    return [
      new DebuffDuration(
        '0',
        2048,
        'Echoing Anguish',
        'Echoing Anguish (Removed)',
        4500
      ),
      new Debuff('1', 2048, ['Unbearable Torment'], [233430]),
      new DebuffDuration(
        '2',
        2048,
        'Soul Corruption',
        'Soul Corruption (Removed)',
        20000,
        'Stayed inside for an average duration of {averageDuration}, with {totalFrequencyOverThreshold} times lasting longer than {threshold}.'
      ),
      new Spawn('3', 2048, 'Tormented Fragment'),
      new Hit('4', 2048, ['Explosive Anguish'], [241524])
    ];
  }
}

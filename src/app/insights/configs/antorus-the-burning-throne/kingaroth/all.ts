import { DebuffUnlessRole } from 'app/insights/configs/debuff-unless-role';
import { Hit } from 'app/insights/configs/hit';
import { HitWithoutDebuff } from 'app/insights/configs/hit-without-debuff';
import { InsightConfig } from 'app/insights/configs/insight-config';
import { Soak } from 'app/insights/configs/soak';

export namespace KingarothInsightConfigs {
  export function All(): InsightConfig[] {
    return [
      new DebuffUnlessRole('0', 2088, ['Forging Strike'], [254919], 'Tank'),
      // Forging Strike > 1 stack

      new Hit('1', 2088, ['Flame Reverberation'], [244328]),
      new Hit('2', 2088, ['Ruiner'], [246840]),
      new Hit('3', 2088, ['Apocalypse Blast'], [246634]),

      new Soak('4', 2088, ['Annihilation'], [246664]),
      new Hit(
        '5',
        2088,
        ['Annihilation Blast'],
        [246666],
        null,
        '{timestamps}'
      ),
      new Soak('6', 2088, ['Demolish'], [246706]),
      new HitWithoutDebuff(
        '7',
        2088,
        ['Decimation > 2m'],
        [246690],
        ['Decimation'],
        [246687],
        7000
      )
    ];
  }
}

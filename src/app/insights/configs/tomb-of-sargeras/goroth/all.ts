import { Debuff } from 'app/insights/configs/debuff';
import { Hit } from 'app/insights/configs/hit';
import { InsightConfig } from 'app/insights/configs/insight-config';
import { Spawn } from 'app/insights/configs/spawn';
import { StackThreshold } from 'app/insights/configs/stack-threshold';

export namespace GorothInsightConfigs {
  export function All(): InsightConfig[] {
    return [
      new Debuff('0', 2032, ['Infernal Burning'], [233062]),
      new StackThreshold('1', 2032, ['Burning Armor (2)'], [231363], 2),
      new Hit('2', 2032, ['Infernal Spike'], [233021]),
      new Hit('3', 2032, ['Fel Pool'], [230348]),
      new Spawn('4', 2032, 'Brimstone Infernal')
    ];
  }
}

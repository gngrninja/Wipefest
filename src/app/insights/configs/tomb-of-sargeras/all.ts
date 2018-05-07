import { InsightConfig } from 'app/insights/configs/insight-config';
import { DemonicInquisitionInsightConfigs } from 'app/insights/configs/tomb-of-sargeras/demonic-inquisition/all';
import { GorothInsightConfigs } from 'app/insights/configs/tomb-of-sargeras/goroth/all';
import { MaidenOfVigilanceInsightConfigs } from 'app/insights/configs/tomb-of-sargeras/maiden-of-vigilance/all';
import { MistressSasszineInsightConfigs } from 'app/insights/configs/tomb-of-sargeras/mistress-sasszine/all';
import { SistersOfTheMoonInsightConfigs } from 'app/insights/configs/tomb-of-sargeras/sisters-of-the-moon/all';

export namespace TombOfSargerasInsightConfigs {
  export function All(): InsightConfig[] {
    return [
      ...GorothInsightConfigs.All(),
      ...DemonicInquisitionInsightConfigs.All(),
      ...SistersOfTheMoonInsightConfigs.All(),
      ...MistressSasszineInsightConfigs.All(),
      ...MaidenOfVigilanceInsightConfigs.All()
    ];
  }
}

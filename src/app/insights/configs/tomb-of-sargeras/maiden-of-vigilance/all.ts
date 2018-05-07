import { InsightConfig } from 'app/insights/configs/insight-config';
import { CreatorsGrace } from 'app/insights/configs/tomb-of-sargeras/maiden-of-vigilance/creators-grace';
import { Echoes } from 'app/insights/configs/tomb-of-sargeras/maiden-of-vigilance/echoes';
import { FellInHole } from 'app/insights/configs/tomb-of-sargeras/maiden-of-vigilance/fell-in-hole';
import { Orbs } from 'app/insights/configs/tomb-of-sargeras/maiden-of-vigilance/orbs';
import { TitanicBulwark } from 'app/insights/configs/tomb-of-sargeras/maiden-of-vigilance/titanic-bulwark';
import { UnnecessaryUnstableSoulGains } from 'app/insights/configs/tomb-of-sargeras/maiden-of-vigilance/unnecessary-unstable-soul-gains';
import { UnstableSoulEarlyExpirationExplosion } from 'app/insights/configs/tomb-of-sargeras/maiden-of-vigilance/unstable-soul-early-expiration-explosion';
import { UnstableSoulFullExpirationExplosion } from 'app/insights/configs/tomb-of-sargeras/maiden-of-vigilance/unstable-soul-full-expiration-explosion';
import { UnstableSoulGainsFromEchoes } from 'app/insights/configs/tomb-of-sargeras/maiden-of-vigilance/unstable-soul-gains-from-echoes';

export namespace MaidenOfVigilanceInsightConfigs {
  export function All(): InsightConfig[] {
    return [
      new UnnecessaryUnstableSoulGains('0'),
      new Echoes('1'),
      new UnstableSoulGainsFromEchoes('2'),
      new UnstableSoulFullExpirationExplosion('3'),
      new UnstableSoulEarlyExpirationExplosion('4'),
      new Orbs('5'),
      new CreatorsGrace('6'),
      new FellInHole('7'),
      new TitanicBulwark('8')
    ];
  }
}

import { DamageEvent } from 'app/fight-events/models/damage-event';
import { DebuffEvent } from 'app/fight-events/models/debuff-event';
import { MarkupHelper } from 'app/helpers/markup-helper';
import { Timestamp } from 'app/helpers/timestamp-helper';
import { InsightConfig } from 'app/insights/configs/insight-config';
import { InsightContext } from 'app/insights/models/insight-context';

export class MarkedPrey extends InsightConfig {
  constructor(id: string) {
    super(
      id,
      2069,
      'Intercepted {abilities} {totalFrequency} time{plural}.',
      '<p>{interceptorsAndFrequencies}</p> {targetsAndInterceptorsTable}',
      null
    );
  }

  getProperties(context: InsightContext): any {
    const damageEvents = context.events
      .filter(x => x.config)
      .filter(
        x => x.config.name == 'Shadow Hunter' && x.config.eventType == 'damage'
      )
      .map(x => x as DamageEvent);

    if (damageEvents.length === 0) {
      return null;
    }

    const debuffEvents = context.events
      .filter(x => x.config)
      .filter(
        x => x.config.name === 'Marked Prey' && x.config.eventType === 'debuff'
      )
      .map(x => x as DebuffEvent)
      .sort((x, y) => y.timestamp - x.timestamp);

    const abilities = this.getAbilitiesIfTheyExist(debuffEvents, [244042]);

    const interceptors = damageEvents
      .map(x => x.target)
      .filter(
        (x, index, array) => array.findIndex(y => y.id === x.id) === index
      );
    const interceptorsAndFrequencies = interceptors
      .map(player => {
        return {
          player,
          frequency: damageEvents.filter(x => x.target.id === player.id).length
        } as any;
      })
      .sort((x, y) => y.frequency - x.frequency);
    const totalFrequency = damageEvents.length;

    const targetsAndInterceptors = damageEvents.map(x => {
      return {
        timestamp: x.timestamp,
        target: debuffEvents.find(y => y.timestamp < x.timestamp).target,
        interceptor: x.target
      } as any;
    });

    const targetsAndInterceptorsTable = new MarkupHelper.Table(
      targetsAndInterceptors.map(
        x =>
          new MarkupHelper.TableRow([
            new MarkupHelper.TableCell(
              Timestamp.ToMinutesAndSeconds(x.timestamp)
            ),
            new MarkupHelper.TableCell(MarkupHelper.Actor(x.target)),
            new MarkupHelper.TableCell(MarkupHelper.Actor(x.interceptor))
          ])
      ),
      new MarkupHelper.TableRow([
        new MarkupHelper.TableCell('Time'),
        new MarkupHelper.TableCell('Target'),
        new MarkupHelper.TableCell('Interceptor')
      ]),
      'table table-hover markup-table-details'
    );

    return {
      abilities: MarkupHelper.AbilitiesWithIcons(abilities),
      abilityTooltips: MarkupHelper.AbilitiesWithTooltips(abilities),
      targetsAndInterceptorsTable: targetsAndInterceptorsTable.parse(),
      totalFrequency,
      plural: this.getPlural(totalFrequency),
      interceptorsAndFrequencies: MarkupHelper.PlayersAndFrequencies(
        interceptorsAndFrequencies
      )
    };
  }
}

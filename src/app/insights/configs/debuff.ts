import { DebuffEvent } from 'app/fight-events/models/debuff-event';
import { MarkupHelper } from 'app/helpers/markup-helper';
import { InsightConfig } from 'app/insights/configs/insight-config';
import { AbilityAndTimestamp } from 'app/insights/models/ability-and-timestamp';
import { InsightContext } from 'app/insights/models/insight-context';

export class Debuff extends InsightConfig {
  constructor(
    id: string,
    boss: number,
    private eventConfigNames: string[],
    private abilityIds: number[],
    insightTemplate: string = null,
    detailsTemplate: string = null,
    tipTemplate: string = null
  ) {
    super(id, boss, insightTemplate, detailsTemplate, tipTemplate);

    if (insightTemplate == null) {
      this.insightTemplate = 'Gained {abilities} {totalHits} time{plural}.';
    }
    if (detailsTemplate == null) {
      this.detailsTemplate = '{playersAndFrequencies}';
    }
  }

  getProperties(context: InsightContext): any {
    const debuffEvents = context.events
      .filter(x => x.config)
      .filter(
        x =>
          this.eventConfigNames.indexOf(x.config.name) != -1 &&
          x.config.eventType == 'debuff'
      )
      .map(x => x as DebuffEvent)
      .sort((x, y) => x.timestamp - y.timestamp);

    if (debuffEvents.length == 0) {
      return null;
    }

    const abilities = this.getAbilitiesIfTheyExist(
      debuffEvents,
      this.abilityIds
    );
    const abilitiesAndTimestamps = debuffEvents.map(
      x => new AbilityAndTimestamp(x.ability, x.timestamp)
    );

    const players = debuffEvents
      .map(x => x.target)
      .filter(
        (x, index, array) => array.findIndex(y => y.id === x.id) === index
      );
    const playersAndFrequencies = players
      .map(player => {
        return {
          player: player,
          frequency: debuffEvents.filter(x => x.target.id === player.id).length
        } as any;
      })
      .sort((x, y) => y.frequency - x.frequency);

    const totalHits = debuffEvents.length;

    return {
      abilities: MarkupHelper.AbilitiesWithIcons(abilities),
      totalHits: MarkupHelper.Info(totalHits),
      plural: this.getPlural(totalHits),
      abilitiesAndTimestamps: MarkupHelper.AbilitiesAndTimestamps(
        abilitiesAndTimestamps
      ),
      playersAndFrequencies: MarkupHelper.PlayersAndFrequencies(
        playersAndFrequencies
      )
    };
  }
}

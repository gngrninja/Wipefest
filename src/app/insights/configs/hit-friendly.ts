import { DamageEvent } from 'app/fight-events/models/damage-event';
import { MarkupHelper } from 'app/helpers/markup-helper';
import { InsightConfig } from 'app/insights/configs/insight-config';
import { InsightContext } from 'app/insights/models/insight-context';

export class HitFriendly extends InsightConfig {
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
      this.insightTemplate =
        'Hit friendlies with {abilities} {totalHits} time{plural}.';
    }
    if (detailsTemplate == null) {
      this.detailsTemplate =
        '<h6>Sources</h6><p>{sourcesAndHits}</p><h6>Targets</h6>{targetsAndHits}';
    }
  }

  getProperties(context: InsightContext): any {
    const damageEvents = context.events
      .filter(x => x.config)
      .filter(
        x =>
          this.eventConfigNames.indexOf(x.config.name) != -1 &&
          x.config.eventType == 'damage'
      )
      .map(x => x as DamageEvent);

    if (damageEvents.length == 0) {
      return null;
    }

    const timestamps = damageEvents.map(x => x.timestamp);
    const abilities = this.getAbilitiesIfTheyExist(
      damageEvents,
      this.abilityIds
    );

    const targets = damageEvents
      .map(x => x.target)
      .filter(
        (x, index, array) => array.findIndex(y => y.id === x.id) === index
      );
    const targetsAndHits = targets
      .map(player => {
        return {
          player: player,
          frequency: damageEvents.filter(x => x.target.id === player.id).length
        } as any;
      })
      .sort((x, y) => y.frequency - x.frequency);

    const sources = damageEvents
      .map(x => x.source)
      .filter(
        (x, index, array) => array.map(y => y.id).indexOf(x.id) === index
      );
    const sourcesAndHits = sources
      .map(player => {
        return {
          player: player,
          frequency: damageEvents.filter(x => x.source.id === player.id).length
        } as any;
      })
      .sort((x, y) => y.frequency - x.frequency);

    const totalHits = targetsAndHits
      .map(x => x.frequency)
      .reduce((x, y) => x + y, 0);

    return {
      abilities: MarkupHelper.AbilitiesWithIcons(abilities),
      abilityTooltips: MarkupHelper.AbilitiesWithTooltips(abilities),
      totalHits: MarkupHelper.Info(totalHits),
      plural: this.getPlural(totalHits),
      targetsAndHits: MarkupHelper.PlayersAndFrequencies(targetsAndHits),
      sourcesAndHits: MarkupHelper.PlayersAndFrequencies(sourcesAndHits),
      timestamps: MarkupHelper.Timestamps(timestamps)
    };
  }
}

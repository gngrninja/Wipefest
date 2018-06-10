module.exports = {
  onMonacoLoad: () => {
    const id = 'event-configs.json';
    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
      validate: true,
      allowComments: true,
      schemas: [
        {
          uri: 'event-configs.json',
          fileMatch: [id],
          schema: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  description:
                    'A 2 character alphanumeric ID that uniquely identifies this config within its group. Stored in the URL when saving state.',
                  examples: ['0A', 'T2'],
                  minLength: 2,
                  maxLength: 2,
                  pattern: '[0-9a-zA-Z]{2}'
                },
                name: {
                  type: 'string',
                  description:
                    'A friendly name for the event. This is used in the left-hand filter menu. If multiple event configs have the same name and tags, their events will be combined into the same "row" in the left-hand filter menu (so they are filtered on/off at the same time). This is mostly just used for stacking tank debuffs as the "debuff" and "debuffstack" events usually want to be combined.'
                },
                tags: {
                  type: 'array',
                  description:
                    'These tags help to organise the filters in the left-hand filter menu. The first tag will be the main heading for that filter group, and the second tag will be the subheading. For bosses, the first tag is typically "boss" / "player" / "raid" / "spawn", and the second tag is typically "ability" / "buff" / "debuff" / "damage" / "interrupt".',
                  minItems: 1,
                  maxItems: 2,
                  items: {
                    type: 'string',
                    examples: ['boss', 'ability']
                  }
                },
                show: {
                  type: 'boolean',
                  description:
                    "This property determines whether, on initial page load, the event is shown (true) or filtered (false). Be careful not to have too many events defaulting to be shown, as the timeline can easily get cluttered with lots of frequent events that the user isn't necessarily concerned about.",
                  default: true
                },
                eventType: {
                  description:
                    'Mostly determines what the event title says. For example, an ability event typically reads "X cast Y on Z", but a debuff event might read "X applied Y to Z". "debuff" / "debuffstack" / "removedebuff" events can also be used for buffs.',
                  enum: [
                    'ability',
                    'debuff',
                    'debuffstack',
                    'removedebuff',
                    'damage',
                    'phase',
                    'interrupt',
                    'spawn',
                    'title',
                    'death',
                    'heroism'
                  ]
                },
                friendly: {
                  type: 'boolean',
                  description:
                    'Determines which side of the timeline the event title will appear. Events on the left should be events that the raid had some control over, and should have a friendly value of true. Events on the right should be events that the raid didn\'t have much control over, and should have a friendly value of false. Also determines the phrasing of the event title. For example, a friendly debuff event might read "X gains Y from Z", and an unfriendly debuff event might read "Z applied Y to X". If the default value of friendly is not correct, then simply override it by setting this property.',
                  default: true
                },
                filter: {
                  type: 'object',
                  description:
                    'The filter determines which Warcraft Logs events are used to create Wipefest events. Most of the time, one Warcraft Logs event will become one Wipefest event, but there are also filter properties that will allow you to collapse several Warcraft Logs events into a single Wipefest event.',
                  properties: {
                    type: {
                      description: 'The Warcraft Logs type of the event.',
                      enum: [
                        'begincast',
                        'cast',
                        'miss',
                        'damage',
                        'heal',
                        'absorbed',
                        'healabsorbed',
                        'applybuff',
                        'applydebuff',
                        'applybuffstack',
                        'applydebuffstack',
                        'refreshbuff',
                        'refreshdebuff',
                        'removebuff',
                        'removedebuff',
                        'removebuffstack',
                        'removedebuffstack',
                        'summon',
                        'create',
                        'death',
                        'destroy',
                        'extraattacks',
                        'aurabroken',
                        'dispel',
                        'interrupt',
                        'steal',
                        'leech',
                        'energize',
                        'drain',
                        'resurrect',
                        'encounterstart',
                        'encounterend'
                      ]
                    },
                    types: {
                      type: 'array',
                      description:
                        'You can specify that you want to filter to multiple Warcraft Logs types using the filter.types array instead of filter.type. For example, a Wipefest damage eventType will often filter to both damage and absorb Warcraft Logs types, so as to include events where a player was hit but absorbed all of the damage.',
                      items: {
                        description: 'The Warcraft Logs type of the event.',
                        enum: [
                          'begincast',
                          'cast',
                          'miss',
                          'damage',
                          'heal',
                          'absorbed',
                          'healabsorbed',
                          'applybuff',
                          'applydebuff',
                          'applybuffstack',
                          'applydebuffstack',
                          'refreshbuff',
                          'refreshdebuff',
                          'removebuff',
                          'removedebuff',
                          'removebuffstack',
                          'removedebuffstack',
                          'summon',
                          'create',
                          'death',
                          'destroy',
                          'extraattacks',
                          'aurabroken',
                          'dispel',
                          'interrupt',
                          'steal',
                          'leech',
                          'energize',
                          'drain',
                          'resurrect',
                          'encounterstart',
                          'encounterend'
                        ]
                      }
                    },
                    ability: {
                      type: 'object',
                      description:
                        'As well as the type of the Warcraft Logs event, Wipefest needs to know what ability to filter to.',
                      properties: {
                        id: {
                          type: 'integer',
                          description:
                            'The numeric World of Warcraft spell ID for that ability. This is the same ID that is used in Weak Auras, Warcraft Logs, WoWDB, Wowhead etc.',
                          examples: [244399]
                        },
                        ids: {
                          type: 'array',
                          description:
                            'To filter to multiple abilities, specify their ids in the filter.ability.ids array, instead of using filter.ability.id.',
                          uniqueItems: true,
                          items: {
                            type: 'integer',
                            description:
                              'The numeric World of Warcraft spell ID for that ability. This is the same ID that is used in Weak Auras, Warcraft Logs, WoWDB, Wowhead etc.',
                            examples: [244399]
                          }
                        }
                      }
                    }
                  }
                },
                difficulties: {
                  type: 'array',
                  description:
                    'Determines which raid difficulties the event config will be loaded for. 3 = Normal, 4 = Heroic, and 5 = Mythic. This is useful for when a mechanic significantly differs from heroic to mythic, and you want to load different versions of the event config for each difficulty.',
                  uniqueItems: true,
                  items: {
                    enum: [3, 4, 5]
                  }
                }
              },
              required: ['id', 'name', 'tags', 'show', 'eventType']
            }
          }
        }
      ]
    });
  }
};

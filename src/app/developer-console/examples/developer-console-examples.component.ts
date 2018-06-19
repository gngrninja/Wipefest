import { Component, Output, EventEmitter } from '@angular/core';
import { DeveloperConsoleTestCase } from '../test-case/developer-console-test-case';

@Component({
  selector: 'developer-console-examples',
  templateUrl: './developer-console-examples.component.html',
  styleUrls: ['./developer-console-examples.component.scss']
})
export class DeveloperConsoleExamplesComponent {
  @Output()
  load: EventEmitter<DeveloperConsoleExample> = new EventEmitter<
    DeveloperConsoleExample
  >();

  garothiWorldbreakerTestCases: DeveloperConsoleTestCase[] = [
    {
      name: 'Mythic Garothi Worldbreaker',
      reportId: 'ng2DGa4jwC9q7x8W',
      fightId: 1
    },
    {
      name: 'Heroic Garothi Worldbreaker',
      reportId: '4tBPYwHfZrmjFQWv',
      fightId: 1
    },
    {
      name: 'Normal Garothi Worldbreaker',
      reportId: 'vnawTcV21B7xdt9q',
      fightId: 1
    }
  ];

  examples: DeveloperConsoleExample[] = [
    {
      name: 'Ability event',
      testCases: this.garothiWorldbreakerTestCases,
      code: `[
  /*
    Our first example shows a simple ability event.
    We specify it as an ability event by using:
      "eventType": "ability"
    The main effect this has is to phrase the
    title as "X cast by Y".
    The "filter" property specifies how to get the
    data for this event from WCL.
    The relevant WCL query would be:
      type = 'cast' and ability.id = 244399
    We specify that in JSON as:
        "filter": {
          "type": "cast",
          "ability": {
            "id": 244399
          }
        }
  */
  
  {
    // This is the name that appears in the filter menu
    "name": "Decimation",
    // These tags are used as headings in the filter menu
    "tags": [
      "boss", // Heading
      "ability" // Subheading
    ],
    // We want to show this event by default
    "show": true,
    // We want this event to read "X cast by Y"
    "eventType": "ability",
    // How do we want to get events from WCL?
    "filter": {
      // Return 'cast' events from WCL ...
      "type": "cast",
      "ability": {
        // ... where ability.id = 244399
        // which is the spell id for Decimation
        "id": 244399
      }
    }
  }

  /*
    Click the "Run" button for any of the test
    cases to see what events this configuration
    builds.
  */
]`
    },
    {
      name: 'Multiple events',
      testCases: this.garothiWorldbreakerTestCases,
      code: `[ // <-- start of array
  /*
    The '[' and ']' at the start and end of this
    code indicate that this is a JSON array,
    which means it can hold multiple JSON objects.

    We can use this to build different events,
    such as the three variations of 'Decimation',
    that use different spell IDs.
  */
  
  // This is the event we built in the 'Ability event' example
  {
    "name": "Decimation",
    "tags": [
      "boss",
      "ability"
    ],
    "show": true,
    "eventType": "ability",
    "filter": {
      "type": "cast",
      "ability": {
        "id": 244399
      }
    }
  },
  // Normal and heroic difficulties also have this ability
  {
    "name": "Empowered Decimation",
    "tags": [
      "boss",
      "ability"
    ],
    "show": true,
    "eventType": "ability",
    "filter": {
      "type": "cast",
      "ability": {
        "id": 245294
      }
    }
  },
  // This ability is only cast on mythic difficulty
  {
    "name": "Haywire Decimation",
    "tags": [
      "boss",
      "ability"
    ],
    "show": true,
    "eventType": "ability",
    "filter": {
      "type": "cast",
      "ability": {
        "id": 246919
      }
    }
  }

  /*
    Run the different test cases to see the
    different abilities appear on different
    difficulties.
  */
] // <-- end of array`
    },
    {
      name: 'Debuff event',
      testCases: this.garothiWorldbreakerTestCases,
      code: `[
  /*
    We can track buffs and debuffs using
      "eventType": "debuff"
    This causes events to read "X applied to Y".
    In most cases, we want to filter to WCL
    events of the "applydebuff" type.
  */
  
  {
    "name": "Fel Bombardment",
    "tags": [
      "player",
      "debuff"
    ],
    "show": true,
    // Phrase event as "X applied to Y"
    "eventType": "debuff",
    "filter": {
      // Bring back 'applydebuff' events from WCL
      "type": "applydebuff",
      "ability": {
        // Where spell ID is 246220
        // which is the ID for the Fel Bombardment debuff
        "id": 246220
      }
    }
  }
]`
    },
    {
      name: 'Damage event',
      testCases: this.garothiWorldbreakerTestCases,
      code: `[
  /*
    For damage events, we use:
      "eventType": "damage"
    Which causes event titles to include how much
    damage was taken, absorbed, or was overkill.

    To make sure we bring back WCL combat events where
    the hit was fully absorbed, we need to ensure
    we filter to both "damage" and "absorbed" events.
  */
  
  {
    "name": "Fel Bombardment",
    "tags": [
      "player",
      "damage"
    ],
    "show": true,
    // Include damage information in event title
    "eventType": "damage",
    // Taking damage from this is something the raid
    // has control over, so specify "friendly": true
    // to place it on the left half of the timeline
    "friendly": true,
    "filter": {
      // We need to make sure we not only bring back
      // damage combat events, but also combat events
      // where the hit was fully absorbed
      "types": [
        "damage",
        "absorbed"
      ],
      "ability": {
        // We only want events where the spell ID is 244532,
        // which is the ID for Fel Bombardment damage
        // (note: in this case, this is different to the ID for Fel Bombardment debuff)
        "id": 244532
      }
    }
  }
]`
    },
    {
      name: 'Phase events',
      testCases: this.garothiWorldbreakerTestCases,
      code: `[
  /*
    For phase events, we use:
      "eventType": "phase"
    This will cause the events to appear larger,
    as well as allowing them to be collapsed when
    clicked.
  */

  {
    "name": "Phase 1",
    "tags": [
      "phase"
    ],
    "eventType": "phase",
    "show": true,
    // We want this event to appear at the start of the fight
    // ("0" milliseconds after the fight starts)
    "timestamp": 0
  },
  {
    "name": "Phase 2",
    "tags": [
      "phase"
    ],
    "eventType": "phase",
    "show": true,
    // We know that Phase 2 starts when Garothi
    // starts casting Apocalypse Drive
    "filter": {
      // So we filter to "begincast" events
      "type": "begincast",
      "ability": {
        // of Apocalypse Drive
        "id": 240277
      }
    }
  },
  {
    "name": "Phase 1",
    "tags": [
      "phase"
    ],
    "eventType": "phase",
    "show": true,
    // We know that Phase 1 starts again when Garothi
    // casts Eradication
    "filter": {
      // So we filter to "cast" events
      "type": "cast",
      "ability": {
        // of Eradication
        "id": 244969
      }
    }
  }
]`
    },
    {
      name: 'Event with custom title',
      testCases: [this.garothiWorldbreakerTestCases[0]],
      code: `[
  /*
    On Mythic Garothi Worldbreaker, the boss casts
    "Haywire" when either of his weapons are destroyed.
    This provides an easy way for us to track when the
    raid is destroying each weapon.

    We can specify the "title" property to override
    the default title that Wipefest generates.

    This title can include Wipefest markup, such as:
      {npc:Annihilator}
    to style the text like an NPC name.
  */
      
  {
    "name": "Annihilator Destroyed",
    "tags": [
      "boss",
      "ability"
    ],
    "show": true,
    // The raid has control over this event, so show on left
    "friendly": true,
    "eventType": "ability",
    "title": "{npc:Annihilator} destroyed",
    "filter": {
      "type": "cast",
      "ability": {
        // This is the spell ID for when "Haywire" is cast
        // after the Annihilator has been destroyed
        "id": 246965
      }
    }
  },
  {
    "name": "Decimator Destroyed",
    "tags": [
      "boss",
      "ability"
    ],
    "show": true,
    // The raid has control over this event, so show on left
    "friendly": true,
    "eventType": "ability",
    "title": "{npc:Decimator} destroyed",
    "filter": {
      "type": "cast",
      "ability": {
        // This is the spell ID for when "Haywire" is cast
        // after the Decimator has been destroyed
        "id": 246897
      }
    }
  }
]`
    },
    {
      name: 'Collapse multiple events into one',
      testCases: this.garothiWorldbreakerTestCases,
      code: `[
  /*
    Garothi Worldbreaker casts Annihilation 6 seconds
    before it lands. However, the most useful timing to
    report is when it lands.

    We can tell when it lands, because everyone takes damage.
    However, we don't want to show 20 damage events just to
    show that Annihilation has been cast.

    Instead, we can use the "range" property to collapse
    these events. For example:
      "range": 3000
    Will take all events within a 3 second window, and
    collapse them into 1 event.
  */

  {
    "name": "Annihilation",
    "tags": [
      "boss",
      "ability"
    ],
    "show": true,
    // We want the event to read "X cast by Y"
    "eventType": "ability",
    "friendly": false,
    "filter": {
      // We want to find damage events from Warcraft Logs
      "types": [
        "damage",
        "absorbed"
      ],
      // Collapse found events within a 3 second window
      "range": 3000,
      "ability": {
        // Annihilation damage can come from either of these spells
        "ids": [
          244761,
          246971
        ]
      }
    }
  },

  // In the same way, we can track when Annihilation isn't
  // soaked by checking for damage from 244762
  {
    "name": "Annihilation Soak Missed",
    "tags": [
      "boss",
      "ability"
    ],
    "show": true,
    "eventType": "ability",
    "friendly": true,
    // We'll use a custom title to be more informative
    "title": "{fire:Annihilation} soak missed",
    "filter": {
      // We want to find damage events from Warcraft Logs
      "types": [
        "damage",
        "absorbed"
      ],
      // Collapse found events within a 3 second window
      "range": 3000,
      "ability": {
        "id": 244762 // "Missed" Annihilation damage
      }
    }
  }
]`
    },
    {
      name: 'Garothi Worldbreaker',
      testCases: this.garothiWorldbreakerTestCases,
      code: `[
  // Abilities
  {
    "name": "Annihilation",
    "tags": [ "boss", "ability" ],
    "show": true,
    "eventType": "ability",
    "friendly": false,
    "filter": {
      "types": [ "damage", "absorbed" ],
      "range": 3000,
      "ability": {
        "ids": [ 244761, 246971 ]
      }
    }
  },
  {
    "name": "Shrapnel",
    "tags": [ "boss", "ability" ],
    "show": true,
    "eventType": "ability",
    "filter": {
      "type": "cast",
      "range": 3000,
      "ability": {
        "id": 247044
      }
    }
  },
  {
    "name": "Annihilation Soak Missed",
    "tags": [ "boss", "ability" ],
    "show": true,
    "eventType": "ability",
    "friendly": true,
    "title": "{fire:Annihilation} soak missed",
    "filter": {
      "types": [ "damage", "absorbed" ],
      "range": 3000,
      "minimum": 3,
      "ability": {
        "id": 244762
      }
    }
  },
  {
    "name": "Decimation",
    "tags": [ "boss", "ability" ],
    "show": true,
    "eventType": "ability",
    "filter": {
      "type": "cast",
      "ability": {
        "id": 244399
      }
    }
  },
  {
    "name": "Empowered Decimation",
    "tags": [ "boss", "ability" ],
    "show": true,
    "eventType": "ability",
    "filter": {
      "type": "cast",
      "ability": {
        "id": 245294
      }
    }
  },
  {
    "name": "Haywire Decimation",
    "tags": [ "boss", "ability" ],
    "show": true,
    "eventType": "ability",
    "filter": {
      "type": "cast",
      "ability": {
        "id": 246919
      }
    }
  },
  {
    "name": "Carnage",
    "tags": [ "boss", "ability" ],
    "show": true,
    "eventType": "ability",
    "filter": {
      "type": "cast",
      "ability": {
        "id": 244106
      }
    }
  },
  {
    "name": "Apocalypse Drive",
    "tags": [ "boss", "ability" ],
    "show": true,
    "eventType": "ability",
    "filter": {
      "type": "begincast",
      "ability": {
        "id": 240277
      }
    }
  },
  {
    "name": "Empowered",
    "tags": [ "boss", "ability" ],
    "show": true,
    "eventType": "ability",
    "filter": {
      "type": "cast",
      "ability": {
        "id": 245237
      }
    }
  },
  {
    "name": "Eradication",
    "tags": [ "boss", "ability" ],
    "show": true,
    "eventType": "ability",
    "filter": {
      "type": "cast",
      "ability": {
        "id": 244969
      }
    }
  },
  {
    "name": "Luring Destruction",
    "tags": [ "boss", "ability" ],
    "show": true,
    "eventType": "ability",
    "filter": {
      "type": "cast",
      "ability": {
        "id": 246848
      }
    }
  },
  {
    "name": "Haywire (Annihilation)",
    "tags": [ "boss", "ability" ],
    "show": true,
    "friendly": true,
    "eventType": "ability",
    "title": "{npc:Annihilator} destroyed",
    "filter": {
      "type": "cast",
      "ability": {
        "id": 246965
      }
    }
  },
  {
    "name": "Haywire (Decimation)",
    "tags": [ "boss", "ability" ],
    "show": true,
    "friendly": true,
    "eventType": "ability",
    "title": "{npc:Decimator} destroyed",
    "filter": {
      "type": "cast",
      "ability": {
        "id": 246897
      }
    }
  },

  // Damage
  {
    "name": "Eradication",
    "tags": [ "player", "damage" ],
    "show": false,
    "eventType": "damage",
    "filter": {
      "types": [ "damage", "absorbed" ],
      "ability": {
        "id": 244969
      }
    }
  },
  {
    "name": "Fel Bombardment",
    "tags": [ "player", "damage" ],
    "show": false,
    "eventType": "damage",
    "friendly": true,
    "filter": {
      "types": [ "damage", "absorbed" ],
      "ability": {
        "id": 244532
      }
    }
  },
  {
    "name": "Annihilation",
    "tags": [ "player", "damage" ],
    "show": false,
    "eventType": "damage",
    "friendly": true,
    "showSource": false,
    "filter": {
      "types": [ "damage", "absorbed" ],
      "ability": {
        "ids": [ 244761, 246971 ]
      }
    }
  },
  {
    "name": "Shrapnel",
    "tags": [ "player", "damage" ],
    "show": false,
    "eventType": "damage",
    "friendly": true,
    "showSource": false,
    "filter": {
      "types": [ "damage", "absorbed" ],
      "ability": {
        "id": 247044
      }
    }
  },
  {
    "name": "Decimation > 2m",
    "tags": [ "player", "damage" ],
    "show": true,
    "eventType": "damage",
    "friendly": true,
    "showSource": false,
    "filter": {
      "types": [ "damage", "absorbed" ],
      "ability": {
        "id": 244449
      },
      "query": "type in ('damage', 'absorb') and ability.id = 244449 and rawDamage > 2000000"
    }
  },

  // Debuffs
  {
    "name": "Fel Bombardment",
    "tags": [ "player", "debuff" ],
    "show": false,
    "eventType": "debuff",
    "filter": {
      "type": "applydebuff",
      "ability": {
        "id": 246220
      }
    }
  },
  {
    "name": "Decimation",
    "tags": [ "player", "debuff" ],
    "show": false,
    "eventType": "debuff",
    "filter": {
      "type": "applydebuff",
      "ability": {
        "id": 244410
      }
    }
  },
  {
    "name": "Haywire Decimation",
    "tags": [ "player", "debuff" ],
    "show": false,
    "eventType": "debuff",
    "filter": {
      "type": "applydebuff",
      "ability": {
        "id": 246919
      }
    }
  },

  // Phases
  {
    "name": "Phase 1",
    "tags": [ "phase" ],
    "eventType": "phase",
    "show": true,
    "timestamp": 0
  },
  {
    "name": "Phase 2",
    "tags": [ "phase" ],
    "eventType": "phase",
    "show": true,
    "filter": {
      "type": "begincast",
      "ability": {
        "id": 240277
      }
    }
  },
  {
    "name": "Phase 1",
    "tags": [ "phase" ],
    "eventType": "phase",
    "show": true,
    "filter": {
      "type": "cast",
      "ability": {
        "id": 244969
      }
    }
  }
]`
    },
    {
      name: 'Holy Priest',
      testCases: this.garothiWorldbreakerTestCases,
      code: `[
  {
    "name": "Divine Hymn",
    "tags": [ "priest", "holy" ],
    "show": true,
    "friendly": true,
    "eventType": "ability",
    "filter": {
      "type": "cast",
      "ability": {
        "id": 64843
      }
    }
  },
  {
    "name": "Prayer of Mending",
    "tags": [ "priest", "holy" ],
    "show": false,
    "friendly": true,
    "eventType": "ability",
    "filter": {
      "type": "cast",
      "ability": {
        "id": 33076
      }
    }
  },
  {
    "name": "Prayer of Healing",
    "tags": [ "priest", "holy" ],
    "show": false,
    "friendly": true,
    "eventType": "ability",
    "filter": {
      "type": "cast",
      "ability": {
        "id": 596
      }
    }
  },
  {
    "name": "Holy Word: Sanctify",
    "tags": [ "priest", "holy" ],
    "show": false,
    "friendly": true,
    "eventType": "ability",
    "filter": {
      "type": "cast",
      "ability": {
        "id": 34861
      }
    }
  },
  {
    "name": "Holy Word: Serenity",
    "tags": [ "priest", "holy" ],
    "show": false,
    "friendly": true,
    "showTarget": true,
    "eventType": "ability",
    "filter": {
      "type": "cast",
      "ability": {
        "id": 2050
      }
    }
  },
  {
    "name": "Light of T'uure",
    "tags": [ "priest", "holy" ],
    "show": false,
    "friendly": true,
    "showTarget": true,
    "eventType": "ability",
    "filter": {
      "type": "cast",
      "ability": {
        "id": 208065
      }
    }
  },
  {
    "name": "Desperate Prayer",
    "tags": [ "priest", "holy" ],
    "show": true,
    "friendly": true,
    "eventType": "ability",
    "filter": {
      "type": "cast",
      "ability": {
        "id": 19236
      }
    }
  },
  {
    "name": "Fade",
    "tags": [ "priest", "holy" ],
    "show": false,
    "friendly": true,
    "eventType": "ability",
    "filter": {
      "type": "cast",
      "ability": {
        "id": 19236
      }
    }
  },
  {
    "name": "Leap of Faith",
    "tags": [ "priest", "holy" ],
    "show": true,
    "friendly": true,
    "showTarget": true,
    "eventType": "ability",
    "filter": {
      "type": "cast",
      "ability": {
        "id": 73325
      }
    }
  },
  {
    "name": "Guardian Spirit",
    "tags": [ "priest", "holy" ],
    "show": true,
    "friendly": true,
    "showTarget": true,
    "eventType": "ability",
    "filter": {
      "type": "cast",
      "ability": {
        "id": 47788
      }
    }
  },
  {
    "name": "Angelic Feather",
    "tags": [ "priest", "holy" ],
    "show": false,
    "friendly": true,
    "eventType": "debuff",
    "filter": {
      "type": "applybuff",
      "ability": {
        "id": 121557
      }
    }
  },
  {
    "name": "Blessing of Tuure",
    "tags": [ "priest", "holy" ],
    "show": false,
    "friendly": true,
    "eventType": "debuff",
    "filter": {
      "type": "applybuff",
      "ability": {
        "id": 196644
      }
    }
  },
  {
    "name": "Blessing of Tuure (Removed)",
    "tags": [ "priest", "holy" ],
    "show": false,
    "friendly": true,
    "eventType": "removedebuff",
    "filter": {
      "type": "removebuff",
      "ability": {
        "id": 196644
      }
    }
  },
  {
    "name": "Spirit of Redemption",
    "tags": [ "priest", "holy" ],
    "show": true,
    "friendly": true,
    "eventType": "debuff",
    "filter": {
      "type": "applybuff",
      "ability": {
        "id": 27827
      }
    }
  },
  {
    "name": "Spirit of Redemption (Removed)",
    "tags": [ "priest", "holy" ],
    "show": true,
    "friendly": true,
    "eventType": "removedebuff",
    "filter": {
      "type": "removebuff",
      "ability": {
        "id": 27827
      }
    }
  },
  {
    "name": "Benedictus' Restitution",
    "tags": [ "priest", "holy" ],
    "show": true,
    "friendly": true,
    "eventType": "debuff",
    "filter": {
      "type": "applydebuff",
      "ability": {
        "id": 211319
      }
    }
  }
]`
    }
  ];

  selectedExample: DeveloperConsoleExample = this.examples[0];
}

export interface DeveloperConsoleExample {
  name: string;
  testCases: DeveloperConsoleTestCase[];
  code: string;
}

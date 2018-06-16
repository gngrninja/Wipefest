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
  ]

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
    we filter to both "damage" and "absorb" events.
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
        "absorb"
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
  // Empty
]`
    },
    {
      name: 'Event with custom title',
      testCases: this.garothiWorldbreakerTestCases,
      code: `[
  // Empty
]`
    },
    {
      name: 'Collapse multiple events into one',
      testCases: this.garothiWorldbreakerTestCases,
      code: `[
  // Empty
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

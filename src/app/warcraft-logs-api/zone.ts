export class Zone {
  id: number;
  name: string;
  frozen: boolean;
  encounters: Encounter[];
  brackets: Bracket[];
}

export class Encounter {
  id: number;
  name: string;
}

export class Bracket {
  id: number;
  name: string;
}

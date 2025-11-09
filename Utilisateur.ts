export class Utilisateur {
  constructor(
    public id: number,
    public nom: string,
    public email: string
  ) {}
}

export const utilisateurs: Utilisateur[] = [
  new Utilisateur(1, 'Alice', 'alice@example.com'),
  new Utilisateur(2, 'Bob', 'bob@example.com'),
];

export interface ProblemDetails {
  probleem: string;
  locatie: string;
  categorie: string;
  waarschijnlijkeOorzaak: string;
  urgentie: string;
  actieplan: string;
  benodigdeOnderdelen: string[];
}

export interface WorkOrder {
  klantnaam: string;
  kenteken: string;
  merkModel: string;
  bouwjaar?: string;
  registratieStatus: string;
  problemen: ProblemDetails[];
}

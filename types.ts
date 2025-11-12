
export interface WorkOrder {
  klantnaam: string;
  kenteken: string;
  merkModel: string;
  probleem: string;
  locatie: string;
  categorie: string;
  waarschijnlijkeOorzaak: string;
  urgentie: string;
  actieplan: string;
  benodigdeOnderdelen: string[];
  registratieStatus: string;
}
import { GoogleGenAI, Type } from "@google/genai";
import type { WorkOrder } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const problemDetailsSchema = {
  type: Type.OBJECT,
  properties: {
    probleem: { type: Type.STRING, description: 'Een korte, duidelijke samenvatting van dit specifieke probleem.' },
    locatie: { type: Type.STRING, description: 'Waar in de caravan/camper dit probleem zich bevindt (bijv. Keukenblok, badkamer, onderstel).' },
    categorie: { type: Type.STRING, description: 'De technische categorie van dit probleem (bijv. Watersysteem, Elektrisch systeem, Chassis, Carrosserie, Interieur).' },
    waarschijnlijkeOorzaak: { type: Type.STRING, description: 'De meest waarschijnlijke technische oorzaak van dit probleem.' },
    urgentie: { type: Type.STRING, description: 'De urgentie van de reparatie voor dit probleem. Kies uit: "Laag", "Normaal", "Hoog".' },
    actieplan: { type: Type.STRING, description: 'Een voorgesteld stappenplan voor de monteur om dit specifieke probleem te diagnosticeren en op te lossen.' },
    benodigdeOnderdelen: {
      type: Type.ARRAY,
      description: 'Een lijst met specifieke onderdelen die mogelijk besteld moeten worden voor dit probleem. Als er geen onderdelen nodig zijn, retourneer een lege array.',
      items: { type: Type.STRING }
    },
  },
  required: ['probleem', 'locatie', 'categorie', 'waarschijnlijkeOorzaak', 'urgentie', 'actieplan', 'benodigdeOnderdelen']
};

const workOrderSchema = {
  type: Type.OBJECT,
  properties: {
    klantnaam: { type: Type.STRING, description: 'De naam van de klant.' },
    kenteken: { type: Type.STRING, description: 'Het kenteken van het voertuig.' },
    merkModel: { type: Type.STRING, description: 'Het merk en model van de caravan/camper.' },
    bouwjaar: { type: Type.STRING, description: 'Het bouwjaar van het voertuig.' },
    registratieStatus: { type: Type.STRING, description: 'De status voor het interne werkplaatssysteem. Geef hier de waarde "Geregistreerd en ingepland" terug.'},
    problemen: {
        type: Type.ARRAY,
        description: "Een lijst met alle afzonderlijke problemen die uit de klantmelding zijn geanalyseerd. Elk item in de lijst is een volledige, op zichzelf staande analyse voor dat specifieke probleem.",
        items: problemDetailsSchema
    }
  },
  required: ['klantnaam', 'kenteken', 'merkModel', 'bouwjaar', 'registratieStatus', 'problemen']
};

export const generateWorkOrder = async (data: { name: string; licensePlate: string; makeModel: string; bouwjaar: string; complaint: string }): Promise<WorkOrder> => {
  const systemInstruction = `Je bent een AI-assistent voor de frontdesk van een caravan- en camperbedrijf. Je taak is om klantmeldingen te analyseren en om te zetten in een gestructureerde JSON-werkopdracht.

Wanneer je een klantmelding ontvangt, analyseer je de tekst zorgvuldig.

➡️ Als er één probleem wordt genoemd:
Genereer een werkopdracht met één item in de 'problemen' array.

➡️ Als er meerdere, losstaande problemen worden genoemd (bijv. ‘koelkast doet het niet én het dakluik lekt’):
1. Splits de melding op in aparte deelproblemen.
2. Maak voor elk deelprobleem een eigen, compleet object in de 'problemen' array. Elk object moet bevatten:
    - Een duidelijke probleembeschrijving.
    - De specifieke locatie.
    - Een technische categorie.
    - Een analyse van de waarschijnlijke oorzaak.
    - Een concreet actieplan.
    - Een lijst van benodigde onderdelen (of een lege lijst).
    - Een eigen urgentie ("Laag", "Normaal", "Hoog").

Verwerk ook genegeerde, vergeten of oude meldingen; in dat geval maak je een nieuwe werkorder aan en vul je de bekende klant- en voertuiggegevens in. Na analyse zet je de 'registratieStatus' altijd op "Geregistreerd en ingepland". Gebruik altijd Nederlands.`;

  const prompt = `
    Klantgegevens:
    - Naam: ${data.name || 'Niet opgegeven'}
    - Kenteken: ${data.licensePlate || 'Niet opgegeven'}
    - Merk/Model: ${data.makeModel || 'Niet opgegeven'}
    - Bouwjaar: ${data.bouwjaar || 'Niet opgegeven'}

    Klantmelding:
    ${data.complaint}
    `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      systemInstruction: systemInstruction,
      responseMimeType: "application/json",
      responseSchema: workOrderSchema,
    },
  });

  const jsonText = response.text.trim();
  try {
    const parsedJson = JSON.parse(jsonText);
    return parsedJson as WorkOrder;
  } catch (e) {
    console.error("Failed to parse Gemini response:", jsonText);
    throw new Error("Ontvangen data van de AI is niet in het juiste formaat.");
  }
};


import { GoogleGenAI, Type } from "@google/genai";
import type { WorkOrder } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const workOrderSchema = {
  type: Type.OBJECT,
  properties: {
    klantnaam: { type: Type.STRING, description: 'De naam van de klant.' },
    kenteken: { type: Type.STRING, description: 'Het kenteken van het voertuig.' },
    merkModel: { type: Type.STRING, description: 'Het merk en model van de caravan/camper.' },
    probleem: { type: Type.STRING, description: 'Een korte, duidelijke samenvatting van het probleem.' },
    locatie: { type: Type.STRING, description: 'Waar in de caravan/camper het probleem zich bevindt (bijv. Keukenblok, badkamer, onderstel).' },
    categorie: { type: Type.STRING, description: 'De technische categorie van het probleem (bijv. Watersysteem, Elektrisch systeem, Chassis, Carrosserie, Interieur).' },
    waarschijnlijkeOorzaak: { type: Type.STRING, description: 'De meest waarschijnlijke technische oorzaak van het probleem.' },
    urgentie: { type: Type.STRING, description: 'De urgentie van de reparatie. Kies uit: "Laag", "Normaal", "Hoog".' },
    actieplan: { type: Type.STRING, description: 'Een voorgesteld stappenplan voor de monteur om het probleem te diagnosticeren en op te lossen.' },
    benodigdeOnderdelen: {
      type: Type.ARRAY,
      description: 'Een lijst met specifieke onderdelen die mogelijk besteld moeten worden. Als er geen onderdelen nodig zijn, retourneer een lege array.',
      items: { type: Type.STRING }
    },
    registratieStatus: { type: Type.STRING, description: 'De status voor het interne werkplaatssysteem. Geef hier de waarde "Geregistreerd en ingepland" terug.'}
  },
  required: ['klantnaam', 'kenteken', 'merkModel', 'probleem', 'locatie', 'categorie', 'waarschijnlijkeOorzaak', 'urgentie', 'actieplan', 'benodigdeOnderdelen', 'registratieStatus']
};

export const generateWorkOrder = async (data: { name: string; licensePlate: string; makeModel: string; complaint: string }): Promise<WorkOrder> => {
  const systemInstruction = `Je bent een AI-assistent voor de frontdesk van een caravan- en camperbedrijf. Je taak is om klantmeldingen en klachten te analyseren en deze om te zetten in een gestructureerde, JSON-geformatteerde werkopdracht voor monteurs. Dit omvat ook het verwerken van genegeerde, vergeten of oude meldingen; in dat geval maak je een nieuwe werkorder aan en vul je de bekende klant- en voertuiggegevens in. Na analyse registreer en plan je de opdracht in het interne werkplaatssysteem. Communiceer professioneel, helder en technisch onderlegd, maar blijf praktisch. Gebruik altijd Nederlands. Analyseer de melding van de klant en genereer een werkopdracht volgens het opgegeven JSON-schema.`;

  const prompt = `
    Klantgegevens:
    - Naam: ${data.name || 'Niet opgegeven'}
    - Kenteken: ${data.licensePlate || 'Niet opgegeven'}
    - Merk/Model: ${data.makeModel || 'Niet opgegeven'}

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
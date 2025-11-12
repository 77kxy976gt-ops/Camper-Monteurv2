
import React from 'react';
import type { WorkOrder } from '../types';
import { WrenchIcon, ClipboardListIcon, TagIcon, LightBulbIcon, ClockIcon, DocumentTextIcon, ShoppingCartIcon, UserIcon, IdentificationIcon, LogoIcon, CheckBadgeIcon, ExternalLinkIcon } from './icons';

interface WorkOrderDisplayProps {
  workOrder: WorkOrder | null;
  isLoading: boolean;
  error: string | null;
}

const DetailItem: React.FC<{ icon: React.ReactNode; label: string; value: string; }> = ({ icon, label, value }) => (
  <div className="flex items-start gap-4">
    <div className="text-brand-lightblue mt-1">{icon}</div>
    <div className="min-w-0">
      <h4 className="font-semibold text-gray-500">{label}</h4>
      <p className="text-gray-900 truncate" title={value}>{value}</p>
    </div>
  </div>
);

const WorkOrderDisplay: React.FC<WorkOrderDisplayProps> = ({ workOrder, isLoading, error }) => {
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center text-center p-8">
          <svg className="animate-spin h-12 w-12 text-brand-lightblue mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-lg font-semibold text-gray-700">Werkorder wordt gegenereerd...</p>
          <p className="text-gray-500">De AI analyseert de melding.</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center text-center p-8 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-lg font-semibold text-red-700">Fout</p>
          <p className="text-gray-600">{error}</p>
        </div>
      );
    }

    if (!workOrder) {
      return (
        <div className="flex flex-col items-center justify-center text-center p-8">
          <ClipboardListIcon className="h-12 w-12 text-gray-400 mb-4" />
          <p className="text-lg font-semibold text-gray-700">Wachten op invoer</p>
          <p className="text-gray-500">De gegenereerde werkopdracht verschijnt hier.</p>
        </div>
      );
    }

    const urgencyClass = {
      'Laag': 'bg-green-100 text-green-800 border-green-200',
      'Normaal': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Hoog': 'bg-red-100 text-red-800 border-red-200',
    }[workOrder.urgentie] || 'bg-gray-100 text-gray-800 border-gray-200';

    return (
      <div className="space-y-6">
        <div className="p-6 bg-gray-50 rounded-lg border border-brand-lightgray">
            <h4 className="font-semibold text-gray-500 mb-4 flex items-center gap-2">Klant & Voertuig</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                    <UserIcon className="h-5 w-5 text-brand-lightblue"/>
                    <span className="text-gray-800">{workOrder.klantnaam || 'Onbekend'}</span>
                </div>
                <div className="flex items-center gap-3">
                    <IdentificationIcon className="h-5 w-5 text-brand-lightblue"/>
                    <span className="text-gray-800">{workOrder.kenteken || 'Onbekend'}</span>
                </div>
                <div className="flex items-center gap-3">
                    <LogoIcon className="h-5 w-5 text-brand-lightblue"/>
                    <span className="text-gray-800">{workOrder.merkModel || 'Onbekend'}</span>
                </div>
            </div>
        </div>

        <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <WrenchIcon className="h-6 w-6" />
                Technische Analyse
            </h3>
            <div className="flex items-center gap-2 flex-wrap justify-end">
                {workOrder.registratieStatus && (
                    <span className="flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-full border bg-blue-100 text-blue-800 border-blue-200">
                        <CheckBadgeIcon className="h-4 w-4" />
                        {workOrder.registratieStatus}
                    </span>
                )}
                <span className={`px-3 py-1 text-sm font-medium rounded-full border ${urgencyClass}`}>
                    {workOrder.urgentie}
                </span>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50 rounded-lg border border-brand-lightgray">
            <DetailItem icon={<DocumentTextIcon className="h-5 w-5" />} label="Probleem" value={workOrder.probleem} />
            <DetailItem icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>} label="Locatie" value={workOrder.locatie} />
            <DetailItem icon={<TagIcon className="h-5 w-5" />} label="Categorie" value={workOrder.categorie} />
            <DetailItem icon={<LightBulbIcon className="h-5 w-5" />} label="Waarschijnlijke Oorzaak" value={workOrder.waarschijnlijkeOorzaak} />
        </div>
        
        <div className="p-6 bg-gray-50 rounded-lg border border-brand-lightgray">
          <h4 className="font-semibold text-gray-500 mb-2 flex items-center gap-2"><ClockIcon className="h-5 w-5 text-brand-lightblue" /> Actieplan Monteur</h4>
          <p className="text-gray-900 whitespace-pre-wrap">{workOrder.actieplan}</p>
        </div>

        <div className="p-6 bg-gray-50 rounded-lg border border-brand-lightgray">
          <h4 className="font-semibold text-gray-500 mb-4 flex items-center gap-2"><ShoppingCartIcon className="h-5 w-5 text-brand-lightblue" /> Benodigde Onderdelen / Te Bestellen</h4>
          {workOrder.benodigdeOnderdelen.length > 0 ? (
            <ul className="space-y-2">
              {workOrder.benodigdeOnderdelen.map((item, index) => (
                <li key={index} className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100">
                  <span className="text-gray-900">{item}</span>
                  <a
                    href={`https://www.google.com/search?q=${encodeURIComponent(item + ' caravan onderdeel')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 py-1 px-3 text-xs font-semibold text-brand-blue bg-blue-100 hover:bg-blue-200 rounded-full transition-colors duration-200"
                    title={`Bestel '${item}' bij een leverancier`}
                  >
                    <ExternalLinkIcon className="h-3.5 w-3.5" />
                    Bestel
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">Geen onderdelen benodigd.</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-brand-gray p-6 rounded-xl shadow-lg h-full border border-gray-200">
      <h2 className="text-xl font-semibold mb-4 text-gray-900">2. Gegenereerde Werkopdracht</h2>
      <div className="bg-brand-gray rounded-lg">
        {renderContent()}
      </div>
    </div>
  );
};

export default WorkOrderDisplay;

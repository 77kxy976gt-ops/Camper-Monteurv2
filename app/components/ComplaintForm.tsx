import React from 'react';
import { AnalyzeIcon } from './icons';

interface ComplaintFormProps {
  name: string;
  setName: (name: string) => void;
  licensePlate: string;
  setLicensePlate: (licensePlate: string) => void;
  makeModel: string;
  setMakeModel: (makeModel: string) => void;
  bouwjaar: string;
  setBouwjaar: (bouwjaar: string) => void;
  complaint: string;
  setComplaint: (complaint: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  isAccepted: boolean;
}

const ComplaintForm: React.FC<ComplaintFormProps> = ({ 
  name, setName, 
  licensePlate, setLicensePlate,
  makeModel, setMakeModel,
  bouwjaar, setBouwjaar,
  complaint, setComplaint, 
  handleSubmit, isLoading, isAccepted
}) => {
  return (
    <div className="bg-brand-gray p-6 rounded-xl shadow-lg h-full flex flex-col border border-gray-200">
      <h2 className="text-xl font-semibold mb-4 text-gray-900">1. Klantmelding / Klacht</h2>
      <form onSubmit={handleSubmit} className="flex flex-col flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="customer-name" className="text-gray-600 mb-2 block text-sm font-medium">Naam Klant</label>
            <input
              id="customer-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jan Jansen"
              className="w-full p-3 bg-gray-50 border border-brand-lightgray rounded-lg focus:ring-2 focus:ring-brand-lightblue focus:outline-none transition-all duration-200 text-gray-800 disabled:bg-gray-200 disabled:cursor-not-allowed"
              disabled={isLoading || isAccepted}
            />
          </div>
          <div>
            <label htmlFor="license-plate" className="text-gray-600 mb-2 block text-sm font-medium">Kenteken</label>
            <input
              id="license-plate"
              type="text"
              value={licensePlate}
              onChange={(e) => setLicensePlate(e.target.value)}
              placeholder="12-ABC-3"
              className="w-full p-3 bg-gray-50 border border-brand-lightgray rounded-lg focus:ring-2 focus:ring-brand-lightblue focus:outline-none transition-all duration-200 text-gray-800 disabled:bg-gray-200 disabled:cursor-not-allowed"
              disabled={isLoading || isAccepted}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
              <label htmlFor="make-model" className="text-gray-600 mb-2 block text-sm font-medium">Merk / Model</label>
              <input
                id="make-model"
                type="text"
                value={makeModel}
                onChange={(e) => setMakeModel(e.target.value)}
                placeholder="Adria Matrix"
                className="w-full p-3 bg-gray-50 border border-brand-lightgray rounded-lg focus:ring-2 focus:ring-brand-lightblue focus:outline-none transition-all duration-200 text-gray-800 disabled:bg-gray-200 disabled:cursor-not-allowed"
                disabled={isLoading || isAccepted}
              />
          </div>
          <div>
              <label htmlFor="bouwjaar" className="text-gray-600 mb-2 block text-sm font-medium">Bouwjaar</label>
              <input
                id="bouwjaar"
                type="text"
                value={bouwjaar}
                onChange={(e) => setBouwjaar(e.target.value)}
                placeholder="2022"
                className="w-full p-3 bg-gray-50 border border-brand-lightgray rounded-lg focus:ring-2 focus:ring-brand-lightblue focus:outline-none transition-all duration-200 text-gray-800 disabled:bg-gray-200 disabled:cursor-not-allowed"
                disabled={isLoading || isAccepted}
              />
          </div>
        </div>

        <label htmlFor="complaint-input" className="text-gray-600 mb-2 text-sm font-medium">
          Klachtomschrijving
        </label>
        <textarea
          id="complaint-input"
          value={complaint}
          onChange={(e) => setComplaint(e.target.value)}
          placeholder="Voer de melding van de klant zo gedetailleerd mogelijk in..."
          className="flex-grow w-full p-3 bg-gray-50 border border-brand-lightgray rounded-lg focus:ring-2 focus:ring-brand-lightblue focus:outline-none transition-all duration-200 text-gray-800 resize-none min-h-[150px] lg:min-h-0 disabled:bg-gray-200 disabled:cursor-not-allowed"
          disabled={isLoading || isAccepted}
        />
        <button
          type="submit"
          disabled={isLoading || isAccepted}
          className="mt-4 w-full flex items-center justify-center gap-2 bg-brand-blue hover:bg-brand-lightblue disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyse bezig...
            </>
          ) : (
            <>
              <AnalyzeIcon className="h-5 w-5" />
              Analyseer Melding
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ComplaintForm;
"use client";

import React, { useState } from 'react';
import type { WorkOrder } from './types';
import { generateWorkOrder } from './services/geminiService';
import ComplaintForm from './components/ComplaintForm';
import WorkOrderDisplay from './components/WorkOrderDisplay';
import { LogoIcon } from './components/icons';

export default function Home() {
  const [name, setName] = useState<string>('');
  const [licensePlate, setLicensePlate] = useState<string>('');
  const [makeModel, setMakeModel] = useState<string>('');
  const [bouwjaar, setBouwjaar] = useState<string>('');
  const [complaint, setComplaint] = useState<string>('');
  const [workOrder, setWorkOrder] = useState<WorkOrder | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isAccepted, setIsAccepted] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaint.trim()) {
      setError('Voer alstublieft een klacht in.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setWorkOrder(null);
    setIsAccepted(false);

    try {
      const generatedOrder = await generateWorkOrder({ name, licensePlate, makeModel, bouwjaar, complaint });
      setWorkOrder(generatedOrder);
    } catch (err) {
      console.error(err);
      setError('Er is een fout opgetreden bij het analyseren van de melding. Probeer het opnieuw.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = () => {
    setIsAccepted(true);
    console.log("Werkorder geaccepteerd!");
  };

  return (
    <div className="min-h-screen text-gray-700 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex items-center gap-4 mb-8">
          <LogoIcon className="h-12 w-12 text-brand-lightblue" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Frontdesk AI Assistent</h1>
            <p className="text-gray-500">Klachtenanalyse & Werkopdracht Generator</p>
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="lg:pr-4">
            <ComplaintForm
              name={name}
              setName={setName}
              licensePlate={licensePlate}
              setLicensePlate={setLicensePlate}
              makeModel={makeModel}
              setMakeModel={setMakeModel}
              bouwjaar={bouwjaar}
              setBouwjaar={setBouwjaar}
              complaint={complaint}
              setComplaint={setComplaint}
              handleSubmit={handleSubmit}
              isLoading={isLoading}
              isAccepted={isAccepted}
            />
          </div>

          <div className="lg:pl-4">
            <WorkOrderDisplay
              workOrder={workOrder}
              isLoading={isLoading}
              error={error}
              isAccepted={isAccepted}
              onAccept={handleAccept}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
import type { WorkOrder } from '../types';

export const generateWorkOrder = async (data: { name: string; licensePlate: string; makeModel: string; complaint: string }): Promise<WorkOrder> => {
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ error: 'Onbekende serverfout' }));
    console.error("API Error:", errorBody);
    throw new Error(errorBody.error || 'Er is een fout opgetreden bij de communicatie met de server.');
  }

  const workOrder = await response.json();
  return workOrder as WorkOrder;
};

export interface AlertMessage {
  subject: string;
  body: string;
  priority: 'low' | 'normal' | 'urgent';
}

export const createSurplusAlert = (itemName: string, quantityKg: number, facilityName: string): AlertMessage => {
  return {
    subject: `[MessMind Alert] ${quantityKg}kg Surplus Available at ${facilityName}`,
    body: `A batch of ${quantityKg}kg (${itemName}) was flagged at ${facilityName}. Claim via portal immediately to prevent thermal degradation.`,
    priority: quantityKg > 20 ? 'urgent' : 'normal',
  };
};

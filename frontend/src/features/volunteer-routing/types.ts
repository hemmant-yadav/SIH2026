export interface DeliveryRoute {
  id: string;
  originFacility: string;
  destinationFacility: string;
  distanceKm: number;
  estimatedMinutes: number;
  status: 'assigned' | 'in_transit' | 'completed';
}

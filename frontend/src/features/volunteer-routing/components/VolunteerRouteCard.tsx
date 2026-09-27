import React from 'react';
import { Card } from '../../../shared/components/Card';
import { DeliveryRoute } from '../types';

export interface VolunteerRouteCardProps {
  route?: DeliveryRoute;
}

export const VolunteerRouteCard: React.FC<VolunteerRouteCardProps> = ({
  route = {
    id: 'route-1',
    originFacility: 'Campus Dining Hall #1',
    destinationFacility: 'Community Food Bank Haven',
    distanceKm: 4.2,
    estimatedMinutes: 18,
    status: 'assigned',
  },
}) => {
  return (
    <Card className="border border-outline-variant/30 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-forest font-semibold">
          Delivery Logistics
        </span>
        <span className="text-xs px-2.5 py-0.5 rounded-full bg-lime/15 text-lime font-bold">
          {route.status.replace('_', ' ')}
        </span>
      </div>

      <div className="flex items-center gap-2 text-sm font-dmsans">
        <strong className="text-forest">{route.originFacility}</strong>
        <span className="text-outline">→</span>
        <strong className="text-forest">{route.destinationFacility}</strong>
      </div>

      <div className="flex items-center justify-between text-xs text-on-surface-variant pt-2 border-t border-outline-variant/30">
        <span>Distance: {route.distanceKm} km</span>
        <span>ETA: {route.estimatedMinutes} mins</span>
      </div>
    </Card>
  );
};

import { useEffect, useState } from 'react';
import { DashboardData, UnitType } from '@messmind/shared-types';
import { dashboardApi } from '../api/dashboardApi';

export const useDashboardData = (initialUnit: UnitType = 'kitchen') => {
  const [unitType, setUnitType] = useState<UnitType>(initialUnit);
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [toggleCount, setToggleCount] = useState<number>(0);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    dashboardApi.fetchDashboardData(unitType).then((result) => {
      if (isMounted) {
        setData(result);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [unitType]);

  const toggleUnit = (newUnit: UnitType) => {
    if (newUnit !== unitType) {
      setUnitType(newUnit);
      setToggleCount((prev) => prev + 1);
    }
  };

  return {
    unitType,
    toggleUnit,
    data,
    loading,
    toggleCount,
  };
};

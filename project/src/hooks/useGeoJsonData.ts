import { useState, useEffect } from 'react';
import { fetchGeoJsonData, ApiResponse } from '../services/api';

interface UseGeoJsonDataResult {
  data: any | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useGeoJsonData = (): UseGeoJsonDataResult => {
  const [data, setData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    const result: ApiResponse<any> = await fetchGeoJsonData();

    if (result.error) {
      setError(result.error);
      setData(null);
    } else {
      setData(result.data);
      setError(null);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    isLoading,
    error,
    refetch: fetchData
  };
};
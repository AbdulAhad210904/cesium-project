const API_BASE_URL = 'http://localhost:3001/api';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export const fetchGeoJsonData = async (): Promise<ApiResponse<any>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/geojson`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return { data };
  } catch (error) {
    console.error('Error fetching GeoJSON data:', error);
    return { 
      error: error instanceof Error ? error.message : 'Failed to fetch data'
    };
  }
};

export const checkServerHealth = async (): Promise<ApiResponse<{ status: string; message: string }>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return { data };
  } catch (error) {
    console.error('Error checking server health:', error);
    return { 
      error: error instanceof Error ? error.message : 'Server unavailable'
    };
  }
};
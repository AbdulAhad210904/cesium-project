import React, { useEffect, useRef, useState } from 'react';
import { Viewer, GeoJsonDataSource, Entity } from 'resium';
import { 
  Cartesian3, 
  Color, 
  GeoJsonDataSource as CesiumGeoJsonDataSource,
  PolylineGlowMaterialProperty,
  CallbackProperty,
  defined
} from 'cesium';
import { Loader } from 'lucide-react';

interface CesiumMapProps {
  geoJsonData?: any;
  isLoading?: boolean;
  error?: string;
}

const CesiumMap: React.FC<CesiumMapProps> = ({ geoJsonData, isLoading, error }) => {
  const viewerRef = useRef<any>(null);
  const [dataSource, setDataSource] = useState<CesiumGeoJsonDataSource | null>(null);

  useEffect(() => {
    if (geoJsonData && viewerRef.current?.cesiumElement) {
      const viewer = viewerRef.current.cesiumElement;
      
      // Clear existing data source
      if (dataSource) {
        viewer.dataSources.remove(dataSource);
      }

      // Create new GeoJSON data source
      const newDataSource = new CesiumGeoJsonDataSource();
      
      // Load the GeoJSON data
      newDataSource.load(geoJsonData, {
        strokeWidth: 5,
        strokeOpacity: 1.0,
        fill: Color.YELLOW.withAlpha(0.5),
        stroke: Color.RED
      }).then(() => {
        // Customize the entities after loading
        const entities = newDataSource.entities.values;
        
        entities.forEach((entity) => {
          const properties = entity.properties;
          
          if (entity.billboard && properties && defined(properties.name)) {
            // Handle points
            const name = properties.name.getValue();
            const markerColor = properties['marker-color']?.getValue();
            
            if (markerColor) {
              // Parse RGBA color
              const colorMatch = markerColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
              if (colorMatch) {
                const [, r, g, b, a = 1] = colorMatch;
                entity.point = {
                  pixelSize: 15,
                  color: Color.fromBytes(parseInt(r), parseInt(g), parseInt(b), parseFloat(a) * 255),
                  outlineColor: Color.BLACK,
                  outlineWidth: 2,
                  heightReference: 0
                };
                
                // Add label
                entity.label = {
                  text: name,
                  font: '14pt sans-serif',
                  pixelOffset: new Cartesian3(0, -50, 0),
                  fillColor: Color.WHITE,
                  outlineColor: Color.BLACK,
                  outlineWidth: 2,
                  style: 0
                };
                
                // Remove billboard since we're using point
                entity.billboard = undefined;
              }
            }
          } else if (entity.polyline && properties && defined(properties.name)) {
            // Handle lines
            const strokeColor = properties.stroke?.getValue();
            const strokeWidth = properties['stroke-width']?.getValue() || 5;
            
            if (strokeColor) {
              const colorMatch = strokeColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
              if (colorMatch) {
                const [, r, g, b, a = 1] = colorMatch;
                const cesiumColor = Color.fromBytes(parseInt(r), parseInt(g), parseInt(b), parseFloat(a) * 255);
                
                entity.polyline = {
                  positions: entity.polyline.positions,
                  width: strokeWidth,
                  material: new PolylineGlowMaterialProperty({
                    glowPower: 0.2,
                    color: cesiumColor
                  }),
                  clampToGround: true
                };
              }
            }
          }
        });

        // Add to viewer and zoom to data
        viewer.dataSources.add(newDataSource);
        viewer.zoomTo(newDataSource);
        setDataSource(newDataSource);
      }).catch((error) => {
        console.error('Error loading GeoJSON:', error);
      });
    }
  }, [geoJsonData, dataSource]);

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-900">
        <div className="flex flex-col items-center gap-4">
          <Loader className="w-8 h-8 animate-spin text-blue-400" />
          <p className="text-white">Loading map data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-2">Error loading map data</p>
          <p className="text-gray-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen">
      <Viewer
        ref={viewerRef}
        full
        animation={false}
        timeline={false}
        navigationHelpButton={false}
        baseLayerPicker={true}
        geocoder={true}
        homeButton={true}
        sceneModePicker={true}
        selectionIndicator={true}
        infoBox={true}
      />
    </div>
  );
};

export default CesiumMap;
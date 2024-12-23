import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { MdDirections } from 'react-icons/md';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

const FicheDeRouteForm = ({ selectedLivraison, drivers, handleDriverSubmit, setShowForm }) => {
  const [selectedDriver, setSelectedDriver] = useState('');
  const [distance, setDistance] = useState(null);
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapContainerRef.current && selectedLivraison) {
      const marketCoords = [
        parseFloat(selectedLivraison.market.longitude),
        parseFloat(selectedLivraison.market.latitude)
      ];
      const clientCoords = [
        parseFloat(selectedLivraison.client.longitude),
        parseFloat(selectedLivraison.client.latitude)
      ];

      if (isNaN(marketCoords[0]) || isNaN(marketCoords[1]) || isNaN(clientCoords[0]) || isNaN(clientCoords[1])) {
        console.error('Invalid coordinates:', { marketCoords, clientCoords });
        return;
      }

      if (mapRef.current) {
        mapRef.current.remove();
      }

      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: marketCoords,
        zoom: 10,
      });

      const coordinates = `${marketCoords.join(',')};${clientCoords.join(',')}`;
      const directionsUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates}?geometries=geojson&access_token=${mapboxgl.accessToken}`;

      fetch(directionsUrl)
        .then(response => response.json())
        .then(data => {
          if (data.routes && data.routes[0]) {
            const route = data.routes[0].geometry.coordinates;
            const marketPopup = new mapboxgl.Popup({ offset: 25 }).setText('Market');
            new mapboxgl.Marker({ color: 'green' })
              .setLngLat(route[0])
              .setPopup(marketPopup)
              .addTo(mapRef.current);

            const clientPopup = new mapboxgl.Popup({ offset: 25 }).setText('Client');
            new mapboxgl.Marker({ color: 'red' })
              .setLngLat(route[route.length - 1])
              .setPopup(clientPopup)
              .addTo(mapRef.current);

            mapRef.current.addSource('route', {
              type: 'geojson',
              data: {
                type: 'Feature',
                geometry: {
                  type: 'LineString',
                  coordinates: route,
                },
              },
            });

            mapRef.current.addLayer({
              id: 'route',
              type: 'line',
              source: 'route',
              layout: {
                'line-join': 'round',
                'line-cap': 'round',
              },
              paint: {
                'line-color': '#007bff',
                'line-width': 5,
              },
            });

            const bounds = new mapboxgl.LngLatBounds();
            route.forEach(coord => bounds.extend(coord));
            mapRef.current.fitBounds(bounds, {
              padding: 50,
            });

            // Set the distance in kilometers
            setDistance(data.routes[0].distance / 1000);
          } else {
            console.error('No routes found');
          }
        })
        .catch(error => {
          console.error('Error fetching directions:', error);
        });
    }
  }, [selectedLivraison]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedDriver || !distance) {
      console.error('Driver or distance not set');
      return;
    }

    handleDriverSubmit(selectedDriver, distance);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 sm:p-6 md:p-10 rounded-2xl shadow-lg w-full max-w-5xl max-h-full overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-700">
            Assign Driver for {selectedLivraison ? selectedLivraison.NumeroCommande : ''}
          </h2>
          <button
            onClick={() => setShowForm(false)}
            className="text-gray-600 hover:text-gray-800 text-2xl"
          >
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-6">
            <label htmlFor="driver" className="block text-base sm:text-lg md:text-xl font-semibold text-blue-700">Select Driver</label>
            <select
              id="driver"
              className="w-full border rounded-lg py-2 px-3 text-sm sm:text-lg"
              value={selectedDriver}
              onChange={(e) => setSelectedDriver(e.target.value)}
            >
              <option value="">Choose a driver</option>
              {drivers.map((driver) => (
                <option key={driver._id} value={driver._id}>
                  {driver.first_name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-actions flex justify-end mb-6">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-blue-700 transition text-sm sm:text-lg"
            >
              Assign
            </button>
          </div>
        </form>
        <div className="mt-6 mb-6 text-sm sm:text-lg">
          <div className="p-4 border rounded-lg shadow-sm">
            <div className="flex items-center mb-2 text-blue-600">
              <FaMapMarkerAlt className="mr-2 text-lg sm:text-xl" />
              <span className="font-semibold">Market: </span> {selectedLivraison ? selectedLivraison.market.first_name : ''}
            </div>
            <div className="flex items-center mb-2 text-blue-600">
              <MdDirections className="mr-2 text-lg sm:text-xl" />
              <span className="font-semibold">Client: </span> {selectedLivraison ? selectedLivraison.client.first_name : ''}
            </div>
            <div className="flex items-center text-blue-600">
              <span className="font-semibold">Distance: </span> {distance ? `${distance.toFixed(2)} km` : 'Calculating...'}
            </div>
          </div>
        </div>
        <div
          ref={mapContainerRef}
          style={{ width: '100%', height: '300px', marginTop: '20px' }}
        />
      </div>
    </div>
  );
};

export default FicheDeRouteForm;

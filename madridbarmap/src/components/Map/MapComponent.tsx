"use client";

import { useState, useCallback } from "react";
import {
  APIProvider,
  Map,
  InfoWindow,
  MapMouseEvent,
} from "@vis.gl/react-google-maps";
import BarMarker from "./BarMarker";
// import BarInfoWindow from "./BarInfoWindow"; // Removed to use Panel-only flow
import { BarWithStats, MapClickEvent } from "@/types";
import { useAppStore } from "@/store/useAppStore";

interface MapComponentProps {
  bars: BarWithStats[];
  isLoggedIn: boolean;
  onRightClick: (coords: MapClickEvent) => void;
  onAddReview: (bar: BarWithStats) => void;
}

const MADRID_CENTER = { lat: 40.4168, lng: -3.7038 };
const DEFAULT_ZOOM = 13;

export default function MapComponent({
  bars,
  isLoggedIn,
  onRightClick,
  onAddReview,
}: MapComponentProps) {
  const [selectedBar, setSelectedBar] = useState<BarWithStats | null>(null);

  const handleMapRightClick = useCallback(
    (event: MapMouseEvent) => {
      if (!isLoggedIn) return;

      const latLng = event.detail.latLng;
      if (latLng) {
        onRightClick({ lat: latLng.lat, lng: latLng.lng });
      }
    },
    [isLoggedIn, onRightClick]
  );

  const handleMarkerClick = useCallback((bar: BarWithStats) => {
    if (bar.googlePlaceId) {
      useAppStore.getState().setSelectedPlaceId(bar.googlePlaceId);
    }
  }, []);

  const handleInfoWindowClose = useCallback(() => {
    setSelectedBar(null);
  }, []);

  const handleAddReview = useCallback(() => {
    if (selectedBar) {
      onAddReview(selectedBar);
      setSelectedBar(null);
    }
  }, [selectedBar, onAddReview]);

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}>
      <Map
        style={{ width: "100%", height: "100%" }}
        className="w-full h-full"
        defaultCenter={MADRID_CENTER}
        defaultZoom={DEFAULT_ZOOM}
        mapId="madridbarmap"
        onContextmenu={handleMapRightClick}
        onClick={(ev: MapMouseEvent) => {
          if (ev.detail.placeId) {
            ev.stop(); // Prevent default info window
            useAppStore.getState().setSelectedPlaceId(ev.detail.placeId);
          }
        }}
        gestureHandling="greedy"
        disableDefaultUI={false}
        mapTypeControl={true}
        mapTypeControlOptions={{ position: 3 }} // 3 = TOP_RIGHT
      >
        {bars.map((bar) => (
          <BarMarker
            key={bar.id}
            bar={bar}
            onClick={() => handleMarkerClick(bar)}
          />
        ))}

      </Map>
    </APIProvider>
  );
}

import { create } from "zustand";

interface AppState {
    selectedPlaceId: string | null;
    panelMode: "search" | "details" | "review";
    refreshTrigger: number;
    setSelectedPlaceId: (id: string | null) => void;
    setPanelMode: (mode: "search" | "details" | "review") => void;
    triggerRefresh: () => void;
}

export const useAppStore = create<AppState>((set) => ({
    selectedPlaceId: null,
    panelMode: "search",
    refreshTrigger: 0,
    setSelectedPlaceId: (id) => set({ selectedPlaceId: id, panelMode: id ? "details" : "search" }),
    setPanelMode: (mode) => set({ panelMode: mode }),
    triggerRefresh: () => set((state) => ({ refreshTrigger: state.refreshTrigger + 1 })),
}));

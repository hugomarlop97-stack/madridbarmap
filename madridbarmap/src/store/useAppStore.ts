import { create } from "zustand";

interface AppState {
    selectedPlaceId: string | null;
    panelMode: "search" | "details" | "review";
    refreshTrigger: number;
    bottomSheetExpanded: boolean;
    setSelectedPlaceId: (id: string | null) => void;
    setPanelMode: (mode: "search" | "details" | "review") => void;
    triggerRefresh: () => void;
    setBottomSheetExpanded: (expanded: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
    selectedPlaceId: null,
    panelMode: "search",
    refreshTrigger: 0,
    bottomSheetExpanded: false,
    setSelectedPlaceId: (id) => set({ selectedPlaceId: id, panelMode: id ? "details" : "search", bottomSheetExpanded: false }),
    setPanelMode: (mode) => set({ panelMode: mode }),
    triggerRefresh: () => set((state) => ({ refreshTrigger: state.refreshTrigger + 1 })),
    setBottomSheetExpanded: (expanded) => set({ bottomSheetExpanded: expanded }),
}));

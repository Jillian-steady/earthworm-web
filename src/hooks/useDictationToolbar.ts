import { useCallback } from "react";
import { create } from "zustand";

interface ToolBar {
  times: number;
  rate: number;
  interval: number;
  [key: string]: number;
}

export const defaultOptions: ToolBar = {
  times: 1,
  rate: 1,
  interval: 1000,
};

interface DictationToolbarState {
  toolBarData: ToolBar;
  setToolBarData: (data: Partial<ToolBar>) => void;
  resetToolBarData: () => void;
}

const useDictationToolbarStore = create<DictationToolbarState>((set) => ({
  toolBarData: { ...defaultOptions },
  setToolBarData: (data: Partial<ToolBar>) =>
    set((state) => ({
      toolBarData: { ...state.toolBarData, ...data } as ToolBar,
    })),
  resetToolBarData: () => set({ toolBarData: { ...defaultOptions } }),
}));

export function useToolbar() {
  const { toolBarData, setToolBarData, resetToolBarData } =
    useDictationToolbarStore();

  const saveToolBarData = useCallback(() => {
    const data = useDictationToolbarStore.getState().toolBarData;
    localStorage.setItem("dictationOptions", JSON.stringify(data));
  }, []);

  const recoverToolBarData = useCallback(() => {
    const options = localStorage.getItem("dictationOptions");
    if (options) {
      setToolBarData(JSON.parse(options));
    }
  }, [setToolBarData]);

  const handleResetToolBarData = useCallback(() => {
    resetToolBarData();
  }, [resetToolBarData]);

  return {
    toolBarData,
    saveToolBarData,
    recoverToolBarData,
    resetToolBarData: handleResetToolBarData,
  };
}

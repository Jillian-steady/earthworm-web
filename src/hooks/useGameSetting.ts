import { useCallback } from "react";
import { create } from "zustand";

interface GameSettingState {
  showGameSettingModal: boolean;
  setShowGameSettingModal: (value: boolean) => void;
}

const useGameSettingStore = create<GameSettingState>((set) => ({
  showGameSettingModal: false,
  setShowGameSettingModal: (value: boolean) =>
    set({ showGameSettingModal: value }),
}));

export function useGameSetting() {
  const { showGameSettingModal, setShowGameSettingModal } =
    useGameSettingStore();

  const toggleGameSettingModal = useCallback(() => {
    const current = useGameSettingStore.getState().showGameSettingModal;
    setShowGameSettingModal(!current);
  }, [setShowGameSettingModal]);

  const openGameSettingModal = useCallback(() => {
    setShowGameSettingModal(true);
  }, [setShowGameSettingModal]);

  const closeGameSettingModal = useCallback(() => {
    setShowGameSettingModal(false);
  }, [setShowGameSettingModal]);

  return {
    showGameSettingModal,
    toggleGameSettingModal,
    openGameSettingModal,
    closeGameSettingModal,
  };
}

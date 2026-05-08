import { create } from "zustand";

import type { MasteredElement, MasteredElementContent } from "@/types";
import { deleteFetcher, getFetcher, postFetcher } from "@/utils/fetcher";

interface MasteredElementsState {
  masteredElements: MasteredElement[];
  totalMasteredElementsCount: () => number;
  addElement: (content: MasteredElementContent) => Promise<() => void>;
  removeElement: (elementId: string) => Promise<void>;
  checkMastered: (english: string) => boolean;
  setup: () => Promise<void>;
}

export const useMasteredElementsStore = create<MasteredElementsState>((set, get) => ({
  masteredElements: [],

  totalMasteredElementsCount: () => {
    return get().masteredElements.length;
  },

  addElement: async (content: MasteredElementContent) => {
    const result = await postFetcher<MasteredElement>("/api/mastered-elements", { content });
    const previousElements = [...get().masteredElements];
    set({ masteredElements: [result, ...get().masteredElements] });

    return () => {
      set({ masteredElements: previousElements });
      deleteFetcher<boolean>(`/api/mastered-elements/${result.id}`).catch(console.error);
    };
  },

  removeElement: async (elementId: string) => {
    await deleteFetcher<boolean>(`/api/mastered-elements/${elementId}`);
    set({
      masteredElements: get().masteredElements.filter(({ id }) => id !== elementId),
    });
  },

  checkMastered: (english: string) => {
    return !!get().masteredElements.find(
      (element) => element.content.english.toLowerCase() === english.toLowerCase(),
    );
  },

  setup: async () => {
    const elements = await getFetcher<MasteredElement[]>("/api/mastered-elements");
    set({ masteredElements: [...elements] });
  },
}));

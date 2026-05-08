import { useCallback, useEffect } from "react";
import { create } from "zustand";

import { useDailySentence } from "@/hooks/useSummary";
import {
  convertSVGtoImg,
  copyImage,
  fontEn,
  fontZh,
  initCanvas,
  tpl_1,
  tpl_2,
} from "@/utils/shareImage";

export enum ShareImageTemplate {
  TPL_1 = "tpl_1",
  TPL_2 = "tpl_2",
}

export interface ShareImageTemplateData {
  coursePackTitle: string;
  courseTitle: string;
  zhSentence: string;
  enSentence: string;
  userName: string;
  dateStr: string;
  totalRecordNumber: number;
  totalTime: string;
}

type TemplateFunction = (data: ShareImageTemplateData) => Record<string, unknown>;

export const imageTemplates: Record<ShareImageTemplate, TemplateFunction> = {
  [ShareImageTemplate.TPL_1]: tpl_1,
  [ShareImageTemplate.TPL_2]: tpl_2,
};

// --- Share Modal ---

interface ShareModalState {
  shareModalVisible: boolean;
  setShareModalVisible: (value: boolean) => void;
}

const useShareModalStore = create<ShareModalState>((set) => ({
  shareModalVisible: false,
  setShareModalVisible: (value: boolean) =>
    set({ shareModalVisible: value }),
}));

export function useShareModal() {
  const { shareModalVisible, setShareModalVisible } = useShareModalStore();

  const showShareModal = useCallback(() => {
    setShareModalVisible(true);
  }, [setShareModalVisible]);

  const hideShareModal = useCallback(() => {
    setShareModalVisible(false);
  }, [setShareModalVisible]);

  return {
    showShareModal,
    hideShareModal,
    shareModalVisible,
  };
}

// --- Generate Share Image ---

export interface GalleryItem {
  src: string;
  canvasEl: HTMLCanvasElement;
}

interface GenerateShareImageState {
  shareImageSrc: string;
  currImageIndex: number;
  galleryImgs: GalleryItem[];
  setShareImageSrc: (src: string) => void;
  setCurrImageIndex: (index: number) => void;
  setGalleryImgs: (imgs: GalleryItem[]) => void;
  updateGalleryImg: (index: number, item: GalleryItem) => void;
}

const useGenerateShareImageStore = create<GenerateShareImageState>(
  (set, get) => ({
    shareImageSrc: "",
    currImageIndex: 0,
    galleryImgs: [],
    setShareImageSrc: (src: string) => set({ shareImageSrc: src }),
    setCurrImageIndex: (index: number) => set({ currImageIndex: index }),
    setGalleryImgs: (imgs: GalleryItem[]) => set({ galleryImgs: imgs }),
    updateGalleryImg: (index: number, item: GalleryItem) => {
      const imgs = [...get().galleryImgs];
      imgs[index] = item;
      set({ galleryImgs: imgs });
    },
  }),
);

const generateConfig = async () => {
  const fontEnData = await fontEn();
  const fontZhData = await fontZh();
  return {
    width: 400,
    height: 600,
    embedFont: true,
    fonts: [
      {
        name: "EBGaramond",
        data: fontEnData,
      },
      {
        name: "SourceHanSerifSCBold",
        data: fontZhData,
      },
    ],
  };
};

export function useGenerateShareImage() {
  const { enSentence, zhSentence } = useDailySentence();
  const {
    shareImageSrc,
    currImageIndex,
    galleryImgs,
    setShareImageSrc,
    setCurrImageIndex,
    setGalleryImgs,
    updateGalleryImg,
  } = useGenerateShareImageStore();

  const format = "jpg";
  const fullFormat = `image/${format}`;

  // Preload fonts on mount
  useEffect(() => {
    fontEn();
    fontZh();
  }, []);

  const chosenTemplate = useCallback(
    (
      templateKey: ShareImageTemplate,
      coursePackTitle: string,
      courseTitle: string,
      userName: string,
      dateStr: string,
      totalRecordNumber: number,
      totalTime: string,
    ) => {
      return imageTemplates[templateKey]({
        coursePackTitle,
        courseTitle,
        zhSentence,
        enSentence,
        userName,
        dateStr,
        totalRecordNumber,
        totalTime,
      });
    },
    [zhSentence, enSentence],
  );

  const generateImage = useCallback(
    async (
      coursePackTitle: string,
      courseTitle: string,
      template: ShareImageTemplate,
      index: number,
      userName: string,
      dateStr: string,
      totalRecordNumber: number,
      totalTime: string,
    ) => {
      const satori = (await import("satori")).default;
      const canvasEl = initCanvas();

      updateGalleryImg(index, { src: "", canvasEl });

      try {
        const svg = await satori(
          chosenTemplate(
            template,
            coursePackTitle,
            courseTitle,
            userName,
            dateStr,
            totalRecordNumber,
            totalTime,
          ) as unknown as React.ReactNode,
          await generateConfig(),
        );

        const src = await convertSVGtoImg(svg, canvasEl, fullFormat);
        updateGalleryImg(index, { src, canvasEl });

        if (index === 0) {
          setShareImageSrc(src);
        }
      } catch (e) {
        console.error("Error generating SVG", e);
      }
    },
    [chosenTemplate, fullFormat, updateGalleryImg, setShareImageSrc],
  );

  const generateGalleryImage = useCallback(
    async (
      coursePackTitle: string,
      courseTitle: string,
      userName: string,
      dateStr: string,
      totalRecordNumber: number,
      totalTime: string,
    ) => {
      Object.values(ShareImageTemplate).forEach(
        async (template, index) => {
          generateImage(
            coursePackTitle,
            courseTitle,
            template,
            index,
            userName,
            dateStr,
            totalRecordNumber,
            totalTime,
          );
        },
      );
    },
    [generateImage],
  );

  const clearShareImageSrc = useCallback(() => {
    setShareImageSrc("");
    setGalleryImgs([]);
    setCurrImageIndex(0);
  }, [setShareImageSrc, setGalleryImgs, setCurrImageIndex]);

  const copyShareImage = useCallback(
    (index: number) => {
      const state = useGenerateShareImageStore.getState();
      copyImage(state.galleryImgs[index].canvasEl, fullFormat);
    },
    [fullFormat],
  );

  const handleSelectImage = useCallback(
    (index: number) => {
      const state = useGenerateShareImageStore.getState();
      const src = state.galleryImgs[index]?.src;
      if (!src) return;
      setShareImageSrc(src);
      setCurrImageIndex(index);
    },
    [setShareImageSrc, setCurrImageIndex],
  );

  return {
    shareImageSrc,
    generateImage,
    generateGalleryImage,
    copyShareImage,
    galleryImgs,
    clearShareImageSrc,
    handleSelectImage,
    currImageIndex,
  };
}

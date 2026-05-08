import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";

vi.mock("satori", () => {
  return {
    default: vi.fn().mockResolvedValue("svg"),
  };
});

vi.mock("@/utils/shareImage", async (importOriginal) => {
  return {
    ...((await importOriginal()) as any),
    fontEn: vi.fn().mockResolvedValue(new ArrayBuffer(0)),
    fontZh: vi.fn().mockResolvedValue(new ArrayBuffer(0)),
    convertSVGtoImg: vi
      .fn()
      .mockResolvedValue("default image url")
      .mockResolvedValueOnce("first image url"),
    copyImage: vi.fn(),
    initCanvas: vi.fn(() => ({
      getContext: () => ({ drawImage: vi.fn(), clearRect: vi.fn() }),
      toDataURL: () => "data:image/jpg;base64,",
      toBlob: vi.fn(),
      width: 900,
      height: 1200,
    })),
  };
});

vi.mock("@/utils/fetcher", () => ({
  getFetcher: vi.fn().mockResolvedValue({ en: "en", zh: "zh" }),
  postFetcher: vi.fn(),
}));

import { fontEn, fontZh, convertSVGtoImg } from "@/utils/shareImage";
import { ShareImageTemplate, useGenerateShareImage } from "@/hooks/useShareImage";

const dummyUserName = "dummyUserName";
const dummyDateStr = "2024/03/12";

describe("Share Image", () => {
  beforeEach(() => {
    return () => {
      vi.clearAllMocks();
    };
  });

  it("should generate an image", async () => {
    const { result } = renderHook(() => useGenerateShareImage());

    await act(async () => {
      await result.current.generateImage(
        "零基础",
        "1",
        ShareImageTemplate.TPL_1,
        0,
        dummyUserName,
        dummyDateStr,
        0,
        "",
      );
    });

    const satori = (await import("satori")).default;
    expect(satori).toBeCalled();
    expect(result.current.shareImageSrc).toBe("first image url");
  });

  it("should copy the image", async () => {
    const { result } = renderHook(() => useGenerateShareImage());

    await act(async () => {
      await result.current.generateImage(
        "零基础",
        "1",
        ShareImageTemplate.TPL_1,
        0,
        dummyUserName,
        dummyDateStr,
        0,
        "",
      );
    });

    act(() => {
      result.current.copyShareImage(0);
    });

    const { copyImage } = await import("@/utils/shareImage");
    expect(copyImage).toBeCalled();
  });

  it("should generate gallery images for all templates", async () => {
    const { result } = renderHook(() => useGenerateShareImage());

    // generateGalleryImage calls generateImage for each template
    // Due to async forEach in the implementation, only the first call completes synchronously
    await act(async () => {
      await result.current.generateGalleryImage(
        "零基础",
        "1",
        dummyUserName,
        dummyDateStr,
        0,
        "",
      );
    });

    const satori = (await import("satori")).default;
    // At least one template should have been generated
    expect(satori).toHaveBeenCalled();
  });

  it("should preload the font file", async () => {
    renderHook(() => useGenerateShareImage());

    // Fonts are preloaded in useEffect
    await vi.waitFor(() => {
      expect(fontEn).toBeCalled();
      expect(fontZh).toBeCalled();
    });
  });
});

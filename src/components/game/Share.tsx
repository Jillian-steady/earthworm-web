"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";

import { courseTimer } from "@/hooks/useCourseTimer";
import { useCourseStore } from "@/stores/course";
import { useCoursePackStore } from "@/stores/course-pack";
import { useUserStore } from "@/stores/user";
import { formatSecondsToTime, getToday } from "@/utils/date";

export default function Share() {
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [shareImageSrc, setShareImageSrc] = useState("");
  const [currImageIndex, setCurrImageIndex] = useState(0);
  const [galleryImgs, setGalleryImgs] = useState<{ src: string }[]>([]);

  const currentCourse = useCourseStore((s) => s.currentCourse);
  const currentCoursePack = useCoursePackStore((s) => s.currentCoursePack);
  const user = useUserStore((s) => s.user);

  // Listen for showShareModal event
  useEffect(() => {
    const handleShow = () => setShareModalVisible(true);
    window.addEventListener("showShareModal", handleShow);
    return () => window.removeEventListener("showShareModal", handleShow);
  }, []);

  // Generate share image data when modal opens
  useEffect(() => {
    if (shareModalVisible && currentCourse?.title) {
      const username = user?.username || "";
      const { year, month, day } = getToday();
      const coursePackTitle = currentCoursePack?.title || "";
      const totalRecordNumber = courseTimer.totalRecordNumber();
      const totalTime = formatSecondsToTime(courseTimer.calculateTotalTime());

      // Generate placeholder gallery images
      const placeholderImgs = [
        { src: "" },
        { src: "" },
        { src: "" },
      ];
      setGalleryImgs(placeholderImgs);

      // Generate a simple share image using canvas
      generateShareImage(
        coursePackTitle,
        currentCourse.title,
        username,
        `${year}/${month}/${day}`,
        totalRecordNumber,
        totalTime,
      );
    } else {
      setShareImageSrc("");
      setGalleryImgs([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shareModalVisible]);

  const generateShareImage = useCallback(
    (
      coursePackTitle: string,
      courseTitle: string,
      username: string,
      date: string,
      totalRecordNumber: number,
      totalTime: string,
    ) => {
      const canvas = document.createElement("canvas");
      canvas.width = 400;
      canvas.height = 300;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Background
      ctx.fillStyle = "#6b21a8";
      ctx.fillRect(0, 0, 400, 300);

      // Text
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 20px sans-serif";
      ctx.fillText("Earthworm 学习打卡", 20, 40);

      ctx.font = "16px sans-serif";
      ctx.fillText(`课程包: ${coursePackTitle}`, 20, 80);
      ctx.fillText(`课程: ${courseTitle}`, 20, 110);
      ctx.fillText(`用户: ${username}`, 20, 140);
      ctx.fillText(`日期: ${date}`, 20, 170);
      ctx.fillText(`完成: ${totalRecordNumber} 道题`, 20, 200);
      ctx.fillText(`用时: ${totalTime}`, 20, 230);

      const dataUrl = canvas.toDataURL("image/png");
      setShareImageSrc(dataUrl);

      // Set gallery images
      setGalleryImgs([
        { src: dataUrl },
        { src: dataUrl },
        { src: dataUrl },
      ]);
    },
    [],
  );

  const handleSelectImage = useCallback((index: number) => {
    setCurrImageIndex(index);
    // In a full implementation, this would switch the main display image
  }, []);

  const copyAndClose = useCallback(async () => {
    if (shareImageSrc) {
      try {
        const response = await fetch(shareImageSrc);
        const blob = await response.blob();
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob }),
        ]);
        toast.success("图片已复制到剪贴板");
      } catch {
        toast.error("复制失败，请手动保存图片");
      }
    }
    setShareModalVisible(false);
  }, [shareImageSrc]);

  const hideShareModal = useCallback(() => {
    setShareModalVisible(false);
  }, []);

  if (!shareModalVisible) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={hideShareModal} />
      <div className="relative flex w-full flex-col items-center rounded-lg bg-white p-6 shadow-xl sm:w-[400px] md:w-[448px] lg:w-[496px] dark:bg-gray-800">
        <div className="flex w-full flex-col sm:flex-row">
          <div className="mr-2 flex py-2 sm:flex-col">
            {galleryImgs.map((imgItem, index) => (
              <div
                key={index}
                className={`mb-2 mr-2 h-14 w-14 cursor-pointer overflow-hidden rounded-sm border-2 sm:h-18 sm:w-18 ${
                  currImageIndex === index
                    ? "border-purple-500"
                    : "border-transparent"
                } ${!imgItem.src ? "animate-pulse bg-gray-200 dark:bg-gray-600" : ""}`}
                onClick={() => handleSelectImage(index)}
              >
                {imgItem.src && (
                  <img
                    src={imgItem.src}
                    alt={`Card ${index}`}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
            ))}
          </div>
          <div
            className={`mt-4 flex-1 sm:mt-0 ${!shareImageSrc ? "animate-pulse bg-gray-200 dark:bg-gray-600" : ""}`}
          >
            {shareImageSrc && (
              <img
                src={shareImageSrc}
                alt="Selected Share Image"
                className="h-auto max-h-[600px] w-full rounded-md"
              />
            )}
          </div>
        </div>
        <div className="mt-4 space-x-4">
          <button className="btn btn-primary" onClick={copyAndClose}>
            复制并关闭
          </button>
          <button className="btn" onClick={hideShareModal}>
            关闭
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

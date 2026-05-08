"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";

import ModalHeader from "../common/ModalHeader";

const TOOLBAR_LIST = [
  {
    label: "倍速",
    key: "rate" as const,
    options: [
      { label: "2.0X", value: "2" },
      { label: "1.5X", value: "1.5" },
      { label: "1.0X", value: "1" },
      { label: "0.5X", value: "0.5" },
    ],
  },
  {
    label: "播放次数",
    key: "times" as const,
    options: [
      { label: "4", value: "4" },
      { label: "3", value: "3" },
      { label: "2", value: "2" },
      { label: "1", value: "1" },
    ],
  },
  {
    label: "播放间隔",
    key: "interval" as const,
    options: [
      { label: "10s", value: "10000" },
      { label: "5s", value: "5000" },
      { label: "3s", value: "3000" },
      { label: "1s", value: "1000" },
    ],
  },
];

const TOOLBAR_STORAGE_KEY = "dictationToolbar";

interface ToolBarData {
  rate: string;
  times: string;
  interval: string;
}

const DEFAULT_TOOLBAR_DATA: ToolBarData = {
  rate: "1",
  times: "2",
  interval: "3000",
};

function loadToolBarData(): ToolBarData {
  try {
    const stored = localStorage.getItem(TOOLBAR_STORAGE_KEY);
    if (stored) {
      return { ...DEFAULT_TOOLBAR_DATA, ...JSON.parse(stored) };
    }
  } catch {}
  return { ...DEFAULT_TOOLBAR_DATA };
}

function saveToolBarData(data: ToolBarData) {
  localStorage.setItem(TOOLBAR_STORAGE_KEY, JSON.stringify(data));
}

export default function GameSettingModal() {
  const [showModal, setShowModal] = useState(false);
  const [toolBarData, setToolBarData] = useState<ToolBarData>(DEFAULT_TOOLBAR_DATA);

  // Listen for open event
  useEffect(() => {
    const handleOpen = () => setShowModal(true);
    window.addEventListener("openGameSetting", handleOpen);
    return () => window.removeEventListener("openGameSetting", handleOpen);
  }, []);

  // Load data on mount
  useEffect(() => {
    setToolBarData(loadToolBarData());
  }, []);

  // Save when data changes
  useEffect(() => {
    saveToolBarData(toolBarData);
  }, [toolBarData]);

  const closeModal = useCallback(() => {
    setShowModal(false);
  }, []);

  const handleChange = useCallback((key: keyof ToolBarData, value: string) => {
    setToolBarData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleReset = useCallback(() => {
    setToolBarData({ ...DEFAULT_TOOLBAR_DATA });
  }, []);

  if (!showModal) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={closeModal} />
      <div className="relative flex h-[50vh] max-h-[580px] w-[70vw] max-w-[680px] flex-col rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
        <ModalHeader title="游戏设置" onClose={closeModal} />
        <div className="mt-6 px-4">
          <div className="flex flex-col space-y-4">
            {TOOLBAR_LIST.map((option) => (
              <div
                key={option.key}
                className="flex items-center justify-between"
              >
                <span className="mr-2 text-sm font-medium dark:text-gray-200">
                  {option.label}：
                </span>
                <select
                  value={toolBarData[option.key]}
                  onChange={(e) => handleChange(option.key, e.target.value)}
                  className="select select-bordered select-sm w-32 dark:bg-gray-700 dark:text-white"
                >
                  {option.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-end">
            <button className="btn btn-primary btn-sm" onClick={handleReset}>
              重置
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

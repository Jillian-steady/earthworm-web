"use client";

import Fuse from "fuse.js";
import { useEffect, useMemo, useState } from "react";

import { useMasteredElementsStore } from "@/stores/mastered-elements";

export default function MasteredElementsPage() {
  const masteredElements = useMasteredElementsStore((s) => s.masteredElements);
  const totalMasteredElementsCount = useMasteredElementsStore(
    (s) => s.totalMasteredElementsCount,
  );
  const removeElement = useMasteredElementsStore((s) => s.removeElement);
  const setup = useMasteredElementsStore((s) => s.setup);

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setup();
  }, [setup]);

  const fuse = useMemo(
    () =>
      new Fuse(masteredElements, {
        keys: ["content.english"],
        threshold: 0.4,
      }),
    [masteredElements],
  );

  const filteredItems = useMemo(() => {
    if (!searchQuery) return masteredElements;
    return fuse.search(searchQuery).map((result) => result.item);
  }, [searchQuery, fuse, masteredElements]);

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  }

  function removeItem(item: { id: string }) {
    removeElement(item.id + "");
  }

  return (
    <div className="mx-auto my-8 w-full max-w-screen-lg space-y-3 rounded-lg bg-white px-6 py-8 shadow-even-lg dark:bg-gray-900 dark:shadow-gray-700 md:px-12">
      <div className="mb-4 flex items-center justify-between">
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          type="text"
          placeholder="Search ..."
          className="w-3/4 rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <span className="text-gray-600 dark:text-gray-300">
          Total: {totalMasteredElementsCount()}
        </span>
      </div>
      {filteredItems.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between rounded-lg bg-purple-100 p-4 transition-colors duration-300 hover:bg-purple-200 dark:bg-purple-700 dark:hover:bg-purple-600"
        >
          <div>
            <div className="text-lg font-bold text-purple-800 dark:text-white">
              {item.content.english}
            </div>
            <div className="text-purple-600 dark:text-purple-300">
              Added on {formatDate(item.masteredAt)}
            </div>
          </div>
          <div
            onClick={() => removeItem(item)}
            className="cursor-pointer transition-transform duration-300 hover:scale-110"
            title="删除"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 256 256"
              fill="currentColor"
            >
              <path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z" />
            </svg>
          </div>
        </div>
      ))}
    </div>
  );
}

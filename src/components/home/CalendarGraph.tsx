"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import type { UserLearningDailyTime } from "@/types";

// Calendar data types
interface TableHead {
  colSpan: number;
  month: string;
}

interface TableBody {
  date: Date;
  tips?: string;
  bg?: string;
}

enum ActivityLevel {
  Low = "low",
  Moderate = "moderate",
  High = "high",
  Higher = "higher",
}

const weeksZh: Record<number, string> = {
  0: "周日",
  1: "周一",
  2: "周二",
  3: "周三",
  4: "周四",
  5: "周五",
  6: "周六",
};

const monthsZh: Record<number, string> = {
  0: "一月",
  1: "二月",
  2: "三月",
  3: "四月",
  4: "五月",
  5: "六月",
  6: "七月",
  7: "八月",
  8: "九月",
  9: "十月",
  10: "十一月",
  11: "十二月",
};

interface CalendarGraphProps {
  data: UserLearningDailyTime[];
  totalLearningTime: number;
  onToggleYear?: (year?: number) => void;
  className?: string;
}

function secondToMinutes(second: number) {
  return Math.floor(second / 60);
}

function formatLearningTime(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}小时${minutes}分钟`;
  } else {
    if (minutes === 0) {
      return `不足 1 分钟`;
    } else {
      return `${minutes}分钟`;
    }
  }
}

function getActivityLevel(item: UserLearningDailyTime | undefined): string {
  if (!item) return "";
  const duration = secondToMinutes(item.duration);
  if (duration < 10) return ActivityLevel.Low;
  if (duration < 30) return ActivityLevel.Moderate;
  if (duration < 60) return ActivityLevel.High;
  return ActivityLevel.Higher;
}

function tipFormatter(current: UserLearningDailyTime): string {
  if (current.duration === 0) return `${current.date} 没有学习`;
  let tip = "";
  const minutes = secondToMinutes(current.duration);
  if (minutes < 1) {
    tip = "不足 1 分钟";
  } else {
    tip = ` ${secondToMinutes(current.duration)} 分钟`;
  }
  return `${current.date} 学习${tip}`;
}

function calcStartDate(date: Date = new Date()) {
  const offset = 52 * 7 + (date.getDay() % 7);
  const startDay = date.getDate() - offset;
  return new Date(date.setDate(startDay));
}

function calcDateRange(year?: number) {
  const startDate = year ? new Date(`${year}-01-01`) : calcStartDate(new Date());
  const endDate = year ? new Date(`${year}-12-31`) : new Date();
  return { startDate, endDate };
}

function initTbody(startDate: Date): (null | TableBody)[][] {
  const tbody: (null | TableBody)[][] = [[], [], [], [], [], [], []];
  const week = startDate.getDay();
  for (let i = 0; i < week; i++) {
    tbody[i].push(null);
  }
  return tbody;
}

function renderHead(theadData: { offset: number; month: number }[]): TableHead[] {
  return theadData.map((item, i) => {
    const nextItem = theadData[i + 1] || { offset: 53 };
    const colSpan = nextItem.offset - item.offset;
    const month = monthsZh[item.month]?.slice(0, 3);
    return { colSpan, month };
  });
}

function initData(year?: number) {
  const { startDate, endDate } = calcDateRange(year);

  const tbody: (null | TableBody)[][] = initTbody(startDate);
  const thead: { offset: number; month: number }[] = [];

  let theadLen = 12;
  const nextDate = new Date(+startDate);
  while (nextDate <= endDate) {
    const month = nextDate.getMonth();
    const week = nextDate.getDay();
    const day = nextDate.getDate();

    if (day === 1 && thead.length < theadLen) {
      const rowIndex = week;
      const preRowIndex = rowIndex - 1;
      const colIndex = tbody[rowIndex].length;
      const nonCurrentMonthDate =
        tbody[preRowIndex] && tbody[preRowIndex][colIndex] !== null;
      const offset = nonCurrentMonthDate ? colIndex + 1 : colIndex;

      const isFirstTh = thead.length === 0;
      if (isFirstTh && offset !== 0) {
        const preTH = { offset: 0, month: (month || 12) - 1 };
        if (offset < 3) {
          preTH.month = -1;
          theadLen = 13;
        } else if (offset === 3) {
          theadLen = 13;
        }
        thead.push(preTH);
      }

      thead.push({ offset, month });
    }

    tbody[week].push({ date: new Date(+nextDate) });
    nextDate.setDate(day + 1);
  }

  return { thead, tbody };
}

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function renderBody(
  tbodyData: (null | TableBody)[][],
  list: UserLearningDailyTime[],
) {
  return tbodyData.map((row) => {
    return row.map((item) => {
      if (!item) return null;

      const date = formatDate(item.date);
      const current = list.find((f) => f.date === date);
      const bg = getActivityLevel(current);
      const tips = tipFormatter(current || { date, duration: 0 });

      return { date: item.date, tips, bg };
    });
  });
}

// Cell style classes mapped to Tailwind
const cellBaseClass =
  "h-[12px] w-[12px] rounded-sm border-gray-200 bg-gray-200 hover:scale-125 hover:border hover:border-blue-400 dark:bg-gray-700 dark:hover:border-gray-50";

const levelClasses: Record<string, string> = {
  low: "bg-[#9be9a8] dark:bg-[#0e4429]",
  moderate: "bg-[#40c463] dark:bg-[#006d32]",
  high: "bg-[#30a14e] dark:bg-[#26a641]",
  higher: "bg-[#216e39] dark:bg-[#39d353]",
};

export default function CalendarGraph({
  data,
  totalLearningTime,
  onToggleYear,
  className = "",
}: CalendarGraphProps) {
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [thead, setThead] = useState<TableHead[]>([]);
  const [tbody, setTbody] = useState<(null | TableBody)[][]>([]);

  // Year options
  const yearOptions = useMemo(() => {
    const options: { label: string; value: number }[] = [];
    for (let i = 2024; i <= new Date().getFullYear(); i++) {
      options.unshift({ label: i.toString(), value: i });
    }
    return options;
  }, []);

  // Initialize table
  useEffect(() => {
    onToggleYear?.();
    const result = initData();
    setThead(renderHead(result.thead));
    setTbody(result.tbody);
  }, []);

  // Scroll to right on mount
  useEffect(() => {
    if (tableContainerRef.current) {
      tableContainerRef.current.scrollLeft =
        tableContainerRef.current.scrollWidth;
    }
  }, [thead]);

  // Render body when data changes
  const renderedBody = useMemo(() => {
    if (tbody.length === 0) return [];
    return renderBody(tbody, data);
  }, [tbody, data]);

  return (
    <div className={`flex justify-between ${className}`}>
      {/* Calendar graph */}
      <div className="min-w-0 flex-1 rounded-md border border-gray-300 px-2 py-4 text-xs dark:border-gray-700">
        <div className="w-full overflow-x-auto" ref={tableContainerRef}>
          <table className="mx-auto mb-2">
            <thead>
              <tr>
                <th></th>
                {thead.map((item, idx) => (
                  <th
                    key={`${item.month}-${idx}`}
                    colSpan={item.colSpan}
                    className="pb-1 text-left font-normal"
                  >
                    {item.month}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {renderedBody.map((row, i) => (
                <tr key={weeksZh[i]}>
                  <td className="relative hidden w-8 md:block">
                    <span className="absolute">
                      {i % 2 !== 0 ? weeksZh[i] : ""}
                    </span>
                  </td>
                  {row.map((cell, j) => (
                    <td key={j}>
                      <div
                        className={`block ${cellBaseClass} ${cell?.bg ? levelClasses[cell.bg] || "" : ""}`}
                        title={cell?.tips}
                      ></div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-2 flex justify-between px-1">
          <span className="justify-self-end text-sm dark:text-gray-400">
            {totalLearningTime > 0 ? "一共学习" : "还没有开始学习"}
            {totalLearningTime > 0 && (
              <span className="font-semibold text-purple-500">
                {formatLearningTime(totalLearningTime)}
              </span>
            )}
          </span>
          <div className="flex items-center gap-1 text-xs">
            <div className="text-gray-500">更少</div>
            <div className={`block ${cellBaseClass}`}></div>
            <div className={`block ${cellBaseClass} ${levelClasses.low}`}></div>
            <div className={`block ${cellBaseClass} ${levelClasses.moderate}`}></div>
            <div className={`block ${cellBaseClass} ${levelClasses.high}`}></div>
            <div className={`block ${cellBaseClass} ${levelClasses.higher}`}></div>
            <div className="text-gray-500">更多</div>
          </div>
        </div>
      </div>

      {/* Year options */}
      {yearOptions.map((year) => (
        <div
          key={year.value}
          className="btn btn-sm tw-btn-blue ml-6 hidden pr-7 xl:flex"
        >
          {year.label}
        </div>
      ))}
    </div>
  );
}

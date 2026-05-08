"use client";

import dayjs from "dayjs";
import { useMemo, useRef, useState } from "react";

const weeks: Record<number, string> = {
  0: "Sun",
  1: "Mon",
  2: "Tue",
  3: "Wed",
  4: "Thu",
  5: "Fri",
  6: "Sat",
};
const weeksZh: Record<number, string> = {
  0: "周日",
  1: "周一",
  2: "周二",
  3: "周三",
  4: "周四",
  5: "周五",
  6: "周六",
};
const months: Record<number, string> = {
  0: "January",
  1: "February",
  2: "March",
  3: "April",
  4: "May",
  5: "June",
  6: "July",
  7: "August",
  8: "September",
  9: "October",
  10: "November",
  11: "December",
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

export interface CalendarDataItem {
  date: string;
  duration: number;
}

export interface CalendarConfig {
  getActivityLevel: (item: CalendarDataItem | undefined) => string;
  tipFormatter: (item: CalendarDataItem) => string;
}

interface Options {
  label: string;
  value: number;
}
interface TableHead {
  colSpan: number;
  month: string;
}
interface TableBody {
  date: Date;
  tips?: string;
  bg?: string;
}

export function useCalendarGraph(
  onToggleYear: (year?: number) => void,
  config: CalendarConfig
) {
  const [year, setYear] = useState<number | undefined>();
  const [yearOptions, setYearOptions] = useState<Options[]>(() => {
    const options: Options[] = [];
    for (let i = 2024; i <= new Date().getFullYear(); i++) {
      options.unshift({ label: i.toString(), value: i });
    }
    return options;
  });
  const [thead, setThead] = useState<TableHead[]>([]);
  const [tbody, setTbody] = useState<(null | TableBody)[][]>([]);

  function format(date: Date) {
    return date.toISOString().slice(0, 10);
  }

  function getOrdinalSuffix(day: number) {
    const lastTwoDigits = day % 100;
    if ([11, 12, 13].includes(lastTwoDigits)) return "th";
    const lastDigit = day % 10;
    if ([1, 2, 3].includes(lastDigit))
      return { 1: "st", 2: "nd", 3: "rd" }[lastDigit] as string;
    return "th";
  }

  function getActivityLevel(count?: number) {
    if (!count) return "";
    if (count < 3) return "low";
    if (count < 5) return "moderate";
    if (count < 10) return "high";
    return "higher";
  }

  function renderBody(currentTbody: (null | TableBody)[][], list: CalendarDataItem[]) {
    return currentTbody.map((row) => {
      return row.map((item) => {
        if (!item) return null;

        const date = dayjs(item.date).format("YYYY-MM-DD");
        const current = list.find((f) => f.date === date);
        const bg = config.getActivityLevel(current);
        const tips = config.tipFormatter(current || { date, duration: 0 });

        return { date: item.date, tips, bg };
      });
    });
  }

  function renderHead(theadData: { offset: number; month: number }[]) {
    return theadData.map((item, i) => {
      const nextItem = theadData[i + 1] || { offset: 53 };
      const colSpan = nextItem.offset - item.offset;
      const month = monthsZh[item.month]?.slice(0, 3);
      return { colSpan, month };
    });
  }

  function calcStartDate(date: Date = new Date()) {
    const offset = 52 * 7 + (date.getDay() % 7);
    const startDay = date.getDate() - offset;
    return new Date(date.setDate(startDay));
  }

  function calcDateRange(selectedYear?: number) {
    const startDate = selectedYear
      ? new Date(`${selectedYear}-01-01`)
      : calcStartDate(new Date());
    const endDate = selectedYear ? new Date(`${selectedYear}-12-31`) : new Date();
    return { startDate, endDate };
  }

  function initTbody(startDate: Date) {
    const tbodyData: (null | TableBody)[][] = [[], [], [], [], [], [], []];
    const week = startDate.getDay();
    for (let i = 0; i < week; i++) {
      tbodyData[i].push(null);
    }
    return tbodyData;
  }

  function initData(selectedYear?: number) {
    const { startDate, endDate } = calcDateRange(selectedYear);

    const tbodyData: (null | TableBody)[][] = initTbody(startDate);
    const theadData: { offset: number; month: number }[] = [];

    let theadLen = 12;
    const nextDate = new Date(+startDate);
    while (nextDate <= endDate) {
      const month = nextDate.getMonth();
      const week = nextDate.getDay();
      const day = nextDate.getDate();

      if (day === 1 && theadData.length < theadLen) {
        const rowIndex = week;
        const preRowIndex = rowIndex - 1;
        const colIndex = tbodyData[rowIndex].length;
        const nonCurrentMonthDate =
          tbodyData[preRowIndex] && tbodyData[preRowIndex][colIndex] !== null;
        const offset = nonCurrentMonthDate ? colIndex + 1 : colIndex;

        const isFirstTh = theadData.length === 0;
        if (isFirstTh && offset !== 0) {
          const preTH = { offset: 0, month: (month || 12) - 1 };
          if (offset < 3) {
            preTH.month = -1;
            theadLen = 13;
          } else if (offset === 3) {
            theadLen = 13;
          }
          theadData.push(preTH);
        }

        theadData.push({ offset, month });
      }

      tbodyData[week].push({ date: new Date(+nextDate) });

      nextDate.setDate(day + 1);
    }

    return { thead: theadData, tbody: tbodyData };
  }

  function initTable(value?: number) {
    onToggleYear(value);
    setYear(value);
    const data = initData(value);
    setThead(renderHead(data.thead));
    setTbody(data.tbody);
  }

  return {
    format,
    calcStartDate,
    calcDateRange,
    getActivityLevel,
    getOrdinalSuffix,
    initTable,
    initTbody,
    initData,
    renderHead,
    renderBody,
    weeks,
    weeksZh,
    thead,
    tbody,
    year,
    yearOptions,
  };
}

import { describe, expect, it, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";

import type { CalendarConfig, CalendarDataItem } from "@/hooks/useCalendarGraph";
import { useCalendarGraph } from "@/hooks/useCalendarGraph";

describe("use calendar graph", () => {
  const onToggleYear = vi.fn();
  const config: CalendarConfig = {
    getActivityLevel: (item) => {
      if (!item) return "";
      const count = item.duration;
      if (count < 3) return "low";
      if (count < 5) return "moderate";
      if (count < 10) return "high";
      return "higher";
    },
    tipFormatter: (item) => `${item.duration}次学习, ${item.date}`,
  };

  function setup() {
    return renderHook(() => useCalendarGraph(onToggleYear, config));
  }

  it("should return the formatted date", () => {
    const { result } = setup();
    const date = result.current.format(new Date("2024-01-01"));
    expect(date).toBe("2024-01-01");
  });

  it.each([
    [1, "st"],
    [2, "nd"],
    [3, "rd"],
    [4, "th"],
    [11, "th"],
    [12, "th"],
    [13, "th"],
    [21, "st"],
    [22, "nd"],
    [23, "rd"],
    [31, "st"],
  ])("%s should return the suffix %s", (day, expected) => {
    const { result } = setup();
    expect(result.current.getOrdinalSuffix(day)).toBe(expected);
  });

  it.each([
    [1, "low"],
    [3, "moderate"],
    [5, "high"],
    [10, "higher"],
  ])("%s should return the activity level %s", (day, expected) => {
    const { result } = setup();
    expect(result.current.getActivityLevel(day)).toBe(expected);
  });

  it("should return the start date for graph", () => {
    const { result } = setup();
    const date = result.current.calcStartDate(new Date("2024-03-11"));
    expect(result.current.format(date)).toBe("2023-03-12");
  });

  it("should return the date range for 2024", () => {
    const { result } = setup();
    const { startDate, endDate } = result.current.calcDateRange(2024);
    expect(result.current.format(startDate)).toBe("2024-01-01");
    expect(result.current.format(endDate)).toBe("2024-12-31");
  });

  it("should return the date range for today to last year", () => {
    const { result } = setup();
    const start = result.current.calcStartDate(new Date());
    const end = new Date();
    const { startDate, endDate } = result.current.calcDateRange();
    expect(result.current.format(startDate)).toBe(result.current.format(start));
    expect(result.current.format(endDate)).toBe(result.current.format(end));
  });

  it("should return initialized table body data", () => {
    const { result } = setup();
    const sundayStart = result.current.initTbody(new Date("2023-01-01")); // sunday
    const wednesdayStart = result.current.initTbody(new Date("2020-01-01")); // wednesday
    expect(sundayStart).toEqual([[], [], [], [], [], [], []]);
    expect(wednesdayStart).toEqual([[null], [null], [null], [], [], [], []]);
  });

  it("should return initialized table data", () => {
    const { result } = setup();
    const { thead, tbody } = result.current.initData(2024);
    expect(thead).toEqual([
      { offset: 0, month: 0 },
      { offset: 5, month: 1 },
      { offset: 9, month: 2 },
      { offset: 14, month: 3 },
      { offset: 18, month: 4 },
      { offset: 22, month: 5 },
      { offset: 27, month: 6 },
      { offset: 31, month: 7 },
      { offset: 35, month: 8 },
      { offset: 40, month: 9 },
      { offset: 44, month: 10 },
      { offset: 48, month: 11 },
    ]);
    expect(tbody[0].length).toBe(53);
    expect(result.current.format(tbody[1][0]!.date)).toBe("2024-01-01");
  });

  it("should initial table", () => {
    const { result } = setup();
    act(() => {
      result.current.initTable(2024);
    });
    expect(onToggleYear).toHaveBeenCalledWith(2024);
  });

  it("should return render table header data", () => {
    const { result } = setup();
    const { thead } = result.current.initData(2024);
    const data = result.current.renderHead(thead);
    expect(data).toEqual([
      { colSpan: 5, month: "一月" },
      { colSpan: 4, month: "二月" },
      { colSpan: 5, month: "三月" },
      { colSpan: 4, month: "四月" },
      { colSpan: 4, month: "五月" },
      { colSpan: 5, month: "六月" },
      { colSpan: 4, month: "七月" },
      { colSpan: 4, month: "八月" },
      { colSpan: 5, month: "九月" },
      { colSpan: 4, month: "十月" },
      { colSpan: 4, month: "十一月" },
      { colSpan: 5, month: "十二月" },
    ]);
  });

  it("should return render table body data", () => {
    const { result } = setup();

    // Initialize the table for 2024 to get tbody
    const { tbody: tbodyData } = result.current.initData(2024);

    const apiData: CalendarDataItem[] = [
      { date: "2024-01-01", duration: 1 },
      { date: "2024-01-02", duration: 3 },
      { date: "2024-01-03", duration: 5 },
      { date: "2024-01-04", duration: 10 },
    ];
    const tbody = result.current.renderBody(tbodyData, apiData);
    expect(tbody[1][0]?.tips).toBe("1次学习, 2024-01-01");
    expect(tbody[1][0]?.bg).toBe("low");
    expect(tbody[2][0]?.tips).toBe("3次学习, 2024-01-02");
    expect(tbody[2][0]?.bg).toBe("moderate");
    expect(tbody[3][0]?.tips).toBe("5次学习, 2024-01-03");
    expect(tbody[3][0]?.bg).toBe("high");
    expect(tbody[4][0]?.tips).toBe("10次学习, 2024-01-04");
    expect(tbody[4][0]?.bg).toBe("higher");
  });
});

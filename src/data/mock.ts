// Mock data for standalone frontend deployment (no backend required)
// Activated when MOCK_MODE=true or API_BACKEND_URL is not set

import { courseStatements } from "./mock-statements";

export const isMockMode =
  process.env.NEXT_PUBLIC_MOCK_MODE === "true" || !process.env.API_BACKEND_URL;

// ============ Course Pack ============

const COURSE_PACK_ID = "vrhje46xwpphw1aegwhn4ie6";

// 55 courses with real IDs
const courseList = [
  { id: "lepslwzcyyykktudkyxyjwh1", title: "第一课", order: 1 },
  { id: "vcmq10obgfsqcgrex3dynloy", title: "第二课", order: 2 },
  { id: "l5muhgc6evdt692y6oi33cs7", title: "第三课", order: 3 },
  { id: "yyw9daf9t33xsaqdq7pz2j2j", title: "第四课", order: 4 },
  { id: "rd9h6tfp8lqb0k3z1l8ks4o7", title: "第五课", order: 5 },
  { id: "n7jp4pe3czmcf715mv5n0s4q", title: "第六课", order: 6 },
  { id: "agczgs2c63mzvcmmi53k0jtt", title: "第七课", order: 7 },
  { id: "hsatfsshn3qqt77fcmiijrtd", title: "第八课", order: 8 },
  { id: "xbur0q710co67gncvj9i330q", title: "第九课", order: 9 },
  { id: "ukj06sl811ylesd18b0wlerl", title: "第十课", order: 10 },
  { id: "au397em04aim0kr5c3d14ufb", title: "第十一课", order: 11 },
  { id: "jojsb0cfjwd9m5esgec85379", title: "第十二课", order: 12 },
  { id: "cv8gfoh9k6fmgu1uvkabuihy", title: "第十三课", order: 13 },
  { id: "sgyxuc11swdqtaqny068gdzq", title: "第十四课", order: 14 },
  { id: "fuwq13h87f004rwmqfvw7dzh", title: "第十五课", order: 15 },
  { id: "a5ujk7p08zybqaf7e9jxrlw7", title: "第十六课", order: 16 },
  { id: "e6w2m5cj9qkr75v0pjghlmy8", title: "第十七课", order: 17 },
  { id: "evvdzccdrc7kejz7je3ptl8a", title: "第十八课", order: 18 },
  { id: "r7zteaocyamerofjw32y2qwr", title: "第十九课", order: 19 },
  { id: "reofvn9ws1ex5d8l7j7avlzo", title: "第二十课", order: 20 },
  { id: "yzzx8lvn5mmltnuf5a32oxbg", title: "第二十一课", order: 21 },
  { id: "f2400dltr6oxy3l2zdh9onu4", title: "第二十二课", order: 22 },
  { id: "g882gq2l84y07s0d8pjk6sgu", title: "第二十三课", order: 23 },
  { id: "qurcd2av7ngp15bjauprhb4r", title: "第二十四课", order: 24 },
  { id: "q78b1dtgxdzrrs55ia2oe1vk", title: "第二十五课", order: 25 },
  { id: "q24yd3dh7i3mwpzcd9f09w60", title: "第二十六课", order: 26 },
  { id: "c2r32orjereqs480l07p4933", title: "第二十七课", order: 27 },
  { id: "rh1ezi36ue1s94kloivfqj4f", title: "第二十八课", order: 28 },
  { id: "qu4exjyt6mfgrjuit70vy48t", title: "第二十九课", order: 29 },
  { id: "nyp733i5on0jbl39so00jwbn", title: "第三十课", order: 30 },
  { id: "a8mtnwr6sx7h48a3tv6jdnm9", title: "第三十一课", order: 31 },
  { id: "uwy1mhmpf230r8oplholjewq", title: "第三十二课", order: 32 },
  { id: "a2uyz1b74xneh858clwjjh2x", title: "第三十三课", order: 33 },
  { id: "x6kdnss5n5ytn40yi77gri4q", title: "第三十四课", order: 34 },
  { id: "w9k880sg3flxcpkdp9s8218l", title: "第三十五课", order: 35 },
  { id: "a5cn3cplznmfepjwud5bwfhg", title: "第三十六课", order: 36 },
  { id: "x91nfqwh1npyb2g4qfruejip", title: "第三十七课", order: 37 },
  { id: "eglrd0z90b3ir6f7tr4mjcm3", title: "第三十八课", order: 38 },
  { id: "v0ootk7z79jteslemp60d2e7", title: "第三十九课", order: 39 },
  { id: "iejrgouxl2dzcvkbx0kqaidu", title: "第四十课", order: 40 },
  { id: "dcio90b9v392kd3rd1kle9i8", title: "第四十一课", order: 41 },
  { id: "hxt1k3ru5xjskw6pcg14qkwj", title: "第四十二课", order: 42 },
  { id: "qgksa4moe8o0lx5krvon2wld", title: "第四十三课", order: 43 },
  { id: "zgr1pmhe7mwb0p3337iw5zu6", title: "第四十四课", order: 44 },
  { id: "k25ud8dc87bpc8ogqngt5l1w", title: "第四十五课", order: 45 },
  { id: "kpeqqhp9qzdxhm27ljamiyd2", title: "第四十六课", order: 46 },
  { id: "j76vwznmcxme1kzau02yvp8h", title: "第四十七课", order: 47 },
  { id: "t1ycpined8dssrj2vzlyj249", title: "第四十八课", order: 48 },
  { id: "eqalaj2c6d33ybiifb3miohw", title: "第四十九课", order: 49 },
  { id: "ochbc55k95b6s56h2kxzkeg2", title: "第五十课", order: 50 },
  { id: "nd93v2qyqhajk05z3zm7s1a1", title: "第五十一课", order: 51 },
  { id: "h9d9or05toqn7d6pjgvkfzf4", title: "第五十二课", order: 52 },
  { id: "vfr7n05yc3b7t1mft3l3qg05", title: "第五十三课", order: 53 },
  { id: "j06biuk7lbcsdnim0pn2mncy", title: "第五十四课", order: 54 },
  { id: "vfrcpcmj4nr8wkndbd5g6c9p", title: "第五十五课", order: 55 },
];

// ============ Build course objects ============

// Course list for pack detail (without statements)
const coursesForPack = courseList.map((c) => ({
  id: c.id,
  title: c.title,
  description: "",
  video: "",
  order: c.order,
  coursePackId: COURSE_PACK_ID,
}));

// Full course with statements (for individual course API)
function buildFullCourse(courseId: string) {
  const course = courseList.find((c) => c.id === courseId);
  if (!course) return null;

  return {
    id: course.id,
    title: course.title,
    description: "",
    order: course.order,
    statements: courseStatements[courseId] || [],
    coursePackId: COURSE_PACK_ID,
    completionCount: 0,
    statementIndex: 0,
    video: "",
  };
}

// ============ Exported Mock Data ============

export const mockCoursePacks = [
  {
    id: COURSE_PACK_ID,
    order: 1,
    title: "星荣零基础学英语",
    description: "最适合零基础入门的课程",
    isFree: true,
    cover:
      "https://earthworm-prod-1312884695.cos.ap-beijing.myqcloud.com/course-packs/xingrong.jpg",
  },
];

export const mockCoursePackDetails: Record<string, object> = {
  [COURSE_PACK_ID]: {
    id: COURSE_PACK_ID,
    order: 1,
    title: "星荣零基础学英语",
    description: "最适合零基础入门的课程",
    isFree: true,
    cover:
      "https://earthworm-prod-1312884695.cos.ap-beijing.myqcloud.com/course-packs/xingrong.jpg",
    courses: coursesForPack,
  },
};

export function getMockCourse(coursePackId: string, courseId: string) {
  if (coursePackId !== COURSE_PACK_ID) return null;
  return buildFullCourse(courseId);
}

// Build next course map for completion flow
const courseOrderMap: Record<string, { coursePackId: string; courseId: string }> =
  {};
for (let i = 0; i < courseList.length - 1; i++) {
  courseOrderMap[`${COURSE_PACK_ID}:${courseList[i].id}`] = {
    coursePackId: COURSE_PACK_ID,
    courseId: courseList[i + 1].id,
  };
}

export function getMockNextCourse(coursePackId: string, courseId: string) {
  return (
    courseOrderMap[`${coursePackId}:${courseId}`] || {
      coursePackId,
      courseId,
    }
  );
}

// ============ User ============

export const mockUser = {
  id: "mock-user-001",
  username: "Earthworm学员",
  avatar: "",
  email: "",
  membership: {
    isMember: false,
    details: null,
  },
};

// ============ Rankings ============

function generateRankList(period: string) {
  const names = [
    "学习达人",
    "英语小能手",
    "每日坚持",
    "进步之星",
    "勤奋学员",
  ];
  return {
    list: names.map((name, i) => ({
      username: name,
      count: Math.max(100 - i * 15, 20),
    })),
    self: {
      username: "Earthworm学员",
      count: 42,
      rank: 6,
    },
    period,
  };
}

export const mockRankings: Record<string, object> = {
  weekly: generateRankList("weekly"),
  monthly: generateRankList("monthly"),
  yearly: generateRankList("yearly"),
};

// ============ Daily Sentence ============

export const mockDailySentence = {
  zh: "学习一门语言就是多一个观察世界的窗户。",
  en: "To learn a language is to have one more window from which to look at the world.",
};

// ============ Learning Activities (last 30 days) ============

export function getMockLearningActivities() {
  const activities = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    const duration = i % 3 === 0 ? 0 : Math.floor(Math.random() * 3600) + 300;
    activities.push({ date: dateStr, duration });
  }
  return activities;
}

export const mockTotalLearningTime = { totalDuration: 36000 };

// ============ Course History ============

export function getMockCourseHistory(coursePackId: string) {
  if (coursePackId !== COURSE_PACK_ID) return [];
  return courseList.map((c) => ({
    courseId: c.id,
    completionCount: 0,
  }));
}

// ============ Recent Course Packs ============

export const mockRecentCoursePacks = [
  {
    id: 1,
    coursePackId: COURSE_PACK_ID,
    courseId: courseList[0].id,
    title: "星荣零基础学英语",
    description: "最适合零基础入门的课程",
    cover:
      "https://earthworm-prod-1312884695.cos.ap-beijing.myqcloud.com/course-packs/xingrong.jpg",
    isFree: true,
  },
];

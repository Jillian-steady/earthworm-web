import type { ShareImageTemplateData } from "@/hooks/useShareImage";

export const tpl_1 = ({
  zhSentence,
  enSentence,
  coursePackTitle,
  courseTitle,
  totalRecordNumber,
  totalTime,
}: ShareImageTemplateData) => {
  return {
    type: "div",
    props: {
      tw: "w-full h-full bg-[#EEA2A4] px-8 pt-8 flex flex-col items-center tracking-normal font-sans",
      children: [
        {
          type: "div",
          props: {
            tw: "bg-white rounded-xl flex-1 w-full flex flex-col px-2 py-4 mb-6 shadow-xl",
            children: [
              {
                type: "div",
                props: {
                  tw: "text-6xl font-bold flex",
                  children: "\u201C",
                },
              },
              {
                type: "span",
                props: {
                  tw: "text-slate-400 font-bold text-2xl",
                  children: `${coursePackTitle}`,
                },
              },
              {
                type: "span",
                props: {
                  tw: "text-slate-400 font-bold text-2xl",
                  children: `${courseTitle}`,
                },
              },
              {
                type: "div",
                props: {
                  tw: "text-slate-400 text-lg mb-6",
                  children: `恭喜您一共完成 ${totalRecordNumber} 道题，用时${totalTime}`,
                },
              },
              {
                type: "div",
                props: {
                  tw: "flex-1 flex flex-col font-bold text-slate-600 text-lg leading-snug italic font-serif text-2xl",
                  style: {
                    fontFamily:
                      '"EBGaramond", "SourceHanSerifSCBold" , sans-serif',
                  },
                  children: [
                    {
                      type: "div",
                      props: {
                        tw: "mb-2",
                        children: enSentence,
                      },
                    },
                    {
                      type: "div",
                      props: {
                        children: zhSentence,
                      },
                    },
                  ],
                },
              },
              {
                type: "div",
                props: {
                  tw: "text-6xl font-bold flex justify-end",
                  children: "\u201D",
                },
              },
            ],
          },
        },
        {
          type: "img",
          props: {
            src: "/logo.png",
            width: "48",
            height: "48",
            alt: "Earthworm logo",
          },
        },
        {
          type: "p",
          props: {
            tw: "text-lg mb-2",
            children: "\u00A9 earthworm.cuixueshe.com",
          },
        },
      ],
    },
  };
};

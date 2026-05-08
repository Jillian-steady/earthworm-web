"use client";

import Divider from "@/components/common/Divider";
import Title from "@/components/common/Title";
import CommentsList from "@/data/comments.json";
import { formatTimestamp } from "@/utils/date";

interface CommentItem {
  nickname: string;
  account: string;
  avatar: string;
  link: string;
  comment: string;
  chinese: string;
  time: number;
  likeCount: number;
}

export default function Comments() {
  const comments = CommentsList as CommentItem[];

  return (
    <>
      <section className="flex flex-col pt-24">
        <div className="mx-auto max-w-screen-xl">
          <Title
            title="用户反馈"
            description={["如果您正在使用 Earthworm ，请随时在 Twitter 上向我们提供您的反馈!"]}
          />
          <div className="mt-8 sm:columns-2 sm:gap-6 lg:columns-3 lg:gap-8">
            {comments.map((item, index) => (
              <div key={index} className="mb-8 sm:break-inside-avoid">
                <blockquote className="cursor-pointer overflow-hidden rounded-lg bg-white shadow-lg transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/50 dark:bg-[#111128] dark:hover:shadow-blue-400/50">
                  <div className="flex h-full flex-col justify-between p-6">
                    <div className="flex items-center gap-4">
                      <img
                        src={item.avatar}
                        alt=""
                        className="h-12 w-12 rounded-full border-2 border-purple-400 object-cover p-1 lg:h-14 lg:w-14"
                      />
                      <div className="flex-grow">
                        <p className="mt-0.5 text-lg font-bold dark:text-white">
                          {item.nickname}
                        </p>
                        <p className="text-xs text-gray-500">
                          @{item.account}
                        </p>
                      </div>
                      <svg
                        className="h-6 w-6 self-start text-[#03a9f4]"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                      </svg>
                    </div>
                    <p className="mt-4 text-sm text-gray-700 dark:text-gray-300 lg:text-base">
                      {item.chinese}
                    </p>
                    <div className="my-2 flex items-center justify-between">
                      <div className="text-xs text-gray-500">
                        {formatTimestamp({ timestamp: item.time })}
                      </div>
                    </div>
                    <div className="mx-auto my-4"></div>
                    <div className="mt-4 flex items-center justify-between text-xs">
                      <div className="flex items-center">
                        <svg
                          className="mr-2 h-5 w-5 fill-current text-pink-300 dark:text-blue-300"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                        <span className="text-gray-500 dark:text-gray-400">
                          {item.likeCount} likes
                        </span>
                      </div>
                      <span
                        className="text-blue-500 dark:text-blue-400"
                        aria-disabled="true"
                        style={{ pointerEvents: "none" }}
                      >
                        See {item.account}&apos;s
                      </span>
                    </div>
                  </div>
                </blockquote>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Divider />
    </>
  );
}

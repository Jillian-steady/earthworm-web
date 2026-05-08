"use client";

interface NoticeBarProps {
  mainTitle?: string;
  subTitle?: string;
  link?: string;
  btnText?: string;
}

export default function NoticeBar({
  mainTitle = "Earthworm is now available!",
  subTitle = "Start your English learning journey now!",
  link = "https://github.com/cuixueshe/earthworm",
  btnText = "Learn More",
}: NoticeBarProps) {
  return (
    <div className="w-full">
      <div className="rounded-md bg-purple-200 px-4 py-1.5 text-white dark:bg-gray-800 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p className="text-center font-medium text-black dark:text-white sm:text-left">
          {mainTitle}
          <br className="sm:hidden" />
          {subTitle}
        </p>
        <a
          className="mt-4 block rounded-lg bg-white px-5 py-3 text-center text-sm font-medium text-purple-600 transition hover:bg-white/90 hover:text-pink-500 focus:outline-none focus:ring active:text-pink-500 sm:mt-0"
          href={link}
        >
          {btnText}
        </a>
      </div>
    </div>
  );
}

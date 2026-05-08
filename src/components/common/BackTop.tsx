"use client";

import { usePathname, useRouter } from "next/navigation";

export default function BackTop() {
  const pathname = usePathname();
  const router = useRouter();

  const scrollToTop = () => {
    if (pathname === "/") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } else {
      router.push("/");
    }
  };

  const label = pathname === "/" ? "Back to Top" : "Go to Home";

  return (
    <button
      className="back-top-button cursor-pointer bg-white transition-all duration-300 dark:bg-[#05051d]"
      data-content={label}
      onClick={scrollToTop}
    >
      <svg
        className="back-top-icon h-5 w-5 fill-black transition-all duration-300 dark:fill-white"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 256 256"
      >
        <path d="M205.66,117.66a8,8,0,0,1-11.32,0L136,59.31V216a8,8,0,0,1-16,0V59.31L61.66,117.66a8,8,0,0,1-11.32-11.32l80-80a8,8,0,0,1,11.32,0l80,80A8,8,0,0,1,205.66,117.66Z" />
      </svg>

      <style jsx>{`
        .back-top-button {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          border: none;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0px 0px 0px 4px rgba(180, 160, 255, 0.253);
          cursor: pointer;
          transition-duration: 0.3s;
          overflow: hidden;
          position: relative;
        }
        .back-top-button:hover {
          width: 140px;
          border-radius: 50px;
          transition-duration: 0.3s;
          background-color: rgb(181, 160, 255);
          align-items: center;
        }
        .back-top-button:hover .back-top-icon {
          transition-duration: 0.3s;
          opacity: 0;
        }
        .back-top-button::before {
          position: absolute;
          bottom: -20px;
          content: attr(data-content);
          color: white;
          font-size: 0px;
        }
        .back-top-button:hover::before {
          font-size: 13px;
          opacity: 1;
          bottom: unset;
          transition-duration: 0.3s;
        }
      `}</style>
    </button>
  );
}

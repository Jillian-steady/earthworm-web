"use client";

import { useRouter } from "next/navigation";

import Divider from "@/components/common/Divider";
import { isAuthenticated } from "@/services/auth";

export default function Banner() {
  const router = useRouter();

  function handleStartEarthworm() {
    if (!isAuthenticated()) {
      router.push("/course-pack");
    }
  }

  return (
    <section className="pt-28 text-gray-500" id="home">
      <div className="mx-auto my-5 text-center">
        <h2 className="bg-gradient-to-r from-purple-600 to-gray-200 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent dark:from-purple-600 dark:to-gray-100 lg:text-4xl xl:text-5xl">
          让你上瘾的英语学习工具
        </h2>

        <div className="mt-5 text-sm md:text-base xl:text-lg">
          <p className="pt-2 text-center text-gray-500 dark:text-gray-300 lg:text-xl">
            使用<span className="text-purple-400 dark:text-purple-200"> 连词成句 </span>、
            <span className="text-purple-400 dark:text-purple-200"> i + 1 </span>、
            <span className="text-purple-400 dark:text-purple-200"> 以终为始 </span>
            等学习理论来帮助你习得英语
          </p>
          <p className="pt-2 text-center text-gray-500 dark:text-gray-300 lg:text-xl">
            通过不断的<span className="text-purple-400 dark:text-purple-200"> 重复 </span>形成肌肉记忆
          </p>
          <p className="pt-2 text-center text-gray-500 dark:text-gray-300 lg:text-xl">
            最重要的是<span className="text-purple-400 dark:text-purple-200"> 游戏化 </span>
            的形式让学习英语从此不再痛苦
          </p>
        </div>
      </div>

      <div className="my-10 flex flex-wrap items-center justify-center gap-4 font-customFont">
        <button
          onClick={handleStartEarthworm}
          className="banner-btn relative"
          type="button"
        >
          <strong>开启Earthworm</strong>
          <div id="container-stars">
            <div id="stars"></div>
          </div>
          <div id="glow">
            <div className="circle"></div>
            <div className="circle"></div>
          </div>
        </button>

        <a
          href="https://github.com/cuixueshe/earthworm"
          rel="noreferrer noopener"
          target="_blank"
          className="group relative inline-flex h-12 cursor-pointer items-center justify-center overflow-hidden rounded-full px-6 duration-500"
        >
          <div className="relative inline-flex -translate-x-0 items-center transition group-hover:-translate-x-6">
            <div className="absolute flex translate-x-0 items-center justify-center text-purple-600 opacity-100 transition group-hover:-translate-x-6 group-hover:opacity-0">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
            <span className="bg-gradient-to-r from-purple-600 to-gray-300 bg-clip-text pl-6 font-medium text-transparent">
              Star us on GitHub
            </span>
            <div className="absolute right-0 flex translate-x-12 items-center justify-center text-purple-400 opacity-0 transition group-hover:translate-x-6 group-hover:opacity-100">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </a>
      </div>

      <div className="mt-20 flex w-full justify-center">
        <img
          alt=""
          src="/home-page-preview.png"
          className="w-4/5 lg:w-3/4"
        />
      </div>

      <Divider />

      <style jsx>{`
        .banner-btn {
          display: flex;
          justify-content: center;
          align-items: center;
          width: fit-content;
          overflow: hidden;
          height: 3rem;
          background-size: 300% 300%;
          backdrop-filter: blur(1rem);
          border-radius: 5rem;
          transition: 0.5s;
          animation: gradient_301 5s ease infinite;
          border: double 4px transparent;
          background-image: linear-gradient(#05051d, #05051d),
            linear-gradient(137.48deg, #ffdb3b 10%, #fe53bb 45%, #8f51ea 67%, #0044ff 87%);
          background-origin: border-box;
          background-clip: content-box, border-box;
        }

        #container-stars {
          position: absolute;
          z-index: -1;
          width: 100%;
          height: 100%;
          overflow: hidden;
          transition: 0.5s;
          backdrop-filter: blur(1rem);
          border-radius: 5rem;
          background-color: #05051d;
        }

        .banner-btn strong {
          z-index: 2;
          font-family: "Avalors Personal Use";
          font-size: 15px;
          letter-spacing: 5px;
          color: #ffffff;
        }

        #glow {
          position: absolute;
          display: flex;
          width: 12rem;
        }

        .circle {
          width: 100%;
          height: 30px;
          filter: blur(2rem);
          animation: pulse_3011 4s infinite;
          z-index: -1;
        }

        .circle:nth-of-type(1) {
          background: rgba(254, 83, 186, 0.636);
        }

        .circle:nth-of-type(2) {
          background: rgba(142, 81, 234, 0.704);
        }

        .banner-btn:hover #container-stars {
          z-index: 1;
          background-color: #05051d;
        }

        .banner-btn:hover {
          transform: scale(1.1);
        }

        .banner-btn:active {
          border: double 4px #fe53bb;
          background-origin: border-box;
          background-clip: content-box, border-box;
          animation: none;
        }

        .banner-btn:active .circle {
          background: #fe53bb;
        }

        #stars {
          position: relative;
          background: transparent;
          width: 200rem;
          height: 200rem;
        }

        #stars::after {
          content: "";
          position: absolute;
          top: -10rem;
          left: -100rem;
          width: 100%;
          height: 100%;
          animation: animStarRotate 90s linear infinite;
          background-image: radial-gradient(#ffffff 1px, transparent 1%);
          background-size: 50px 50px;
        }

        #stars::before {
          content: "";
          position: absolute;
          top: 0;
          left: -50%;
          width: 170%;
          height: 500%;
          animation: animStar 60s linear infinite;
          background-image: radial-gradient(#ffffff 1px, transparent 1%);
          background-size: 50px 50px;
          opacity: 0.5;
        }

        @keyframes animStar {
          from {
            transform: translateY(0);
          }
          to {
            transform: translateY(-135rem);
          }
        }

        @keyframes animStarRotate {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0);
          }
        }

        @keyframes gradient_301 {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes pulse_3011 {
          0% {
            transform: scale(0.75);
            box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.7);
          }
          70% {
            transform: scale(1);
            box-shadow: 0 0 0 10px rgba(0, 0, 0, 0);
          }
          100% {
            transform: scale(0.75);
            box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
          }
        }
      `}</style>
    </section>
  );
}

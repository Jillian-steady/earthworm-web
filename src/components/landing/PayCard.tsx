"use client";

import Divider from "@/components/common/Divider";

interface FeatureItem {
  text: string;
  unique: boolean;
}

interface PricingPlan {
  type: string;
  list: FeatureItem[];
}

const features: PricingPlan[] = [
  {
    type: "免费",
    list: [
      { text: "最多支持5个空间，支持云同步", unique: false },
      { text: "最多支持1000个URL，支持AI分组", unique: false },
      { text: "自动AI分组（即将推出）", unique: true },
      { text: "基础支持服务", unique: true },
      { text: "终身免费更新！", unique: true },
    ],
  },
  {
    type: "终身付费",
    list: [
      { text: "无限空间，支持云同步", unique: true },
      { text: "无限URL，支持AI分组", unique: true },
      { text: "自动AI分组（即将推出）", unique: true },
      { text: "终身付费的高级支持服务", unique: true },
      { text: "终身免费更新！", unique: true },
    ],
  },
];

async function handleUpgrade(_type: string) {
  // placeholder for upgrade logic
}

export default function PayCard() {
  return (
    <>
      <div className="mt-16 flex flex-col items-center justify-center" id="pricing">
        <div className="bg-opacity-75 py-16 text-center text-white">
          <div className="mb-6">
            <p className="relative pb-4 text-sm font-bold tracking-wider text-gray-500 before:absolute before:inset-x-0 before:bottom-0 before:mb-0 before:h-0.5 before:bg-gradient-to-r before:from-purple-500">
              价格
            </p>
          </div>
          <h2 className="bg-gradient-to-r from-purple-400 to-gray-300 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent dark:from-purple-600 dark:to-gray-500 md:text-5xl">
            进行简单、透明的定价 <br />
            为每个人
          </h2>
          <p className="mt-6 text-sm leading-relaxed text-gray-500 dark:text-gray-300">
            <span>一次付款，使用无限空间，终身免费更新。</span>
            <br />
            <span>定制您的服务</span>
          </p>
        </div>

        <div className="flex items-center justify-around space-x-20">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`card relative w-96 max-w-sm border-transparent p-8 shadow-xl ${
                feature.type === "终身付费" ? "lifetime-animation" : ""
              }`}
            >
              {feature.type === "终身付费" && (
                <button className="button-unlock">
                  <svg
                    className="crown h-6 w-6 text-[#f09f33]"
                    fill="currentColor"
                    viewBox="0 0 256 256"
                  >
                    <path d="M243.84,76.19a12.08,12.08,0,0,0-13.34-1.7l-50.21,25.1L138.24,42.87a12,12,0,0,0-20.48,0L75.71,99.59,25.5,74.49A12,12,0,0,0,8,88.36l26.19,115.63A12,12,0,0,0,45.88,212H210.12a12,12,0,0,0,11.69-7.89L248,88.48A12.07,12.07,0,0,0,243.84,76.19Z" />
                  </svg>
                  解锁 Pro
                </button>
              )}

              <div className="mb-6 text-left">
                <h2 className="text-gradient text-3xl font-bold">{feature.type}</h2>
                <p className="program-description">
                  {feature.type === "免费"
                    ? "我们的基本服务涵盖了很多内容，您也可以在上面进行 Earthworm 之旅！"
                    : "终身多种定制服务，体验我们所有的功能， Earthworm 将全方位支持您的英语课程！"}
                </p>
              </div>

              <div className="mb-8 text-left">
                <span className="mr-2 text-5xl font-extrabold text-black dark:text-white">
                  {feature.type === "免费" ? "$0" : "$19"}
                </span>
                <span className="gradient-text">
                  {feature.type === "免费" ? "现在使用" : "抢先体验"}
                </span>
              </div>

              <div className="text-left">
                <button
                  onClick={() => handleUpgrade(feature.type)}
                  className={`w-full transform rounded-lg px-8 py-3 font-bold text-white transition duration-300 ease-in-out hover:scale-105 ${
                    feature.type === "免费"
                      ? "bg-gray-600 hover:bg-gray-700"
                      : "bg-purple-600 hover:bg-purple-700"
                  }`}
                >
                  {feature.type === "免费" ? "Get Started" : "Upgrade now"}
                </button>
                <ul className="mt-4">
                  {feature.list.map((item, itemIndex) => (
                    <li
                      key={`feature-${index}-item-${itemIndex}`}
                      className="mb-6 mt-6 flex items-center"
                    >
                      <svg
                        className={`mr-2 h-5 w-5 ${
                          item.unique ? "text-green-500" : "text-gray-500"
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {item.text}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 bg-opacity-75 py-10 text-center text-white">
        <p className="text-xs text-gray-800 dark:text-gray-400 md:text-sm">
          每次新购买的用户如若退款， <br className="md:hidden" />
          <span className="bg-gradient-to-r from-purple-400 via-purple-400 to-gray-400 bg-clip-text text-transparent dark:from-purple-600 dark:via-purple-600 dark:to-gray-500">
            7 天内获得 100% 退款
          </span>
          在购买之日起
          <br />
          购买Earthworm许可证后，
          <span className="bg-gradient-to-r from-purple-400 via-purple-400 to-gray-400 bg-clip-text text-transparent dark:from-purple-600 dark:via-purple-600 dark:to-gray-500">
            登录
          </span>
          并且
          <span className="bg-gradient-to-r from-purple-400 via-purple-400 to-gray-400 bg-clip-text text-transparent dark:from-purple-600 dark:via-purple-600 dark:to-gray-500">
            注册你的许可证
          </span>
          去解锁我们的所有功能
        </p>
      </div>
      <Divider />

      <style jsx>{`
        .card {
          position: relative;
          overflow: hidden;
          border-radius: 6px;
          border: 1px solid rgba(138, 100, 226, 0.25);
          transition:
            box-shadow 0.3s ease-in-out,
            transform 0.3s ease-in-out,
            background-color 0.3s ease-in-out;
          will-change: transform;
        }

        .card:hover {
          transform: translateY(-5px);
          animation:
            dynamic-shadow 2s infinite alternate,
            pulse 2s infinite alternate;
        }

        .lifetime-animation {
          animation:
            dynamic-shadow 2s infinite alternate,
            pulse 2s infinite alternate;
        }

        .program-description {
          font-size: 0.875rem;
          color: #7087aa;
        }

        :global(.dark) .program-description {
          color: #9ca3af;
        }

        .gradient-text {
          background: linear-gradient(to right, #7e22ce, #adafb3);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .text-gradient {
          background: linear-gradient(to right, #7e22ce, #adafb3);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .button-unlock {
          width: fit-content;
          display: flex;
          align-items: center;
          padding: 5px 10px;
          gap: 0.4rem;
          border: none;
          font-weight: bold;
          border-radius: 30px;
          cursor: pointer;
          text-shadow: 2px 2px 3px rgb(136 0 136 / 50%);
          background: linear-gradient(
              15deg,
              #880088,
              #aa2068,
              #cc3f47,
              #de6f3d,
              #f09f33,
              #de6f3d,
              #cc3f47,
              #aa2068,
              #880088
            )
            no-repeat;
          background-size: 300%;
          background-position: left center;
          transition: background 0.3s ease;
          color: #fff;
          position: absolute;
          right: 8px;
          top: 8px;
        }

        .button-unlock:hover {
          background-size: 320%;
          background-position: right center;
        }

        .button-unlock:hover .crown {
          color: #fff;
        }

        .button-unlock .crown {
          transition: 0.3s ease;
        }

        @keyframes dynamic-shadow {
          0% {
            box-shadow:
              0 0 10px rgba(139, 92, 246, 0.5),
              0 0 20px rgba(139, 92, 246, 0.4),
              0 0 40px rgba(139, 92, 246, 0.3);
          }
          100% {
            box-shadow:
              0 0 10px rgba(139, 92, 246, 0.7),
              0 0 25px rgba(139, 92, 246, 0.6),
              0 0 55px rgba(139, 92, 246, 0.5);
          }
        }

        @keyframes pulse {
          0% {
            background-color: rgba(10, 3, 3, 0.05);
          }
          100% {
            background-color: rgba(154, 101, 240, 0.1);
          }
        }
      `}</style>
    </>
  );
}

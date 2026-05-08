"use client";

import { Crown } from "lucide-react";

import { useUserStore } from "@/stores/user";

export default function MembershipBadge() {
  const isFounderMembership = useUserStore((s) => s.isFounderMembership);

  if (!isFounderMembership()) return null;

  return (
    <div>
      <span title="尊贵的创始会员,感谢您对 Earthworm 的大力支持！">
        <Crown
          className="glimmer relative overflow-hidden"
          style={{ width: 20, height: 20 }}
        />
      </span>
      <style jsx>{`
        .glimmer {
          color: #facc15;
          background: linear-gradient(-45deg, #ffd700 40%, #fafafa 50%, #ffd700 60%);
          background-size: 300%;
          background-position-x: 100%;
          -webkit-background-clip: text;
          background-clip: text;
          animation: shimmer 2s infinite;
        }
        @keyframes shimmer {
          to {
            background-position-x: 0%;
          }
        }
      `}</style>
    </div>
  );
}

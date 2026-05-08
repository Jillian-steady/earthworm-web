"use client";

import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";

import { isAuthenticated } from "@/services/auth";
import BackTop from "@/components/common/BackTop";
import Banner from "@/components/landing/Banner";
import Features from "@/components/landing/Features";
import Comments from "@/components/landing/Comments";
import Questions from "@/components/landing/Questions";
import Contact from "@/components/landing/Contact";

export default function Landing() {
  const router = useRouter();

  const startEarthworm = useCallback(() => {
    if (!isAuthenticated()) {
      router.push("/course-pack");
    }
  }, [router]);

  useEffect(() => {
    function handleKeydown(e: KeyboardEvent) {
      if (e.key === "Enter") {
        startEarthworm();
      }
    }

    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [startEarthworm]);

  return (
    <div className="font-customFont">
      <Banner />
      <Features />
      <Comments />
      <Questions />
      <Contact />
      <div className="sticky bottom-28 ml-auto flex justify-end sm:block">
        <BackTop />
      </div>
    </div>
  );
}

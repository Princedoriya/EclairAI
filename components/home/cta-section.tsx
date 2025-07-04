"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";

interface CTASectionProps {
  hasReachedLimit: boolean;
}

export default function CTASection({ hasReachedLimit }: CTASectionProps) {
  const router = useRouter();

  const handleGetStartedClick = useCallback(() => {
    if (hasReachedLimit) {
      router.push("/your-summaries");
    } else {
      router.push("/upload");
    }
  }, [hasReachedLimit, router]);

  return (
    <section>
      <div className="py-12 lg:py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 lg:pt-12">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Ready to Save Hours of Reading Time?
            </h2>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Transform lengthy documents into clear, actionable insight with our AI-powered summarizer
            </p>
          </div>
          <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center">
            <Button
              onClick={handleGetStartedClick}
              size="lg"
              variant={"link"}
              className="w-full min-[400px]:w-auto bg-linear-to-r from-slate-900 to-rose-500 hover:from-rose-500 hover:to-slate-900 hover:text-white text-white transition-all duration-300"
            >
              <span className="flex items-center justify-center">
                Get Started{" "}
                <ArrowRight className="ml-2 h-4 w-4 animate-pulse" />
              </span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useBlockNumber } from "wagmi";
import { monadTestnet } from "../config";

export default function SpeedVisualizer() {
  const [blockTime, setBlockTime] = useState<number | null>(null);
  const [lastTimestamp, setLastTimestamp] = useState<number | null>(null);
  const [displayBlockTime, setDisplayBlockTime] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [prevBlockNumber, setPrevBlockNumber] = useState<bigint | null>(null);

  const { data: blockNumber } = useBlockNumber({
    chainId: monadTestnet.id,
    watch: true,
  });

  useEffect(() => {
    if (blockTime !== null && displayBlockTime !== null) {
      const duration = 600;
      const start = displayBlockTime;
      const end = blockTime;
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = start + (end - start) * easeOutQuart;
        setDisplayBlockTime(current);

        if (progress < 1) requestAnimationFrame(animate);
      };

      requestAnimationFrame(animate);
    } else if (blockTime !== null) {
      setDisplayBlockTime(blockTime);
    }
  }, [blockTime]);

  useEffect(() => {
    if (blockNumber && blockNumber !== prevBlockNumber) {
      setIsAnimating(true);
      const now = Date.now();

      if (lastTimestamp) {
        const diffInSeconds = (now - lastTimestamp) / 1000;
        if (diffInSeconds < 10) setBlockTime(diffInSeconds);
      }

      setLastTimestamp(now);
      setPrevBlockNumber(blockNumber);

      const timer = setTimeout(() => setIsAnimating(false), 800);
      return () => clearTimeout(timer);
    }
  }, [blockNumber, prevBlockNumber, lastTimestamp]);

  const getStatus = () => {
    if (!blockTime)
      return {
        text: "Monitoring",
        color: "text-purple-300/60",
        dot: "bg-purple-500/40",
      };
    if (blockTime < 1.5)
      return { text: "Optimal", color: "text-white", dot: "bg-purple-400" };
    if (blockTime < 2.5)
      return {
        text: "Normal",
        color: "text-purple-200/80",
        dot: "bg-purple-400/60",
      };
    return {
      text: "Monitoring",
      color: "text-purple-300/60",
      dot: "bg-purple-500/40",
    };
  };

  const status = getStatus();

  return (
    <div className="w-full relative px-4 sm:px-0">
      <div className="relative bg-black/40 backdrop-blur-md p-4 sm:p-8 border border-purple-500/30 overflow-hidden">
        <div
          className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-transparent pointer-events-none"
          style={{
            opacity: isAnimating ? 1 : 0,
            transform: isAnimating ? "translateX(0)" : "translateX(-100%)",
            transition: "transform 0.8s ease-out, opacity 0.4s ease-out",
          }}
        />

        <div className="mb-6 sm:mb-10 relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-base sm:text-lg font-light text-white tracking-tight">
              Network Performance
            </h2>
          </div>
          <p className="text-xs text-purple-400/60 mt-1 tracking-wide font-mono">
            Monad Testnet // Blockstream
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 mb-6 sm:mb-10 relative z-10">
          <div className="border-l-2 border-purple-500/40 pl-4 sm:pl-6">
            <p className="text-[10px] text-purple-400/60 uppercase tracking-[0.2em] mb-3 sm:mb-4 font-medium font-mono">
              Latest Block
            </p>
            <p className="text-2xl sm:text-3xl font-extralight text-white font-mono tabular-nums tracking-tight">
              {blockNumber ? (
                <span className="inline-flex items-center gap-3">
                  <span
                    className="inline-block transition-transform duration-500"
                    style={{
                      transform: isAnimating
                        ? "translateY(-2px)"
                        : "translateY(0)",
                      textShadow: "0 0 20px rgba(168, 85, 247, 0.5)",
                    }}
                  >
                    #{blockNumber.toString()}
                  </span>
                </span>
              ) : (
                <span className="text-purple-500/30">−</span>
              )}
            </p>
          </div>

          <div className="border-l-2 border-purple-500/40 pl-4 sm:pl-6">
            <p className="text-[10px] text-purple-400/60 uppercase tracking-[0.2em] mb-3 sm:mb-4 font-medium font-mono">
              Block Time
            </p>
            <div className="flex items-baseline gap-2">
              <p
                className={`text-2xl sm:text-3xl font-extralight font-mono tabular-nums tracking-tight transition-colors duration-500 ${blockTime && blockTime < 1.5 ? "text-white" : "text-purple-200/70"}`}
                style={{
                  textShadow:
                    blockTime && blockTime < 1.5
                      ? "0 0 20px rgba(168, 85, 247, 0.5)"
                      : "none",
                }}
              >
                {displayBlockTime !== null ? (
                  displayBlockTime.toFixed(2)
                ) : (
                  <span className="text-purple-500/30">−</span>
                )}
              </p>
              <span className="text-xs text-purple-400/50 font-light tracking-wide font-mono">
                s
              </span>
            </div>
            <div className="mt-3 h-[2px] bg-purple-500/20 w-full overflow-hidden rounded-full">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-purple-300 transition-all duration-700 ease-out rounded-full"
                style={{
                  width: displayBlockTime
                    ? `${Math.min((displayBlockTime / 3) * 100, 100)}%`
                    : "0%",
                  opacity: displayBlockTime ? 1 : 0,
                  boxShadow: "0 0 10px rgba(168, 85, 247, 0.5)",
                }}
              />
            </div>
          </div>
        </div>

        {isAnimating && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ animation: "flash 0.4s ease-out" }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl" />
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.2);
          }
        }
        @keyframes ping {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          75%,
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        @keyframes flash {
          0% {
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

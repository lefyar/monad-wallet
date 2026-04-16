"use client";

import { useState, useEffect, useRef } from "react";
import { useAccount, useConnect, useDisconnect, useBalance } from "wagmi";
import { formatUnits } from "viem";
import { monadTestnet } from "../config";
import SpeedVisualizer from "../components/SpeedVisualizer";

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const [isHovering, setIsHovering] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: balance, isLoading } = useBalance({
    address,
    chainId: monadTestnet.id,
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
    };
    resize();
    window.addEventListener("resize", resize);

    let animationId: number;
    let time = 0;

    const draw = () => {
      time += 0.003;

      const w = canvas.width;
      const h = canvas.height;

      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, w, h);

      const gradient1 = ctx.createRadialGradient(
        w * 0.3 + Math.sin(time) * w * 0.15,
        h * 0.3 + Math.cos(time * 0.7) * h * 0.1,
        0,
        w * 0.3,
        h * 0.3,
        w * 0.7,
      );
      gradient1.addColorStop(0, "rgba(139, 92, 246, 0.4)");
      gradient1.addColorStop(0.5, "rgba(168, 85, 247, 0.15)");
      gradient1.addColorStop(1, "transparent");

      const gradient2 = ctx.createRadialGradient(
        w * 0.7 + Math.cos(time * 0.8) * w * 0.2,
        h * 0.6 + Math.sin(time * 0.5) * h * 0.15,
        0,
        w * 0.7,
        h * 0.6,
        w * 0.6,
      );
      gradient2.addColorStop(0, "rgba(147, 51, 234, 0.35)");
      gradient2.addColorStop(0.5, "rgba(139, 92, 246, 0.1)");
      gradient2.addColorStop(1, "transparent");

      const gradient3 = ctx.createRadialGradient(
        w * 0.5 + Math.sin(time * 0.6) * w * 0.1,
        h * 0.8 + Math.cos(time * 0.4) * h * 0.1,
        0,
        w * 0.5,
        h * 0.8,
        w * 0.5,
      );
      gradient3.addColorStop(0, "rgba(124, 58, 237, 0.3)");
      gradient3.addColorStop(1, "transparent");

      ctx.fillStyle = gradient1;
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = gradient2;
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = gradient3;
      ctx.fillRect(0, 0, w, h);

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, [isMounted]);

  const handleCopy = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isMounted) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-black">
        <div className="relative">
          <div className="w-16 h-16 border-2 border-purple-900 border-t-purple-500 rounded-full animate-spin" />
          <p className="text-purple-400 text-sm mt-4 tracking-wide animate-pulse">
            Initializing...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen bg-black overflow-hidden">
      <div className="w-2/3 relative overflow-hidden p-8 flex flex-col items-center justify-center">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ imageRendering: "pixelated" }}
        />

        <div
          className="absolute inset-0 opacity-[0.08] pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(139, 92, 246, 0.8) 1px, transparent 1px),
              linear-gradient(90deg, rgba(139, 92, 246, 0.8) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />

        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute w-64 h-64 border border-purple-500/30 rounded-full"
            style={{
              top: "10%",
              left: "10%",
              animation: "float 20s ease-in-out infinite",
            }}
          />
          <div
            className="absolute w-48 h-48 border border-purple-400/20 rotate-45"
            style={{
              top: "60%",
              right: "15%",
              animation: "float 25s ease-in-out infinite reverse",
            }}
          />
          <div
            className="absolute w-32 h-32 border border-purple-500/25 rounded-full"
            style={{
              bottom: "20%",
              left: "20%",
              animation: "float 18s ease-in-out infinite",
              animationDelay: "-5s",
            }}
          />
        </div>

        <div className="relative z-10 w-full max-w-lg">
          <div
            className="text-center mb-12"
            style={{ animation: "fadeInUp 0.8s ease-out forwards", opacity: 0 }}
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <h2
                className="text-5xl text-white font-light tracking-tight"
                style={{
                  animation: "fadeInUp 0.8s ease-out 0.2s forwards",
                  opacity: 0,
                  textShadow: "0 0 40px rgba(168, 85, 247, 0.3)",
                }}
              >
                MONAD
              </h2>
            </div>
            <p
              className="text-purple-400/80 text-sm tracking-[0.3em] mt-3 uppercase font-medium"
              style={{
                animation: "fadeInUp 0.8s ease-out 0.4s forwards",
                opacity: 0,
              }}
            >
              Lightning Network
            </p>
          </div>

          <div
            style={{
              animation: "fadeIn 1s ease-out 0.6s forwards",
              opacity: 0,
            }}
          >
            <SpeedVisualizer />
          </div>
        </div>
      </div>

      <div className="w-1/2 bg-white p-12 flex flex-col items-center justify-center border-l border-purple-900/30 shadow-2xl shadow-purple-900/20">
        <div className="max-w-md w-full">
          <div
            className="text-center mb-16"
            style={{
              animation: "fadeInUp 0.8s ease-out 0.3s forwards",
              opacity: 0,
            }}
          >
            <h1 className="text-4xl font-light text-gray-900 mb-2 tracking-tight">
              Wallet
            </h1>
            <p className="text-gray-400 text-xs tracking-[0.2em] uppercase">
              Web3 Experience
            </p>
          </div>

          <div className="relative">
            {!isConnected ? (
              <div
                className="text-center py-8"
                style={{
                  animation: "fadeInUp 0.8s ease-out 0.5s forwards",
                  opacity: 0,
                }}
              >
                <p className="text-gray-400 mb-10 text-sm tracking-wide">
                  Connect to continue
                </p>
                <div className="space-y-4">
                  {connectors.map((connector, index) => (
                    <button
                      key={connector.uid}
                      onClick={() => connect({ connector })}
                      onMouseEnter={() => setIsHovering(connector.uid)}
                      onMouseLeave={() => setIsHovering(null)}
                      className="group w-full relative overflow-hidden bg-white border border-gray-200 hover:border-purple-600 transition-all duration-500 py-4 px-6 rounded-none"
                      style={{
                        animation: `slideIn 0.6s ease-out ${0.6 + index * 0.1}s forwards`,
                        opacity: 0,
                        transform: "translateX(-20px)",
                      }}
                    >
                      <span
                        className="absolute inset-0 bg-purple-600 transition-transform duration-500 ease-out origin-left"
                        style={{
                          transform:
                            isHovering === connector.uid
                              ? "scaleX(1)"
                              : "scaleX(0)",
                        }}
                      />
                      <span className="relative z-10 flex items-center justify-center gap-3">
                        <span
                          className="text-sm tracking-[0.15em] uppercase transition-colors duration-500"
                          style={{
                            color:
                              isHovering === connector.uid ? "white" : "#111",
                          }}
                        >
                          Connect {connector.name}
                        </span>
                        <svg
                          className="w-4 h-4 transition-all duration-500"
                          style={{
                            color:
                              isHovering === connector.uid ? "white" : "#111",
                            transform:
                              isHovering === connector.uid
                                ? "translateX(4px)"
                                : "translateX(0)",
                            opacity: isHovering === connector.uid ? 1 : 0,
                          }}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </svg>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div
                  className="group bg-white p-6 border border-gray-200 hover:border-purple-400 transition-all duration-500 cursor-pointer"
                  onClick={handleCopy}
                  style={{ animation: "slideIn 0.6s ease-out forwards" }}
                >
                  <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-medium mb-4">
                    Address
                  </p>
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-mono text-sm text-gray-700 tracking-wide">
                      {address?.slice(0, 8)}...{address?.slice(-6)}
                    </p>
                    <button className="relative p-2 text-gray-400 hover:text-purple-600 transition-colors duration-300">
                      {copied ? (
                        <svg
                          className="w-4 h-4 text-purple-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      )}
                      <span
                        className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] text-gray-500 bg-gray-100 px-2 py-1 rounded transition-opacity duration-300"
                        style={{ opacity: copied ? 1 : 0 }}
                      >
                        Copied!
                      </span>
                    </button>
                  </div>
                </div>

                <div
                  className="bg-gray-50 p-8 border border-gray-100"
                  style={{
                    animation: "slideIn 0.6s ease-out 0.1s forwards",
                    opacity: 0,
                    transform: "translateY(20px)",
                  }}
                >
                  <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-medium mb-6">
                    Balance
                  </p>
                  <div className="relative">
                    <p className="text-5xl font-extralight text-gray-900 tracking-tight tabular-nums">
                      {isLoading ? (
                        <span className="inline-flex gap-1">
                          <span
                            className="animate-bounce"
                            style={{ animationDelay: "0ms" }}
                          >
                            .
                          </span>
                          <span
                            className="animate-bounce"
                            style={{ animationDelay: "150ms" }}
                          >
                            .
                          </span>
                          <span
                            className="animate-bounce"
                            style={{ animationDelay: "300ms" }}
                          >
                            .
                          </span>
                        </span>
                      ) : balance ? (
                        Number(
                          formatUnits(balance.value, balance.decimals),
                        ).toFixed(4)
                      ) : (
                        "0.0000"
                      )}
                    </p>
                    <p className="text-xs text-gray-400 mt-3 tracking-wide uppercase">
                      {balance?.symbol || "MON"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => disconnect()}
                  onMouseEnter={() => setIsHovering("disconnect")}
                  onMouseLeave={() => setIsHovering(null)}
                  className="group w-full relative overflow-hidden bg-white border border-gray-200 hover:border-red-400 transition-all duration-500 py-4 mt-8"
                  style={{
                    animation: "slideIn 0.6s ease-out 0.2s forwards",
                    opacity: 0,
                    transform: "translateY(20px)",
                  }}
                >
                  <span
                    className="absolute inset-0 bg-red-50 transition-transform duration-500 ease-out origin-left"
                    style={{
                      transform:
                        isHovering === "disconnect" ? "scaleX(1)" : "scaleX(0)",
                    }}
                  />
                  <span className="relative z-10 text-xs tracking-[0.2em] uppercase text-gray-500 group-hover:text-red-500 transition-colors duration-500">
                    Disconnect
                  </span>
                </button>
              </div>
            )}
          </div>

          <p
            className="text-center text-gray-300 text-[10px] uppercase tracking-[0.3em] mt-16"
            style={{ animation: "fadeIn 1s ease-out 1s forwards", opacity: 0 }}
          >
            Monad Testnet
          </p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes float {
          0%,
          100% {
            transform: translate(0, 0) scale(1) rotate(0deg);
          }
          33% {
            transform: translate(30px, -30px) scale(1.05) rotate(2deg);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.95) rotate(-2deg);
          }
        }
        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.2);
          }
        }
      `}</style>
    </main>
  );
}

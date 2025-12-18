"use client";

import React, { useState, useEffect } from "react";
import { RateLimitStatus } from "@/utils/rateLimit";

interface RateLimitIndicatorProps {
  status: RateLimitStatus | null;
  visible?: boolean;
}

/**
 * Visual indicator component for rate limit status
 * Shows warning when approaching limit or when rate limited
 */
export function RateLimitIndicator({ status, visible = true }: RateLimitIndicatorProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!status || !visible) {
      setIsVisible(false);
      return;
    }

    // Show indicator if rate limited or warning level
    const shouldShow = status.isLimited || (status.remaining < status.limit * 0.2);
    setIsVisible(shouldShow);
  }, [status, visible]);

  if (!isVisible || !status) {
    return null;
  }

  const severity = status.isLimited ? "critical" : "warning";
  const bgColor = severity === "critical" ? "bg-red-100" : "bg-yellow-100";
  const borderColor = severity === "critical" ? "border-red-300" : "border-yellow-300";
  const textColor = severity === "critical" ? "text-red-800" : "text-yellow-800";
  const badgeBg = severity === "critical" ? "bg-red-200" : "bg-yellow-200";

  return (
    <div
      className={`${bgColor} ${borderColor} ${textColor} border rounded-lg p-4 mb-4 flex items-center justify-between gap-3`}
      role="alert"
      aria-live="polite"
      aria-label={`Rate limit indicator: ${status.message}`}
    >
      <div className="flex-1">
        <div className="font-semibold">{status.isLimited ? "Rate Limited" : "High Request Rate"}</div>
        <div className="text-sm mt-1">{status.message}</div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <div className={`${badgeBg} px-3 py-1 rounded-full text-sm font-medium`}>
          {status.remaining}/{status.limit}
        </div>

        {status.isLimited && (
          <button
            onClick={() => setIsVisible(false)}
            className={`${badgeBg} hover:opacity-75 transition-opacity p-1 rounded`}
            aria-label="Dismiss rate limit notice"
            type="button"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * Simple rate limit status badge (minimal)
 * Shows remaining requests / total limit
 */
export function RateLimitBadge({ status }: { status: RateLimitStatus | null }) {
  if (!status || status.limit === 0) {
    return null;
  }

  const percentage = (status.remaining / status.limit) * 100;
  let statusColor = "text-green-600";

  if (percentage < 10) {
    statusColor = "text-red-600";
  } else if (percentage < 25) {
    statusColor = "text-orange-600";
  } else if (percentage < 50) {
    statusColor = "text-yellow-600";
  }

  return (
    <div
      className={`inline-flex items-center gap-2 text-xs font-medium ${statusColor}`}
      title={`${status.remaining} of ${status.limit} requests remaining`}
    >
      <svg
        className="w-4 h-4"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
        <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0015.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
      </svg>
      <span>{status.remaining}/{status.limit}</span>
    </div>
  );
}

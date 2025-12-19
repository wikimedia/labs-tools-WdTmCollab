import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { debounce } from "../../utils/debounce";
import { cn } from "../../utils/utils";

describe("Utility Functions", () => {
  describe("cn (className merger)", () => {
    it("should merge class names correctly", () => {
      expect(cn("bg-red-500", "text-white")).toBe("bg-red-500 text-white");
    });

    it("should handle conditional classes", () => {
      expect(cn("bg-red-500", false && "text-white", "p-4")).toBe("bg-red-500 p-4");
    });

    it("should merge tailwind conflicts correctly", () => {
      expect(cn("p-4", "p-8")).toBe("p-8");
      expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
    });
  });

  describe("debounce", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("should debounce function calls", () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 1000);

      debouncedFn();
      debouncedFn();
      debouncedFn();

      expect(mockFn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(1000);

      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it("should pass arguments correctly", () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 500);

      debouncedFn("hello", 123);
      vi.advanceTimersByTime(500);

      expect(mockFn).toHaveBeenCalledWith("hello", 123);
    });
  });
});

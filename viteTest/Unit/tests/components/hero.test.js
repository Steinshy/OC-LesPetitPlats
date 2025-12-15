import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import { setupHero } from "@/components/hero.js";
import { isScrolledPastHeader } from "@/components/scroll.js";
import * as skeletonsModule from "@/components/skeletons/manager.js";
import { getHeaderHeight } from "@/utils/config.js";
import * as deviceModule from "@/utils/config.js";
import { logCategorySummary } from "@viteTest-helper/message.js";

vi.mock("@/utils/config.js", async () => {
  const actual = await vi.importActual("@/utils/config.js");
  return {
    ...actual,
    isMobile: vi.fn(() => false),
    baseUrl: "/",
  };
});

const mockHide = vi.fn();
vi.mock("@/components/skeletons/manager.js", () => ({
  heroSkeleton: vi.fn(() => ({
    hide: mockHide,
  })),
}));

const setupHeaderTest = () => {
  document.body.innerHTML = "";
  vi.clearAllMocks();
  mockHide.mockClear();
  Object.defineProperty(window, "scrollY", {
    value: 0,
    writable: true,
    configurable: true,
  });
};

describe("hero", () => {
  beforeEach(() => {
    setupHeaderTest();
  });

  describe("getHeaderHeight", () => {
    it("should return hero height when hero exists", () => {
      const hero = document.createElement("div");
      hero.id = "hero";
      hero.style.height = "200px";
      document.body.appendChild(hero);

      Object.defineProperty(hero, "offsetHeight", {
        value: 200,
        writable: false,
        configurable: true,
      });

      const height = getHeaderHeight();

      expect(height).toBe(200);
    });

    it("should return 0 when hero does not exist", () => {
      document.body.innerHTML = "";

      const height = getHeaderHeight();

      expect(height).toBe(0);
    });

    it("should return 0 when hero offsetHeight is 0", () => {
      const hero = document.createElement("div");
      hero.id = "hero";
      document.body.appendChild(hero);

      Object.defineProperty(hero, "offsetHeight", {
        value: 0,
        writable: false,
        configurable: true,
      });

      const height = getHeaderHeight();

      expect(height).toBe(0);
    });

    it("should return 0 when hero offsetHeight is undefined", () => {
      const hero = document.createElement("div");
      hero.id = "hero";
      document.body.appendChild(hero);

      Object.defineProperty(hero, "offsetHeight", {
        value: undefined,
        writable: false,
        configurable: true,
      });

      const height = getHeaderHeight();

      expect(height).toBe(0);
    });
  });

  describe("isScrolledPastHeader", () => {
    it("should return false when hero does not exist", () => {
      document.body.innerHTML = "";

      const result = isScrolledPastHeader();

      expect(result).toBe(false);
    });

    describe("desktop behavior", () => {
      it("should return false when scrollY is less than hero height on desktop", () => {
        const hero = document.createElement("div");
        hero.id = "hero";
        document.body.appendChild(hero);

        Object.defineProperty(hero, "offsetHeight", {
          value: 100,
          writable: false,
          configurable: true,
        });

        Object.defineProperty(window, "scrollY", {
          value: 50,
          writable: true,
          configurable: true,
        });

        vi.mocked(deviceModule.isMobile).mockReturnValue(false);

        const result = isScrolledPastHeader();

        expect(result).toBe(false);
      });

      it("should return true when scrollY is greater than hero height on desktop", () => {
        const hero = document.createElement("div");
        hero.id = "hero";
        document.body.appendChild(hero);

        Object.defineProperty(hero, "offsetHeight", {
          value: 100,
          writable: false,
          configurable: true,
        });

        Object.defineProperty(window, "scrollY", {
          value: 150,
          writable: true,
          configurable: true,
        });

        vi.mocked(deviceModule.isMobile).mockReturnValue(false);

        const result = isScrolledPastHeader();

        expect(result).toBe(true);
      });

      it("should return false when scrollY exactly equals hero height on desktop", () => {
        const hero = document.createElement("div");
        hero.id = "hero";
        document.body.appendChild(hero);

        Object.defineProperty(hero, "offsetHeight", {
          value: 100,
          writable: false,
          configurable: true,
        });

        Object.defineProperty(window, "scrollY", {
          value: 100,
          writable: true,
          configurable: true,
        });

        vi.mocked(deviceModule.isMobile).mockReturnValue(false);

        const result = isScrolledPastHeader();

        expect(result).toBe(false);
      });
    });

    describe("mobile behavior", () => {
      it("should use mobile threshold (35% of hero height) when on mobile", () => {
        const hero = document.createElement("div");
        hero.id = "hero";
        document.body.appendChild(hero);

        Object.defineProperty(hero, "offsetHeight", {
          value: 100,
          writable: false,
          configurable: true,
        });

        Object.defineProperty(window, "scrollY", {
          value: 40,
          writable: true,
          configurable: true,
        });

        vi.mocked(deviceModule.isMobile).mockReturnValue(true);

        const result = isScrolledPastHeader();

        expect(result).toBe(true);
      });

      it("should return false when scrollY is less than mobile threshold", () => {
        const hero = document.createElement("div");
        hero.id = "hero";
        document.body.appendChild(hero);

        Object.defineProperty(hero, "offsetHeight", {
          value: 100,
          writable: false,
          configurable: true,
        });

        Object.defineProperty(window, "scrollY", {
          value: 30,
          writable: true,
          configurable: true,
        });

        vi.mocked(deviceModule.isMobile).mockReturnValue(true);

        const result = isScrolledPastHeader();

        expect(result).toBe(false);
      });

      it("should return false when scrollY exactly equals mobile threshold", () => {
        const hero = document.createElement("div");
        hero.id = "hero";
        document.body.appendChild(hero);

        Object.defineProperty(hero, "offsetHeight", {
          value: 100,
          writable: false,
          configurable: true,
        });

        Object.defineProperty(window, "scrollY", {
          value: 35,
          writable: true,
          configurable: true,
        });

        vi.mocked(deviceModule.isMobile).mockReturnValue(true);

        const result = isScrolledPastHeader();

        expect(result).toBe(false);
      });
    });

    describe("edge cases", () => {
      it("should handle hero with 0 height", () => {
        const hero = document.createElement("div");
        hero.id = "hero";
        document.body.appendChild(hero);

        Object.defineProperty(hero, "offsetHeight", {
          value: 0,
          writable: false,
          configurable: true,
        });

        Object.defineProperty(window, "scrollY", {
          value: 10,
          writable: true,
          configurable: true,
        });

        vi.mocked(deviceModule.isMobile).mockReturnValue(false);

        const result = isScrolledPastHeader();

        expect(result).toBe(true);
      });

      it("should handle negative scrollY values", () => {
        const hero = document.createElement("div");
        hero.id = "hero";
        document.body.appendChild(hero);

        Object.defineProperty(hero, "offsetHeight", {
          value: 100,
          writable: false,
          configurable: true,
        });

        Object.defineProperty(window, "scrollY", {
          value: -10,
          writable: true,
          configurable: true,
        });

        vi.mocked(deviceModule.isMobile).mockReturnValue(false);

        const result = isScrolledPastHeader();

        expect(result).toBe(false);
      });

      it("should handle offsetHeight being undefined", () => {
        const hero = document.createElement("div");
        hero.id = "hero";
        document.body.appendChild(hero);

        Object.defineProperty(hero, "offsetHeight", {
          value: undefined,
          writable: false,
          configurable: true,
        });

        Object.defineProperty(window, "scrollY", {
          value: 10,
          writable: true,
          configurable: true,
        });

        vi.mocked(deviceModule.isMobile).mockReturnValue(false);

        const result = isScrolledPastHeader();

        expect(result).toBe(true);
      });
    });
  });

  afterAll(() => {
    logCategorySummary("hero", "Hero", "All hero tests");
  });
});

describe("hero - setupHero - null and undefined", () => {
  beforeEach(() => {
    setupHeaderTest();
  });

  it("should not set background when recipesData is null", () => {
    const hero = document.createElement("div");
    hero.id = "hero";
    document.body.appendChild(hero);

    setupHero(null);

    expect(skeletonsModule.heroSkeleton).not.toHaveBeenCalled();
    expect(hero.style.backgroundImage).toBe("");
  });

  it("should not set background when recipesData is undefined", () => {
    const hero = document.createElement("div");
    hero.id = "hero";
    document.body.appendChild(hero);

    setupHero(undefined);

    expect(skeletonsModule.heroSkeleton).not.toHaveBeenCalled();
    expect(hero.style.backgroundImage).toBe("");
  });

  it("should handle empty recipesData array", () => {
    const hero = document.createElement("div");
    hero.id = "hero";
    document.body.appendChild(hero);

    setupHero([]);

    expect(mockHide).toHaveBeenCalled();
    expect(hero.style.backgroundImage).toBe("");
  });
});

describe("hero - setupHero - image selection", () => {
  beforeEach(() => {
    setupHeaderTest();
  });

  it("should hide skeleton and set random background image", () => {
    const hero = document.createElement("div");
    hero.id = "hero";
    document.body.appendChild(hero);

    const recipesData = [
      {
        image: "test-card.jpg",
      },
      {
        image: "test-card2.jpg",
      },
    ];

    const randomSpy = vi.spyOn(Math, "random").mockReturnValue(0.1);
    const mockImage = {
      onload: null,
      onerror: null,
      src: "",
    };
    // eslint-disable-next-line prefer-arrow-callback
    const ImageSpy = vi.spyOn(global, "Image").mockImplementation(function () {
      return mockImage;
    });

    setupHero(recipesData);

    expect(mockHide).toHaveBeenCalled();
    expect(mockImage.src).toMatch(/.*test-card-hero\.webp/);
    mockImage.onload();

    expect(hero.style.backgroundImage).toMatch(/url\(["']?.*test-card-hero\.webp["']?\)/);

    randomSpy.mockRestore();
    ImageSpy.mockRestore();
  });
});

describe("hero - setupHero - missing or invalid images", () => {
  beforeEach(() => {
    setupHeaderTest();
  });

  it("should not set background image when no image URLs are available", () => {
    const hero = document.createElement("div");
    hero.id = "hero";
    document.body.appendChild(hero);

    const recipesData = [
      {
        image: "",
      },
    ];

    setupHero(recipesData);

    expect(hero.style.backgroundImage).toBe("");
  });

  it("should filter out recipes without images", () => {
    const hero = document.createElement("div");
    hero.id = "hero";
    document.body.appendChild(hero);

    const recipesData = [
      {
        image: "test-card.jpg",
      },
      {},
      {
        image: null,
      },
    ];

    const randomSpy = vi.spyOn(Math, "random").mockReturnValue(0.1);
    const mockImage = {
      onload: null,
      onerror: null,
      src: "",
    };
    // eslint-disable-next-line prefer-arrow-callback
    const ImageSpy = vi.spyOn(global, "Image").mockImplementation(function () {
      return mockImage;
    });

    setupHero(recipesData);

    expect(mockImage.src).toMatch(/.*test-card-hero\.webp/);
    mockImage.onload();

    expect(hero.style.backgroundImage).toMatch(/url\(["']?.*test-card-hero\.webp["']?\)/);

    randomSpy.mockRestore();
    ImageSpy.mockRestore();
  });

  it("should handle empty images array", () => {
    const hero = document.createElement("div");
    hero.id = "hero";
    document.body.appendChild(hero);

    const recipesData = [
      {
        image: null,
      },
    ];

    setupHero(recipesData);

    expect(hero.style.backgroundImage).toBe("");
  });
});

describe("hero - setupHero - error handling", () => {
  beforeEach(() => {
    setupHeaderTest();
  });
  it("should return early when hero element is missing", () => {
    document.body.innerHTML = "";

    const recipesData = [
      {
        image: "test-card.jpg",
      },
    ];

    expect(() => setupHero(recipesData)).not.toThrow();
    expect(mockHide).not.toHaveBeenCalled();
  });

  it("should handle recipesData that is not an array (object)", () => {
    const hero = document.createElement("div");
    hero.id = "hero";
    document.body.appendChild(hero);

    const recipesData = { length: 2, 0: { image: "test-card.jpg" } };

    expect(() => setupHero(recipesData)).not.toThrow();
    expect(mockHide).not.toHaveBeenCalled();
    expect(hero.style.backgroundImage).toBe("");
  });

  it("should handle recipesData that is not an array (string)", () => {
    const hero = document.createElement("div");
    hero.id = "hero";
    document.body.appendChild(hero);

    expect(() => setupHero("not an array")).not.toThrow();
    expect(mockHide).not.toHaveBeenCalled();
    expect(hero.style.backgroundImage).toBe("");
  });

  it("should handle recipesData that is not an array (number)", () => {
    const hero = document.createElement("div");
    hero.id = "hero";
    document.body.appendChild(hero);

    expect(() => setupHero(123)).not.toThrow();
    expect(mockHide).not.toHaveBeenCalled();
    expect(hero.style.backgroundImage).toBe("");
  });
});

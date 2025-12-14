import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import { headerElement, getHeaderHeight, setupHeader } from "@/components/header.js";
import { isScrolledPastHeader } from "@/components/scroll.js";
import * as skeletonsModule from "@/components/skeletons/manager.js";
import * as deviceModule from "@/utils/config.js";
import { logCategorySummary } from "@viteTest-helper/message.js";

const IMAGE1_WEBP = "image1.webp";
const IMAGE1_JPG = "image1.jpg";

vi.mock("@/utils/config.js", async () => {
  const actual = await vi.importActual("@/utils/config.js");
  return {
    ...actual,
    isMobile: vi.fn(() => false),
  };
});

const mockHide = vi.fn();
vi.mock("@/components/skeletons/manager.js", () => ({
  headerSkeleton: vi.fn(() => ({
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

describe("header", () => {
  beforeEach(() => {
    setupHeaderTest();
  });

  describe("headerElement", () => {
    it("should return header element when it exists", () => {
      document.body.innerHTML = '<div id="header"></div>';

      const result = headerElement();

      expect(result.header).toBeTruthy();
      expect(result.header.id).toBe("header");
    });

    it("should return null header when element does not exist", () => {
      document.body.innerHTML = "";

      const result = headerElement();

      expect(result.header).toBeNull();
    });
  });

  describe("getHeaderHeight", () => {
    it("should return header height when header exists", () => {
      const header = document.createElement("div");
      header.id = "header";
      header.style.height = "200px";
      document.body.appendChild(header);

      Object.defineProperty(header, "offsetHeight", {
        value: 200,
        writable: false,
        configurable: true,
      });

      const height = getHeaderHeight();

      expect(height).toBe(200);
    });

    it("should return 0 when header does not exist", () => {
      document.body.innerHTML = "";

      const height = getHeaderHeight();

      expect(height).toBe(0);
    });

    it("should return 0 when header offsetHeight is 0", () => {
      const header = document.createElement("div");
      header.id = "header";
      document.body.appendChild(header);

      Object.defineProperty(header, "offsetHeight", {
        value: 0,
        writable: false,
        configurable: true,
      });

      const height = getHeaderHeight();

      expect(height).toBe(0);
    });

    it("should return 0 when header offsetHeight is undefined", () => {
      const header = document.createElement("div");
      header.id = "header";
      document.body.appendChild(header);

      Object.defineProperty(header, "offsetHeight", {
        value: undefined,
        writable: false,
        configurable: true,
      });

      const height = getHeaderHeight();

      expect(height).toBe(0);
    });
  });

  describe("isScrolledPastHeader", () => {
    it("should return false when header does not exist", () => {
      document.body.innerHTML = "";

      const result = isScrolledPastHeader();

      expect(result).toBe(false);
    });

    describe("desktop behavior", () => {
      it("should return false when scrollY is less than header height on desktop", () => {
        const header = document.createElement("div");
        header.id = "header";
        document.body.appendChild(header);

        Object.defineProperty(header, "offsetHeight", {
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

      it("should return true when scrollY is greater than header height on desktop", () => {
        const header = document.createElement("div");
        header.id = "header";
        document.body.appendChild(header);

        Object.defineProperty(header, "offsetHeight", {
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

      it("should return false when scrollY exactly equals header height on desktop", () => {
        const header = document.createElement("div");
        header.id = "header";
        document.body.appendChild(header);

        Object.defineProperty(header, "offsetHeight", {
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
      it("should use mobile threshold (35% of header height) when on mobile", () => {
        const header = document.createElement("div");
        header.id = "header";
        document.body.appendChild(header);

        Object.defineProperty(header, "offsetHeight", {
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
        const header = document.createElement("div");
        header.id = "header";
        document.body.appendChild(header);

        Object.defineProperty(header, "offsetHeight", {
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
        const header = document.createElement("div");
        header.id = "header";
        document.body.appendChild(header);

        Object.defineProperty(header, "offsetHeight", {
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
      it("should handle header with 0 height", () => {
        const header = document.createElement("div");
        header.id = "header";
        document.body.appendChild(header);

        Object.defineProperty(header, "offsetHeight", {
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
        const header = document.createElement("div");
        header.id = "header";
        document.body.appendChild(header);

        Object.defineProperty(header, "offsetHeight", {
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
        const header = document.createElement("div");
        header.id = "header";
        document.body.appendChild(header);

        Object.defineProperty(header, "offsetHeight", {
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
    logCategorySummary("header", "Header", "All header tests");
  });
});

describe("header - setupHeader - null and undefined", () => {
  beforeEach(() => {
    setupHeaderTest();
  });

  it("should not set background when recipesData is null", () => {
    const header = document.createElement("div");
    header.id = "header";
    document.body.appendChild(header);

    setupHeader(null);

    expect(skeletonsModule.headerSkeleton).not.toHaveBeenCalled();
    expect(header.style.backgroundImage).toBe("");
  });

  it("should not set background when recipesData is undefined", () => {
    const header = document.createElement("div");
    header.id = "header";
    document.body.appendChild(header);

    setupHeader(undefined);

    expect(skeletonsModule.headerSkeleton).not.toHaveBeenCalled();
    expect(header.style.backgroundImage).toBe("");
  });

  it("should handle empty recipesData array", () => {
    const header = document.createElement("div");
    header.id = "header";
    document.body.appendChild(header);

    setupHeader([]);

    expect(mockHide).toHaveBeenCalled();
    expect(header.style.backgroundImage).toBe("");
  });
});

describe("header - setupHeader - image selection", () => {
  beforeEach(() => {
    setupHeaderTest();
  });

  it("should hide skeleton and set random background image", () => {
    const header = document.createElement("div");
    header.id = "header";
    document.body.appendChild(header);

    const recipesData = [
      {
        images: {
          webpUrl: IMAGE1_WEBP,
          jpgUrl: IMAGE1_JPG,
        },
      },
      {
        images: {
          webpUrl: "image2.webp",
          jpgUrl: "image2.jpg",
        },
      },
    ];

    const randomSpy = vi.spyOn(Math, "random").mockReturnValue(0.1);

    setupHeader(recipesData);

    expect(mockHide).toHaveBeenCalled();
    expect(header.style.backgroundImage).toMatch(/url\(["']?image1\.webp["']?\)/);

    randomSpy.mockRestore();
  });

  it("should use jpgUrl when webpUrl is not available", () => {
    const header = document.createElement("div");
    header.id = "header";
    document.body.appendChild(header);

    const recipesData = [
      {
        images: {
          jpgUrl: IMAGE1_JPG,
        },
      },
    ];

    const randomSpy = vi.spyOn(Math, "random").mockReturnValue(0.1);

    setupHeader(recipesData);

    expect(header.style.backgroundImage).toMatch(/url\(["']?image1\.jpg["']?\)/);

    randomSpy.mockRestore();
  });

  it("should use jpgUrl when webpUrl is empty string", () => {
    const header = document.createElement("div");
    header.id = "header";
    document.body.appendChild(header);

    const recipesData = [
      {
        images: {
          webpUrl: "",
          jpgUrl: IMAGE1_JPG,
        },
      },
    ];

    const randomSpy = vi.spyOn(Math, "random").mockReturnValue(0.1);

    setupHeader(recipesData);

    expect(header.style.backgroundImage).toMatch(/url\(["']?image1\.jpg["']?\)/);

    randomSpy.mockRestore();
  });

  it("should select different random images on multiple calls", () => {
    const header = document.createElement("div");
    header.id = "header";
    document.body.appendChild(header);

    const recipesData = [
      {
        images: {
          webpUrl: IMAGE1_WEBP,
        },
      },
      {
        images: {
          webpUrl: "image2.webp",
        },
      },
      {
        images: {
          webpUrl: "image3.webp",
        },
      },
    ];

    const randomSpy = vi
      .spyOn(Math, "random")
      .mockReturnValueOnce(0.1)
      .mockReturnValueOnce(0.5)
      .mockReturnValueOnce(0.9);

    setupHeader(recipesData);
    expect(header.style.backgroundImage).toMatch(/image1\.webp/);

    setupHeader(recipesData);
    expect(header.style.backgroundImage).toMatch(/image2\.webp/);

    setupHeader(recipesData);
    expect(header.style.backgroundImage).toMatch(/image3\.webp/);

    randomSpy.mockRestore();
  });
});

describe("header - setupHeader - missing or invalid images", () => {
  beforeEach(() => {
    setupHeaderTest();
  });

  it("should not set background image when no image URLs are available", () => {
    const header = document.createElement("div");
    header.id = "header";
    document.body.appendChild(header);

    const recipesData = [
      {
        images: {},
      },
    ];

    const randomSpy = vi.spyOn(Math, "random").mockReturnValue(0.1);

    setupHeader(recipesData);

    expect(header.style.backgroundImage).toBe("");

    randomSpy.mockRestore();
  });

  it("should filter out recipes without images", () => {
    const header = document.createElement("div");
    header.id = "header";
    document.body.appendChild(header);

    const recipesData = [
      {
        images: {
          webpUrl: IMAGE1_WEBP,
        },
      },
      {},
      {
        images: null,
      },
    ];

    const randomSpy = vi.spyOn(Math, "random").mockReturnValue(0.1);

    setupHeader(recipesData);

    expect(header.style.backgroundImage).toMatch(/url\(["']?image1\.webp["']?\)/);

    randomSpy.mockRestore();
  });

  it("should handle empty images array", () => {
    const header = document.createElement("div");
    header.id = "header";
    document.body.appendChild(header);

    const recipesData = [
      {
        images: null,
      },
    ];

    setupHeader(recipesData);

    expect(header.style.backgroundImage).toBe("");
  });

  it("should not set background when both webpUrl and jpgUrl are empty strings", () => {
    const header = document.createElement("div");
    header.id = "header";
    document.body.appendChild(header);

    const recipesData = [
      {
        images: {
          webpUrl: "",
          jpgUrl: "",
        },
      },
    ];

    const randomSpy = vi.spyOn(Math, "random").mockReturnValue(0.1);

    setupHeader(recipesData);

    expect(header.style.backgroundImage).toBe("");

    randomSpy.mockRestore();
  });

  it("should handle recipe with images object but no URL properties", () => {
    const header = document.createElement("div");
    header.id = "header";
    document.body.appendChild(header);

    const recipesData = [
      {
        images: {
          webpUrl: IMAGE1_WEBP,
        },
      },
      {
        images: {},
      },
    ];

    const randomSpy = vi.spyOn(Math, "random").mockReturnValue(0.9);

    setupHeader(recipesData);

    expect(header.style.backgroundImage).toBe("");

    randomSpy.mockRestore();
  });
});

describe("header - setupHeader - error handling", () => {
  beforeEach(() => {
    setupHeaderTest();
  });
  it("should return early when header element is missing", () => {
    document.body.innerHTML = "";

    const recipesData = [
      {
        images: {
          webpUrl: "image1.webp",
        },
      },
    ];

    expect(() => setupHeader(recipesData)).not.toThrow();
    expect(mockHide).not.toHaveBeenCalled();
  });

  it("should handle recipesData that is not an array (object)", () => {
    const header = document.createElement("div");
    header.id = "header";
    document.body.appendChild(header);

    const recipesData = { length: 2, 0: { images: { webpUrl: IMAGE1_WEBP } } };

    expect(() => setupHeader(recipesData)).not.toThrow();
    expect(mockHide).not.toHaveBeenCalled();
    expect(header.style.backgroundImage).toBe("");
  });

  it("should handle recipesData that is not an array (string)", () => {
    const header = document.createElement("div");
    header.id = "header";
    document.body.appendChild(header);

    expect(() => setupHeader("not an array")).not.toThrow();
    expect(mockHide).not.toHaveBeenCalled();
    expect(header.style.backgroundImage).toBe("");
  });

  it("should handle recipesData that is not an array (number)", () => {
    const header = document.createElement("div");
    header.id = "header";
    document.body.appendChild(header);

    expect(() => setupHeader(123)).not.toThrow();
    expect(mockHide).not.toHaveBeenCalled();
    expect(header.style.backgroundImage).toBe("");
  });

  it("should handle recipe.images that is not an object (string)", () => {
    const header = document.createElement("div");
    header.id = "header";
    document.body.appendChild(header);

    const recipesData = [
      {
        images: "not an object",
      },
    ];

    const randomSpy = vi.spyOn(Math, "random").mockReturnValue(0.1);

    setupHeader(recipesData);

    expect(header.style.backgroundImage).toBe("");

    randomSpy.mockRestore();
  });

  it("should handle recipe.images that is not an object (array)", () => {
    const header = document.createElement("div");
    header.id = "header";
    document.body.appendChild(header);

    const recipesData = [
      {
        images: ["not", "an", "object"],
      },
    ];

    const randomSpy = vi.spyOn(Math, "random").mockReturnValue(0.1);

    setupHeader(recipesData);

    expect(header.style.backgroundImage).toBe("");

    randomSpy.mockRestore();
  });

  it("should handle webpUrl that is not a string (number)", () => {
    const header = document.createElement("div");
    header.id = "header";
    document.body.appendChild(header);

    const recipesData = [
      {
        images: {
          webpUrl: 123,
          jpgUrl: IMAGE1_JPG,
        },
      },
    ];

    const randomSpy = vi.spyOn(Math, "random").mockReturnValue(0.1);

    setupHeader(recipesData);

    expect(header.style.backgroundImage).toMatch(/url\(["']?123["']?\)/);

    randomSpy.mockRestore();
  });

  it("should handle jpgUrl that is not a string (object)", () => {
    const header = document.createElement("div");
    header.id = "header";
    document.body.appendChild(header);

    const recipesData = [
      {
        images: {
          webpUrl: IMAGE1_WEBP,
          jpgUrl: { url: IMAGE1_JPG },
        },
      },
    ];

    const randomSpy = vi.spyOn(Math, "random").mockReturnValue(0.1);

    setupHeader(recipesData);

    expect(header.style.backgroundImage).toMatch(/url\(["']?image1\.webp["']?\)/);

    randomSpy.mockRestore();
  });
});

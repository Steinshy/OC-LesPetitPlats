/**
 * Reference test file demonstrating Vitest testing patterns
 * This file serves as a reference for common testing patterns used in the project
 * Note: This file is excluded from test runs (see vitest.config.js)
 */

import { describe, it, expect, beforeEach, afterAll, vi } from "vitest";

describe("Vitest testing patterns reference", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    vi.clearAllMocks();
  });

  describe("Basic assertions", () => {
    it("should use toBe for primitive values", () => {
      expect(1 + 1).toBe(2);
      expect("hello").toBe("hello");
      expect(true).toBe(true);
    });

    it("should use toEqual for objects and arrays", () => {
      expect({ a: 1, b: 2 }).toEqual({ a: 1, b: 2 });
      expect([1, 2, 3]).toEqual([1, 2, 3]);
    });

    it("should use toBeTruthy and toBeFalsy", () => {
      expect(1).toBeTruthy();
      expect(0).toBeFalsy();
      expect("").toBeFalsy();
      expect(null).toBeFalsy();
      expect(undefined).toBeFalsy();
    });

    it("should use toBeNull and toBeUndefined", () => {
      expect(null).toBeNull();
      expect(undefined).toBeUndefined();
    });
  });

  describe("DOM element assertions", () => {
    it("should check if element exists with toBeTruthy", () => {
      const element = document.createElement("div");
      element.id = "test-element";
      document.body.appendChild(element);

      const found = document.getElementById("test-element");
      expect(found).toBeTruthy();
    });

    it("should check element textContent", () => {
      const element = document.createElement("div");
      element.textContent = "Hello World";
      document.body.appendChild(element);

      expect(element.textContent).toBe("Hello World");
    });

    it("should check element classList", () => {
      const element = document.createElement("div");
      element.className = "active highlight";
      document.body.appendChild(element);

      expect(element.classList.contains("active")).toBe(true);
      expect(element.classList.contains("highlight")).toBe(true);
    });

    it("should check element attributes", () => {
      const input = document.createElement("input");
      input.type = "text";
      input.required = true;
      input.setAttribute("data-testid", "test-input");
      document.body.appendChild(input);

      expect(input.getAttribute("type")).toBe("text");
      expect(input.hasAttribute("required")).toBe(true);
      expect(input.getAttribute("data-testid")).toBe("test-input");
    });

    it("should check element visibility", () => {
      const visible = document.createElement("div");
      visible.style.display = "block";
      document.body.appendChild(visible);

      const hidden = document.createElement("div");
      hidden.style.display = "none";
      document.body.appendChild(hidden);

      expect(visible.style.display).toBe("block");
      expect(hidden.style.display).toBe("none");
    });

    it("should check element disabled state", () => {
      const button = document.createElement("button");
      button.disabled = true;
      document.body.appendChild(button);

      expect(button.disabled).toBe(true);
      expect(button.hasAttribute("disabled")).toBe(true);
    });

    it("should check input value", () => {
      const input = document.createElement("input");
      input.type = "text";
      input.value = "test value";
      document.body.appendChild(input);

      expect(input.value).toBe("test value");
    });

    it("should check checkbox checked state", () => {
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = true;
      document.body.appendChild(checkbox);

      expect(checkbox.checked).toBe(true);
    });
  });

  describe("Array and collection assertions", () => {
    it("should check array length", () => {
      const items = ["a", "b", "c"];
      expect(items).toHaveLength(3);
    });

    it("should check if array contains value", () => {
      const items = ["apple", "banana", "cherry"];
      expect(items).toContain("banana");
      expect(items).not.toContain("orange");
    });

    it("should check NodeList length", () => {
      document.body.innerHTML = `
        <div class="item">Item 1</div>
        <div class="item">Item 2</div>
        <div class="item">Item 3</div>
      `;

      const items = document.querySelectorAll(".item");
      expect(items).toHaveLength(3);
    });
  });

  describe("String assertions", () => {
    it("should check string contains substring", () => {
      const html = '<div class="card">Content</div>';
      expect(html).toContain("card");
      expect(html).toContain("Content");
    });

    it("should check string with regex", () => {
      const text = "Hello World";
      expect(text).toMatch(/hello/i);
      expect(text).toMatch(/^Hello/);
    });
  });

  describe("Mocking with vi", () => {
    it("should mock functions", () => {
      const mockFn = vi.fn();
      mockFn("arg1", "arg2");

      expect(mockFn).toHaveBeenCalled();
      expect(mockFn).toHaveBeenCalledWith("arg1", "arg2");
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it("should mock return values", () => {
      const mockFn = vi.fn(() => "mocked value");
      expect(mockFn()).toBe("mocked value");
    });

    it("should mock modules", () => {
      vi.mock("./someModule.js", () => ({
        someFunction: vi.fn(() => "mocked"),
      }));
    });

    it("should clear mocks between tests", () => {
      const mockFn = vi.fn();
      mockFn();
      expect(mockFn).toHaveBeenCalledTimes(1);

      vi.clearAllMocks();
      expect(mockFn).not.toHaveBeenCalled();
    });
  });

  describe("Async testing", () => {
    it("should test async functions with async/await", async () => {
      const asyncFn = async () => {
        return new Promise(resolve => {
          setTimeout(() => resolve("done"), 10);
        });
      };

      const result = await asyncFn();
      expect(result).toBe("done");
    });

    it("should test promises", async () => {
      const promise = Promise.resolve("success");
      await expect(promise).resolves.toBe("success");
    });

    it("should test rejected promises", async () => {
      const promise = Promise.reject(new Error("failure"));
      await expect(promise).rejects.toThrow("failure");
    });
  });

  describe("Event testing", () => {
    it("should trigger events", () => {
      const button = document.createElement("button");
      const clickHandler = vi.fn();
      button.addEventListener("click", clickHandler);

      button.click();

      expect(clickHandler).toHaveBeenCalled();
    });

    it("should test custom events", () => {
      const handler = vi.fn();
      document.addEventListener("custom:event", handler);

      document.dispatchEvent(
        new CustomEvent("custom:event", {
          detail: { data: "test" },
        }),
      );

      expect(handler).toHaveBeenCalled();
      const event = handler.mock.calls[0][0];
      expect(event.detail.data).toBe("test");
    });
  });

  describe("Test organization", () => {
    it("should use describe blocks for grouping", () => {
      // Tests are organized in describe blocks
      expect(true).toBe(true);
    });

    it("should use beforeEach for setup", () => {
      // beforeEach runs before each test
      expect(document.body.innerHTML).toBe("");
    });

    it("should use afterAll for cleanup", () => {
      // afterAll runs after all tests in the describe block
      expect(true).toBe(true);
    });
  });

  describe("Error testing", () => {
    it("should test that functions throw errors", () => {
      const throwError = () => {
        throw new Error("Test error");
      };

      expect(() => throwError()).toThrow();
      expect(() => throwError()).toThrow("Test error");
      expect(() => throwError()).toThrow(Error);
    });

    it("should test error messages", () => {
      const throwError = () => {
        throw new Error("Specific error message");
      };

      expect(() => throwError()).toThrow(/Specific error/);
    });
  });

  afterAll(() => {
    // Cleanup after all tests
    document.body.innerHTML = "";
  });
});

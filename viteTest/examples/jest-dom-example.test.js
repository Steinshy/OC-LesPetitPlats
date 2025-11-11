/**
 * Example test file demonstrating @testing-library/jest-dom matchers
 * These matchers provide better assertions for DOM elements
 */

import { describe, it, expect, beforeEach } from "vitest";

describe("jest-dom matchers examples", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("should use toBeVisible matcher", () => {
    const element = document.createElement("div");
    element.style.display = "block";
    element.textContent = "Content";
    document.body.appendChild(element);

    expect(element).toBeVisible();
  });

  it("should use toBeInTheDocument matcher", () => {
    const element = document.createElement("div");
    element.textContent = "Content";
    document.body.appendChild(element);

    expect(element).toBeInTheDocument();
  });

  it("should use toHaveClass matcher", () => {
    const element = document.createElement("div");
    element.className = "active highlight";
    element.textContent = "Content";
    document.body.appendChild(element);

    expect(element).toHaveClass("active");
    expect(element).toHaveClass("highlight");
  });

  it("should use toHaveTextContent matcher", () => {
    const element = document.createElement("div");
    element.textContent = "Hello World";
    document.body.appendChild(element);

    expect(element).toHaveTextContent("Hello World");
    expect(element).toHaveTextContent(/hello/i);
  });

  it("should use toHaveAttribute matcher", () => {
    const element = document.createElement("input");
    element.type = "text";
    element.required = true;
    document.body.appendChild(element);

    expect(element).toHaveAttribute("type", "text");
    expect(element).toHaveAttribute("required");
  });

  it("should use toBeDisabled matcher", () => {
    const button = document.createElement("button");
    button.disabled = true;
    button.textContent = "Click me";
    document.body.appendChild(button);

    expect(button).toBeDisabled();
  });

  it("should use toBeEnabled matcher", () => {
    const button = document.createElement("button");
    button.textContent = "Click me";
    document.body.appendChild(button);

    expect(button).toBeEnabled();
  });

  it("should use toHaveValue matcher", () => {
    const input = document.createElement("input");
    input.type = "text";
    input.value = "test value";
    document.body.appendChild(input);

    expect(input).toHaveValue("test value");
  });

  it("should use toBeChecked matcher", () => {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = true;
    document.body.appendChild(checkbox);

    expect(checkbox).toBeChecked();
  });

  it("should use toBeEmptyDOMElement matcher", () => {
    const emptyDiv = document.createElement("div");
    document.body.appendChild(emptyDiv);

    expect(emptyDiv).toBeEmptyDOMElement();
  });
});

import { test, expect } from "@jest/globals";
import { normalizeURL, getURLsFromHTML } from "./crawl.js";

test("Normalize Url", () => {
  const url1 = "https://blog.boot.dev/path/";
  const url2 = "https://blog.boot.dev/path";
  const url3 = "http://blog.boot.dev/path/";
  const url4 = "http://blog.boot.dev/path";
  const expected = "blog.boot.dev/path";

  expect(normalizeURL(url1)).toBe(expected);
  expect(normalizeURL(url2)).toBe(expected);
  expect(normalizeURL(url3)).toBe(expected);
  expect(normalizeURL(url4)).toBe(expected);
  expect(normalizeURL("lel")).toBe(null);
  expect(normalizeURL()).toBe(null);
});

test("getURLsFromHTML absolute", () => {
  const inputURL = "https://blog.boot.dev";
  const inputBody =
    '<html><body><a href="https://blog.boot.dev"><span>Boot.dev></span></a></body></html>';
  const actual = getURLsFromHTML(inputBody, inputURL);
  const expected = ["https://blog.boot.dev/"];
  expect(actual).toEqual(expected);
});

test("getURLsFromHTML relative", () => {
  const inputURL = "https://blog.boot.dev";
  const inputBody =
    '<html><body><a href="/path/one"><span>Boot.dev></span></a></body></html>';
  const actual = getURLsFromHTML(inputBody, inputURL);
  const expected = ["https://blog.boot.dev/path/one"];
  expect(actual).toEqual(expected);
});

test("getURLsFromHTML both", () => {
  const inputURL = "https://blog.boot.dev";
  const inputBody =
    '<html><body><a href="/path/one"><span>Boot.dev></span></a><a href="https://other.com/path/one"><span>Boot.dev></span></a></body></html>';
  const actual = getURLsFromHTML(inputBody, inputURL);
  const expected = [
    "https://blog.boot.dev/path/one",
    "https://other.com/path/one",
  ];
  expect(actual).toEqual(expected);
});

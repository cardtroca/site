import { describe, expect, it } from "vitest";
import { androidIntentUrl, isInAppBrowser, platformOf, storeOrder } from "./links";

const IPHONE = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
const ANDROID = "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Mobile Safari/537.36";
const DESKTOP = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15";
const INSTAGRAM = `${IPHONE} Instagram 300.0.0.0`;

describe("links", () => {
  it("androidIntentUrl", () => {
    const url = androidIntentUrl("/card/x");
    expect(url.startsWith("intent://cardtroca.com/card/x#Intent;scheme=https;package=io.cardtroca;")).toBe(true);
    expect(url).toContain("S.browser_fallback_url=https%3A%2F%2Fplay.google.com");
    expect(url.endsWith(";end")).toBe(true);
  });
  it("platformOf", () => {
    expect(platformOf(IPHONE)).toBe("ios");
    expect(platformOf(ANDROID)).toBe("android");
    expect(platformOf(DESKTOP)).toBe("desktop");
  });
  it("isInAppBrowser", () => {
    expect(isInAppBrowser(INSTAGRAM)).toBe(true);
    expect(isInAppBrowser(`${ANDROID} [FBAN/FB4A;FBAV/400.0]`)).toBe(true);
    expect(isInAppBrowser(IPHONE)).toBe(false);
  });
  it("storeOrder", () => {
    expect(storeOrder("android")).toEqual(["google", "apple"]);
    expect(storeOrder("ios")).toEqual(["apple", "google"]);
    expect(storeOrder("desktop")).toEqual(["apple", "google"]);
  });
});

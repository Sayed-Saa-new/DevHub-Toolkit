import { describe, expect, it } from "bun:test";
import { isBlockedHost } from "./fetch-html.functions";

describe("SSRF Prevention - isBlockedHost", () => {
  it("blocks standard local hostnames and IPs", () => {
    expect(isBlockedHost("localhost")).toBe(true);
    expect(isBlockedHost("LOCALHOST")).toBe(true);
    expect(isBlockedHost("127.0.0.1")).toBe(true);
    expect(isBlockedHost("127.0.0.254")).toBe(true);
    expect(isBlockedHost("0.0.0.0")).toBe(true);
  });

  it("blocks IPv6 loopback with or without brackets", () => {
    expect(isBlockedHost("::1")).toBe(true);
    expect(isBlockedHost("[::1]")).toBe(true);
  });

  it("blocks IPv4-mapped IPv6 addresses", () => {
    expect(isBlockedHost("[::ffff:127.0.0.1]")).toBe(true);
    expect(isBlockedHost("::ffff:127.0.0.1")).toBe(true);
    expect(isBlockedHost("[::ffff:7f00:1]")).toBe(true);
    expect(isBlockedHost("::ffff:7f00:1")).toBe(true);
  });

  it("blocks internal RFC-1918 and metadata IP addresses", () => {
    expect(isBlockedHost("10.0.0.1")).toBe(true);
    expect(isBlockedHost("172.16.0.1")).toBe(true);
    expect(isBlockedHost("172.31.255.255")).toBe(true);
    expect(isBlockedHost("192.168.1.1")).toBe(true);
    expect(isBlockedHost("169.254.169.254")).toBe(true);
    expect(isBlockedHost("metadata.google.internal")).toBe(true);
    expect(isBlockedHost("kubernetes.default")).toBe(true);
  });

  it("allows valid public hostnames", () => {
    expect(isBlockedHost("example.com")).toBe(false);
    expect(isBlockedHost("google.com")).toBe(false);
    expect(isBlockedHost("schema.org")).toBe(false);
    expect(isBlockedHost("1.1.1.1")).toBe(false);
    expect(isBlockedHost("8.8.8.8")).toBe(false);
  });
});

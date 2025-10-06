import { shortenAddress, formatUSDC, parseUSDCValue } from "@/lib/wallet-utils"

describe("Wallet Utils", () => {
  describe("shortenAddress", () => {
    it("should shorten address correctly", () => {
      const address = "0x1234567890abcdef1234567890abcdef12345678"
      expect(shortenAddress(address)).toBe("0x1234...5678")
    })

    it("should handle empty address", () => {
      expect(shortenAddress("")).toBe("")
    })
  })

  describe("formatUSDC", () => {
    it("should format USDC value as currency", () => {
      expect(formatUSDC(1234.56)).toBe("$1,234.56")
      expect(formatUSDC("100")).toBe("$100.00")
    })
  })

  describe("parseUSDCValue", () => {
    it("should parse USDC value with decimals", () => {
      expect(parseUSDCValue("1000000", "6")).toBe("1.00")
      expect(parseUSDCValue("1500000", "6")).toBe("1.50")
    })
  })
})

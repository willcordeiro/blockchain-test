import { renderHook, act } from "@testing-library/react"
import { useWalletStore } from "@/stores/wallet-store"

describe("WalletStore", () => {
  beforeEach(() => {
    useWalletStore.setState({
      address: null,
      provider: null,
      isConnecting: false,
      error: null,
    })
  })

  it("should initialize with default values", () => {
    const { result } = renderHook(() => useWalletStore())

    expect(result.current.address).toBeNull()
    expect(result.current.provider).toBeNull()
    expect(result.current.isConnecting).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it("should disconnect wallet", () => {
    const { result } = renderHook(() => useWalletStore())

    act(() => {
      useWalletStore.setState({
        address: "0x123",
        provider: {} as any,
      })
    })

    expect(result.current.address).toBe("0x123")

    act(() => {
      result.current.disconnect()
    })

    expect(result.current.address).toBeNull()
    expect(result.current.provider).toBeNull()
  })

  it("should clear error", () => {
    const { result } = renderHook(() => useWalletStore())

    act(() => {
      useWalletStore.setState({ error: "Test error" })
    })

    expect(result.current.error).toBe("Test error")

    act(() => {
      result.current.clearError()
    })

    expect(result.current.error).toBeNull()
  })
})

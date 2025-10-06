import type { Meta, StoryObj } from "@storybook/react"
import { WalletButton } from "./wallet-button"

const meta: Meta<typeof WalletButton> = {
  title: "Wallet/WalletButton",
  component: WalletButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof WalletButton>

export const Default: Story = {}

export const DarkMode: Story = {
  parameters: {
    backgrounds: { default: "dark" },
  },
}

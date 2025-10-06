import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const address = searchParams.get("address")

  if (!address) {
    return NextResponse.json({ error: "Address is required" }, { status: 400 })
  }

  const apiKey = process.env.ETHERSCAN_API_KEY

  if (!apiKey) {
    return NextResponse.json({ error: "API key not configured" }, { status: 500 })
  }

  try {
    const response = await fetch(
      `https://api-sepolia.etherscan.io/api?module=account&action=tokentx&contractaddress=0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238&address=${address}&page=1&offset=100&sort=desc&apikey=${apiKey}`,
    )

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 })
  }
}

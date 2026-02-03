import { NextResponse } from "next/server";
import { Wallet } from "ethers";

export async function GET() {
  try {
    const pk = process.env.IEXEC_PRIVATE_KEY || "";
    if (!pk) {
      return NextResponse.json(
        { error: "Missing IEXEC_PRIVATE_KEY on server" },
        { status: 500 }
      );
    }

    const wallet = new Wallet(pk);
    return NextResponse.json({ address: wallet.address });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to read wallet" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { IExec, IExecConfig, utils } from "iexec";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amountNrlc } = body || {};

    if (!amountNrlc || !Number.isInteger(amountNrlc) || amountNrlc <= 0) {
      return NextResponse.json(
        { error: "amountNrlc must be a positive integer (nRLC)" },
        { status: 400 }
      );
    }

    const pk = process.env.IEXEC_PRIVATE_KEY || "";
    if (!pk) {
      return NextResponse.json(
        { error: "Missing IEXEC_PRIVATE_KEY on server" },
        { status: 500 }
      );
    }

    const ethProvider = utils.getSignerFromPrivateKey(
      "https://sepolia-rollup.arbitrum.io/rpc",
      pk
    );

    const config = new IExecConfig(
      { ethProvider },
      {
        allowExperimentalNetworks: true,
        defaultTeeFramework: "scone",
        smsURL: "https://sms.arbitrum-sepolia-testnet.iex.ec",
        resultProxyURL: "https://result-proxy.arbitrum-sepolia-testnet.iex.ec",
        ipfsGatewayURL: "https://ipfs-gateway.arbitrum-sepolia-testnet.iex.ec",
      }
    );

    const iexec = IExec.fromConfig(config);
    const result = await iexec.account.deposit(amountNrlc);

    return NextResponse.json({ result });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to stake RLC" },
      { status: 500 }
    );
  }
}

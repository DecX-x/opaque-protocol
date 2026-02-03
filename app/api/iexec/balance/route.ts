import { NextResponse } from "next/server";
import { IExec, IExecConfig, utils } from "iexec";

export async function GET() {
  try {
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
    const address = await iexec.wallet.getAddress();
    const balance = await iexec.account.checkBalance(address);

    return NextResponse.json({
      address,
      stake: balance.stake.toString(),
      locked: balance.locked.toString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to fetch balance" },
      { status: 500 }
    );
  }
}

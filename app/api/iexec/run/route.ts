import { NextResponse } from "next/server";
import { IExec, IExecConfig, utils } from "iexec";
import { JsonRpcProvider } from "ethers";
import { CONTRACTS } from "@/constants";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { protectedDataAddress, orderJson } = body || {};

    // For reserve model, we can pass order data directly as args
    // or still use protected data for privacy
    if (!protectedDataAddress && !orderJson) {
      return NextResponse.json(
        { error: "Missing protectedDataAddress or orderJson" },
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

    const app = CONTRACTS.IEXEC.IAPP_ADDRESS;
    const reserveAddress = CONTRACTS.ARBITRUM_SEPOLIA.RESERVE;

    const workerpoolOrderbook = await iexec.orderbook.fetchWorkerpoolOrderbook({
      category: 0,
      minTag: ["tee", "scone"],
    });

    const workerpoolorder = workerpoolOrderbook?.orders?.[0]?.order;
    if (!workerpoolorder) {
      return NextResponse.json(
        { error: "No workerpool order available" },
        { status: 500 }
      );
    }

    // Build args: first arg is reserve address, then order JSON
    // Format: "RESERVE_ADDRESS ORDER_JSON"
    let iexecArgs = reserveAddress;
    if (orderJson) {
      iexecArgs = `${reserveAddress} ${JSON.stringify(orderJson)}`;
    }

    let datasetorder = null;
    if (protectedDataAddress) {
      const datasetOrderbook = await iexec.orderbook.fetchDatasetOrderbook({
        dataset: protectedDataAddress,
        app,
        requester: await iexec.wallet.getAddress(),
        isAppStrict: true,
        isRequesterStrict: true,
      });

      datasetorder = datasetOrderbook?.orders?.[0]?.order;
      if (!datasetorder) {
        return NextResponse.json(
          { error: "No dataset order available for protected data" },
          { status: 500 }
        );
      }
    }

    const apporderTemplate = await iexec.order.createApporder({
      app,
      appprice: 0,
      tag: ["tee", "scone"],
      workerpoolrestrict: workerpoolorder.workerpool,
    });
    const apporder = await iexec.order.signApporder(apporderTemplate, {
      preflightCheck: false,
    });

    const requestorderTemplate = await iexec.order.createRequestorder({
      app,
      category: 0,
      dataset: protectedDataAddress || "0x0000000000000000000000000000000000000000",
      params: {
        iexec_args: iexecArgs,
      },
      appmaxprice: 0,
      datasetmaxprice: datasetorder?.datasetprice || 0,
      workerpoolmaxprice: workerpoolorder.workerpoolprice || 10,
    });
    const requestorder = await iexec.order.signRequestorder(requestorderTemplate);

    const matchOrdersParams: any = {
      apporder,
      workerpoolorder,
      requestorder,
    };
    
    if (datasetorder) {
      matchOrdersParams.datasetorder = datasetorder;
    }

    const { dealid, txHash } = await iexec.order.matchOrders(matchOrdersParams);

    const rpcProvider = new JsonRpcProvider(
      "https://sepolia-rollup.arbitrum.io/rpc"
    );
    const receipt = await rpcProvider.waitForTransaction(txHash, 1, 120000);
    if (!receipt || receipt.status !== 1) {
      throw new Error(`matchOrders tx failed: ${txHash}`);
    }

    const waitDeal = async () => {
      const attempts = 40;
      for (let i = 0; i < attempts; i += 1) {
        try {
          await iexec.deal.show(dealid);
          return;
        } catch {
          await new Promise((r) => setTimeout(r, 3000));
        }
      }
      throw new Error("Deal not found after retries");
    };

    await waitDeal();

    const taskId = await iexec.deal.computeTaskId(dealid, 0);

    return NextResponse.json({ deal: dealid, task: taskId, txHash });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to run iApp" },
      { status: 500 }
    );
  }
}

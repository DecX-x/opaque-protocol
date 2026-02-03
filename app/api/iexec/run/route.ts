import { NextResponse } from "next/server";
import { IExec, IExecConfig, utils } from "iexec";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { protectedDataAddress } = body || {};

    if (!protectedDataAddress) {
      return NextResponse.json(
        { error: "Missing protectedDataAddress" },
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

    const app = "0xdE4f4aC58a35Fc70Abc4AfDD7F41EA4C4fc8BB4f";
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

    const datasetOrderbook = await iexec.orderbook.fetchDatasetOrderbook({
      dataset: protectedDataAddress,
      app,
      requester: await iexec.wallet.getAddress(),
      isAppStrict: true,
      isRequesterStrict: true,
    });

    const datasetorder = datasetOrderbook?.orders?.[0]?.order;
    if (!datasetorder) {
      return NextResponse.json(
        { error: "No dataset order available for protected data" },
        { status: 500 }
      );
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
      dataset: protectedDataAddress,
      params: "",
      appmaxprice: 0,
      datasetmaxprice: datasetorder.datasetprice,
      workerpoolmaxprice: workerpoolorder.workerpoolprice || 10,
    });
    const requestorder = await iexec.order.signRequestorder(requestorderTemplate);

    const { dealid, txHash } = await iexec.order.matchOrders({
      apporder,
      datasetorder,
      workerpoolorder,
      requestorder,
    });

    const taskId = await iexec.deal.computeTaskId(dealid, 0);

    return NextResponse.json({ deal: dealid, task: taskId, txHash });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to run iApp" },
      { status: 500 }
    );
  }
}

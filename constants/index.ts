export const CONTRACTS = {
  ARBITRUM_SEPOLIA: {
    USDC: "0x7568f9E2D79eB7fE4396BC78fbB63303d984901A",
    WETH: "0xd694475B5c7D2610dfcBc9F3ea83377A3ac4C5BB",
    VAULT: "0xe12188789Ca4Ddf15dD683993c91aD5C391a7f70",
  },
  IEXEC: {
    IAPP_ADDRESS: "0x16Fb8368B1C6CD5C4727Ca3051Ea98695C80236C",
  }
};

export const VAULT_ABI = [
  "function deposit(address token, uint256 amount) external",
  "function withdraw(address token, uint256 amount) external",
  "function settleBatch(tuple(address buyer, address seller, address tokenBuy, address tokenSell, uint256 amountBuy, uint256 amountSell, uint256 nonce)[] trades, bytes signature) external",
  "function balances(address user, address token) external view returns (uint256)"
];

export const ERC20_ABI = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function balanceOf(address account) external view returns (uint256)",
  "function mint(address to, uint256 amount) external" 
];

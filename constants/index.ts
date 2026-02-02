import { parseAbi } from "viem";

export const CONTRACTS = {
  ARBITRUM_SEPOLIA: {
    USDC: "0xaB11C99BdfeEbd8DaE856B2198222091b09d3b9d",
    WETH: "0x12A863f8c557a4cf93BD872Dc1CA9F4aD2EbDB64",
    WBTC: "0xCE92A00Fe30FD461d7d800dDC1657e2436acF581",
    LINK: "0x9321436d7C2114D1707268F617a5D9b95cd548b1",
    SOL: "0x5A32446d6790234d8f504bc0bF3eD22F10662A34",
    VAULT: "0x1E3Dfb508CadbFAa60c913876Bd4766c30E56562",
    ORACLE: "0x74425Dd6Cf65BAbDFb83AAe69550C0B4C065FB7c",
  },
  IEXEC: {
    IAPP_ADDRESS: "0xdE4f4aC58a35Fc70Abc4AfDD7F41EA4C4fc8BB4f",
  }
};

export const VAULT_ABI = parseAbi([
  "function deposit(address token, uint256 amount) external",
  "function withdraw(address token, uint256 amount) external",
  "function settleBatch((address buyer, address seller, address tokenBuy, address tokenSell, uint256 amountBuy, uint256 amountSell, uint256 nonce)[] trades, bytes signature) external",
  "function balances(address user, address token) external view returns (uint256)",
  "function setTeeSigner(address _teeSigner) external"
]);

export const ERC20_ABI = parseAbi([
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function balanceOf(address account) external view returns (uint256)",
  "function mint(address to, uint256 amount) external" 
]);

export const ORACLE_ABI = parseAbi([
  "function getPrice(address token) external view returns (uint256)"
]);

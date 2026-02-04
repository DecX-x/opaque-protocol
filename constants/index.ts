import { parseAbi } from "viem";

export const CONTRACTS = {
  ARBITRUM_SEPOLIA: {
    USDC: "0x6e267555409dd2d9AA2a314C15fC506400c7e648",
    WETH: "0xc9406cBCE0C651BA83cca1a9a852486DFE6B9CED",
    WBTC: "0xc53f09386F0FA32EA470044f9F4360F6dD894516",
    LINK: "0xDfd902FAD9a94EC5aDc30030D1074cC892c0BB31",
    SOL: "0xD65697F071fBf3A7A2654F51120e7E3b05E1A591",
    VAULT: "0xc4ba886Dde719f8302203ffED1865CBf911cAF97",
    RESERVE: "0x8b9616c56fc48cf040F7204CFD6D67ef34f6CF21",
    ORACLE: "0x74425Dd6Cf65BAbDFb83AAe69550C0B4C065FB7c", // Keep old oracle for now
  },
  IEXEC: {
    IAPP_ADDRESS: "0xcEeBEe91C442c6345Ae341ed6d51721d8F7e9e17",
    TEE_SIGNER: "0x19E7E376E7C213B7E7e7e46cc70A5dD086DAff2A",
  }
};

export const VAULT_ABI = parseAbi([
  "function deposit(address token, uint256 amount) external",
  "function withdraw(address token, uint256 amount) external",
  "function settleBatch((address buyer, address seller, address tokenBuy, address tokenSell, uint256 amountBuy, uint256 amountSell, uint256 nonce)[] trades, bytes signature) external",
  "function balances(address user, address token) external view returns (uint256)",
  "function setTeeSigner(address _teeSigner) external",
  "function setReserve(address _reserve) external",
  "function fundReserve(address token, uint256 amount) external",
  "function getReserveBalance(address token) external view returns (uint256)",
  "function reserve() external view returns (address)",
  "function teeSigner() external view returns (address)"
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

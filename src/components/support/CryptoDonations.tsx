'use client';
import Image from "next/image";
import { useState } from "react";
import { CRYPTO_ADDRESSES } from "@/config/crypto";

type CoinKey = "ETH" | "BTC" | "LTC" | "DOGE";

const COINS: {
  key: CoinKey;
  name: string;
  ticker: string;
  address: string;
  qrSrc: string;   // public path
  iconSrc: string; // coin logo
}[] = [
  {
    key: "ETH",
    name: "Ethereum",
    ticker: "ETH",
    address: CRYPTO_ADDRESSES.ETH,
    qrSrc: "/qr/eth.png",
    iconSrc: "/icons/eth.svg",
  },
  {
    key: "BTC",
    name: "Bitcoin",
    ticker: "BTC",
    address: CRYPTO_ADDRESSES.BTC,
    qrSrc: "/qr/btc.png",
    iconSrc: "/icons/btc.svg",
  },
  {
    key: "LTC",
    name: "Litecoin",
    ticker: "LTC",
    address: CRYPTO_ADDRESSES.LTC,
    qrSrc: "/qr/ltc.png",
    iconSrc: "/icons/ltc.svg",
  },
  {
    key: "DOGE",
    name: "Dogecoin",
    ticker: "DOGE",
    address: CRYPTO_ADDRESSES.DOGE,
    qrSrc: "/qr/doge.png",
    iconSrc: "/icons/doge.svg",
  },
];

export default function CryptoDonations() {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (text: string, coin: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(coin);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {COINS.map((c) => (
        <div key={c.key} className="rounded-2xl border p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Image
              src={c.iconSrc}
              alt={`${c.name} logo`}
              width={24}
              height={24}
              className="rounded-full"
            />
            <h3 className="text-lg font-semibold">{c.name} ({c.ticker})</h3>
          </div>

          <div className="mt-3 flex justify-center">
            <Image
              src={c.qrSrc}
              alt={`${c.name} QR`}
              width={220}
              height={220}
              className="rounded-lg"
              priority
            />
          </div>

          <p className="mt-3 break-all text-sm">
            <span className="font-medium">Address:</span> {c.address}
          </p>

          <div className="mt-3 flex gap-2">
            <button
              className="rounded-lg border px-3 py-1 text-sm hover:bg-gray-50"
              onClick={() => copy(c.address, c.ticker)}
            >
              {copied === c.ticker ? "Copied!" : "Copy address"}
            </button>
            <a
              href={c.qrSrc}
              download={`${c.ticker}-qr.png`}
              className="rounded-lg border px-3 py-1 text-sm hover:bg-gray-50"
            >
              Download QR
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
import {
  Credenza,
  CredenzaBody,
  CredenzaClose,
  CredenzaContent,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTrigger,
} from "@/components/ui/credenza";
import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import { useWallet } from "@solana/wallet-adapter-react";

const WalletMultiButtonDynamic = dynamic(
  () =>
    import("@solana/wallet-adapter-react-ui").then(
      (mod) => mod.WalletMultiButton
    ),
  { ssr: false }
);

const Navbar = () => {
  const wallet = useWallet();
  const { select, wallets } = useWallet();
  const [scrollingDown, setScrollingDown] = useState(false);
  const [connectedToastShown, setConnectedToastShown] = useState(false);
  const [disconnectedToastShown, setDisconnectedToastShown] = useState(false);

  useEffect(() => {
    if (wallet.connected && wallet.publicKey && !connectedToastShown) {
      toast.success(`Connected to ${wallet.publicKey.toBase58()}`);
      setConnectedToastShown(true);
    } else if (
      !wallet.connecting &&
      !wallet.connected &&
      !disconnectedToastShown
    ) {
      toast.info("Disconnected from wallet");
      setDisconnectedToastShown(true);
    }

    const handleScroll = () => {
      if (window.scrollY > 0) {
        setScrollingDown(true);
      } else {
        setScrollingDown(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [
    wallet.connected,
    wallet.connecting,
    wallet.publicKey,
    connectedToastShown,
    disconnectedToastShown,
  ]);

  return (
    <nav
      className={`max-sm:max-w-sm bg-background/80 fixed top-5 left-1/2 transform -translate-x-1/2 container mx-auto p-0 border border-border rounded-3xl shadow-xl z-50 transition-transform duration-300 ease-in-out ${
        scrollingDown
          ? "translate-y-[-100%] opacity-0"
          : "translate-y-0 opacity-100"
      }`}
    >
      <div className="container mx-auto flex justify-between items-center px-6 py-2">
        <Link href="/" passHref>
          <img src="/sol.png" alt="logo" className="h-8 w-8" />
        </Link>

        <div className="flex items-center space-x-4">
          <Credenza>
            {!wallet.connected && (
              <CredenzaTrigger asChild>
                <Button size="lg" className="text-md rounded-sm p-6">
                  Connect Wallet
                </Button>
              </CredenzaTrigger>
            )}
            {wallet.connected && <WalletMultiButtonDynamic />}

            <CredenzaContent className="h-[50svh] max-sm:max-h-[60svh]">
              <CredenzaHeader className="text-center justify-center items-center">
                <h2 className="text-2xl font-bold mb-4 text-center">
                  Connect a Wallet on <br /> Solana to Continue
                </h2>
              </CredenzaHeader>

              <CredenzaBody className="overflow-y-auto">
                {wallets.map((wallet) => (
                  <CredenzaClose
                    key={wallet.adapter.name}
                    className="flex items-center justify-between p-3 hover:bg-gray-800 rounded cursor-pointer w-full"
                  >
                    <div
                      className="flex justify-between items-center w-full"
                      onClick={() => {
                        select(wallet.adapter.name);
                      }}
                    >
                      <div className="flex items-center">
                        <img
                          className="w-6 h-6 mr-2"
                          src={wallet.adapter.icon}
                          alt={wallet.adapter.name}
                        />
                        <span className="text-white">
                          {wallet.adapter.name}
                        </span>
                      </div>
                      {wallet.readyState === "Installed" && (
                        <div className="flex justify-end">
                          <span className="text-sm text-gray-400">
                            Detected
                          </span>
                        </div>
                      )}
                    </div>
                  </CredenzaClose>
                ))}
              </CredenzaBody>

              <CredenzaFooter className="text-center">
                <img
                  src="https://solana.com/_next/static/media/solanaLogo.74d35f7a.svg"
                  alt="Solana Logo"
                  className="w-full h-3"
                />
              </CredenzaFooter>
            </CredenzaContent>
          </Credenza>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

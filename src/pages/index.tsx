import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Credenza,
  CredenzaBody,
  CredenzaContent,
  CredenzaHeader,
  CredenzaTrigger,
} from "@/components/ui/credenza";
import {
  DiscordLogoIcon,
  GlobeIcon,
  TwitterLogoIcon,
} from "@radix-ui/react-icons";
import React, { useEffect, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/utils/supabaseClient";
import { toast } from "sonner";
import { useRegistrationStatus } from "@/utils/useRegistrationStatus";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletBalanceCheck } from "@/utils/useBalance";
import whitelistData from "@/config/config";

type TimeLeft = {
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
};

export default function Home() {
  const { select, wallets, publicKey, disconnect } = useWallet();
  const isRegistrationOpen = useRegistrationStatus(whitelistData);
  const [isChecking, setIsChecking] = useState(false);
  const [twitterButtonText, setTwitterButtonText] = useState("Follow");
  const { balance, isBalanceHighEnough } = useWalletBalanceCheck(
    publicKey?.toBase58() || null,
    whitelistData
  );

  const userAddress = useMemo(() => publicKey?.toBase58() || "", [publicKey]);
  const [discordUsername, setDiscordUsername] = useState("");

  const handleSubmit = async () => {
    if (!publicKey) {
      toast.error("Please connect your wallet.");
      return;
    }

    if (whitelistData.requireDiscordJoin && !discordUsername) {
      toast.error("We are working on discord verification.");
      return;
    }

    if (!isBalanceHighEnough) {
      toast.error(
        "Project submission failed. Minimum wallet balance is not met."
      );
      return;
    }

    const followedStatus = isChecking ? "Followed" : "Not Followed";

    const entryData = {
      useraddress: userAddress || null,
      discordusername: discordUsername || null,
      balance: balance || null,
      followed: followedStatus || null,
      timestamp: new Date().toISOString(),
    };

    try {
      if (
        whitelistData.requireTwitterFollow &&
        twitterButtonText !== "Followed"
      ) {
        toast.error("You must follow us on Twitter to submit.");
      } else {
        const { data, error } = await supabase
          .from("whitelist")
          .insert([entryData]);

        if (error) {
          if (
            error.message.includes(
              "duplicate key value violates unique constraint"
            )
          ) {
            toast.error("Entry Found! You have already submitted an address.");
          } else {
            console.error(error);
            toast.error(
              "Error submitting data: " + (error.message || "Unknown error")
            );
          }
        } else {
          toast.success("Submitted successfully!");
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while submitting the data.");
    }
  };

  const handleFollow = async () => {
    setIsChecking(true);
    window.open(whitelistData.twitterUrl, "_blank");

    const loadingPhrases = [
      "Checking Twitter follow status...",
      "Confirming follow action...",
      "Validating Twitter interaction...",
      "This should only take a few seconds...",
    ];

    const ApiCheck = async () => {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve();
        }, 20000);
      });
    };

    let loadingIndex = 0;
    const loadingInterval = setInterval(() => {
      toast.loading(loadingPhrases[loadingIndex]);
      loadingIndex = (loadingIndex + 1) % loadingPhrases.length;
    }, 3000);

    try {
      await ApiCheck();
      clearInterval(loadingInterval);
      toast.dismiss();
      setTwitterButtonText("Followed");
      toast.success("Followed successfully!");
    } catch (error) {
      console.error("Follow failed:", error);
      clearInterval(loadingInterval);
      toast.dismiss();
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsChecking(false);
    }
  };

  const handleDiscordConnect = async () => {
    toast.info("Coming soon!");
  };

  const calculateTimeLeft = () => {
    const difference =
      +new Date(whitelistData.registrationEndDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  function CountdownUnit({ value, label }: { value?: number; label: string }) {
    return (
      <div className="countdown-unit">
        <span className="countdown-value text-2xl font-bold text-primary">
          {value ?? 0}
        </span>
        <span className="countdown-label text-lg font-semibold text-muted">
          {label}
        </span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 max-sm:px-4 pt-24 md:pt-26">
      {whitelistData && (
        <div>
          <div className="relative">
            <img
              src={whitelistData.bannerUrl}
              alt="Banner"
              className="w-full h-64 rounded-3xl"
            />
          </div>
          <div className="flex justify-end items-center mb-4 mt-4">
            <div className="w-48 h-48 -mt-48 z-10 mr-10 md:mr-20 rounded-full bg-card p-2">
              <img
                src={whitelistData.profilePictureUrl}
                alt="Profile Picture"
                className="rounded-full"
              />
            </div>
          </div>
          <div className="flex mb-2 gap-8">
            <h1 className="text-4xl font-bold">{whitelistData.projectName}</h1>
            <div className="flex flex-row items-end gap-4">
              {!whitelistData.websiteUrl ? null : (
                <a
                  href={whitelistData.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold underline"
                >
                  <GlobeIcon className="w-8 h-8 hover:scale-105 transition-all" />
                </a>
              )}
              {!whitelistData.twitterUrl ? null : (
                <a
                  href={whitelistData.twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold underline"
                >
                  <TwitterLogoIcon className="w-8 h-8 hover:scale-105 transition-all" />
                </a>
              )}
              {!whitelistData.discordUrl ? null : (
                <a
                  href={whitelistData.discordUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold underline"
                >
                  <DiscordLogoIcon className="w-8 h-8 hover:scale-105 transition-all" />
                </a>
              )}
            </div>
          </div>
          <div className="mb-4 max-w-6xl">{whitelistData.description}</div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="border rounded-lg shadow">
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold">Mint Details</h2>
                  <p
                    className={`text-lg ${
                      isRegistrationOpen ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {isRegistrationOpen ? "Active" : "Inactive"}
                    <span
                      className={`w-4 h-4 ml-2 rounded-full inline-block ${
                        isRegistrationOpen
                          ? "bg-green-500 animate-pulse"
                          : "bg-red-500"
                      }`}
                    ></span>
                  </p>
                </div>

                <div className="mt-4">
                  <div className="flex justify-between">
                    <span>Registration Start Date:</span>
                    <Badge variant="outline" className="text-sm mb-2">
                      {new Date(
                        whitelistData.registrationStartDate
                      ).toLocaleString()}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Registration End Date:</span>
                    <Badge variant="outline" className="text-sm mb-2">
                      {new Date(
                        whitelistData.registrationEndDate
                      ).toLocaleString()}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Mint Price (SOL):</span>
                    <Badge variant="outline" className="text-sm mb-2">
                      {whitelistData.mintPrice} SOL
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Supply:</span>
                    <Badge variant="outline" className="text-sm mb-2">
                      {whitelistData.totalSupply} NFTs
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t">
                <h2 className="text-2xl font-semibold">Verification</h2>
                <div className="mt-4">
                  <div className="flex justify-between">
                    <span>Minimum Wallet Balance (SOL):</span>
                    <Badge variant="outline" className="text-sm mb-2">
                      {whitelistData.minimumWalletBalance} SOL
                    </Badge>
                  </div>

                  {whitelistData.requireDiscordJoin && (
                    <>
                      <div className="flex justify-between">
                        <span>Verify Discord Role:</span>
                        <Badge variant="outline" className="text-sm mb-2">
                          {whitelistData.verifyDiscordRole.name}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Verify Discord Membership:</span>
                        <Badge variant="outline" className="text-sm mb-2">
                          {whitelistData.verifyDiscordMembership.name}
                        </Badge>
                      </div>
                    </>
                  )}

                  {whitelistData.requireTwitterFollow && (
                    <div className="flex justify-between">
                      <span>Follow Twitter:</span>
                      <Badge variant="outline" className="text-sm mb-2">
                        <a
                          href={whitelistData.twitterUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300"
                        >
                          {whitelistData.twitterUrl.split("/").pop()}
                        </a>
                      </Badge>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 border-t">
                <h2 className="text-2xl font-semibold">Results</h2>
                <div className="mt-4">
                  <div className="flex justify-between">
                    <span>Number of Winners:</span>
                    <Badge variant="outline" className="text-sm mb-2">
                      {whitelistData.numberOfWinners} Winners
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Number of Max Entries:</span>
                    <Badge variant="outline" className="text-sm mb-2">
                      {whitelistData.registrationLimit || "Unlimited"} Entries
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">
                    Sign Up for Whitelist
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="mb-6">
                    <div className="bg-muted p-4 rounded-md flex items-center">
                      <div
                        className={`w-4 h-4 rounded-full ${
                          publicKey ? "bg-green-500" : "bg-red-500"
                        }`}
                        aria-hidden="true"
                      ></div>
                      <span className="ml-2 text-xs flex-shrink-0">
                        Address:
                      </span>
                      {publicKey ? (
                        <div className="flex items-center w-full ml-2">
                          <Input
                            type="text"
                            id="publicKey"
                            className="text-xs flex-grow shadow-transparent"
                            value={publicKey.toBase58()}
                            disabled
                          />
                          <Button disabled className="text-xs">
                            Connected
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center w-full ml-2">
                          <Input
                            type="text"
                            id="publicKey"
                            className="text-xs flex-grow shadow-transparent"
                            value={""}
                            disabled
                          />
                          <Credenza>
                            <CredenzaTrigger asChild>
                              <Button className="text-xs">Select Wallet</Button>
                            </CredenzaTrigger>
                            <CredenzaContent className="max-w-sm mx-auto">
                              <CredenzaHeader className="text-center justify-center items-center">
                                <h2 className="text-2xl font-bold mb-4 text-center">
                                  Connect a Wallet on <br /> Solana to Continue
                                </h2>
                              </CredenzaHeader>
                              <CredenzaBody>
                                {wallets.map((wallet) => (
                                  <div
                                    key={wallet.adapter.name}
                                    className="flex items-center justify-between p-3 hover:bg-gray-800 rounded cursor-pointer"
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
                                      <span className="text-sm text-gray-400">
                                        Detected
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </CredenzaBody>
                            </CredenzaContent>
                          </Credenza>
                        </div>
                      )}
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                      * Your address will autofill when you connect your wallet.
                    </p>
                  </div>

                  <div className="mb-6">
                    <div className="bg-muted p-6 rounded-md flex justify-between items-center">
                      <div className="flex items-center">
                        <div
                          className={`w-4 h-4 rounded-full ${
                            isBalanceHighEnough ? "bg-green-500" : "bg-red-500"
                          }`}
                          aria-hidden="true"
                        ></div>
                        <span className="ml-2 text-xs">
                          You must hold at least{" "}
                          {whitelistData.minimumWalletBalance} SOL to enter this
                          whitelist.
                        </span>
                      </div>
                      <span
                        className={`font-bold text-xs ${
                          isBalanceHighEnough
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {isBalanceHighEnough
                          ? `${balance} Sufficient`
                          : "Insufficient"}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                      * Your entry may be disqualified if your wallet balance
                      falls below {whitelistData.minimumWalletBalance} SOL
                      before registration closes.
                    </p>
                  </div>

                  {whitelistData.requireDiscordJoin && (
                    <div className="mb-6">
                      <div className="bg-muted p-4 rounded-md flex justify-between items-center">
                        <div className="flex items-center">
                          <span className="text-xs">
                            Join the{" "}
                            <a
                              href={whitelistData.discordUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-300"
                            >
                              {whitelistData.verifyDiscordMembership.name}
                            </a>{" "}
                            and have the &quot;
                            {whitelistData.verifyDiscordRole.name}&quot; role.
                          </span>
                        </div>
                        <Button
                          onClick={handleDiscordConnect}
                          className="text-xs"
                        >
                          Connect
                        </Button>
                      </div>
                      <p className="mt-2 text-xs text-gray-500">
                        * Maintain server membership and role status before
                        registration closes.
                      </p>
                    </div>
                  )}

                  {whitelistData.requireTwitterFollow && (
                    <div className="mb-0">
                      <div className="bg-muted p-4 rounded-md flex justify-between items-center">
                        <div className="flex items-center">
                          <span className="text-xs">
                            Follow{" "}
                            <a
                              href={whitelistData.twitterUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-300"
                            >
                              {whitelistData.twitterUrl.split("/").pop()}
                            </a>{" "}
                            and stay updated.
                          </span>
                        </div>
                        <Button
                          onClick={handleFollow}
                          disabled={
                            isChecking || twitterButtonText === "Followed"
                          }
                        >
                          {isChecking ? "Checking..." : twitterButtonText}
                        </Button>
                      </div>
                      <p className="mt-2 text-xs text-gray-500">
                        * Stay connected for updates from this account.
                      </p>
                    </div>
                  )}
                </CardContent>

                <CardFooter className="flex flex-col justify-center items-center">
                  {timeLeft.days &&
                    isRegistrationOpen &&
                    isBalanceHighEnough &&
                    userAddress &&
                    balance && (
                      <Button
                        disabled={
                          !isRegistrationOpen ||
                          !isBalanceHighEnough ||
                          !userAddress ||
                          (whitelistData.requireDiscordJoin &&
                            !discordUsername) ||
                          (whitelistData.requireTwitterFollow &&
                            twitterButtonText === "Follow")
                        }
                        onClick={handleSubmit}
                      >
                        Sign up for {whitelistData.projectName} Whitelist
                      </Button>
                    )}

                  <div className="text-center">
                    {timeLeft.days ? (
                      <div className="countdown text-sm text-center">
                        <p className="text-lg font-bold text-muted">
                          Registration closes in
                        </p>
                        <div className="countdown-timer flex flex-wrap justify-center space-x-2 sm:space-x-6 sm:space-y-0 mt-2">
                          <CountdownUnit value={timeLeft.days} label="D" />
                          <CountdownUnit value={timeLeft.hours} label="H" />
                          <CountdownUnit value={timeLeft.minutes} label="M" />
                          <CountdownUnit value={timeLeft.seconds} label="S" />
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-sm py-2">
                        <p className="text-xl font-bold">
                          Registration period has ended.
                        </p>
                      </div>
                    )}
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

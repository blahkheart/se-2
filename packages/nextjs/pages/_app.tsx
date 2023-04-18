// import { useEffect } from "react";
// import type { AppProps } from "next/app";
// import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
// import { GetSiweMessageOptions, RainbowKitSiweNextAuthProvider } from "@rainbow-me/rainbowkit-siwe-next-auth";
// import "@rainbow-me/rainbowkit/styles.css";
// import { Session } from "next-auth";
// import { SessionProvider } from "next-auth/react";
// import NextNProgress from "nextjs-progressbar";
// import { Toaster } from "react-hot-toast";
// import { WagmiConfig } from "wagmi";
// import { Footer } from "~~/components/Footer";
// import { Header } from "~~/components/Header";
// import { BlockieAvatar } from "~~/components/scaffold-eth";
// import { useEthPrice } from "~~/hooks/scaffold-eth";
// import { useAppStore } from "~~/services/store/store";
// import { wagmiClient } from "~~/services/web3/wagmiClient";
// import { appChains } from "~~/services/web3/wagmiConnectors";
// import "~~/styles/globals.css";
// const ScaffoldEthApp = ({ Component, pageProps }: AppProps<{ session: Session }>) => {
//   const price = useEthPrice();
//   const setEthPrice = useAppStore(state => state.setEthPrice);
//   const getSiweMessageOptions: GetSiweMessageOptions = () => ({
//     statement: "Sign in with Ethereum to Ghost Unlock.",
//   });
//   useEffect(() => {
//     if (price > 0) {
//       setEthPrice(price);
//     }
//   }, [setEthPrice, price]);
//   return (
//     <WagmiConfig client={wagmiClient}>
//       <NextNProgress />
//       <SessionProvider session={pageProps.session} refetchInterval={0}>
//         <RainbowKitSiweNextAuthProvider getSiweMessageOptions={getSiweMessageOptions}>
//           <RainbowKitProvider chains={appChains.chains} avatar={BlockieAvatar}>
//             <div className="flex flex-col min-h-screen">
//               <Header />
//               <main className="relative flex flex-col flex-1">
//                 <Component {...pageProps} />
//               </main>
//               <Footer />
//             </div>
//             <Toaster />
//           </RainbowKitProvider>
//         </RainbowKitSiweNextAuthProvider>
//       </SessionProvider>
//     </WagmiConfig>
//   );
// }
// export default ScaffoldEthApp;
import { useEffect } from "react";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { GetSiweMessageOptions, RainbowKitSiweNextAuthProvider } from "@rainbow-me/rainbowkit-siwe-next-auth";
import "@rainbow-me/rainbowkit/styles.css";
import { useSession } from "next-auth/react";
import { SessionProvider } from "next-auth/react";
import NextNProgress from "nextjs-progressbar";
import { Toaster } from "react-hot-toast";
import { WagmiConfig } from "wagmi";
import { Footer } from "~~/components/Footer";
import { Header } from "~~/components/Header";
import { BlockieAvatar } from "~~/components/scaffold-eth";
import { useEthPrice } from "~~/hooks/scaffold-eth";
import { useAppStore } from "~~/services/store/store";
import { wagmiClient } from "~~/services/web3/wagmiClient";
import { appChains } from "~~/services/web3/wagmiConnectors";
import "~~/styles/globals.css";

interface AppProps {
  Component: any;
  pageProps: {
    session: any;
    [key: string]: any;
  };
}

export default function ScaffoldEthApp({ Component, pageProps }: AppProps) {
  const { session, ...rest } = pageProps;
  const price = useEthPrice();
  const setEthPrice = useAppStore(state => state.setEthPrice);

  const getSiweMessageOptions: GetSiweMessageOptions = () => ({
    statement: "Sign in with Ethereum to Ghost Unlock.",
  });

  useEffect(() => {
    if (price > 0) {
      setEthPrice(price);
    }
  }, [setEthPrice, price]);

  return (
    <WagmiConfig client={wagmiClient}>
      <NextNProgress />
      <SessionProvider session={session} refetchInterval={0}>
        <RainbowKitSiweNextAuthProvider getSiweMessageOptions={getSiweMessageOptions}>
          <RainbowKitProvider chains={appChains.chains} avatar={BlockieAvatar}>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="relative flex flex-col flex-1">
                {Component.auth ? (
                  <Auth>
                    <Component {...rest} />
                  </Auth>
                ) : (
                  <Component {...rest} />
                )}
              </main>
              <Footer />
            </div>
            <Toaster />
          </RainbowKitProvider>
        </RainbowKitSiweNextAuthProvider>
      </SessionProvider>
    </WagmiConfig>
  );
}

function Auth({ children }: { children: React.ReactNode }) {
  const { status } = useSession({ required: true });

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}

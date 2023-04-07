import { useEffect, useState } from "react";
import Head from "next/head";
import Subscriber, { SubscriberDocument } from "@lib/models/subscriber";
import type { NextPage } from "next";
import { GetServerSideProps } from "next";
import { useAccount } from "wagmi";
import { CreateIntegration } from "~~/components/ghost-unlock/CreateIntegration";
import { CreateTier } from "~~/components/ghost-unlock/CreateTier";
import { ListSubscribers } from "~~/components/ghost-unlock/ListSubscribers";
import dbConnect from "~~/lib/dbConnect";
import handleUser from "~~/services/web3/handleUser";

interface Props {
  subscribers: SubscriberDocument[];
}

const ExampleUI: NextPage<Props> = ({ subscribers }) => {
  const handleSuccess = (): void => console.log("Hello success");
  const [isUser, setIsUser] = useState<boolean>(false);
  const { address, isConnected } = useAccount();
  useEffect(() => {
    if (isConnected && address) {
      handleUser(address)
        .then(user => {
          // Use the user document however you like
          console.log(`User ${user._id} has address ${user.address}`);
          if (user.address) setIsUser(true);
        })
        .catch(error => {
          console.error(error);
        });
    }
  }, [address, isConnected]);
  // console.log("address", address);
  // console.log("address-connected", isConnected);
  // console.log("address-locatin", `${window.location.href}?address=${address}`);

  return (
    <>
      <Head>
        <title>Scaffold-eth Example Ui</title>
        <meta name="description" content="Created with 🏗 scaffold-eth" />
        {/* We are importing the font this way to lighten the size of SE2. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Bai+Jamjuree&display=swap" rel="stylesheet" />
      </Head>
      {isConnected && isUser ? (
        <div className="grid lg:grid-cols-2 flex-grow" data-theme="exampleUi">
          <CreateTier onSuccess={handleSuccess} />
          <CreateIntegration />
          <ListSubscribers subscribers={subscribers} />
        </div>
      ) : (
        <div className="flex items-center flex-col flex-grow pt-10 mt-8">
          <h2 className="block text-4xl font-bold">Connect your wallet</h2>
        </div>
      )}
    </>
  );
};

export default ExampleUI;

export const getServerSideProps: GetServerSideProps = async context => {
  try {
    await dbConnect();
    // const user = context.query.address;
    console.log("context", context.query.address);
    const users: SubscriberDocument[] = await Subscriber.find({});
    return { props: { users: JSON.parse(JSON.stringify(users)) } };
  } catch (e) {
    console.error(e);
    return { props: { users: [] } }; // return an empty array if there's an error
  }
};

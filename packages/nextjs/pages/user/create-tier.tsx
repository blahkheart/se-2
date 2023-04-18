import { useEffect, useState } from "react";
import Head from "next/head";
// import User, { UserDocument } from "@lib/models/user";
import type { NextPage } from "next";
import { GetServerSideProps } from "next";
import { useAccount } from "wagmi";
// import { CreateIntegration } from "~~/components/ghost-unlock/CreateIntegration";
import { CreateTier } from "~~/components/ghost-unlock/CreateTier";
// import { ListUsers } from "~~/components/ghost-unlock/ListUsers";
import handleUser from "~~/services/web3/handleUser";

interface Props {
  integrationId: string;
}

const CreateTierPage: NextPage<Props> = ({ integrationId }) => {
  const [isUser, setIsUser] = useState<boolean>(false);
  const { address, isConnected } = useAccount();
  useEffect(() => {
    if (isConnected && address) {
      handleUser(address)
        .then(user => {
          // Use the user document however you like
          console.log(`User ${user._id}66 ${user.address}`);
          if (user.address) setIsUser(true);
        })
        .catch(error => {
          console.error(error);
        });
    }
  }, [address, isConnected]);

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
        <div className="grid lg:grid-cols-1 flex-grow" data-theme="exampleUi">
          <CreateTier integrationId={integrationId} />
        </div>
      ) : (
        <div className="flex items-center flex-col flex-grow pt-10 mt-8">
          <h2 className="block text-4xl font-bold">Connect your wallet</h2>
        </div>
      )}
    </>
  );
};

export default CreateTierPage;

export const getServerSideProps: GetServerSideProps = async context => {
  try {
    const integrationId = context.query.integrationId;
    if (!integrationId) {
      return { props: { integrationId: null } };
    }
    return { props: { integrationId: integrationId } };
  } catch (e) {
    console.error(e);
    return { props: { users: [] } }; // return an empty array if there's an error
  }
};

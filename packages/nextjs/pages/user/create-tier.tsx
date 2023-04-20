import Head from "next/head";
import type { NextPage } from "next";
import { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import { useAccount } from "wagmi";
import { CreateTier } from "~~/components/ghost-unlock/CreateTier";

interface Props {
  integrationId: string;
}

const CreateTierPage: NextPage<Props> = ({ integrationId }) => {
  const { data: session } = useSession();
  const { isConnected } = useAccount();

  return (
    <>
      <Head>
        <title>Scaffold-eth Example Ui</title>
        <meta name="description" content="Created with 🏗 scaffold-eth" />
        {/* We are importing the font this way to lighten the size of SE2. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Bai+Jamjuree&display=swap" rel="stylesheet" />
      </Head>
      {isConnected && session?.user ? (
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

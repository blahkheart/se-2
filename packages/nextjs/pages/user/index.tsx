import Head from "next/head";
// import Link from "next/link";
import Integration, { IntegrationDocument } from "@lib/models/integration";
import type { NextPage } from "next";
import { GetServerSideProps } from "next";
// import { BugAntIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { ListIntegrations } from "~~/components/ghost-unlock/ListIntegrations";
import dbConnect from "~~/lib/dbConnect";

interface Props {
  integrations: IntegrationDocument[];
}

const Index: NextPage<Props> = ({ integrations }) => {
  return (
    <>
      <Head>
        <title>Scaffold-eth App</title>
        <meta name="description" content="Created with 🏗 scaffold-eth" />
      </Head>

      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5 w-full">
          <h1 className="text-center mb-8">
            {/* <span className="block text-2xl mb-2">Welcome to</span> */}
            <span className="block text-4xl font-bold">Ghost 👻 Unlock </span>
          </h1>
          <ListIntegrations integrations={integrations} />
        </div>

        {/* <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <BugAntIcon className="h-8 w-8 fill-secondary" />
              <p>
                Tinker with your smart contract using the{" "}
                <Link href="/debug" passHref className="link">
                  Debug Contract
                </Link>{" "}
                tab.
              </p>
            </div>
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <SparklesIcon className="h-8 w-8 fill-secondary" />
              <p>
                Experiment with{" "}
                <Link href="/example-ui" passHref className="link">
                  Example UI
                </Link>{" "}
                to build your own UI.
              </p>
            </div>
          </div>
        </div> */}
      </div>
    </>
  );
};

export default Index;

export const getServerSideProps: GetServerSideProps = async context => {
  try {
    await dbConnect();
    // const integration = context.query.address;
    console.log("context", context.query.address);
    const integrations: IntegrationDocument[] = await Integration.find({});
    return { props: { integrations: JSON.parse(JSON.stringify(integrations)) } };
  } catch (e) {
    console.error(e);
    return { props: { integrations: [] } }; // return an empty array if there's an error
  }
};

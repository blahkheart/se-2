import Head from "next/head";
import type { NextPage } from "next";
import { CreateIntegration } from "~~/components/ghost-unlock/CreateIntegration";
// import { ContractData } from "~~/components/example-ui/ContractData";
// import { ContractInteraction } from "~~/components/example-ui/ContractInteraction";
import { CreateTier } from "~~/components/ghost-unlock/CreateTier";

const ExampleUI: NextPage = () => {
  const handleSuccess = (): void => console.log("Hello success");
  return (
    <>
      <Head>
        <title>Scaffold-eth Example Ui</title>
        <meta name="description" content="Created with 🏗 scaffold-eth" />
        {/* We are importing the font this way to lighten the size of SE2. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Bai+Jamjuree&display=swap" rel="stylesheet" />
      </Head>
      <div className="grid lg:grid-cols-2 flex-grow" data-theme="exampleUi">
        <CreateTier onSuccess={handleSuccess} />
        <CreateIntegration />
        {/* <ContractInteraction />
        <ContractData /> */}
      </div>
    </>
  );
};

export default ExampleUI;

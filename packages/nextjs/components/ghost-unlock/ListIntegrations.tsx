import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { IntegrationDocument } from "@lib/models/integration";

interface Props {
  integrations: IntegrationDocument[];
}
export const ListIntegrations: React.FC<Props> = ({ integrations }) => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/integrations/${id}`, {
        method: "DELETE",
      });
      router.reload();
    } catch (error) {
      setErrorMessage("Failed to delete integration");
    }
  };

  return (
    <div className="flex items-center flex-col flex-grow pt-10 px-10 mb-6 w-full">
      <div className="flex flex-col bg-base-200 bg-opacity-70 rounded-2xl shadow-lg px-5 py-4 w-full">
        <h1 className="text-3xl font-bold mb-6">My Integrations</h1>
        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {errorMessage}
          </div>
        )}
        <ul>
          {integrations && integrations.length ? (
            integrations.map(integration => (
              <li key={integration._id} className="mb-4">
                <div className="flex justify-between">
                  <h2 className="text-2xl font-bold">{integration.name}</h2>
                  <button
                    onClick={() => handleDelete(integration._id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Delete
                  </button>
                </div>
                <p className="text-gray-500">{integration.description}</p>
                <p>
                  API: <code>{integration.apiKey}</code>
                </p>
                <p>
                  Secret: <code>{integration.secret}</code>
                </p>
              </li>
            ))
          ) : (
            <li className="text-3xl font-bold mb-4">
              <h2 className="text-2xl font-bold mb-10 pb-2">You have no integrations</h2>
              <div>
                <Link href="/user/new-integration" passHref className="link no-underline">
                  <button
                    onClick={() => router.push("/user/new-integration")}
                    className="btn btn-primary rounded-full capitalize font-normal font-white flex items-center gap-1 hover:gap-2 transition-all tracking-widest"
                  >
                    New integration
                  </button>
                </Link>
              </div>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

import { useState } from "react";
import { useRouter } from "next/router";
import { InputBase } from "../scaffold-eth";
import { IntegrationDocument } from "@lib/models/";
import axios from "axios";
import { useSession } from "next-auth/react";
import { DefaultUserMod } from "~~/interfaces/defaultUserModifier";

export const CreateIntegration: React.FC = () => {
  const [name, setName] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [description, setDescription] = useState("");
  const [siteUrl, setSiteUrl] = useState("");
  const { data: session } = useSession();
  const user: DefaultUserMod | null | undefined = session?.user;

  const router = useRouter();

  const handleSubmit = async () => {
    try {
      // create integration in DB
      const response = await axios.post<IntegrationDocument>("/api/integration/create", {
        name,
        description,
        siteUrl,
        apiKey,
        createdBy: user?.id,
      });
      if (response.status === 201) router.push("/user");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex items-center flex-col flex-grow pt-10 mb-6">
      <div className="flex flex-col my-6 px-7 py-8 bg-base-200 opacity-80 rounded-2xl shadow-lg border-2 border-primary">
        <span className="text-2xl sm:text-3xl mb-4 text-center text-black">New Integration</span>
        <div className="my-4">
          <InputBase error={!name} placeholder="Name" value={name} onChange={setName} />
        </div>
        <div className="my-4">
          <InputBase placeholder="Description..." value={description} onChange={setDescription} />
        </div>
        <div className="my-4">
          <InputBase placeholder="https://myghostblog.com" value={siteUrl} onChange={setSiteUrl} />
        </div>
        <div className="my-4">
          <InputBase error={!apiKey} placeholder="API key" value={apiKey} onChange={setApiKey} />
        </div>
        <button
          onClick={handleSubmit}
          className="btn btn-primary rounded-full capitalize font-normal font-white flex items-center gap-1 hover:gap-2 transition-all tracking-widest"
        >
          Create
        </button>
      </div>
    </div>
  );
};

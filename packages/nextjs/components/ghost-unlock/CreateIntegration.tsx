import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { InputBase } from "../scaffold-eth";
import { IntegrationDocument } from "@lib/models/";
// import User from "@lib/models/user";
import axios from "axios";
import { useAccount } from "wagmi";
// import dbConnect from "~~/lib/dbConnect";
import handleUser from "~~/services/web3/handleUser";

interface User {
  _id: string;
  address: string;
}

export const CreateIntegration: React.FC = () => {
  const [name, setName] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [description, setDescription] = useState("");
  const [siteUrl, setSiteUrl] = useState("");
  const [user, setIsUser] = useState<User>();

  const router = useRouter();
  const { address, isConnected } = useAccount();
  useEffect(() => {
    if (isConnected && address) {
      handleUser(address)
        .then(_user => {
          // Use the _user document however you like
          if (_user) setIsUser(_user);
        })
        .catch(error => {
          console.error(error);
        });
    }
  }, [address, isConnected]);

  const handleSubmit = async () => {
    try {
      console.log("user", user);
      // create integration in DB
      if (!user) return;
      const response = await axios.post<IntegrationDocument>("/api/integration/create", {
        name,
        description,
        siteUrl,
        apiKey,
        createdBy: user._id.toString(),
      });
      if (response.status === 201) {
        console.log("values-response", response);
        router.push("/user");
      }
      const data = {
        name,
        description,
        apiKey,
      };
      console.log("values", data);
      // }
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

import { useState } from "react";
import { InputBase } from "../scaffold-eth";

// import { TierDocument } from "@lib/models/tier";
// import axios from "axios";

// interface Props {
//   address: string;
// }

export const CreateIntegration: React.FC = () => {
  const [name, setName] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async () => {
    try {
      // get user id from db using their address
      // create tier in DB
      //   const response = await axios.post<TierDocument>("/api/tiers", {
      //     name,
      //     description,
      //     apiKey,
      //     createdBy,
      //   });
      //   if (response.status === 201) {
      //     setName("");
      //   }
      const data = {
        name,
        description,
        apiKey,
      };
      console.log("values", data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex items-center flex-col flex-grow pt-10 mb-6">
      <div className="flex flex-col mt-6 px-7 py-8 bg-base-200 opacity-80 rounded-2xl shadow-lg border-2 border-primary">
        <span className="text-2xl sm:text-3xl mb-4 text-center text-black">New Integration</span>
        <div className="my-4">
          <InputBase error={!name} placeholder="Name" value={name} onChange={setName} />
        </div>
        <div className="my-4">
          <InputBase placeholder="Description..." value={description} onChange={setDescription} />
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

import { ChangeEvent, useState } from "react";
import { AddressInput, InputBase } from "../scaffold-eth";

// import { TierDocument } from "@lib/models/tier";
// import axios from "axios";

interface Props {
  onSuccess: () => void;
}

export const CreateTier: React.FC<Props> = ({ onSuccess }) => {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [visibility, setVisibility] = useState("");
  const [lockAddress, setLockAddress] = useState("");
  const [description, setDescription] = useState("");
  const [monthlyPrice, setMonthlyPrice] = useState(0);
  const [yearlyPrice, setYearlyPrice] = useState(0);
  const [currency, setCurrency] = useState("");
  //   id: string;
  //   name: string;
  //   lockAddress: string;
  //   description: string;
  //   type: string; // free || paid
  //   visibility: string; public || private
  //   monthlyPrice: number;
  //   yearlyPrice: number;
  //   welcomePageUrl: string;
  //     currency: string;

  //   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
  //     console.log(e.target.value as any);
  //   };

  const handleSubmit = async () => {
    try {
      // call ghost admin API
      // get tier id from response
      // create tier in DB
      //   const response = await axios.post<TierDocument>("/api/tiers", {
      //     // id,
      //     name,
      //     lockAddress,
      //     description,
      //     type,
      //     visibility,
      //     monthlyPrice,
      //     yearlyPrice,
      //     currency,
      //   });
      //   if (response.status === 201) {
      //     setName("");
      //     // setIntegrationId("");
      //     onSuccess();
      //   }
      const data = {
        name,
        lockAddress,
        description,
        type,
        visibility,
        monthlyPrice,
        yearlyPrice,
        currency,
      };
      console.log("values", data);
      onSuccess();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex items-center flex-col flex-grow pt-10 mb-6">
      <div className="flex flex-col mt-6 px-7 py-8 bg-base-200 opacity-80 rounded-2xl shadow-lg border-2 border-primary">
        <span className="text-2xl sm:text-3xl mb-4 text-center text-black">Create a tier</span>
        <div className="my-4">
          <InputBase error={!name} placeholder="Tier name" value={name} onChange={setName} />
        </div>
        <div className="my-4">
          <AddressInput placeholder="Tier lock address" value={lockAddress} onChange={setLockAddress} />
        </div>
        <div className="my-4">
          <InputBase placeholder="Description..." value={description} onChange={setDescription} />
        </div>
        <div className="my-4">
          <select
            name="type"
            onChange={e => {
              const val = e.target.value;
              setType(val);
            }}
            className="select select-bordered select-ghost input-ghost focus:bg-transparent focus:text-gray-400 h-[2.2rem] min-h-[2.2rem] px-4 border w-full font-medium placeholder:text-accent/50 text-gray-400"
          >
            <option disabled selected>
              Select type
            </option>
            <option value={"free"}>Free</option>
            <option value={"paid"}>Paid</option>
          </select>
        </div>
        <div className="my-4">
          <select
            name="visibility"
            onChange={e => {
              const val = e.target.value;
              setVisibility(val);
            }}
            className="select select-bordered select-ghost input-ghost focus:bg-transparent focus:text-gray-400 h-[2.2rem] min-h-[2.2rem] px-4 border w-full font-medium placeholder:text-accent/50 text-gray-400"
          >
            <option disabled selected>
              Choose visibility
            </option>
            <option value={"public"}>Public</option>
            <option value={"private"}>Private</option>
          </select>
        </div>
        <div className="my-4">
          <input
            className="input input-bordered input-ghost focus:bg-transparent focus:text-gray-400 h-[2.2rem] min-h-[2.2rem] px-4 border w-full font-medium placeholder:text-accent/50 text-gray-400"
            placeholder={"Monthly price"}
            name={"monthly-price"}
            type="number"
            value={monthlyPrice}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              const val = e.target.value;
              setMonthlyPrice(parseInt(val));
            }}
            autoComplete="off"
          />
        </div>
        <div className="my-4">
          <input
            className="input input-bordered input-ghost focus:bg-transparent focus:text-gray-400 h-[2.2rem] min-h-[2.2rem] px-4 border w-full font-medium placeholder:text-accent/50 text-gray-400"
            placeholder={"Yearly price"}
            name={"yearly-price"}
            type="number"
            value={yearlyPrice}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              const val = e.target.value;
              setYearlyPrice(parseInt(val));
            }}
            autoComplete="off"
          />
        </div>
        <div className="my-4">
          <InputBase placeholder="Currency eg USD, EUR..." value={currency} onChange={setCurrency} />
        </div>
        <button
          onClick={handleSubmit}
          className="btn btn-primary rounded-full capitalize font-normal font-white flex items-center gap-1 hover:gap-2 transition-all tracking-widest"
        >
          Create tier
        </button>
      </div>
    </div>
  );
};

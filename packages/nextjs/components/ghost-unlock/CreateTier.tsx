import { ChangeEvent, useState } from "react";
import { useRouter } from "next/router";
import { AddressInput, InputBase } from "../scaffold-eth";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useSignMessage } from "wagmi";
import { DefaultUserMod } from "~~/interfaces/defaultUserModifier";
import { notification } from "~~/utils/scaffold-eth";

interface Props {
  integrationId: string;
}

export const CreateTier: React.FC<Props> = ({ integrationId }) => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [type, setType] = useState("paid");
  const [visibility, setVisibility] = useState("");
  const [lockAddress, setLockAddress] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [monthlyPrice, setMonthlyPrice] = useState(0);
  const [yearlyPrice, setYearlyPrice] = useState(0);
  const [currency, setCurrency] = useState("");
  const { data: session } = useSession();
  const user: DefaultUserMod | null | undefined = session?.user;
  const { signMessageAsync } = useSignMessage({
    message: `${user?.name + ":" + user?.id}`,
  });

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      // get sig
      const signature = await signMessageAsync();
      // call backend api
      const response = await axios.post("/api/tier/create", {
        signature,
        message: `${user?.name + ":" + user?.id}`,
        name,
        lockAddress,
        description,
        type,
        visibility,
        monthlyPrice,
        yearlyPrice,
        currency: currency.toUpperCase(),
        createdBy: user?.id,
        integrationId,
      });

      response &&
        response.status === 201 &&
        notification.success("Tier created successfully") &&
        router.push(`/user/integrations/${integrationId}`);
    } catch (error: any) {
      console.error("ERR:: Creating tier:", error);
      notification.error(`${error.message}`);
    } finally {
      setIsLoading(false);
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
          className={`btn btn-primary rounded-full capitalize font-normal font-white flex items-center gap-1 hover:gap-2 transition-all tracking-widest ${
            isLoading ? "loading " : ""
          }`}
        >
          Create tier
        </button>
      </div>
    </div>
  );
};

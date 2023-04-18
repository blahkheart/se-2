import { ChangeEvent, useEffect, useState } from "react";
import { AddressInput, InputBase } from "../scaffold-eth";
// import { KJUR, Utf8, b64utoutf8 } from "jsrsasign";
// import User from "@lib/models/user";
// import { NextApiRequest, NextApiResponse } from "next";
// import { IntegrationDocument } from "@lib/models/integration";
// import axios from "axios";
// import Integration from "@lib/models/integration";
// import User from "@lib/models/user";
// import axios from "axios";
// import jwt, { Secret } from "jsonwebtoken";
import { useAccount } from "wagmi";

// const { ADMIN_API_KEY, GHOST_BLOG_URL } = process.env;
// if (!ADMIN_API_KEY || !GHOST_BLOG_URL)
//   throw new Error(`Add ${!ADMIN_API_KEY && "Ghost Admin API key " && !GHOST_BLOG_URL && "Blog URL "}to .env`);

// const [id, secret] = ADMIN_API_KEY.split(":");
// const token = jwt.sign({}, Buffer.from(secret, "hex"), {
//   keyid: id,
//   algorithm: "HS256",
//   expiresIn: "5m",
//   audience: `/admin/`,
// });

// const ghostApiUrl = `${GHOST_BLOG_URL}/ghost/api/admin/tiers/`;
// const headers = {
//   Origin: "http://localhost:3000",
//   "Content-Type": "application/json",
//   Authorization: `Ghost ${token}`,
//   "Accept-Version": "v5.24",
// };

interface Props {
  integrationId: string;
}
interface User {
  address: string;
  _id: string;
}
// interface GhostTierResponse {
//   id: string;
//   name: string;
//   description: string | null;
//   slug: string;
//   active: boolean;
//   type: string;
//   welcome_page_url: string | null;
//   created_at: Date;
//   updated_at: Date;
//   visibility: string;
//   benefits: string[];
//   trial_days: number;
// }
interface IntegrationData {
  _id: string;
  name: string;
  apiKey: string;
  description?: string;
  siteUrl?: string;
  createdBy: string;
}

// {
//   "id": "63864fc59536255fe06246e4",
//   "name": "Free",
//   "description": null,
//   "slug": "free",
//   "active": true,
//   "type": "free",
//   "welcome_page_url": null,
//   "created_at": "2022-11-29T18:30:29.000Z",
//   "updated_at": "2022-11-29T18:30:29.000Z",
//   "visibility": "public",
//   "benefits": [],
//   "trial_days": 0
// }
export const CreateTier: React.FC<Props> = ({ integrationId }) => {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [visibility, setVisibility] = useState("");
  const [lockAddress, setLockAddress] = useState("");
  const [description, setDescription] = useState("");
  const [monthlyPrice, setMonthlyPrice] = useState(0);
  const [yearlyPrice, setYearlyPrice] = useState(0);
  const [currency, setCurrency] = useState("");
  const { address, isConnected } = useAccount();
  // const [userId, setUserId] = useState("");
  // const [apiKey, setApiKey] = useState("");
  const [userData, setUserData] = useState<User>();
  const [integrationData, setIntegrationData] = useState<IntegrationData>();
  // const [siteUrl, setSiteUrl] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      if (address && isConnected && integrationId) {
        await fetch(`/api/user/get?address=${address}`).then(async res => {
          const _user = await res.json();
          setUserData(_user);
        });
        await fetch(`/api/integration/get?integrationId=${integrationId}`).then(async res => {
          const _integration = await res.json();
          setIntegrationData(_integration);
          console.log(integrationData);
        });
      }
    };
    fetchData();
  }, [address, isConnected, integrationId]);

  // const payload = {
  //   name,
  //   description,
  //   type,
  //   visibility,
  //   monthlyPrice,
  //   yearlyPrice,
  //   currency,
  // };
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
      // const apiKey: Secret = "639f7aadce990a0eb4413b24:2f65379fd3cc79ba726d89da45ed5278b2a6bb58594eada0da6ab413d7037dbd";
      // const [id, secret] = apiKey.split(":");
      // if (typeof secret !== "string") {
      //   throw new Error("Invalid API key format");
      // }
      // const payL = {
      //   keyid: id,
      //   algorithm: "HS256",
      //   expiresIn: "5m",
      //   audience: `/admin/`,
      // }
      // const token = generateToken(payL, secret);
      // const token = jwt.sign({}, Buffer.from(secret, "hex"), {
      //   keyid: id,
      //   algorithm: "HS256",
      //   expiresIn: "5m",
      //   audience: `/admin/`,
      // });
      // const token = jwt.sign({ _id: "foundUser._id?.toString()", name: "foundUser" }, secret, {
      //   expiresIn: "2 days",
      // });
      // console.log("token", token)
      // const headers = {
      //   "Content-Type": "application/json",
      //   Authorization: `Ghost ${token}`,
      //   "Accept-Version": "v5.24",
      // };
      // const payload = {
      //   name,
      //   description,
      //   type,
      //   visibility,
      //   monthlyPrice,
      //   yearlyPrice,
      //   currency,
      // };
      // const ghostApiUrl = "http://localhost:2368/ghost/api/admin/tiers/";
      // try {
      //   const response = await fetch(ghostApiUrl, {
      //     method: "POST",
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //       "Content-Type": "application/json",
      //       "Accept-Version": "v5.24",
      //     },
      //     body: JSON.stringify(payload),
      //   });

      //   if (response.status === 201) {
      //     const data: GhostTierResponse = await response.json();
      //     console.log("axios id::", data.id);
      //   } else {
      //     console.error(`Failed with status ${response.status}`);
      //   }
      // } catch (error) {
      //   console.error("axios err::", error);
      // }
      const data = {
        name,
        lockAddress,
        description,
        type,
        visibility,
        monthlyPrice,
        yearlyPrice,
        currency,
        createdBy: userData?._id,
        integrationId,
      };
      console.log("values", data);
    } catch (error) {
      console.error("err global:", error);
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

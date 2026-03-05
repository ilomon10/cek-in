"use client";

import { clientSDK } from "./client-sdk";
import { useLocalStorage } from "../hooks/use-local-storage";
import { PayloadPreference } from "./payload-types";

type ConfigurationKey = string;
type ConfigurationValue = PayloadPreference["value"];

type ConfigurationProvider = {
  list: () => Promise<Record<string, ConfigurationValue>>;
  get: (key: ConfigurationKey) => Promise<ConfigurationValue>;
  set: (
    key: ConfigurationKey,
    value: ConfigurationValue
  ) => Promise<ConfigurationValue>;
  remove: (key: ConfigurationKey) => Promise<ConfigurationValue>;
};

export const configurationProvider = (): ConfigurationProvider => {
  const client = clientSDK();
  const [token] = useLocalStorage("undangon-token", "");
  return {
    list: async function () {
      const res = await client.find(
        { collection: "payload-preferences" },
        { headers: { Authorization: `JWT ${token}` } }
      );
      return res.docs.reduce((prev, { key, value }) => {
        if (!key) return prev;
        return {
          ...prev,
          [key]: value,
        };
      }, {});
    },
    get: async function (key) {
      const res = await client.findByID(
        {
          collection: "payload-preferences",
          id: key,
        },
        { headers: { Authorization: `JWT ${token}` } }
      );
      return res.value;
    },
    set: async function (key, value) {
      const res = await client.create(
        {
          collection: "payload-preferences",
          data: { key, value } as any,
        },
        { headers: { Authorization: `JWT ${token}` } }
      );
      return res.value;
    },
    remove: async function (key) {
      const res = await client.delete(
        {
          collection: "payload-preferences",
          id: key,
        },
        { headers: { Authorization: `JWT ${token}` } }
      );
      return res.value;
    },
  };
};

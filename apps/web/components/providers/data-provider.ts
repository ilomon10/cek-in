"use client";

import { DataProvider } from "@refinedev/core";
import { clientSDK } from "./client-sdk";
import { convertRefineSortToPayload } from "./query-converter/sort";
import { convertRefineFilterToPayload } from "./query-converter/filter";
import { SERVER_URL } from "../constants";
// import { useLocalStorage } from "../hooks/use-local-storage";

export const dataProvider = (): DataProvider => {
  const client = clientSDK();
  // const [token] = useLocalStorage("undangon-token", "");
  const config: RequestInit = {
    credentials: "include",
    // headers: { Authorization: `JWT ${token}` },
  };
  return {
    create: async (props) => {
      const resource = props.resource as any;
      const values = props.variables as any;
      const file = values._file;
      delete values._files;
      const res = await client.create(
        {
          collection: resource,
          data: values,
          file,
        },
        config
      );
      return res;
    },
    update: async (props) => {
      const resource = props.resource as any;
      const values = props.variables as any;
      const file = values._file;
      delete values._files;
      const res = await client.update(
        {
          collection: resource,
          id: props.id,
          data: values,
          file,
        },
        config
      );
      return res;
    },
    deleteOne: async (props) => {
      const resource = props.resource as any;
      const res = await client.delete(
        {
          collection: resource,
          id: props.id,
        },
        config
      );
      return { data: res };
    },
    getOne: async (props) => {
      const resource = props.resource as any;
      const select = props.meta?.select as { [k: string]: boolean };
      const depth = props.meta?.depth as number;
      const result: any = {
        data: null,
      };
      if (props.meta?.slug) {
        const res = await client.find(
          {
            collection: resource,
            where: {
              slug: {
                equals: props.meta?.slug,
              },
            },
            select: select as any,
            depth,
          },
          config
        );
        result.data = res.docs[0];
      } else {
        const res = await client.findByID(
          {
            collection: resource,
            id: props.id,
            select: select as any,
            depth,
          },
          config
        );
        result.data = res;
      }

      return result;
    },
    getList: async (props) => {
      const resource = props.resource as any;
      const select = props.meta?.select as { [k: string]: boolean };
      const depth = props.meta?.depth as number;
      const res = await client.find(
        {
          collection: resource,
          sort: convertRefineSortToPayload(props.sorters),
          where: convertRefineFilterToPayload(props.filters),
          select: select as any,
          depth,
        },
        config
      );
      return {
        data: res.docs,
        total: res.totalDocs,
      };
    },
    getApiUrl: () => client.baseURL,
  };
};

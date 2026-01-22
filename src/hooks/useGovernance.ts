import { Keyring } from "@polkadot/api";
import { mnemonicGenerate } from "@polkadot/util-crypto";

import Governance from "../../types/contracts/governance";
import { useContext } from "react";
import { IInfoAccount, IMessage, UseProviderContext } from "../contexts/UseProvider";
import Channel from "../../types/contracts/channel";
import useContract from "./useContract";

const keyring = new Keyring({ type: "sr25519" });
 export interface ChannelInfo {
  id: number;
  channelAddress: string;
  dataCreate: string;
  priceGuardian: string;
  addressOwner: string;
  info:IInfoAccount | null;
}
export interface VotesFakesNews {
  votesYES: number;
  votesNO: number;
  dataCreate: string;
  votesTotal: number;
}
export const useGovernance = () => {
  const { api, apiReady, account } = useContext(UseProviderContext);
  const {
    getAccountCompleteInNetWork,
    getAccountInNetWork,
    decryptMessage,
    getAccountAux: getAccountAuxContract,
    sendTXToken,
    sendTXGovernance,
  } = useContract();
  const getAccountAux = () => {
    if (!apiReady) return null;
    try {
      const seedDex = mnemonicGenerate(12);
      const aux = keyring.addFromUri(seedDex);
      return aux;
    } catch (error) {
      throw new Error("Error at generate account");
    }
  };
  const getPriceGuardian = async () => {
    if (!apiReady || !api) return "0";
    try {
      const aux = getAccountAux();
      if (!aux) return "0";
      const governance = new Governance(
        import.meta.env.VITE_CONTRACT_GOVERNANCE,
        aux,
        api
      );
      const priceGuardian = await governance.query.getPrices();
      return priceGuardian.value.ok?.ok?.toHuman() || "0";
    } catch (error) {
      throw new Error("Error at get price guardian");
    }
  };
  const getTotalNews = async () => {
    if (!apiReady || !api) return "0";
    try {
      const aux = getAccountAux();
      if (!aux) return "0";
      const governance = new Governance(
        import.meta.env.VITE_CONTRACT_GOVERNANCE,
        aux,
        api
      );
      const priceGuardian = await governance.query.getTotalChannel();
      return priceGuardian.value.ok?.ok?.toHuman() || "0";
    } catch (error) {
      throw new Error("Error at get price guardian");
    }
  };
  const getNewsId = async (id: number) => {
    if (!apiReady || !api) return;
    try {
      const aux = getAccountAux();
      if (!aux) return;
      const governance = new Governance(
        import.meta.env.VITE_CONTRACT_GOVERNANCE,
        aux,
        api
      );
      const channel = await governance.query.getChannel(id);
      const ifoAccount = await getAccountCompleteInNetWork(channel.value.ok?.ok?.[3].toString() || "");

      const info: ChannelInfo = {
        id: id,
        channelAddress: channel.value.ok?.ok?.[0].toString() || "",
        priceGuardian: channel.value.ok?.ok?.[1]?.toString() || "",
        dataCreate: channel.value.ok?.ok?.[2].toString().replaceAll(",", "") || "",
        addressOwner: channel.value.ok?.ok?.[3].toString() || "",
        info:ifoAccount || null,
      };
      return info;
    } catch (error) {
      throw new Error("Error at get price guardian");
    }
  };
  const getChannelIdAccount = async (address: string) => {
    if (!apiReady || !api) return "";
    try {
      const aux = getAccountAux();
      if (!aux) return "";
      const governance = new Governance(
        import.meta.env.VITE_CONTRACT_GOVERNANCE,
        aux,
        api
      );
      const channel = await governance.query.getIdChannel(address);
      return channel.value.ok?.toString() || "";
    } catch (error) {
      throw new Error("Error at get channel id account");
    }
  };
  const getTotalMessages = async (addressContract: string) => {
    try {
      if (!api || !apiReady) {
        return;
      }
      const account = await getAccountAux();
      if (!account) return;
      const contract = new Channel(addressContract, account, api);
      const result = await contract.query.getTotalMessages();
      if (result.value.err) {
        throw new Error(result.value.err);
      }
      return result.value.ok || 0;
    } catch (error: any) {
      throw new Error("Error at get total messages");
    }
  };
  const getMessageDefaultChannel = async (addressContract: string) => {
    try {
      if (!api || !apiReady) {
        return;
      }
      const account_aux = await getAccountAux();
      if (!account_aux) return;
      const contract = new Channel(addressContract, account_aux, api);
      const result = await contract.query.getDefaultMessage();
      if (result.value.err) {
        throw new Error(result.value.err);
      }

      return result.value.ok?.ok || [];
    } catch (error: any) {
      throw new Error("Error at get default message");
    }
  };
  const getComments = async (addressContract: string, idMessage: number) => {
    try {
      if (!api || !apiReady) {
        return;
      }
      const account_aux = await getAccountAux();
      if (!account_aux) return;
      const channel = new Channel(addressContract, account_aux, api);
      const comments = await channel.query.receivedMessages(idMessage);
      if (comments.value.err || !comments.value.ok?.ok) {
        throw new Error(comments.value.err);
      }
      const name = await getAccountInNetWork(
        (comments.value.ok?.ok[0].toString() || "").toString()
      );
      const message: IMessage = {
        id: idMessage,
        name: name,
        address: (comments.value.ok?.ok[0] || "").toString(),
        message: decryptMessage((comments.value.ok?.ok[1] || "").toString()),
        dataCreate: (comments.value.ok?.ok[2] || "")
          .toString()
          .replaceAll(",", ""),
        dataUpdate: (comments.value.ok?.ok[3] || "")
          .toString()
          .replaceAll(",", ""),
      };
      return message;
    } catch (error: any) {
      throw new Error("Error at get comments");
    }
  };
  const addNewsChannel = async (channelAddress: string, price: string) => {
    try {
      if (!api || !apiReady) {
        return;
      }
      if (!account) {
        location.href = "/";
        return;
      }
      const account_aux = await getAccountAuxContract();
      if (!account_aux) return;
      //approve
      await sendTXToken(
        import.meta.env.VITE_CONTRACT_TOKEN,
        "psp22::approve",
        {
          spender: import.meta.env.VITE_CONTRACT_GOVERNANCE,
          value: price,
        }
      );
      console.log(price);
      console.log("channelAddress",channelAddress)
      await sendTXGovernance(
        import.meta.env.VITE_CONTRACT_GOVERNANCE,
        "governanceImp::addMessagesPublic",
        {
          addressChannel: channelAddress,
        }
      );
    } catch (error: any) {
      console.log(error);
      throw new Error("Error at add news channel");
    }
  };

  const feeSimulatedNetwork = async (amount: number) => {
    try {
      if (!api || !apiReady) {
        return;
      }
      const account_aux = await getAccountAux();
      if (!account_aux) return;
      const info = await api.tx.balances
        .transfer(account_aux.address, amount)
        .paymentInfo(account_aux);
      let f: any = info.partialFee.toHuman();
      const fee_ = Number(
        f.split(" ")[0].replaceAll(",", "").replaceAll(".", "") || 0
      );
      return fee_ / 10000000;
    } catch (error: any) {
      throw new Error("Error at fee simulated network");
    }
  };
  const getVotesFakesNews = async (addressContract: string) => {
    try {
      if (!api || !apiReady) {
        return;
      }
      const account_aux = await getAccountAux();
      if (!account_aux) return;
      const contract = new Governance(
        import.meta.env.VITE_CONTRACT_GOVERNANCE,
        account_aux,
        api
      );
      const result = await contract.query.getVotesFakesNews(addressContract);
      const totalAllow = await contract.query.getTotalVotesAllowed();
      if (result.value.err) {
        throw new Error(result.value.err);
      }
      const details: VotesFakesNews = {
        votesYES: result.value.ok?.ok?.[0].toNumber() || 0,
        votesNO: result.value.ok?.ok?.[1].toNumber() || 0,
        dataCreate: result.value.ok?.ok?.[2].toString() || "",
        votesTotal: totalAllow.value.ok?.toNumber() || 0,
      };
      return details;
    } catch (error: any) {
      throw new Error("Error at get votes kakes news");
    }
  };
  const openVotesFakesNews = async (
    addressContract: string,
    price: string,
    verify: boolean = false
  ) => {
    try {
      if (!api || !apiReady || !account) {
        return;
      }
      const account_aux = await getAccountAuxContract();
      if (!account_aux) return;
      const contract = new Governance(
        import.meta.env.VITE_CONTRACT_GOVERNANCE,
        account_aux,
        api
      );
      const result = await contract.query.openVoteForFakeNews(addressContract);
      if (result.value.err) {
        throw new Error(result.value.err);
      }
      if (verify) {
        return result.gasRequired.toHuman();
      }
      await sendTXToken(
        import.meta.env.VITE_CONTRACT_TOKEN,
        "psp22::approve",
        {
          spender: import.meta.env.VITE_CONTRACT_GOVERNANCE,
          value: price,
        }
      );
      //send tx
      await sendTXGovernance(
        import.meta.env.VITE_CONTRACT_GOVERNANCE,
        "governanceImp::openVoteForFakeNews",
        {
          channelId: addressContract,
        }
      );
      return result.value.ok;
    } catch (error: any) {
      throw new Error("Error at get votes kakes news");
    }
  };
  const doingVotesFakesNews = async (
    channelID: number,
    yesOrNo: boolean,
    verify: boolean = false
  ) => {
    try {
      if (!api || !apiReady || !account) {
        return;
      }
      const account_aux = await getAccountAuxContract();
      if (!account_aux) return;
      const contract = new Governance(
        import.meta.env.VITE_CONTRACT_GOVERNANCE,
        account_aux,
        api
      );
      const result = await contract.query.doingVoteFake(channelID, yesOrNo);
      if (result.value.err) {
        throw new Error(result.value.err);
      }
      if (verify) {
        return result.gasRequired.toHuman();
      }      
      //send tx
      await sendTXGovernance(
        import.meta.env.VITE_CONTRACT_GOVERNANCE,
        "governanceImp::doingVoteFake",
        {
          channelId: channelID,
          isFake: yesOrNo,
        }
      );
      return result.value.ok;
    } catch (error: any) {
      throw new Error("Error at get votes kakes news");
    }
  };
  return {
    feeSimulatedNetwork,
    getTotalMessages,
    getMessageDefaultChannel,
    getComments,
    addNewsChannel,
    getPriceGuardian,
    getChannelIdAccount,
    getNewsId,
    getTotalNews,
    getVotesFakesNews,
    openVotesFakesNews,
    doingVotesFakesNews,
  };
};
export default useGovernance;

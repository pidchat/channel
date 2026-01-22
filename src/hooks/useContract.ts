import { useContext, useEffect, useState } from "react";
import {
  IChat,
  IInfoAccount,
  IInfoAccountRegister,
  IMessage,
  UseProviderContext,
} from "../contexts/UseProvider";
import { web3FromSource } from "@polkadot/extension-dapp";
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import { mnemonicGenerate, mnemonicValidate } from "@polkadot/util-crypto";
import { ApiPromise, Keyring } from "@polkadot/api";
import { ContractPromise } from "@polkadot/api-contract";
import ABI_Channel from "../../artifacts/channel.json";
import ABI_psp22 from "../../artifacts/psp22_token.json";
import ABI_Governance from "../../artifacts/governance.json";
import Channel_factory from "../../types/constructors/channel";
import Channel from "../../types/contracts/channel";
import Token from "../../types/contracts/psp22_token";
import CryptoJS from "crypto-js";
import { calc_fee } from "../utils";
import { useTranslation } from "react-i18next";
const keyring = new Keyring({ type: "sr25519" });

export const useContract = () => {
   const { t } = useTranslation();
  const {
    api,
    apiReady,
    alert,
    listChannel,
    listMessageEvent,
    setListChannel,
    setListMessageEvent,
    account,
    setAccount,
    accountIdentity,
    setAccountIdentity,
    isDarkMode,
    password,
    setPassword,
  } = useContext(UseProviderContext);

  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([]);
  const [loading, setLoading] = useState(false);
  const [balanceToken, setBalanceToken] = useState<number>(0);
  const [balanceNative, setBalanceNative] = useState<number>(0);
  const [infoRouter, setInfoRouter] = useState<string>("");
  const [feeNetWork, setFeeNetWork] = useState<number>(0);
  const [feeGasNetWork, setFeeGasNetWork] = useState<number>(0);
  const [balanceNativeAgent, setBalanceNativeAgent] = useState<number>(0);
  const [feeIdentityNetWork, setFeeIdentityNetWork] = useState<number>(0);
  useEffect(() => {
    const session = sessionStorage.getItem("PIDCHAT_session");    
    setPassword(session || "");
    const savedAccount = localStorage.getItem("PIDCHAT_accountId");
    if (savedAccount && apiReady) {
      connectWallet();
      getChannels();
    }
    setInfoRouter("");
  }, [apiReady]);
  useEffect(() => {
    if (apiReady) {
      connectWallet();
    }
  }, []);
  useEffect(() => {
    getBalance();
  }, [account]);
  useEffect(() => {
    getBalance();
  }, [account]);

  useEffect(() => {
    if (account) {
      getChannels();
    }
  }, [balanceNative]);
  const getGasLimit = (api: ApiPromise) =>
    api.registry.createType(
      "WeightV2",
      api.consts.system.blockWeights["maxBlock"]
    );

  const getBalance = async () => {
    try {
      if (!api || !apiReady || !account) {
        return;
      }
      const account_aux = getAccountAux();
      if(!account_aux) return
      const token = new Token(
        import.meta.env.VITE_CONTRACT_TOKEN,
        account_aux,
        api
      );
      const balanceToken = await token.query.balanceOf(account);
      const balanceNative = await api.query.system.account(account);
      setBalanceToken(Number(balanceToken.value.ok || 0)/1000000000000000000);
      setBalanceNative(
        Number(balanceNative.data.free.toHuman().replace(/,/g, "") || 0) /
          100000000
      );
      getBalanceAgent();
      listenContract();
      getAccountCompleteInNetWork(account);
    } catch (error: any) {
      alert(error.message, "error");
      console.log(error);
    }
  };
  const getAccountInNetWork = async (address: string) => {
    try {
      if (!api || !apiReady) {
        return;
      }
      const account = await api.query.identity.identityOf(address);
      if (!account) {
        return "anonymous";
      }
      const identity: any = account.toHuman();
      if (identity?.info) {
        return identity?.info?.display?.Raw || "anonymous";
      }
      return "anonymous";
    } catch (error: any) {
      alert(error.message, "error");
      console.log(error);
    }
  };
  const getAccountCompleteInNetWork = async (address: string) => {
    try {
      if (!api || !apiReady) {
        return;
      }
      const info: IInfoAccount = {
        name: "",
        legal: "",
        image: "",
        email: "",
        web: "",
        twitter: "",
        telegram: "",
      };
      const account = await api.query.identity.identityOf(address);
      if (!account) {
        return info;
      }

      const identity: any = account.toHuman();
      if (identity?.info) {
        info.name = identity?.info?.display?.Raw || "";
      }
      if (identity?.info?.legal) {
        info.legal = identity?.info?.legal?.Raw || "";
      }
      if (identity?.info?.web) {
        info.web = identity?.info?.web?.Raw || "";
      }
      if (identity?.info?.email) {
        info.email = identity?.info?.email?.Raw || "";
      }
      if (identity?.info?.twitter) {
        info.twitter = identity?.info?.twitter?.Raw || "";
      }
      if (identity?.info?.additional?.length > 0) {
        //toDo
        info.telegram = "";
      }
      if (identity?.info?.image) {
        info.image = identity?.info?.image?.Raw || "";
      }
      setAccountIdentity(info);
      return info;
    } catch (error: any) {
      alert(error.message, "error");
      console.log(error);
    }
    return null;
  };
  const registerIdentity = async (
    identityInfo: IInfoAccountRegister,
    isFee: boolean = false,
    isOld: boolean = true
  ) => {
    if (!api || !apiReady || !account) {
      return;
    }
    try {
      const account_aux = getAccountAux();
      if(!account_aux) return
      //price deposit identity
      const price = api.consts.identity.basicDeposit.toHuman();
      const tx = api.tx.identity.setIdentity(identityInfo);
      if (isFee) {
        const info = await tx.paymentInfo(account_aux.address, {
          signer: account_aux as any,
        });

        let f: any = info.partialFee.toHuman();
        const fee_ = Number(
          f.split(" ")[0].replaceAll(",", "").replaceAll(".", "") || 0
        );
        let total = fee_;
        if (isOld) {
          total += Number(price.replaceAll(",", "").replaceAll(".", "") || 0);
        }
        setFeeIdentityNetWork(total / 100000000);
        return;
      }
      setLoading(true);
      setInfoRouter("Waiting for transaction...");
      await new Promise<string>(async (resolve, reject) => {
        try {
          const account_aux = getAccountAux();
          if(!account_aux) return
          await tx.signAndSend(account_aux, async (res) => {
            if (res.status.isInBlock) {
              console.log("in a block");
              setInfoRouter("Wait your transaction...");
            }
            if (res.status.isFinalized) {
              console.log("finalized");
              resolve(res.status.asFinalized.toString());
              alert("Identity saved successfully", "success");
              setInfoRouter("Transaction finalized...");
            }
            if (res.isError) {
              console.log(`Error at blockHash ${res.isError}`);
              reject("Error at blockHash");
              alert("Error at blockHash", "error");
            }
            console.log("res", res);
          });
        } catch (error) {
          alert("Cancelled", "error");
          setLoading(false);
          setInfoRouter("");
        }
      });
    } catch (error: any) {
      alert(
        "Transaction fail, verify your balance or try again later",
        "error"
      );
    } finally {
      setLoading(false);
      setInfoRouter("");
    }
  };
  const clearIdentity = async (isFee: boolean = false) => {
    if (!api || !apiReady || !account) {
      return;
    }
    try {
      const tx = api.tx.identity.clearIdentity();
      const account_aux = getAccountAux();
      if(!account_aux) return
      if (isFee) {
        const info = await tx.paymentInfo(account_aux.address, {
          signer: account_aux as any,
        });
        let f: any = info.partialFee.toHuman();
        const fee_ = Number(
          f.split(" ")[0].replaceAll(",", "").replaceAll(".", "") || 0
        );
        setFeeIdentityNetWork(fee_ / 100000000);
        return;
      }
      setLoading(true);
      setInfoRouter("Waiting for transaction...");
      await new Promise<string>(async (resolve, reject) => {
        try {
          await tx.signAndSend(account_aux, async (res) => {
            if (res.status.isInBlock) {
              console.log("in a block");
              setInfoRouter("Transaction in a block...");
            }
            if (res.status.isFinalized) {
              console.log("finalized");
              resolve(res.status.asFinalized.toString());
              setInfoRouter("Transaction finalized...");
            }
            if (res.isError) {
              console.log(`Error at blockHash ${res.isError}`);
              reject("Error at blockHash");
            }
          });
        } catch (error) {
          alert("Cancelled", "error");
          setLoading(false);
          setInfoRouter("");
        }
      });
    } catch (error) {
      console.log(error);
      alert(
        "Transaction fail, verify your balance or try again later",
        "error"
      );
    } finally {
      setLoading(false);
      setInfoRouter("");
    }
  };
  const getBalanceAgent = async () => {
    try {
      if (!api || !apiReady) {
        return;
      }
      const account_aux = getAccountAux();
      if(!account_aux) return
      const balanceNative = await api.query.system.account(account_aux.address);
      const value =
        Number(balanceNative.data.free.toHuman().replace(/,/g, "")) / 100000000;
      setBalanceNativeAgent(value);
      return value;
    } catch (error: any) {
      alert(error.message, "error");
      console.log(error);
    }
    return 0;
  };
  const getAccountAux = () => {
    if(!password) return null;
    const seedLocal = localStorage.getItem("PIDCHAT_seedChannel");
    if (seedLocal) {
      const seedDex = CryptoJS.AES.decrypt(
        seedLocal,
        password
      ).toString(CryptoJS.enc.Utf8);
      if (!seedDex) {
        throw new Error("Error at decrypt seed");
      }
      const aux = keyring.addFromUri(seedDex);
      return aux;
    } else {
      throw new Error("Error at decrypt seed");
    }
  };
  const createAccount = (seed: string, password: string) => {
    try {
      if(password.length < 4){
        throw new Error(t("TEXT_ERROR_PASSWORD"));
      }
      if (seed) {
        const validSeed = mnemonicValidate(seed);
        if (!validSeed) {
          throw new Error(t("TEXT_SEED_INVALID"));
        }
      }else{
        seed = mnemonicGenerate();        
      }
      sessionStorage.setItem("PIDCHAT_session", password);
      localStorage.setItem(
        "PIDCHAT_seedChannel",
        CryptoJS.AES.encrypt(seed, password).toString()
      );
      authenticate(password);
      return true;
    } catch(error: any){ 
      alert(error.message, "error");
    }
    return false;
  };
  const authenticate = (password: string) => {
    try {
      const seedLocal = localStorage.getItem("PIDCHAT_seedChannel");
      if (seedLocal) {
        const seedDex = CryptoJS.AES.decrypt(
          seedLocal,
          password
        ).toString(CryptoJS.enc.Utf8);
        if (!seedDex) {
          throw new Error(t("TEXT_ERROR_ACCESS"));
        }
        const a = keyring.addFromUri(seedDex);
        localStorage.setItem("PIDCHAT_accountId", a.address);
        sessionStorage.setItem("PIDCHAT_session", password);
        setAccount(a.address);
        setPassword(password);
        location.href = "/news"
        return true;
      } else {
        throw new Error(t("TEXT_ERROR_ACCESS"));
      }
    } catch(error: any){ 
      alert(t("TEXT_ERROR_ACCESS"), "error");
    }
    return false;

  };
  const getSeed = () => {
    const seedLocal = localStorage.getItem("PIDCHAT_seedChannel");
    const session = sessionStorage.getItem("PIDCHAT_session") || "";
    if (seedLocal) {
      const seedDex = CryptoJS.AES.decrypt(
        seedLocal,
        session
      ).toString(CryptoJS.enc.Utf8);
      if (!seedDex) {
        throw new Error("Error at decrypt seed");
      }
      return seedDex;
    }
    return "";
  };
  const getChannels = () => {
    const channelAddressLocal = localStorage.getItem("PIDCHAT_channelAddress2");
    if (channelAddressLocal) {
      const listAddress = JSON.parse(channelAddressLocal);
      setListChannel(listAddress);
    }
  };
  const listenContract = () => {
    if (!api || !apiReady) {
      return;
    }
    const channelAddressLocal = localStorage.getItem("PIDCHAT_channelAddress2");
    if (channelAddressLocal) {
      const listAddress = JSON.parse(channelAddressLocal);
      listAddress.forEach(async (el: IChat) => {
        api.query.system.events((events: any) => {
          events.forEach(async (record: any) => {
            const { event } = record;

            if (event.section === "contracts" && event.method === "Called") {
              if (event.data.toHuman().contract === el.address) {
                console.log("Channel: ", el.address);
                console.log("caller: ", event.data.toHuman().caller);
                addLastMessage(el.address);
              }
            }
            if (event.section === "balances" && event.method === "Transfer") {
              if (
                event.data.toHuman().to === account ||
                event.data.toHuman().from === account
              ) {
                getBalance();
                alert("Balance updated", "success");
              }
            }
          });
        });
      });
    }
  };
  const connectWallet = async () => {
    if (!api || !apiReady) {
      return false;
    }
    try {
      const accounts_ = getAccountAux();
      setAccount(accounts_?.address);    
      return true;
    } catch (error: any) {
      alert(error.message, "error");
      console.log(error);
    }
    return false;
  };

  const switchAccount = async (address: string) => {
    try {
      if (!api || !apiReady) {
        return;
      }
      const newAccount = accounts.find((acc) => acc.address === address);
      if (!newAccount) {
        throw new Error("Conta não encontrada");
      }

      const injector = await web3FromSource(newAccount.meta.source);
      api.setSigner(injector.signer as any);

      localStorage.setItem("PIDCHAT_accountId", address);
      // setAccount(newAccount);

      return newAccount;
    } catch (error: any) {
      alert(error.message, "error");
      return null;
    }
  };

  const getQueryChannel = async (
    address: string,
    router: string,
    param: any
  ) => {
    try {
      if (!api || !apiReady || !account) {
        return;
      }
      let error = "";
      const contract = new ContractPromise(api, ABI_Channel, address);
      const gasLimit: any = getGasLimit(api);
      const { storageDeposit, result, gasRequired, output }: any =
        await contract.query[router](
          account,
          {
            gasLimit,
            storageDepositLimit: null,
          },
          ...Object.values(param)
        );
      console.log("storageDeposit", storageDeposit.toHuman());
      console.log("result", result.toHuman());
      console.log("gasRequired", gasRequired.toHuman());
      if (result.isErr) {
        if (result.asErr.isModule) {
          const dispatchError = api.registry.findMetaError(
            result.asErr.asModule
          );
          error = dispatchError.docs.length
            ? dispatchError.docs.concat().toString()
            : dispatchError.name;
        } else {
          error = result.asErr.toString();
        }
        throw new Error(error);
      }
      if (result.isOk) {
        return {
          contract,
          storageDeposit: calc_fee(storageDeposit.toHuman().Charge),
          gasRequired,
          result,
          output,
        };
      }
    } catch (error: any) {
      alert(error.message, "error");
      return null;
    }
  };

  const sendTXChannel = async (address: string, router: string, param: any) => {
    try {
      if (!api || !apiReady || !account) {
        return;
      }
      const accounts_aux = getAccountAux();
      if(!accounts_aux) return
      const contracts = await getQueryChannel(address, router, param);
      if (!contracts) {
        return;
      }
      await new Promise<string>((resolve, reject) => {
        contracts.contract.tx[router](
          {
            gasLimit: contracts.gasRequired,
            storageDepositLimit: null,
          },
          ...Object.values(param)
        ).signAndSend(accounts_aux, async (res) => {
          if (res.status.isInBlock) {
            console.log("in a block");
          }
          if (res.status.isFinalized) {
            console.log("finalized");
            resolve(res.status.asFinalized.toString());
          }
          if (res.isError) {
            console.log(`Error at blockHash ${res.isError}`);
            reject("Error at blockHash");
          }
        });
      });
    } catch (error: any) {
      console.log(error);
      alert(error.message, "error");
      return null;
    }
  };

  const getQueryToken = async (address: string, router: string, param: any) => {
    try {
      if (!api || !apiReady || !account) {
        return;
      }
      let error = "";
      const contract = new ContractPromise(api, ABI_psp22, address);
      const gasLimit: any = getGasLimit(api);
      const { storageDeposit, result, gasRequired, output }: any =
        await contract.query[router](
          account,
          {
            gasLimit,
            storageDepositLimit: null,
          },
          ...Object.values(param)
        );
      if (result.isErr) {
        if (result.asErr.isModule) {
          const dispatchError = api.registry.findMetaError(
            result.asErr.asModule
          );
          error = dispatchError.docs.length
            ? dispatchError.docs.concat().toString()
            : dispatchError.name;
        } else {
          error = result.asErr.toString();
        }
        throw new Error(error);
      }
      if (result.isOk) {
        return {
          contract,
          storageDeposit: calc_fee(storageDeposit.toHuman().Charge),
          gasRequired,
          result,
          output,
        };
      }
    } catch (error: any) {
      alert(error.message, "error");
      return null;
    }
  };

  const sendTXToken = async (address: string, router: string, param: any) => {
    try {
      if (!api || !apiReady || !account) {
        return;
      }
      const contracts = await getQueryToken(address, router, param);
      if (!contracts) {
        return;
      }
      const account_aux = getAccountAux();
      if(!account_aux) return
      await new Promise<string>((resolve, reject) => {
        contracts.contract.tx[router](
          {
            gasLimit: contracts.gasRequired,
            storageDepositLimit: null,
          },
          ...Object.values(param)
        ).signAndSend(account_aux, async (res) => {
          if (res.status.isInBlock) {
            console.log("in a block");
          }
          if (res.status.isFinalized) {
            console.log("finalized");
            resolve(res.status.asFinalized.toString());
          }
          if (res.isError) {
            console.log(`Error at blockHash ${res.isError}`);
            reject("Error at blockHash");
          }
        });
      });
    } catch (error: any) {
      alert(error.message, "error");
      return null;
    }
  };

  const getQueryGovernance = async (address: string, router: string, param: any) => {
    try {
      if (!api || !apiReady || !account) {
        return;
      }
      let error = "";
      const contract = new ContractPromise(api, ABI_Governance, address);
      const gasLimit: any = getGasLimit(api);
      const { storageDeposit, result, gasRequired, output }: any =
        await contract.query[router](
          account,
          {
            gasLimit,
            storageDepositLimit: null,
          },
          ...Object.values(param)
        );
      if (result.isErr) {
        if (result.asErr.isModule) {
          const dispatchError = api.registry.findMetaError(
            result.asErr.asModule
          );
          error = dispatchError.docs.length
            ? dispatchError.docs.concat().toString()
            : dispatchError.name;
        } else {
          error = result.asErr.toString();
        }
        throw new Error(error);
      }
      if (result.isOk) {
        return {
          contract,
          storageDeposit: calc_fee(storageDeposit.toHuman().Charge),
          gasRequired,
          result,
          output,
        };
      }
    } catch (error: any) {
      alert(error.message, "error");
      return null;
    }
  };

  const sendTXGovernance = async (address: string, router: string, param: any) => {
    try {
      if (!api || !apiReady || !account) {
        return;
      }
      const contracts = await getQueryGovernance(address, router, param);
      if (!contracts) {
        return;
      }
      const account_aux = getAccountAux();
      if(!account_aux) return
      await new Promise<string>((resolve, reject) => {
        contracts.contract.tx[router](
          {
            gasLimit: contracts.gasRequired,
            storageDepositLimit: null,
          },
          ...Object.values(param)
        ).signAndSend(account_aux, async (res) => {
          if (res.status.isInBlock) {
            console.log("in a block");
          }
          if (res.status.isFinalized) {
            console.log("finalized");
            resolve(res.status.asFinalized.toString());
          }
          if (res.isError) {
            console.log(`Error at blockHash ${res.isError}`);
            reject("Error at blockHash");
          }
        });
      });
    } catch (error: any) {
      alert(error.message, "error");
      return null;
    }
  };

  const createChannel = async (
    name: string,
    description: string[],
    type: string = "String",
    isPrivate: boolean = false
  ) => {
    try {
      if (!api || !apiReady || !account) {
        throw new Error("API not ready or account not connected");
      }
      if (!name || name.length === 0) {
        throw new Error("Name is required");
      }
      setLoading(true);
      setInfoRouter("Authorizing transfer fee in the wallet ...");
      //criate new seed for new channel
      const aux = getAccountAux();
      if(!aux) return
      //verificar balance
      const value = await feeCreateChannel(description, type);
      const balance = await api.query.system.account(aux.address);
      const balanceNumber = Number(
        balance.data.free.toHuman().replace(/,/g, "")
      );

      if (balanceNative < value / 100000000) {
        throw new Error("Balance is not enough");
      }
      if (balanceNumber < value) {
        //payment channel
        throw new Error("Error at transfer payment");
      }

      setInfoRouter("Creating Channel ...");
      setLoading(true);
      const channelNew = new Channel_factory(api, aux);

      //create channel
      const channel = await channelNew.new(description, null, type, isPrivate);
      if (channel.result.error) {
        throw new Error("Error at create channel");
      }
      //get channel address
      const channelAddress = channel?.address;
      if (!channelAddress) {
        throw new Error("Error at create channel");
      }
      setInfoRouter("Save Channel in local ...");
      //Save channel address in local storage

      addChannelLocal({
        address: channelAddress,
        type,
        name,
      });

      console.log(`Channel address: ${channelAddress}`);
      setInfoRouter(`New Channel Address is ${channelAddress}`);
      alert("Channel created successfully", "success");
      getBalance();

      return channelAddress;
    } catch (error: any) {
      setInfoRouter("");
      alert(error.message, "error");
      console.error("Error creating channel:", error);
    } finally {
      setLoading(false);
    }
    return 0;
  };
  const verifyChannelLocalName = (name: string) => {
    const channelAddressLocal = localStorage.getItem("PIDCHAT_channelAddress2");
    if (channelAddressLocal) {
      const listAddress = JSON.parse(channelAddressLocal);
      const channel = listAddress.find((el: IChat) => el.name === name);
      if (channel) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };
  const searchChannelLocalName = (name: string) => {
    const channelAddressLocal = localStorage.getItem("PIDCHAT_channelAddress2");
    if (channelAddressLocal) {
      const listAddress = JSON.parse(channelAddressLocal);
      if (!name) {
        setListChannel(listAddress);
      }
      const list = listAddress.filter(
        (el: IChat) =>
          el.name.toUpperCase().includes(name.toUpperCase()) ||
          el.address.toUpperCase().includes(name.toUpperCase())
      );
      setListChannel(list);
    } else {
      return [];
    }
  };
  const searchAddress = (address: string) => {
    const channelAddressLocal = localStorage.getItem("PIDCHAT_channelAddress2");
    if (channelAddressLocal) {
      const listAddress: [] = JSON.parse(channelAddressLocal);
      if (!address) {
        return null;
      }
      const find_one = listAddress.find((el: IChat) =>
        el.address.toUpperCase().includes(address.toUpperCase())
      );
      return find_one;
    } else {
      return null;
    }
  };
  const addChannelLocal = (channel: IChat) => {
    const channelAddressLocal = localStorage.getItem("PIDCHAT_channelAddress2");
    const listAddress = channelAddressLocal
      ? JSON.parse(channelAddressLocal)
      : [];
    listAddress.push(channel);
    setListChannel(listAddress);
    localStorage.setItem("PIDCHAT_channelAddress2", JSON.stringify(listAddress));
    getChannels();
  };
  const transferBalance = async (value: number, to: string) => {
    try {
      if (!api || !apiReady || !account) {
        throw new Error("API not ready or account not connected");
      }
      setLoading(true);
      const account_aux = getAccountAux();
      if(!account_aux) return
      await new Promise<string>((resolve, reject) => {
        api.tx.balances
          .transfer(to, value)
          .signAndSend(account_aux, (result) => {
            if (result.status.isInBlock) {
              console.log("in block", result);
            } else if (result.status.isFinalized) {
              console.log("finalized", result);
              resolve(result?.txHash?.toString());
            }
            if (result.isError) {
              console.log(`Error at blockHash ${result.isError}`);
              reject("Error at blockHash");
            }
          });
      });
      getBalance();
      return true;
    } catch (error: any) {
      alert(error.message, "error");
      setLoading(true);
    } finally {
      setLoading(false);
    }
    return false;
  };
  const feeCreateChannel = async (messages: string[], type: string) => {
    try {
      if (!api || !apiReady) {
        return 0;
      }
      // Get contract metadata
      const contractWasm = await fetch("../../artifacts/channel.contract");
      const contractWasmJson = await contractWasm.json();
      const wasm = contractWasmJson.source.wasm;

      // Calculate base storage size
      const contractSize = wasm.length;
      console.log(`Contract WASM size: ${contractSize} bytes`);

      // Get storage deposit per byte from chain constants
      const storageDepositPerByte = api.consts.contracts.depositPerByte;
      console.log(
        `Storage deposit per byte: ${storageDepositPerByte.toString()}`
      );

      // Calculate storage costs
      let totalStorageCost = 0;

      // 1. Base contract storage cost
      const baseStorageCost =
        Number(contractSize) * Number(storageDepositPerByte.toString());
      console.log(`Base storage cost: ${baseStorageCost}`);
      totalStorageCost += baseStorageCost;

      // 2. Message storage cost
      const messageStorageCost = messages.reduce((acc, message) => {
        // Add 4 bytes for length prefix per message
        const messageSize = new TextEncoder().encode(message).length + 4;
        return (
          acc + Number(messageSize) * Number(storageDepositPerByte.toString())
        );
      }, 0);
      console.log(`Messages storage cost: ${messageStorageCost}`);
      totalStorageCost += messageStorageCost;

      // 3. Type storage cost (including length prefix)
      const typeSize = new TextEncoder().encode(type).length + 4;
      const typeStorageCost =
        Number(typeSize) * Number(storageDepositPerByte.toString());
      console.log(`Type storage cost: ${typeStorageCost}`);
      totalStorageCost += typeStorageCost;

      // 4. Additional metadata storage
      const metadataOverhead = 100; // Estimated overhead for contract metadata
      const metadataStorageCost =
        metadataOverhead * Number(storageDepositPerByte.toString());
      console.log(`Metadata storage cost: ${metadataStorageCost}`);
      totalStorageCost += metadataStorageCost + 500;

      // Add safety margin (10%)
      const safetyMargin = totalStorageCost / 10;
      //fee transfer contract to owner
      const feeTransferContract = 12500000 * 2;
      const finalCost = totalStorageCost + safetyMargin + feeTransferContract;
      console.log(`Final cost with safety margin: ${finalCost}`);
      const value = Number(finalCost);
      return value;
    } catch (error: any) {
      alert(error.message, "error");
    }
    return 0;
  };
  const sendMessage = async (addressContract: string, messages: string) => {
    try {
      if (!api || !apiReady) {
        return;
      }
      await sendTXChannel(addressContract, "channelImpl::sendMessages", {
        messages,
      });
      //addLastMessage(addressContract);
    } catch (error: any) {
      alert(error.message, "error");
    }
  };
  const addLastMessage = async (addressContract: string) => {
    try {
      if (!api || !apiReady) {
        return;
      }
      const account = await getAccountAux();
      if(!account) return
      const channel = new Channel(addressContract, account, api);
      const total = await channel.query.getTotalMessages();
      const messages = listMessageEvent.find(
        (el) => el.addressContract === addressContract
      );
      const existMessage = messages?.listMessage?.find(
        (el) => el.id === Number(total.value.ok || 0)
      );
      if (listMessageEvent.length === 0) {
        const message = await channel.query.receivedMessages(
          (total.value.ok || 0).toString()
        );
        if (message.value.ok) {
          const name = await getAccountInNetWork(
            (message.value.ok?.ok?.[0] || "").toString()
          );
          let ms: string = decryptMessage(
            (message.value.ok?.ok?.[1] || "").toString()
          );
          const messageNew: IMessage = {
            id: Number(total.value.ok || 0),
            name: name,
            address: (message.value.ok?.ok?.[0] || "").toString(),
            message: ms,
            dataCreate: (message.value.ok?.ok?.[2] || "")
              .toString()
              .replaceAll(",", ""),
            dataUpdate: (message.value.ok?.ok?.[3] || "")
              .toString()
              .replaceAll(",", ""),
          };
          const listMessageNew = [
            {
              addressContract,
              listMessage: [messageNew],
            },
          ];
          setListMessageEvent(listMessageNew);
        }
        return;
      }
      if (!existMessage) {
        const message = await channel.query.receivedMessages(
          (total.value.ok || 0).toString()
        );
        if (message.value.ok) {
          const name = await getAccountInNetWork(
            (message.value.ok?.ok?.[0] || "").toString()
          );
          let ms: string = decryptMessage(
            (message.value.ok?.ok?.[1] || "").toString()
          );
          const messageNew: IMessage = {
            id: Number(total.value.ok || 0),
            name: name,
            address: (message.value.ok?.ok?.[0] || "").toString(),
            message: ms,
            dataCreate: (message.value.ok?.ok?.[2] || "")
              .toString()
              .replaceAll(",", ""),
            dataUpdate: (message.value.ok?.ok?.[3] || "")
              .toString()
              .replaceAll(",", ""),
          };
          const messagesNew = messages?.listMessage
            ? [...messages.listMessage, messageNew]
            : [messageNew];
          const listMessageNew = [...listMessageEvent];
          for (let i = 0; i < listMessageNew.length; i++) {
            if (listMessageNew[i].addressContract === addressContract) {
              listMessageNew[i] = {
                ...listMessageNew[i],
                listMessage: messagesNew,
              };
            }
          }
          setListMessageEvent(listMessageNew);
        }
      }
    } catch (error: any) {
      console.log(error);
    }
  };
  const removeListenEventByAddress = (addressContract: string) => {
    try {
      let newList = [];
      for (let index = 0; index < listMessageEvent.length; index++) {
        const element = listMessageEvent[index];
        if (element.addressContract != addressContract) {
          newList.push(element);
        }
      }
      setListMessageEvent(newList);
    } catch (error) {
      console.log(error);
    }
  };
  const editMessage = async (
    addressContract: string,
    messages: string,
    idMessage: number
  ) => {
    try {
      if (!api || !apiReady) {
        return;
      }
      await sendTXChannel(addressContract, "channelImpl::editMessages", {
        messages,
        idMessage,
      });
    } catch (error: any) {
      alert(error.message, "error");
    }
  };
  const decryptMessage = (message: string) => {
    let ms = message;
    if (message && message?.toString().startsWith("0x:")) {
      const key = message.split(":")[1];

      const password_local = localStorage.getItem("PIDCHAT_password");
      if (password_local) {
        try {
          const decrypt_pass = CryptoJS.AES.decrypt(
            password_local,
            password
          ).toString(CryptoJS.enc.Utf8);
          const decrypt = CryptoJS.AES.decrypt(key, decrypt_pass).toString(
            CryptoJS.enc.Utf8
          );

          ms = decrypt || "🔒 🔒 🔒";
        } catch (error) {
          ms = "🔒 🔒 🔒";
        }
      } else {
        ms = "🔒 🔒 🔒";
      }
    }
    return ms;
  };
  const getMessages = async (addressContract: string, idMessage: number) => {
    try {
      if (!api || !apiReady || !account) {
        return;
      }
      const result = await getQueryChannel(
        addressContract,
        "channelImpl::receivedMessages",
        {
          idMessage,
        }
      );
      if (result?.result.value.err) {
        throw new Error(result.result.value.err);
      }
      if (!result?.output) {
        return null;
      }
      const object = result.output.toHuman().Ok?.Ok;
      const name = await getAccountInNetWork((object[0] || "").toString());
      let ms: string = decryptMessage((object[1] || "").toString());

      const message: IMessage = {
        id: idMessage,
        name: name,
        address: (object[0] || "").toString(),
        message: ms,
        dataCreate: (object[2] || "").toString().replaceAll(",", ""),
        dataUpdate: (object[3] || "").toString().replaceAll(",", ""),
      };
      return message;
    } catch (error: any) {
      alert(error.message + "", "error");
    }
    return null;
  };
  const destroyChannel = async (addressContract: string) => {
    try {
      if (!api || !apiReady || !account) {
        return;
      }
      const account_aux = await getAccountAux();
      if(!account_aux) return
      const contract = new Channel(addressContract, account_aux, api);

      const ownable = await contract.query.owner();
      console.log("contract", ownable);
      if (ownable.value.err) {
        throw new Error(ownable.value.err);
      }
      if (ownable.value.ok !== account) {
        throw new Error("You are not the owner of this channel");
      }
      await sendTXChannel(addressContract, "destroy", {});
      //remove do local storage
      removeContractLocal(addressContract);
    } catch (error: any) {
      console.log(error);
      alert(error?.message || "Contract not found!", "error");
    }
  };
  const removeContractLocal = (addressContract: string) => {
    const channelAddressLocal = localStorage.getItem("PIDCHAT_channelAddress2");
    if (channelAddressLocal) {
      const listAddress = JSON.parse(channelAddressLocal);
      const newListAddress = listAddress.filter(
        (address: IChat) => address.address !== addressContract
      );
      localStorage.setItem(
        "PIDCHAT_channelAddress2",
        JSON.stringify(newListAddress)
      );
      setListChannel(newListAddress);
    }
  };
  const verifyContractAndRemove = async (addressContract: string) => {
    try {
      if (!api || !apiReady || !account) {
        return;
      }
      setLoading(true);

      const account_aux = await getAccountAux();
      if(!account_aux) return
      const contract = new Channel(addressContract, account_aux, api);
      const result = await contract.query.owner();
      if (result.value.err) {
        throw new Error(result.value.err);
      }
      if (result.value.ok == account_aux.address) {
        contract.tx.destroy();
      }
      removeContractLocal(addressContract);
    } catch (error: any) {
      console.log(error);
      removeContractLocal(addressContract);
      alert(error.message, "error");
    } finally {
      setLoading(false);
    }
  };
  const getTotalMessages = async (addressContract: string) => {
    try {
      if (!api || !apiReady) {
        return;
      }
      const account = await getAccountAux();
      if(!account) return
      const contract = new Channel(addressContract, account, api);
      const result = await contract.query.getTotalMessages();
      if (result.value.err) {
        throw new Error(result.value.err);
      }
      return result.value.ok || 0;
    } catch (error: any) {
      alert(error.message, "error");
    }
    return 0;
  };

  const getMessageDefaultChannel = async (addressContract: string) => {
    try {
      if (!api || !apiReady || !account) {
        return;
      }
      const account_aux = await getAccountAux();
      if(!account_aux) return
      const contract = new Channel(addressContract, account_aux, api);
      const result = await contract.query.getDefaultMessage();
      if (result.value.err) {
        throw new Error(result.value.err);
      }

      return result.value.ok?.ok || [];
    } catch (error: any) {
      alert(error.message, "error");
    }
    return [];
  };
  const transferAuxOwnership = async (
    addressContract: string,
    addressNewOwner: string
  ) => {
    try {
      if (!api || !apiReady) {
        return;
      }
      const aux = getAccountAux();
      if(!aux) return
      const channel = new Channel(addressContract, aux, api);
      await channel.tx.transferOwnership(addressNewOwner);
      return true;
    } catch (error: any) {
      alert(error.message, "error");
    }
    return false;
  };
  const addNewChannelContract = async (
    addressContract: string,
    name: string
  ) => {
    try {
      if (!api || !apiReady) {
        return;
      }
      const account = await getAccountAux();
      if(!account) return
      const contract = new Channel(addressContract, account, api);
      const result = await contract.query.getTotalMessages();
      if (result.value.err) {
        throw new Error(result.value.err);
      }
      addChannelLocal({
        address: addressContract,
        name: name,
        type: "String",
      });
      return true;
    } catch (error: any) {
      console.log(error);
      alert(error.message, "error");
    }
    return false;
  };
  const transferToken = async (value: number, to: string) => {
    try {
      if (!api || !apiReady) {
        return;
      }
      setLoading(true);
      await sendTXToken(
        import.meta.env.VITE_CONTRACT_TOKEN,
        "psp22::transfer",
        {
          to,
          value: value.toString(),
          data: "",
        }
      );
      //addLastMessage(addressContract);
    } catch (error: any) {
      alert(error.message, "error");
    } finally {
      setLoading(false);
    }
  };
  const feeSimulatedToken = async (value: number, to: string) => {
    try {
      if (!api || !apiReady) {
        return;
      }
      setLoading(true);
      const tokenQUery = await getQueryToken(
        import.meta.env.VITE_CONTRACT_TOKEN,
        "psp22::transfer",
        {
          to,
          value: value.toString(),
          data: "",
        }
      );
      setFeeGasNetWork(Number(tokenQUery?.storageDeposit || 0) / 10000000);
      //addLastMessage(addressContract);
    } catch (error: any) {
      alert(error.message, "error");
    } finally {
      setLoading(false);
    }
  };
  const feeSimulatedNetwork = async (amount: number) => {
    try {
      if (!api || !apiReady) {
        return;
      }
      const account_aux = await getAccountAux();
      if(!account_aux) return
      const info = await api.tx.balances
        .transfer(account_aux.address, amount)
        .paymentInfo(account_aux);
      let f: any = info.partialFee.toHuman();
      const fee_ = Number(
        f.split(" ")[0].replaceAll(",", "").replaceAll(".", "") || 0
      );
      setFeeNetWork(fee_ / 10000000);
    } catch (error: any) {
      alert(error.message, "error");
    }
    return 0;
  };
  const verifyAddressValid = (address: string) => {
    try {
      const isValid = keyring.decodeAddress(address);
      return !!isValid;
    } catch (error) {
      return false;
    }
  };
  const get_private = async (addressContract: string) => {
    try {
      if (!api || !apiReady) {
        return;
      }
      const account_aux = await getAccountAux();
      if(!account_aux) return
      const contract = new Channel(addressContract, account_aux, api);
      const result = await contract.query.getIsPrivate();
      if (result.value.err) {
        throw new Error(result.value.err);
      }
      return result.value.ok || false;
    } catch (error: any) {
      alert(error.message, "error");
    }
    return false;
  };
  const add_user_channel = async (
    addressContract: string,
    address: string,
    type_permission: boolean
  ) => {
    try {
      if (!api || !apiReady) {
        return;
      }
      setLoading(true);
      await sendTXChannel(addressContract, "channelImpl::addPermission", {
        address,
        type_permission,
      });
      return true;
    } catch (error: any) {
      alert(error.message, "error");
    } finally {
      setLoading(false);
    }
    return false;
  };
  const disconnectWallet = () => {
    sessionStorage.removeItem("PIDCHAT_session");
    api?.setSigner(undefined);
    api?.disconnect();
    setAccount(undefined);
    setAccounts([]);
  };
  const isOwner = async (addressContract: string) => {
    try {
      if (!api || !apiReady) {
        return;
      }
      const account_aux = await getAccountAux();
      if(!account_aux) return
      const contract = new Channel(addressContract, account_aux, api);
      const result = await contract.query.owner();
      if (result.value.err) {
        throw new Error(result.value.err);
      }
      if (result.value.ok == account_aux.address) {
        return true;
      }
      return false;
    } catch (error: any) {
      alert(error.message, "error");
    }
    return false;
  };
  const balanceContract = async (
    addressContract: string,
    isNative: boolean
  ) => {
    try {
      if (!api || !apiReady) {
        return;
      }
      const account_aux = await getAccountAux();
      if(!account_aux) return
      if (isNative) {
        const balanceNative = await api.query.system.account(addressContract);
        return (
          Number(balanceNative.data.free.toHuman().replace(/,/g, "") || 0) /
          100000000
        );
      } else {
        const token = new Token(
          import.meta.env.VITE_CONTRACT_TOKEN,
          account_aux,
          api
        );
        const balanceToken = await token.query.balanceOf(addressContract);
        return balanceToken.value.ok || 0;
      }
    } catch (error: any) {
      alert(error.message, "error");
    }
    return 0;
  };
  const claimContract = async (addressContract: string, isNative: boolean) => {
    try {
      if (!api || !apiReady) {
        return;
      }
      setLoading(true);
      await sendTXChannel(addressContract, "channelImpl::transferBalance", {
        address_token: import.meta.env.VITE_CONTRACT_TOKEN,
        type_transfer: isNative ? "0" : "1",
      });
    } catch (error: any) {
      alert(error.message, "error");
    } finally {
      setLoading(false);
    }
  };
  const addEmotions = async (addressContract: string, emotion: string) => {
    try {
      if (!api || !apiReady) {
        return;
      }
      setLoading(true);
      await sendTXChannel(addressContract, "channelImpl::addEmotion", {
        emotion,
      });
    } catch (error: any) {
      alert(error.message, "error");
    } finally {
      setLoading(false);
    }
  };
  const getEmotions = async (addressContract: string) => {
    try {
      if (!api || !apiReady) {
        return;
      }
      const account_aux = await getAccountAux();
      if(!account_aux) return
      const contract = new Channel(addressContract, account_aux, api);
      const result = await contract.query.getEmotions();
      if (result.value.err) {
        throw new Error(result.value.err);
      }
      return result.value.ok || [];
    } catch (error: any) {
      alert(error.message, "error");
    }
    return [];
  };
  const approvalToken = async (addressContract: string, to: string) => {
    try {
      if (!api || !apiReady) {
        return;
      }
      setLoading(true);
      // await sendTXChannel(addressContract, "channelImpl::approveToken");
    } catch (error: any) {
      alert(error.message, "error");
    } finally {
      setLoading(false);
    }
  };
  const transferFromAgent = async (addressContract: string) => {
    try {
      if (!api || !apiReady) {
        return;
      }
      setLoading(true);
      // await sendTXChannel(addressContract, "channelImpl::transferBalance");
    } catch (error: any) {
      alert(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return {
    connectWallet,
    switchAccount,
    disconnectWallet,
    account,
    accounts,
    apiReady,
    createChannel,
    loading,
    getQueryChannel,
    sendMessage,
    editMessage,
    getMessages,
    transferAuxOwnership,
    getMessageDefaultChannel,
    getTotalMessages,
    destroyChannel,
    feeCreateChannel,
    balanceToken,
    balanceNative,
    infoRouter,
    verifyChannelLocalName,
    listChannel,
    alert,
    listMessageEvent,
    setInfoRouter,
    getChannels,
    searchChannelLocalName,
    addNewChannelContract,
    verifyContractAndRemove,
    getBalanceAgent,
    searchAddress,
    addChannelLocal,
    getSeed,
    getAccountAux,
    transferBalance,
    transferToken,
    verifyAddressValid,
    feeNetWork,
    feeSimulatedNetwork,
    balanceNativeAgent,
    feeSimulatedToken,
    feeGasNetWork,
    getAccountInNetWork,
    accountIdentity,
    registerIdentity,
    clearIdentity,
    feeIdentityNetWork,
    removeListenEventByAddress,
    get_private,
    add_user_channel,
    isDarkMode,
    isOwner,
    balanceContract,
    claimContract,
    addEmotions,
    getEmotions,
    approvalToken,
    transferFromAgent,
    authenticate,
    createAccount,
    password,
    decryptMessage,
    sendTXChannel,
    getQueryGovernance,
    sendTXGovernance,
    getQueryToken,
    sendTXToken,
    getAccountCompleteInNetWork,

  };
};
export default useContract;

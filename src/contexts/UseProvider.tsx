import React, { createContext, ReactNode, useEffect, useState } from "react";
import "@polkadot/api-augment";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { Bounce, toast } from "react-toastify";
interface IProvider {
  router: string;
  setRouter: (router: string) => void;
  mobileSidebar: boolean;
  setMobileSidebar: (mobileSidebar: boolean) => void;
  api: ApiPromise | null;
  apiReady: boolean;
  alert: (
    message: string,
    type: "success" | "error" | "warning" | "info"
  ) => void;
  contractSelected: string;
  setContractSelected: (contract: string) => void;
  listChannel: IChat[];
  setListChannel: (listChannel: IChat[]) => void;
  listMessageEvent: IMessageList[];
  setListMessageEvent: (listMessageEvent: IMessageList[]) => void;
  account: string | undefined;
  setAccount: (account: string | undefined) => void;
  accountIdentity: IInfoAccount | undefined;
  setAccountIdentity: (accountIdentity: IInfoAccount | undefined) => void;
  isDarkMode: boolean;
  setIsDarkMode: (isDarkMode: boolean) => void;
  changeDark: (active: boolean) => void;
  password: string;
  setPassword: (password: string) => void;
  menuBar:boolean;
  setMenuBar: (value:boolean) => void;
}

const WS_PROVIDER: any =
  import.meta.env.VITE_WS_PROVIDER?.toString().split(",") || "ws://127.0.0.1:9944";

interface IContextProviderProps {
  children?: ReactNode | undefined;
}
const UseProviderContext: React.Context<IProvider> = React.createContext(
  {} as IProvider
);
export interface IChat {
  address: string;
  type: string;
  name: string;
}
export interface IMessage {
  id: number;
  name: string;
  address: string;
  message: string;
  dataCreate: string;
  dataUpdate: string;
}
export interface IMessageList {
  addressContract: string;
  listMessage: IMessage[];
}
export interface IInfoAccount {
  name: string;
  email: string;
  telegram: string;
  legal: string;
  twitter: string;
  web: string;
  image: string;
}
export interface IInfoAccountRegister {
  display: {
    Raw: string;
  };
  email: 
    | {
        Raw: string;
      }
    | undefined;
  legal: 
    | {
        Raw: string;
      } 
    | undefined;
  twitter: 
    | {
        Raw: string;
      }
    | undefined;
  web: 
    | {
        Raw: string;
      }
    | undefined;
  image: 
    | {
        Raw: string;
      }
    | undefined;
}
const UseProvider = (props: IContextProviderProps) => {
  const [router, setRouter] = useState<string>("Channels");
  const [mobileSidebar, setMobileSidebar] = useState<boolean>(false);
  const [api, setApi] = useState<ApiPromise | null>(null);
  const [apiReady, setApiReady] = useState(false);
  const [contractSelected, setContractSelected] = useState<string>("");
  const [listChannel, setListChannel] = useState<IChat[]>([]);
  const [listMessageEvent, setListMessageEvent] = useState<IMessageList[]>([]);
  const [account, setAccount] = useState<string | undefined>();
  const [accountIdentity, setAccountIdentity] = useState<IInfoAccount | undefined>();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [password, setPassword] = useState("");
  const [menuBar, setMenuBar] = useState<boolean>(false);
  useEffect(() => {
    
    const provider = new WsProvider(WS_PROVIDER);
    setApiReady(false);
    setApi(new ApiPromise({ provider }));    
    const local_dark = localStorage.getItem("PIDCHAT_dark_mode");
    if(local_dark) {
      const dark:any = JSON.parse(local_dark);
      changeDark(dark.isDarkMode);
    }
    const session = sessionStorage.getItem("PIDCHAT_session");
    const path = window.location.pathname;
    if (!session && (path !== "/login" &&  window.location.pathname != "/")) {
      setMenuBar(true);
      location.href = "/";
      return;
    }
    setPassword(session || "");
  }, []);
  const changeDark = (active: boolean) => {
    localStorage.setItem("PIDCHAT_dark_mode", JSON.stringify({isDarkMode: active}));
    document.body.classList.toggle("dark-theme", active);
    setIsDarkMode(active);
  };
  const alert = (
    message: string,
    type: "success" | "error" | "warning" | "info"
  ) => {
    toast(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Bounce,
      type: type,
      toastId: message,
    });
  };
  useEffect(() => {
    if (api) {
      api.isReady
        .then(() => {
          setApiReady(true);
          console.log("API ready");
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [api]);
  return (
    <UseProviderContext.Provider
      value={{
        router,
        setRouter,
        mobileSidebar,
        setMobileSidebar,
        api,
        apiReady,
        alert,
        contractSelected,
        setContractSelected,
        listChannel,
        setListChannel,
        listMessageEvent,
        setListMessageEvent,        
        account,
        setAccount,
        accountIdentity,
        setAccountIdentity,
        isDarkMode,
        setIsDarkMode,
        changeDark,
        password,
        setPassword,
        menuBar,
        setMenuBar
      }}
    >
      {props.children}
    </UseProviderContext.Provider>
  );
};

export { UseProviderContext, UseProvider };

import React, { useContext, useEffect, useState } from "react";

import ChatHeader from "./ChatHeader";
import ChatFooter from "./ChatFooter";
import PerfectScrollbar from "react-perfect-scrollbar";
import useContract from "../../hooks/useContract";
import { IMessage, UseProviderContext } from "../../contexts/UseProvider";
import Identicon from "@polkadot/react-identicon";
import { extractNumbersAndColorize, getDateView } from "../../utils";
import CryptoJS from "crypto-js";
import { IonLoading, IonSpinner } from "@ionic/react";
import { useTranslation } from "react-i18next";
const CHUNK_SIZE = 10;
const Chat: React.FC = () => {
  const { t } = useTranslation();
  const { contractSelected, apiReady,password } = useContext(UseProviderContext);
  const [message, setMessage] = useState<IMessage[]>([]);
  const [gas, setGas] = useState<number>(0);
  const [idEdit, setIdEdit] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [indexPage, setIndexPage] = useState(0);
  const [scrollLast, setScrollLast] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const {
    getMessages,
    getTotalMessages,
    sendMessage,
    editMessage,
    listMessageEvent,
    account,
    getQueryChannel,
    removeListenEventByAddress,
    alert,
  } = useContract();
  useEffect(() => {
    setLoading(true);
    if (apiReady) {
      setMessage([]);
      getDataMessages();
    }
  }, [contractSelected, apiReady, account]);
  useEffect(() => {
    addMessageListen();
  }, [listMessageEvent]);
  const addMessageListen = () => {
    let updatedMessages = [...message];
    setScrollLast(0);  
    getDataMessages();
    setMessage(updatedMessages);
  };

  const getDataMessages = async () => {
    setIndexPage(0);
    setScrollLast(0);
    if (!contractSelected) {
      setMessage([]);
      console.log(contractSelected);
      return;
    }
    const totalMessages = await getTotalMessages(contractSelected);
    if (totalMessages === 0) {
      setLoading(false);
      setMessage([]);
      return;
    }
    let index = Number(totalMessages);
    let messages: IMessage[] = [];
    let count = 1;
    do {
      const m = await getMessages(contractSelected, index);
      if (!m) break;
      messages.push(m);
      index--;
      if (index <= 0) {
        setIndexPage(0);
        break;
      }
      if (CHUNK_SIZE == count) {
        setIndexPage(index);
        break;
      }
      count++;
    } while (index <= Number(totalMessages || 0));
    messages = messages.sort((a, b) => a.id - b.id);
    setMessage(messages);
    setLoading(false);
    removeListenEventByAddress(contractSelected);
  };
  const getMore = async () => {
    if (!contractSelected) {
      return;
    }
    if (indexPage == 0) {
      return;
    }
    const totalMessages = await getTotalMessages(contractSelected);
    if (totalMessages === 0 || Number(totalMessages || 0) <= indexPage) {
      return;
    }
    if (message.length >= Number(totalMessages || 0)) {
      setIndexPage(0);
      return;
    }
    setLoadingMore(true);
    let messages: IMessage[] = [];
    let index = indexPage;
    let count = 1;
    do {
      const m = await getMessages(contractSelected, index);
      if (!m) {
        setIndexPage(index);
        break;
      }
      messages.push(m);
      index--;
      if (index <= 0) {
        setIndexPage(0);
        break;
      }
      if (CHUNK_SIZE == count) {
        setIndexPage(index);
        break;
      }

      count++;
    } while (count > 0);
    messages = messages.sort((a, b) => a.id - b.id);
    setLoadingMore(false);
    setIndexPage(index);
    setMessage([...messages, ...message]);
  };
  const handleEdit = (id: number, msg: string) => {
    setInputMsg(msg);
    setIdEdit(id);
  };
  const onChancel = () => {
    setIdEdit(0);
    setInputMsg("");
  };
  const [inputMsg, setInputMsg] = useState("");

  const [scrollEl, setScrollEl] = useState<any>();

  const handleSubmit = async () => {
    if (!inputMsg) return;
    const password_local = localStorage.getItem("PIDCHAT_password");
    let msm = inputMsg;
    setInputMsg("");
    if (password_local) {
      const decrypt_pass = CryptoJS.AES.decrypt(
        password_local,
        password
      ).toString(CryptoJS.enc.Utf8);
      const encrypt = CryptoJS.AES.encrypt(inputMsg, decrypt_pass).toString();
      msm = `0x:${encrypt}`;
    }
    try {
      setLoading(true);
      if (idEdit != 0) {
        setIdEdit(0);
        await editMessage(contractSelected, msm, idEdit);
        return;
      }
      await sendMessage(contractSelected, msm);
    } catch (error) {
    } finally {
      alert(t("TEXT_ALERT_SEND_MESSAGE"), "success");
      setInputMsg("");
      setLoading(false);
    }
  };

  const handleChange = async (newValue: string) => {
    setInputMsg(newValue);
    const resp = await getQueryChannel(
      contractSelected,
      "channelImpl::sendMessages",
      { newValue }
    );
    if (resp?.storageDeposit) {
      setGas(resp?.storageDeposit);
    }
  };

  useEffect(() => {
    if (scrollEl && scrollLast == 0) {
      setTimeout(() => {
        scrollEl.scrollTop = scrollEl.scrollHeight;
      }, 100);
    } else if (scrollEl && scrollLast > 0) {
      scrollEl.scrollTop = scrollEl.scrollHeight - scrollLast - 100;
    }
  }, [message]); 

  const MessagesView = (props: any) => {
    const { message } = props;

    return (
      <div
        key={`id-${message?.id}`}
        className={
          "message-item " +
          (message?.address != account ? "outgoing-message" : "")
        }
      >
        <div className={"message-content "}>
          {message?.address != account ? (
            <>
              <span
                style={{
                  color: extractNumbersAndColorize(message?.address || ""),
                }}
              >
                <Identicon
                  value={message?.address}
                  theme="substrate"
                  size={32}
                />
                {message.name}{" "}
              </span>
              <br />
              {message?.message}{" "}
            </>
          ) : (
            <>
              <span
                style={{
                  color: extractNumbersAndColorize(message?.address || ""),
                }}
              >
                <Identicon
                  value={message?.address}
                  theme="substrate"
                  size={32}
                />{" "}
                {t("TEXT_YOU")} by {message.name}
              </span>{" "}
              <br />
              <p
                onDoubleClick={() =>
                  handleEdit(message?.id || 0, message?.message)
                }
              >
                {message?.message}
              </p>
            </>
          )}
        </div>
        <div className="message-action">
          {getDateView(message?.dataUpdate)}
          <i className="ti-double-check text-info"></i>
        </div>
      </div>
    );
  };

  return (
    <div className="chat">
      {contractSelected ? (
        <React.Fragment>
          <ChatHeader selectedChat={contractSelected} />
          {loadingMore && (
            <div className="loading-more">
              <IonSpinner name="dots"></IonSpinner>
            </div>
          )}
          <PerfectScrollbar
            containerRef={(ref) => setScrollEl(ref)}
            onScroll={() => {
              if (indexPage == 0) {
                return;
              }

              if (scrollEl.scrollTop == 0) {
                setScrollLast(scrollEl.scrollHeight);
                getMore();
              }
            }}
          >
            <div className="chat-body">
              <div className="messages">
                {message.length > 0 ? (
                  message?.map((message, i: any) => {
                    return <MessagesView message={message} key={i} />;
                  })
                ) : (
                  <div
                    style={{
                      width: "100%",
                      textAlign: "center",
                      justifyContent: "center",
                      alignItems: "center",
                      display: "flex",
                    }}
                  >
                    <IonSpinner></IonSpinner>
                  </div>
                )}
              </div>
            </div>
          </PerfectScrollbar>

          <ChatFooter
            gas={gas}
            id={idEdit}
            loading={loading}
            onCancel={() => onChancel()}
            onSubmit={() => handleSubmit()}
            onChange={(e) => handleChange(e)}
            onRefresh={() => getDataMessages()}
            inputMsg={inputMsg}
          />
        </React.Fragment>
      ) : (
        <div className="chat-body no-message">
          <div className="no-message-container">
            <i className="fa fa-comments-o"></i>
            <p></p>
          </div>
        </div>
      )}
      <IonLoading isOpen={loading} message={t("TEXT_WAIT")} duration={5000} />
    </div>
  );
};

export default Chat;

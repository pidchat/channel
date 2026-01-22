import React, { useEffect, useState } from "react";
import {
  IonToolbar,
  IonButton,
  IonIcon,
  IonItem,
  IonInput,
  IonList,
  IonLabel,
  IonAvatar,
  IonSpinner,
  IonLoading,
} from "@ionic/react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { send } from "ionicons/icons";
import { IMessage } from "../../contexts/UseProvider";
import Identicon from "@polkadot/react-identicon";
import { getDateView } from "../../utils";
import useGovernance from "../../hooks/useGovernance";
import PerfectScrollbar from "react-perfect-scrollbar";
import { useTranslation } from "react-i18next";
import useContract from "../../hooks/useContract";
const CHUNK_SIZE = 10;
interface ModalChatPostProps {
  modal: boolean;
  modalToggle: () => void;
  addressChannel: string;
}

const ModalChatPost: React.FC<ModalChatPostProps> = ({
  modal,
  modalToggle,
  addressChannel,
}) => {
  const { t } = useTranslation();
  const [newMessage, setNewMessage] = useState("");
  const [message, setMessage] = useState<IMessage[]>([]);
  const { getComments, getTotalMessages } = useGovernance();
  const [gas, setGas] = useState<number>(0);
  const [indexPage, setIndexPage] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scrollEl, setScrollEl] = useState<any>();
  const { sendMessage, account, getQueryChannel, alert } = useContract();
  useEffect(() => {
    getDataMessages();
  }, [addressChannel]);
  const getDataMessages = async () => {
    setIndexPage(0);

    const totalMessages = await getTotalMessages(addressChannel);
    if (totalMessages === 0) {
      setLoading(false);
      setMessage([]);
      return;
    }
    let index = Number(totalMessages);
    let messages: IMessage[] = [];
    let count = 1;
    do {
      const m = await getComments(addressChannel, index);
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
    setMessage(messages);
    setLoading(false);
  };

  const getMore = async () => {
    if (!addressChannel) {
      return;
    }
    if (indexPage == 0) {
      return;
    }
    const totalMessages = await getTotalMessages(addressChannel);
    if (totalMessages === 0 || Number(totalMessages || 0) <= indexPage) {
      return;
    }
    if (message.length >= Number(totalMessages || 0)) {
      setIndexPage(0);
      return;
    }
    setLoadingMore(true);
    let messages: IMessage[] = [...message];
    let index = indexPage;
    let count = 1;
    do {
      const m = await getComments(addressChannel, index);
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
    setLoadingMore(false);
    setIndexPage(index);
    setMessage(messages);
  };

  const handleChange = async (newValue: string) => {
    setNewMessage(newValue);
    const resp = await getQueryChannel(
      addressChannel,
      "channelImpl::sendMessages",
      { newValue },
    );
    if (resp?.storageDeposit) {
      setGas(resp?.storageDeposit);
    }
  };
  const handleSend = async () => {
    if (!account) {
      alert(t("TEXT_ALERT_ACCOUNT_NOT_FOUND"), "error");
      return;
    }
    if (!newMessage) return;
    try {
      setLoading(true);
      await sendMessage(addressChannel, newMessage);
       setTimeout(() => {
        scrollEl.scrollTop = 0;
      }, 100);
    } catch (error) {
    } finally {
      alert(t("TEXT_ALERT_SEND_MESSAGE"), "success");
      setNewMessage("");
      setLoading(false);
      getDataMessages();
    }
  };
  return (
    <Modal
      className="modal-dialog-zoom"
      isOpen={modal}
      toggle={modalToggle}
      centered
    >
      <ModalHeader toggle={modalToggle}>{"Comentários"}</ModalHeader>
      <ModalBody>
        
        <PerfectScrollbar
          containerRef={(ref) => setScrollEl(ref)}
          style={{ height: "400px" }}
          onScroll={() => {
            
            const scrollBottom = scrollEl.scrollHeight - scrollEl.scrollTop - scrollEl.clientHeight;         
            if (scrollBottom == 0 && !loadingMore && indexPage > 0) {
              getMore();
            }
          }}
        >
          <IonList lines="none">
            {message.map((msg) => (
              <IonItem key={msg.id} className="ion-margin-bottom">
                <Identicon value={msg?.address} theme="substrate" size={32} />
                <IonLabel className="ion-text-wrap">
                  <h3>
                    {msg.name}{" "}
                    <span
                      style={{
                        fontSize: "0.8em",
                        color: "#888",
                        marginLeft: "8px",
                      }}
                    >
                      {getDateView(msg?.dataCreate)}
                    </span>
                  </h3>
                  <p>{msg.message}</p>
                </IonLabel>
              </IonItem>
            ))}
          </IonList>
        </PerfectScrollbar>
        {loadingMore && (
          <div className="loading-more">
            <IonSpinner name="dots"></IonSpinner>
          </div>
        )}
      </ModalBody>
      <ModalFooter>
        
        <IonToolbar>
          <div style={{ textAlign: "center" }}>
            {t("TEXT_FEE")} {gas} LUNES <br />
          </div>
          <div
            style={{ display: "flex", alignItems: "center", padding: "0 8px" }}
          >
            <IonInput
              placeholder="Escreva um comentário..."
              value={newMessage}
              onIonInput={(e) => handleChange(e.detail.value!)}
              onKeyDown={(e) => {
                console.log("onKeyDown", e);
                if (e.key === "Enter") handleSend();
              }}
              disabled={loading}
              style={{
                flex: 1,
                marginRight: "8px",
                "--padding-start": "10px",
                background: "var(--ion-color-light)",
                borderRadius: "20px",
              }}
            />
            <IonButton
              fill="clear"
              onClick={handleSend}
              disabled={!newMessage.trim()}
            >
              <IonIcon icon={send} slot="icon-only" color="primary" />
            </IonButton>
          </div>
        </IonToolbar>
        <IonLoading isOpen={loading} message={t("TEXT_WAIT")} />
      </ModalFooter>
    </Modal>
  );
};

export default ModalChatPost;

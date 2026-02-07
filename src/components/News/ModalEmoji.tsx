import React, { useEffect, useState } from "react";
import { IonToolbar, IonButton, IonButtons, IonLoading } from "@ionic/react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { useTranslation } from "react-i18next";
import useGovernance, {
  IEmoji
} from "../../hooks/useGovernance";

import useContract from "../../hooks/useContract";

import emoji from "../../assets/emoji.json";

interface ModalVotePostProps {
  modal: boolean;
  modalToggle: () => void;
  reload: () => void;
  emojis: IEmoji[];
  address: string;
}
const CHUNK_SIZE = 250;

const ModalEmoji: React.FC<ModalVotePostProps> = ({
  modal,
  modalToggle,
  reload,
  emojis,
  address
}) => {
  const { t } = useTranslation();
  const {
    feeSimulatedNetwork,
    sendEmotions,
  } = useGovernance();
  const { alert, balanceNative } = useContract();
  const [feeChannel, setFeeChannel] = useState(0);
  const [loading, setLoading] = useState(false);
  const [visibleEmojis, setVisibleEmojis] = React.useState<any[]>([]);
  const [index, setIndex] = React.useState(0);
  const emotions = React.useMemo(() => {
    return emoji.map((item: any) => item.char);
  }, []);
  useEffect(() => {
    setVisibleEmojis(emotions.slice(0, CHUNK_SIZE)); 
    setIndex(CHUNK_SIZE);
    feeSimulatedNetwork(100000000).then((res) => {
      if (res) {
        setFeeChannel(Number(res));
      }
    });
  }, []);
  const loadMoreEmojis = () => {
    if (visibleEmojis.length < emoji.length && index < emoji.length) {
      setVisibleEmojis(emotions.slice(0, index));
      setIndex(index + CHUNK_SIZE);
    }
  };

  // Inside ChatFooter component
  const componentEmoji = React.useMemo(
    () => (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(40px, 1fr))",
        }}
      >
        {visibleEmojis.map((item, index) => (
          <button
            key={index}
            onClick={() => {
              handleSendEmojis(item || "");
            }}
            style={{
              fontSize: "24px",
              padding: "5px",
              border: "none",
              background: "transparent",
              cursor: "pointer",
            }}
          >
            {item}
          </button>
        ))}
      </div>
    ),
    [visibleEmojis, index],
  );
  const handleSendEmojis = async (stringEmoji: string) => {
    try {
      console.log(stringEmoji);
      if (!stringEmoji) {
        alert(t("TEXT_ERROR_EMOJI"), "error");
        return;
      }
      if (balanceNative < feeChannel) {
        alert(t("TEXT_ERROR_BALANCE"), "error");
        return;
      }      
      if (!address) {
        alert(t("TEXT_ERROR_ADDRESS"), "error");
        return;
      }
      setLoading(true);
      await sendEmotions(address,stringEmoji);
      reload();
      modalToggle();
      setLoading(false);
    } catch (error: any) {
      alert(t(`${error.message}`), "error");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Modal
      className="modal-dialog-zoom"
      isOpen={modal}
      toggle={modalToggle}
      centered
    >
      <ModalHeader toggle={modalToggle}>{t("TEXT_EMOJI")}</ModalHeader>
      <ModalBody>
        {emojis.map((item, idx) => (
          <tr key={idx} style={{ borderBottom: "1px solid #eee" }}>
            <td style={{ padding: "8px", fontSize: "24px" }}>{item.emoji}</td>
            <td style={{ padding: "8px" }}>{item.quantity || 0}</td>
          </tr>
        ))}

        <p
          style={{
            gap: 5,
            textAlign: "center",
          }}
        >
          {t("TEXT_FEE")} <b>{feeChannel}</b> LUNES
        </p>
         <div
            style={{
              maxHeight: "20vh",
              overflow: "auto",
              width: "100%",
              backgroundColor: "transparent",
              scrollbarWidth: "thin",
              scrollbarColor: "black rgb(228, 221, 221)",
            }}
            onScroll={() => {
              loadMoreEmojis();
            }}
          >
            {componentEmoji}
          </div>
      </ModalBody>
      <ModalFooter>
        <IonToolbar>
          <IonButtons slot="end">
            <IonButton onClick={modalToggle} color="medium">
              {t("TEXT_CANCEL")}
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </ModalFooter>
      <IonLoading isOpen={loading} message={t("TEXT_WAIT")} />
    </Modal>
  );
};

export default ModalEmoji;

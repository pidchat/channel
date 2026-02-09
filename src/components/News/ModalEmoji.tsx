import React, { useEffect, useState } from "react";
import { IonToolbar, IonButton, IonButtons, IonLoading, IonIcon } from "@ionic/react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Input } from "reactstrap";
import { useTranslation } from "react-i18next";
import useGovernance, {
  IEmoji
} from "../../hooks/useGovernance";

import useContract from "../../hooks/useContract";

import emoji from "../../assets/emoji.json";
import { search } from "ionicons/icons";

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
  const searchEmoji = (query: string) => {
    if (query) {
      setVisibleEmojis(emoji.filter((item) => item.name.includes(query) || item.group.includes(query) || item.category.includes(query)).map((item: any) => item.char));
    } else {
      setVisibleEmojis(emotions.slice(0, CHUNK_SIZE));
    }
  };
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
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
            marginBottom: "12px",
          }}
        >
          {emojis.map((item, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                padding: "4px 8px",
                border: "1px solid #eee",
                borderRadius: "4px",
                backgroundColor: "#fafafa",
              }}
            >
              <span style={{ fontSize: "24px" }}>{item.emoji}</span>
              <span style={{ fontSize: "14px", color: "#555" }}>
                {item.quantity || 0}
              </span>
            </div>
          ))}
        </div>

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
            display: "flex",
            alignItems: "center",
            gap: "4px",
            padding: "4px 8px",
            border: "1px solid #eee",
            borderRadius: "4px",
            backgroundColor: "#fafafa",
          }}
        >
          <IonIcon icon={search} style={{ fontSize: "24px" }} />
          <Input
            placeholder={t("TEXT_SEARCH")}
            onChange={(e) => {
              searchEmoji(e.target.value || "");
            }}
          />
        </div>
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

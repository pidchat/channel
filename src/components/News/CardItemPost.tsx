import React, { useEffect, useState } from "react";
import {
  IonCard,
  IonCardContent,
  IonItem,
  IonAvatar,
  IonLabel,
  IonIcon,
  IonButton,
  useIonRouter,
  IonSpinner,
} from "@ionic/react";
import {
  chatbubbleOutline,
  alertCircle,
  skullOutline,
  copyOutline,
} from "ionicons/icons";

import useContract from "../../hooks/useContract";
import Identicon from "@polkadot/react-identicon";
import { getDateView, truncateText } from "../../utils";
import ModalChatPost from "./ModalChatPost";
import ModalReportPost from "./ModalReportPost";
import ModalVotePost from "./ModalVotePost";
import useGovernance, { ChannelInfo } from "../../hooks/useGovernance";
interface CardItemPostProps {
  channelId: number;
}
const CardItemPost: React.FC<CardItemPostProps> = ({ channelId }) => {
  const { isDarkMode, alert } = useContract();
  const router = useIonRouter();
  const { getMessageDefaultChannel, getTotalMessages, getNewsId } =
    useGovernance();
  const [openMessagesModal, setOpenMessagesModal] = useState(false);
  const [openReportPostModal, setOpenReportPostModal] = useState(false);
  const [openVotePostModal, setOpenVotePostModal] = useState(false);
  const [details, setDetails] = useState<ChannelInfo>();
  const [messages, setMessages] = useState<string[]>([]);
  const [quantityMessages, setQuantityMessages] = useState(0);
  useEffect(() => {
    getNewsId(channelId).then((res) => {
      console.log(res);
      setDetails(res);
    });
  }, [channelId]);
  useEffect(() => {
    if (!details) return;
    getMessageDefaultChannel(details.channelAddress).then((res) => {
      if (res && res.length > 0) {
        setMessages(res);
      }
    });
  }, [details]);
  useEffect(() => {
    handleQtdMessages();
  }, [details]);
  const handleQtdMessages = () => {
    if (!details) return;
    getTotalMessages(details.channelAddress).then((res) => {
      if (res) {
        setQuantityMessages(Number(res));
      }
    });
  };
  if (!details)
    return (
      <div className="loading-more">
        <IonSpinner name="dots"></IonSpinner>
      </div>
    );
  return (
    <IonCard
      style={{
        color: isDarkMode ? "#fff" : "",
        maxWidth: "600px",
        margin: "auto",
        top: "30px",
        backgroundColor: "transparent",
        width: "100%",
      }}
    >
      <IonCardContent>
        <IonItem lines="none" style={{ alignItems: "center" }}>
          <IonAvatar slot="start">
            <Identicon
              value={details?.addressOwner}
              theme="substrate"
              size={32}
            />
          </IonAvatar>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              padding: "4px 6px",
              borderRadius: "4px",
              transition: "background-color 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = isDarkMode
                ? "#333"
                : "#f0f0f0";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
            onClick={() => {
              navigator.clipboard.writeText(details?.channelAddress || "");
              alert("Endereço copiado para a área de transferência!", "info");
            }}
          >
            <IonLabel
              style={{
                fontWeight: "bold",
                fontSize: "12px",
                marginRight: "4px",
              }}
            >
              {truncateText(details?.channelAddress || "", 7, 10, false)}
            </IonLabel>
            <IonIcon icon={copyOutline} style={{ fontSize: "14px" }} />
          </div>
        </IonItem>
        <div
          style={{ fontSize: "12px", width: "100%", wordBreak: "break-word" }}
        >
          {details?.info?.name && <span>| {details.info.name} </span>}
          {details?.info?.email && <span>| {details.info.email} </span>}
          {details?.info?.twitter && <span>| {details.info.twitter} </span>}
          {details?.info?.web && <span>| {details.info.web} </span>}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
          }}
        >
          <IonLabel style={{ fontSize: "15px" }}>
            {getDateView(
              (Number(details?.dataCreate || 0) - 86624000 * 10).toString() ||
                "",
            )}
          </IonLabel>
        </div>
        <div>
          <div
            style={{
              fontSize: "15px",
              marginTop: "4px",
              marginBottom: "8px",
            }}
            onClick={() => {
              router.push(`/post/${details?.channelAddress}`);
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = isDarkMode
                ? "#333"
                : "#f0f0f0";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            {messages.slice(0, 5).map((item, index) => (
              <div key={index}>{item}</div>
            ))}
            {messages.length > 5 && <span>...</span>}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              color: "#536471",
            }}
          >
            <IonButton
              fill="clear"
              size="small"
              style={{ color: "#536471" }}
              onClick={() => setOpenMessagesModal(true)}
            >
              <IonIcon icon={chatbubbleOutline} /> {quantityMessages}
            </IonButton>
            <IonButton
              fill="clear"
              size="small"
              style={{ color: "#536471" }}
              onClick={() => setOpenReportPostModal(true)}
            >
              <IonIcon icon={alertCircle} />
            </IonButton>
            <IonButton
              fill="clear"
              size="small"
              style={{ color: "#536471" }}
              onClick={() => setOpenVotePostModal(true)}
            >
              <IonIcon icon={skullOutline} />
            </IonButton>
          </div>
        </div>
        <ModalChatPost
          modal={openMessagesModal}
          modalToggle={() => {
            setOpenMessagesModal(!openMessagesModal);
            handleQtdMessages();
          }}
          addressChannel={details?.channelAddress || ""}
        />
        <ModalReportPost
          modal={openReportPostModal}
          modalToggle={() => {
            setOpenReportPostModal(!openReportPostModal);
            console.log("closeModal");
          }}
          onOpenReport={() => {
            setOpenReportPostModal(true);
            console.log("openReportPostModal");
          }}
        />
        <ModalVotePost
          modal={openVotePostModal}
          modalToggle={() => {
            setOpenVotePostModal(!openVotePostModal);
            console.log("closeModal");
          }}
          handleVote={(yesOuNo) => {
            console.log("handleVote", yesOuNo);
          }}
        />
      </IonCardContent>
    </IonCard>
  );
};

export default CardItemPost;

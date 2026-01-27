import React, { useEffect, useState } from "react";
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonFooter,
  IonButton,
  IonIcon,
  IonSpinner,
} from "@ionic/react";
import {
  chatbubbleOutline,
  alertCircleOutline,
  flagOutline,
} from "ionicons/icons";
import ModalChatPost from "../components/News/ModalChatPost";
import useContract from "../hooks/useContract";
import useGovernance, { ChannelInfo } from "../hooks/useGovernance";
import { getDateView, truncateText } from "../utils";
import Identicon from "@polkadot/react-identicon";
import ShareChannelModal from "../components/Modals/ShareChannelModal";

const Post: React.FC = () => {
  const { account, apiReady, alert, isDarkMode } = useContract();
  const { getMessageDefaultChannel, getChannelIdAccount, getNewsId } =
    useGovernance();
  const [details, setDetails] = useState<ChannelInfo>();
  const [openMessagesModal, setOpenMessagesModal] = useState(false);
  const [openReportPostModal, setOpenReportPostModal] = useState(false);
  const [modal, setModal] = useState(false);
  const [addressChannel, setAddressChannel] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  useEffect(() => {
    if (apiReady) {
      const params = window.location.pathname.split("/");
      const id = params[params.length - 1];
      setAddressChannel(id);
    }
  }, [apiReady]);
  useEffect(() => {
    if (!addressChannel) return;
    getChannelIdAccount(addressChannel)
      .then((res) => {
        if (res) {
          getNewsId(Number(res))
            .then((res) => {
              if (res) {
                setDetails(res);
              }
            })
            .catch((error) => {
              alert(error.message, "error");
            });
        }
      })
      .catch((error) => {
        alert(error.message, "error");
      });
  }, [addressChannel]);

  useEffect(() => {
    if (!addressChannel) return;
    getMessageDefaultChannel(addressChannel).then((res) => {
      if (res && res.length > 0) {
        setMessages(res);
      }
    });
  }, [addressChannel]);

  return (
    <IonPage>
      <div className={account ? "contentNews" : "contentFull"}>
        {details ? (
          <>
            <IonHeader
              style={{
                color: isDarkMode ? "#fff" : "",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div className="chat-header-user">
                <div>
                  <p
                    onClick={() => {
                      navigator.clipboard.writeText(addressChannel);
                    }}
                  >
                    <Identicon
                      value={addressChannel}
                      theme="substrate"
                      size={32}
                    />
                    {truncateText(addressChannel, 7, 10, false)}{" "}
                    <IonButton onClick={() => setModal(true)} size="small">
                      <i className="ti ti-share"></i>
                    </IonButton>
                  </p>
                </div>
              </div>
            </IonHeader>

            <IonContent fullscreen>
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>
                    <div
                      style={{
                        fontSize: "12px",
                        width: "100%",
                        wordBreak: "break-word",
                      }}
                    >
                      {details?.info?.name && (
                        <span>| {details.info.name} </span>
                      )}
                      {details?.info?.email && (
                        <span>| {details.info.email} </span>
                      )}
                      {details?.info?.twitter && (
                        <span>| {details.info.twitter} </span>
                      )}
                      {details?.info?.web && <span>| {details.info.web} </span>}
                    </div>
                  </IonCardTitle>
                  <IonCardSubtitle>
                    {getDateView(
                      (
                        Number(details?.dataCreate || 0) -
                        86624000 * 10
                      ).toString() || "",
                    )}
                  </IonCardSubtitle>
                </IonCardHeader>

                <IonCardContent
                  style={{
                    marginBottom: "50px",
                  }}
                >
                  {messages.map((message, index) => (
                    <div key={index}>{message}</div>
                  ))}
                </IonCardContent>
              </IonCard>
            </IonContent>
          </>
        ) : (
          <IonSpinner name="dots"></IonSpinner>
        )}
      </div>
      <IonFooter>
        <IonToolbar>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              height: "100%",
              justifyContent: "space-around",
              marginLeft: account ? "50px" : "0",
            }}
          >
            <IonButton
              fill="clear"
              color="medium"
              onClick={() => setIsModalOpen(true)}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <IonIcon
                  icon={chatbubbleOutline}
                  style={{ fontSize: "24px" }}
                />
                <span style={{ fontSize: "10px", marginTop: "4px" }}>
                  Comentário
                </span>
              </div>
            </IonButton>

            <IonButton fill="clear" color="warning">
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <IonIcon
                  icon={alertCircleOutline}
                  style={{ fontSize: "24px" }}
                />
                <span style={{ fontSize: "10px", marginTop: "4px" }}>
                  Alerta
                </span>
              </div>
            </IonButton>

            <IonButton fill="clear" color="danger">
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <IonIcon icon={flagOutline} style={{ fontSize: "24px" }} />
                <span style={{ fontSize: "10px", marginTop: "4px" }}>
                  Denunciar
                </span>
              </div>
            </IonButton>
          </div>
        </IonToolbar>
      </IonFooter>
      <ModalChatPost
        modal={isModalOpen}
        modalToggle={() => setIsModalOpen(!isModalOpen)}
        addressChannel={addressChannel}
      />
      <ShareChannelModal
        address={addressChannel}
        modal={modal}
        modalToggle={() => setModal(!modal)}
        name={details?.info?.name || ""}
         patch={`post/${addressChannel}`}
      />
    </IonPage>
  );
};

export default Post;

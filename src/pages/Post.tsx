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
import { chatbubbleOutline, flagOutline, skullOutline } from "ionicons/icons";
import ModalChatPost from "../components/News/ModalChatPost";
import useContract from "../hooks/useContract";
import useGovernance, { ChannelInfo } from "../hooks/useGovernance";
import { getDateView, truncateText } from "../utils";
import Identicon from "@polkadot/react-identicon";
import ShareChannelModal from "../components/Modals/ShareChannelModal";
import { useTranslation } from "react-i18next";
import ModalReportPost from "../components/News/ModalReportPost";
import ModalVotePost from "../components/News/ModalVotePost";

const Post: React.FC = () => {
  const { t,i18n } = useTranslation();
  const { account, apiReady, alert, isDarkMode } = useContract();
  const {
    getMessageDefaultChannel,
    getChannelIdAccount,
    getNewsId,
    getPriceGuardian,
    getReasonReport,
  } = useGovernance();
  const [details, setDetails] = useState<ChannelInfo>();
  const [modal, setModal] = useState(false);
  const [openReportPostModal, setOpenReportPostModal] = useState(false);
  const [openVotePostModal, setOpenVotePostModal] = useState(false);
  const [addressChannel, setAddressChannel] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [priceGuardian, setPriceGuardian] = useState(0);
  const [reason, setReason] = useState("");
  const [priceStr, setPriceStr] = useState("");
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
          getPriceGuardian().then((res) => {
            if (res) {
              setPriceGuardian(Number(res) / 1000000000000000000);
              setPriceStr(res);
            }
          });
          getReasonReport(Number(res)).then((res) => {
            if (res) {
              setReason(res);
            }
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
                      i18n.language,
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
                  {t("TEXT_COMMENTS")}
                </span>
              </div>
            </IonButton>
            <IonButton fill="clear" color="danger" onClick={() => setOpenReportPostModal(true)}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <IonIcon icon={flagOutline} style={{ fontSize: "24px" }} />
                <span style={{ fontSize: "10px", marginTop: "4px" }}>
                   {t("TEXT_REPORT")}
                </span>
              </div>
            </IonButton>
            {reason && (
              <IonButton fill="clear" color="warning" onClick={() => setOpenVotePostModal(true)}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <IonIcon icon={skullOutline} style={{ fontSize: "24px" }} />
                  <span style={{ fontSize: "10px", marginTop: "4px" }}>
                    {t("TEXT_VOTE")}
                  </span>
                </div>
              </IonButton>
            )}
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
      <ModalReportPost
        modal={openReportPostModal}
        value={priceGuardian.toString()}
        postReported={reason}
        priceGuardian={priceStr}
        channelId={details?.id || 0}
        dataLimit={details?.dataCreate || ""}
        isOwner={account === details?.addressOwner}
        modalToggle={() => {
          setOpenReportPostModal(!openReportPostModal);
          getReasonReport(Number(details?.id || 0)).then((res) => {
            if (res) {
              setReason(res);
            }
          });
        }}
      />
      <ModalVotePost
        modal={openVotePostModal}
        reason={reason}
        channelId={details?.id.toString() || ""}
        modalToggle={() => {
          setOpenVotePostModal(!openVotePostModal);
          console.log("closeModal");
        }}
      />
    </IonPage>
  );
};

export default Post;

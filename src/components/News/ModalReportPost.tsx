import React, { useEffect, useState } from "react";
import {
  IonToolbar,
  IonButton,
  IonButtons,
  IonItem,
  IonLoading,
} from "@ionic/react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Input } from "reactstrap";
import { useTranslation } from "react-i18next";
import useContract from "../../hooks/useContract";
import { getDateView } from "../../utils";
import useGovernance from "../../hooks/useGovernance";

interface ModalReportPostProps {
  channelId: number;
  modal: boolean;
  modalToggle: () => void;
  value: string;
  dataLimit: string;
  postReported: string;
  isOwner: boolean;
  priceGuardian: string;
}

const ModalReportPost: React.FC<ModalReportPostProps> = ({
  modal,
  modalToggle,
  value,
  dataLimit,
  postReported,
  isOwner,
  channelId,
  priceGuardian
}) => {
  const { t, i18n } = useTranslation();
  const [reason, setReason] = useState("");
  const { feeNetWork, feeSimulatedNetwork, alert,balanceToken } = useContract();
  const {
      openVotesFakesNews,
      recoverySafePublic,
    } = useGovernance();
  const [loading, setLoading] = useState(false);
 
  useEffect(() => {
    setReason(postReported);
    feeSimulatedNetwork(100000000);
  }, [postReported]);
   const handleRecoveryFakesNews = async () =>{
    if(!channelId) return;
    try {
      setLoading(true);
      await recoverySafePublic(channelId);
      alert(t("TEXT_REWARD_SEND_SUCCESS"), "success");
      
      modalToggle()
    } catch (error: any) {
      alert(t(`${error.message}`), "error");
    } finally {
      setLoading(false);
    }
  }
   const handleOpenVotesFakesNews = async (reason: string) => {
    if (!channelId) return;
    try {
      if (balanceToken < 1000000) {
        alert(t("TEXT_BALANCE_AUDITOR"), "error");
        return;
      }
      if (balanceToken < Number(value)) {
        alert(t("TEXT_ERROR_BALANCE"), "error");
        return;
      }
      setLoading(true);
      await openVotesFakesNews(channelId.toString(), reason, priceGuardian.toString());
      alert(t("TEXT_POST_REPORTED"), "success");
       modalToggle()
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
      <ModalHeader toggle={modalToggle}>
        {t("TEXT_TITLE_REPORT_POST")}
      </ModalHeader>
      <ModalBody>
        {t("TEXT_DESCRIPTION_REPORT_POST")}
        <br />
        <ul>
          <li>1. {t("TEXT_1_REPORT_POST")} </li>
          <li>2. {t("TEXT_2_REPORT_POST", { value: value })}</li>
          <li>3. {t("TEXT_3_REPORT_POST")}</li>
          <li>4. {t("TEXT_4_REPORT_POST")}</li>
          <li>5. {t("TEXT_5_REPORT_POST")}</li>
          <li>6. {t("TEXT_6_REPORT_POST")}</li>
        </ul>
        <br />
        {isOwner && (
          <div style={{ fontSize: "12px", textAlign: "center" }}>
            {t("TEXT_DATA_LIMIT_BALANCE", {
              value: getDateView(
                Number(dataLimit || 0).toString() || "",
                i18n.language,
              ),
            })}
          </div>
        )}
        {!isOwner && (
          <div style={{ fontSize: "12px", textAlign: "center" }}>
            {t("TEXT_DATA_LIMIT", {
              value: getDateView(
                Number(dataLimit || 0).toString() || "",
                i18n.language,
              ),
            })}
          </div>
        )}       
        {!isOwner && (
          <IonItem lines="none" style={{ fontSize: "12px" }}>
            <Input
              style={{
                color: "#000000ff",
                fontSize: "inherit",
                maxHeight: "100px",
                overflowY: "auto",
              }}
              disabled={postReported.length > 0}
              placeholder={t("TEXT_REASON")}
              value={reason}
              type="text"
              name="reason"
              id="reason"
              onChange={(e) => setReason(e.target.value)}
            />
          </IonItem>
        )}
        <p
          style={{
            gap: 5,
            textAlign: "center",
            marginLeft: "auto",
          }}
        >
          {t("TEXT_FEE")} <b>{feeNetWork}</b> LUNES
        </p>
      </ModalBody>
      <ModalFooter>
        <IonToolbar>
          <IonButtons slot="end">
            <IonButton onClick={modalToggle} color="medium">
              {t("TEXT_CANCEL")}
            </IonButton>
            {!isOwner && (
              <IonButton
                onClick={()=>handleOpenVotesFakesNews(reason)}
                color="danger"
                disabled={postReported.length > 0}
              >
                {t("TEXT_REPORT")}
              </IonButton>
            )}
            {isOwner && (
              <IonButton
                onClick={()=>handleRecoveryFakesNews()}
                color="danger"
                disabled={postReported.length > 0 && !isOwner}
              >
                {t("TEXT_REWARD_SAFE")}
              </IonButton>
            )}
          </IonButtons>
        </IonToolbar>
      </ModalFooter>
      <IonLoading isOpen={loading} message={t("TEXT_WAIT")} />
    </Modal>
  );
};

export default ModalReportPost;

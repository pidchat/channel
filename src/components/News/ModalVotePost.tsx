import React, { useEffect, useState } from 'react';
import {
  IonToolbar,
  IonButton,
  IonButtons,
  IonLoading
} from '@ionic/react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import { useTranslation } from 'react-i18next';
import useGovernance, { VotesFakesNews } from '../../hooks/useGovernance';
import { getDateView } from '../../utils';
import useContract from '../../hooks/useContract';



interface ModalVotePostProps   {
  modal: boolean;
  modalToggle: () => void;
  reason: string;
  channelId: string;
}


const ModalVotePost: React.FC<ModalVotePostProps> = ({ modal, modalToggle, reason, channelId }) => {  
  const { t,i18n } = useTranslation();
  const { getVotesFakesNews,feeSimulatedNetwork, rewardSafeForFakesNews,doingVotesFakesNews } = useGovernance();
  const {alert,balanceNative} = useContract();
  const [openClaim, setOpenClaim] = useState(false);
  const [feeChannel, setFeeChannel] = useState(0);
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState<VotesFakesNews>({
    votesYES: 0,
    votesNO: 0,
    dataCreate: "",
    votesTotal: 0,
  });
  useEffect(() => {
    getVotesFakesNews(channelId).then((details) => {
      if(!details) return;
      if(!details.dataCreate) return;
      setDetails(details);
      const dataEnd = new Date();
      dataEnd.setTime(Number(details.dataCreate))
      if(dataEnd.getTime() < Date.now()){
        setOpenClaim(true);
      }     
    });
    feeSimulatedNetwork(100000000).then((fee) => {
      if(!fee) return;
      setFeeChannel(fee);
    });
  }, [channelId]);
   const handleRewardSafeForFakesNews = async () => {
    if (!details) return;
    try {
      setLoading(true);
      await rewardSafeForFakesNews(Number(channelId));
      alert(t("TEXT_REWARD_SEND_SUCCESS"), "success");
      modalToggle();
      setLoading(false);
    } catch (error: any) {
      alert(t(`${error.message}`), "error");
    } finally {
      setLoading(false);
    }
  };
  const handleDoingVotesFakesNews = async (yesOuNo: boolean) => {
    if (!details) return;
    try {
      if (balanceNative < 0) {
        alert(t("TEXT_ERROR_BALANCE"), "error");
        return;
      }
      setLoading(true);
      await doingVotesFakesNews(Number(channelId), yesOuNo);
      alert(t("TEXT_VOTE_SUCCESS"), "success");
      getVotesFakesNews(channelId).then((res) => {
        if(!res) return;
        setDetails(res);
      });
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
      <ModalHeader toggle={modalToggle}>{t("TEXT_VOTE_POST")}</ModalHeader>
      <ModalBody>
          {t("TEXT_DESCRIPTION_REPORT_POST")}<br/>
          {t("TEXT_REASON")}:<br/>         
          {reason}<br/>
           <div style={{  textAlign: "center",}}>{t("TEXT_DATE_AT")} {getDateView(details.dataCreate,i18n.language)}</div>
          <div className="mt-3">
            <div className="d-flex justify-content-between mb-1">
              <small>{t("TEXT_YES")}: {details.votesYES}</small>
              <small>{t("TEXT_NO")}: {details.votesNO}</small>
            </div>
            <div className="progress" style={{ height: "20px" }}>
              <div
                className="progress-bar bg-success"
                role="progressbar"
                style={{ width: `${details.votesTotal ? (details.votesYES / details.votesTotal) * 100 : 0}%` }}
              />
              <div
                className="progress-bar bg-danger"
                role="progressbar"
                style={{ width: `${details.votesTotal ? (details.votesNO / details.votesTotal) * 100 : 0}%` }}
              />
            </div>
            <div className="text-center mt-1">
              <small>{t("TEXT_TOTAL_LIMIT")}{details.votesTotal}</small>
            </div>
          </div>
            <p
            style={{
              gap: 5,
              textAlign: "center",
            }}
          >
            {t("TEXT_FEE")} <b>{feeChannel}</b> LUNES
          </p>
      </ModalBody>
      <ModalFooter>
        <IonToolbar>
          <IonButtons slot='end'>
            <IonButton onClick={modalToggle} color="medium">{t("TEXT_CANCEL")}</IonButton>
            {!openClaim && (
            <>
            <IonButton onClick={() => handleDoingVotesFakesNews(true)} color="success">{t("TEXT_YES")}</IonButton>            
            <IonButton onClick={() => handleDoingVotesFakesNews(false)} color="danger">{t("TEXT_NO")}</IonButton>            
            </>
            )}
            {openClaim &&(
              <>
              <IonButton onClick={() => handleRewardSafeForFakesNews()} color="success">{t("TEXT_CLAIM")}</IonButton>           
              </>
            )}
          </IonButtons>
        </IonToolbar>
       </ModalFooter>
       <IonLoading isOpen={loading} message={t("TEXT_WAIT")} />
    </Modal>
  );
};

export default ModalVotePost;

import React, { useContext, useEffect, useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import { IonButton, IonLoading } from "@ionic/react";
import { useTranslation } from "react-i18next";
import { UseProviderContext } from "../../contexts/UseProvider";
import useGovernance, {
  InfoGovernance,
  InfoVotePriceAndAuditor,
} from "../../hooks/useGovernance";
import { getDateView } from "../../utils";
import useContract from "../../hooks/useContract";
interface IIssueChannel {
  modal: boolean;
  modalToggle: () => void;
}
const ModalVotePriceAndAudit: React.FC<IIssueChannel> = ({
  modal,
  modalToggle,
}) => {
  const { t, i18n } = useTranslation();
  const { apiReady } = useContext(UseProviderContext);
  const [valuePrice, setValuePrice] = useState("");
  const [valueBalanceAudit, setValueBalanceAudit] = useState("");
  const {
    getInfoGovernance,
    getVotePrice,
    doingVotesPrice,
    feeSimulatedNetwork,
    openVoteNewPriceAndBalanceAudit,
  } = useGovernance();
  const { alert, balanceToken } = useContract();
  const [feeChannel, setFeeChannel] = useState(0);
  const [infoVotePrice, setInfoVotePrice] = useState<InfoVotePriceAndAuditor>();
  const [infoGovernance, setInfoGovernance] = useState<InfoGovernance>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!apiReady) return;
    getInfoGovernanceView();
    getPriceVoteView();
    feeSimulatedNetwork(100000000).then((fee) => {
      if (!fee) return;
      setFeeChannel(fee);
    });
  }, [apiReady]);
  const getPriceVoteView = async () => {
    try {
      const data = await getVotePrice();
      if (data) setInfoVotePrice(data);
    } catch (error: any) {
      console.log(error);
    }
  };
  const getInfoGovernanceView = async () => {
    try {
      const data = await getInfoGovernance();
      if (data) {
        setInfoGovernance(data);
        setValuePrice(
          (Number(data?.priceGuardian) / 100000000000000000).toFixed(0) || "",
        );
        setValueBalanceAudit(
          (Number(data?.totalBalanceAuditor) / 100000000000000000).toFixed(0) ||
            "",
        );
      }
    } catch (error: any) {
      console.log(error);
    }
  };
  const handleDoingVotesPrice = async (yesOrNo: boolean) => {
    try {
      if (balanceToken < 1000000) {
        alert(t("TEXT_BALANCE_AUDITOR"), "error");
        return;
      }
      setLoading(true);
      await doingVotesPrice(yesOrNo);
      await getPriceVoteView();
      alert(t("TEXT_VOTE_SUCCESS"), "success");
    } catch (error: any) {
      alert(error.message, "error");
    } finally {
      setLoading(false);
    }
  };
  const handleOpenVotePrice = async () => {
    try {
      if (balanceToken < 1000000) {
        alert(t("TEXT_BALANCE_AUDITOR"), "error");
        return;
      }
      if (!valuePrice || !valueBalanceAudit) {
        alert(t("TEXT_ENTER_INFORMATION"), "error");
        return;
      }
      setLoading(true);
      await openVoteNewPriceAndBalanceAudit(valuePrice.replace(/\D/g, ''), valueBalanceAudit.replace(/\D/g, ''));
      alert(t("TEXT_VOTE_SUCCESS"), "success");
    } catch (error: any) {
      alert(error.message, "error");
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
        🚨 {t("TEXT_GOVERNANCE")}🚨
      </ModalHeader>
      <ModalBody>
        <p>
          {t("TEXT_AUDITOR_OPEN_VOTE", {
            value: (
              Number(infoGovernance?.priceGuardian) / 100000000000000000
            ).toFixed(0),
          })}
        </p>
        {!infoVotePrice && (
          <>
            <Form>
              <FormGroup>
                <Label for="address">{t("TEXT_PRICE_PER_POST")}</Label>
                <Input
                  type="number"
                  name="address"
                  id="address"
                  value={valuePrice}
                  onChange={(e) => setValuePrice(e.target.value.replace(/\D/g, ''))}
                />
              </FormGroup>
              <FormGroup>
                <Label for="address">{t("TEXT_BALANCE_PER_AUDIT")}</Label>
                <Input
                  type="number"
                  name="address"
                  id="address"
                  value={valueBalanceAudit}
                  onChange={(e) => setValueBalanceAudit(e.target.value.replace(/\D/g, ''))}
                />
              </FormGroup>
            </Form>
          </>
        )}
        {infoVotePrice && (
          <>
            <div style={{ textAlign: "center" }}>
              {t("TEXT_DATE_AT")}{" "}
              {getDateView(infoVotePrice.dataLimit, i18n.language)}
            </div>
            <div className="mt-3">
              <div className="d-flex justify-content-between mb-1">
                <small>
                  {t("TEXT_YES")}: {infoVotePrice.voteYes}
                </small>
                <small>
                  {t("TEXT_NO")}: {infoVotePrice.voteNo}
                </small>
              </div>
              <div className="progress" style={{ height: "20px" }}>
                <div
                  className="progress-bar bg-success"
                  role="progressbar"
                  style={{
                    width: `${
                      (infoVotePrice.voteYes /
                        (infoVotePrice.voteYes + infoVotePrice.voteNo)) *
                      100
                    }%`,
                  }}
                />
                <div
                  className="progress-bar bg-danger"
                  role="progressbar"
                  style={{
                    width: `${
                      (infoVotePrice.voteNo /
                        (infoVotePrice.voteYes + infoVotePrice.voteNo)) *
                      100
                    }%`,
                  }}
                />
              </div>
              <div className="text-center mt-1">
                <small>
                  {t("TEXT_PRICE_PER_POST")}
                  {(
                    Number(infoVotePrice?.votePrice) / 100000000000000000
                  ).toFixed(0)}
                </small>
                <small>
                  {t("TEXT_BALANCE_PER_AUDIT")}
                  {(
                    Number(infoVotePrice.balanceAuditor) / 100000000000000000
                  ).toFixed(0)}
                </small>
              </div>
            </div>
          </>
        )}
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
        <IonButton color="danger" onClick={() => modalToggle()}>
          {t("TEXT_CANCEL")}
        </IonButton>
        {!infoVotePrice && (
          <>
            <IonButton color="primary" onClick={() => handleOpenVotePrice()}>
              {t("TEXT_OPEN_VOTE")}
            </IonButton>
          </>
        )}
        {infoVotePrice && (
          <>
            <IonButton
              onClick={() => handleDoingVotesPrice(true)}
              color="success"
            >
              {t("TEXT_YES")}
            </IonButton>
            <IonButton
              onClick={() => handleDoingVotesPrice(false)}
              color="danger"
            >
              {t("TEXT_NO")}
            </IonButton>
          </>
        )}
      </ModalFooter>
      <IonLoading isOpen={loading} message={t("TEXT_WAIT")} />
    </Modal>
  );
};

export default ModalVotePriceAndAudit;

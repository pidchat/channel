import React, { useEffect, useState } from "react";
import {
  IonToolbar,
  IonButton,
  IonButtons,
  IonLoading,
  IonSelect,
  IonSelectOption,
} from "@ionic/react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  FormGroup,
  Label,
} from "reactstrap";
import { useTranslation } from "react-i18next";
import useGovernance from "../../hooks/useGovernance";

import useContract from "../../hooks/useContract";
import Identicon from "@polkadot/react-identicon";
import { formatMillion } from "../../utils";

interface ModalTipProps {
  modal: boolean;
  modalToggle: () => void;
  address: string;
}
const ModalTip: React.FC<ModalTipProps> = ({
  modal,
  modalToggle,
  address,
}) => {
  const { t } = useTranslation();
  const {
    feeSimulatedNetwork,
  } = useGovernance();
  const {
    alert,
    balanceNative,
    balanceToken,
    transferBalance,
    transferToken,
    feeSimulatedToken,
    account
  } = useContract();
  const [coinType, setCoinType] = useState("PID");
  const [amount, setAmount] = useState(0);
  const [feeChannel, setFeeChannel] = useState(0);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    feeSimulatedNetwork(100000000).then((res) => {
      if (res) {
        setFeeChannel(Number(res));
      }
    });
  }, []);
 
  const handleTransfer = async () => {
    if (!address) {
      alert(t("TEXT_ERROR_ADDRESS"), "error");
      return;
    }
    if (amount <= 0) {
      alert(t("TEXT_ERROR_AMOUNT"), "error");
      return;
    }
    try {     
      if (coinType === "LUNES") {
        if (amount == 0 || amount > balanceNative) {
          alert(t("TEXT_ERROR_BALANCE"), "error");
          return;
        }
        setLoading(true);
        await transferBalance(Math.round(amount * Math.pow(10, 8)), address);
      } else {
        if (amount == 0 || amount > balanceToken) {
          alert(t("TEXT_ERROR_BALANCE"), "error");
          return;
        }      
        setLoading(true);
        await transferToken(
          Math.round(amount * Math.pow(10, 18)).toLocaleString("fullwide", {
            useGrouping: false,
          }),
          address,
        );
      }
      setLoading(false);
      alert(t("TEXT_ALERT_TRANSFER_SUCCESS"), "success");
      setAmount(0);
    } catch (error: any) {
      console.log(error);
      alert(error.message? error.message : t("TEXT_ERROR"), "error");
    } finally {
      setLoading(false);
    }
  };
  const componentSelectWallet = (balance: number, coin: string) => {
    return (
      <FormGroup>
        <IonButton expand="full" color={"light"}>
          <Identicon value={account} theme="substrate" size={32} />{" "}
          {t("TEXT_BALANCE")}{" "}
          {`${formatMillion(balance.toFixed(0).toString())} ${coin}`}
        </IonButton>
      </FormGroup>
    );
  };
  return (
    <Modal
      className="modal-dialog-zoom"
      isOpen={modal}
      toggle={modalToggle}
      centered
    >
      <ModalHeader toggle={modalToggle}>{t("TEXT_TIP")}</ModalHeader>
      <ModalBody>
        <IonSelect
          label={t("TEXT_CHOOSE_COIN")}
          placeholder="LUNES or PID"
          mode="md"
          value={coinType}
          onIonChange={(e: any) => setCoinType(e.detail.value)}
        >
          <IonSelectOption value="LUNES">
            {" "}
            <p style={{ textTransform: "uppercase", color: "red" }}>LUNES</p>
          </IonSelectOption>
          <IonSelectOption value="PID">TOKEN PIDCHAT</IonSelectOption>
        </IonSelect>
        { componentSelectWallet(
              coinType === "LUNES" ? balanceNative : balanceToken,
              coinType === "LUNES" ? "LUNES" : "PID",
            )}

        <FormGroup>
          <Label for="amount">{t("TEXT_AMOUNT")}</Label>
          <Input
            type="number"
            name="amount"
            id="amount"
            value={amount}
            onChange={(e: any) => {
              setAmount(Number(e.target.value));
              feeSimulatedNetwork(
                Math.round(Number(e.target.value || 0) * Math.pow(10, 8)),
              );
              if (coinType === "PID")
                feeSimulatedToken(
                  Math.round(
                    Number(e.target.value || 0) * Math.pow(10, 8),
                  ).toLocaleString("fullwide", { useGrouping: false }),
                  address,
                );
            }}
            placeholder={t("TEXT_ENTER_AMOUNT")}
          />
        </FormGroup>
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
          <IonButtons slot="end">
            <IonButton onClick={modalToggle} color="medium">
              {t("TEXT_CANCEL")}
            </IonButton>
            <IonButton
              color="primary"
              disabled={loading}
              onClick={() => handleTransfer()}
            >
              { t("TEXT_SEND")}
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </ModalFooter>
      <IonLoading isOpen={loading} message={t("TEXT_WAIT")} />
    </Modal>
  );
};

export default ModalTip;

import React, { useEffect, useState } from "react";
import {
  IonCard,
  IonCardContent,
  IonAvatar,
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonTextarea,
} from "@ionic/react";
import { imageOutline, happyOutline } from "ionicons/icons";
import { useTranslation } from "react-i18next";
import useContract from "../../hooks/useContract";
import Identicon from "@polkadot/react-identicon";
import { truncateText } from "../../utils";
import useGovernance from "../../hooks/useGovernance";
import { Input } from "reactstrap";
interface CardSendPostProp {
  reload: () => void;
}
const CardSendPost: React.FC<CardSendPostProp> = ({ reload }) => {
  const { t } = useTranslation();
  const {
    account,
    accountIdentity,
    alert,
    balanceToken,
    balanceNative,
    isDarkMode,
    feeCreateChannel,
    feeGasNetWork,
  } = useContract();
  const { getPriceGuardian, addNewsChannel } = useGovernance();
  const [feeChannel, setFeeChannel] = useState(0);
  const [priceGuardian, setPriceGuardian] = useState(0);
  const [priceString, setPriceString] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    calcFeeContract();
  }, [description]);
  const calcFeeContract = async () => {
    const descriptionArray = description.split("\n");
    const value = await feeCreateChannel(descriptionArray, "String");
    setFeeChannel(value + feeGasNetWork);
  };
  useEffect(() => {
    getPriceGuardian().then((value) => {
      setPriceGuardian(Number(value) / 1000000000000000000);
      setPriceString(value);
    });
  }, []);
  const handleCreate = async () => {
    try {
      if (description.length === 0) {
        alert("Please enter a description", "error");
        return;
      }
      if (balanceNative < feeChannel) {
        alert("You don't have enough balance Native", "error");
        return;
      }
      if (balanceToken < priceGuardian) {
        alert("You don't have enough balance Token", "error");
        return;
      }
      setLoading(true);
      const descriptionArray = description.split("\n");
      let name =
        "[" +
        Math.random().toString(36).substring(2, 10) +
        "]" +
        new Date().getTime().toString(36);
      await addNewsChannel(
        descriptionArray,
        priceString.toString(),
        name,
        "String",
      );
      setDescription("");
      setLoading(false);
      alert("Channel published successfully", "success");
      reload();
    } catch (error: any) {
      setLoading(false);
      alert(error, "error");
    }
  };
  return (
    <IonCard
      style={{
        maxWidth: "600px",
        margin: "auto",
        backgroundColor: "transparent",
        width: "100%",
        color: isDarkMode ? "#fff" : "",
      }}
    >
      <IonCardContent>
        <IonItem lines="none" style={{ alignItems: "center" }}>
          <IonAvatar slot="start">
            <Identicon value={account} theme="substrate" size={32} />
          </IonAvatar>
          <IonLabel style={{ fontWeight: "bold", fontSize: "12px" }}>
            {accountIdentity?.name || truncateText(account || "", 7, 10, false)}
          </IonLabel>
        </IonItem>
        <IonItem lines="none" style={{ fontSize: "12px" }}>
          <Input
            style={{
              color: "#1d9bf0",
              fontSize: "inherit",
              maxHeight: "100px",
              overflowY: "auto",
            }}
            value={description}
            type="textarea"
            name="email"
            id="email"
            onChange={(e) => setDescription(e.target.value)}
          />
        </IonItem>
        <div style={{ display: "flex", gap: "12px" }}>
          {/**
           <IonButton fill="clear" size="small">
            <IonIcon icon={imageOutline} slot="icon-only" title="Image" />
          </IonButton>
          <IonButton fill="clear" size="small">
            <IonIcon icon={happyOutline} slot="icon-only" title="Emoji" />
          </IonButton>
           * 
           */}
          <p
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              marginLeft: "auto",
            }}
          >
            {t("TEXT_FEE")} <b>{feeChannel / 100000000}</b> LUNES
          </p>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 10,
            width: "100%",
          }}
        >
          <p
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              marginLeft: "auto",
            }}
          >
            {t("TEXT_FEE_SAFE")} <b>{priceGuardian}</b> PID
          </p>
          <IonButton color="primary" shape="round" onClick={handleCreate}>
            {loading ? t("TEXT_WAIT") : t("TEXT_SEND_POST")}
          </IonButton>
        </div>
      </IonCardContent>
    </IonCard>
  );
};

export default CardSendPost;

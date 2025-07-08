import React from "react";
import {
  IonCard,
  IonCardContent,
  IonAvatar,
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonRadio,
  IonTextarea,
} from "@ionic/react";
import {
  imageOutline,
  barChartOutline,
  happyOutline,
  calendarOutline,
  addCircleOutline,
} from "ionicons/icons";
import ProfilePic from "../../assets/img/profile.jpg";
import { useTranslation } from "react-i18next";
import useContract from "../../hooks/useContract";
import Identicon from "@polkadot/react-identicon";
import { truncateText } from "../../utils";

const CardSendPost: React.FC = () => {
  const { t } = useTranslation();
  const { account, accountIdentity, alert , isDarkMode} = useContract();
  return (
    <IonCard
    
      style={{
        maxWidth: "600px",
        margin: "auto",
        top: "30px",
        backgroundColor: "transparent",
        width: "100%",
        color: isDarkMode?"#fff":""

      }}
    >
      <IonCardContent>
        <IonItem lines="none" style={{ alignItems: "center" }}>
          <IonAvatar slot="start">
            <Identicon value={account} theme="substrate" size={32} />
          </IonAvatar>
          <IonLabel
            style={{ fontWeight: "bold", fontSize: "12px" }}
          >
            {accountIdentity?.name || truncateText(account || "", 7, 10, false)}
          </IonLabel>
        </IonItem>
        <IonItem lines="none" style={{ fontSize: "12px"}}>
          <IonTextarea
            placeholder={t("TEXT_WRITE_MESSAGE")}
            autoGrow={true}
            style={{
              color: "#1d9bf0",
              "--background": "transparent",
              "--padding-start": "0",
              "--padding-end": "0",
              fontSize: "inherit",
              maxHeight: "100px",
              overflowY: "auto",
            }}
          />
        </IonItem>
        <div style={{ display: "flex", gap: "12px", color: "#536471" }}>
          <IonButton fill="clear" size="small">
            <IonIcon icon={imageOutline} slot="icon-only" title="Image" />
          </IonButton>
          <IonButton fill="clear" size="small">
            <IonIcon icon={happyOutline} slot="icon-only" title="Emoji" />
          </IonButton>
          <p
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              marginLeft: "auto",
            }}
          >
            {t("TEXT_FEE")} <b>{0}</b> LUNES
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
            {t("TEXT_FEE_SAFE")} <b>{0}</b> PID
          </p>
          <IonButton color="primary" shape="round">
            Send
          </IonButton>
        </div>
      </IonCardContent>
    </IonCard>
  );
};

export default CardSendPost;

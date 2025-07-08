import React from "react";
import {
  IonCard,
  IonCardContent,
  IonItem,
  IonAvatar,
  IonLabel,
  IonIcon,
  IonButton,
} from "@ionic/react";
import { chatbubbleOutline, alertCircle, skullOutline  } from "ionicons/icons";
import { useTranslation } from "react-i18next";
import useContract from "../../hooks/useContract";
import Identicon from "@polkadot/react-identicon";
import { truncateText } from "../../utils";

const CardItemPost: React.FC = () => {
  const { t } = useTranslation();
  const { account, accountIdentity, isDarkMode, alert } = useContract();
  return (
   <IonCard  style={{ color: isDarkMode?"#fff":"", maxWidth: "600px",  margin: "auto", top:"30px", backgroundColor: "transparent", width:"100%" }}>
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
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
              }}
            >              
              <IonLabel style={{ fontSize: "12px" }}>
                time · 1 min
              </IonLabel>
            </div>
          <div>           
            <div
              style={{
                fontSize: "14px",
                marginTop: "4px",
                marginBottom: "8px",
              }}
            >
              The DesignLab is doing major work on Community-Driven Design, with
              several different variants. If you are working in this area,
              submit a paper to the DIS conference here in San Diego (see
              DesignLab posting below)....
              <a
                href="https://facebook.com/don.norman.18"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#1d9bf0", textDecoration: "none" }}
              >
                https://facebook.com/don.norman.18/
              </a>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                color: "#536471",
              }}
            >
              <IonButton fill="clear" size="small" style={{ color: '#536471' }}>
                <IonIcon icon={chatbubbleOutline} />
              </IonButton>
              <IonButton fill="clear" size="small" style={{ color: '#536471' }}>
                <IonIcon icon={alertCircle} />
              </IonButton>
              <IonButton fill="clear" size="small" style={{ color: '#536471' }}>
                <IonIcon icon={skullOutline} />
              </IonButton>
              
            </div>
          </div>
      </IonCardContent>
    </IonCard>
  );
};

export default CardItemPost;

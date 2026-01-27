import React, { useState } from "react";
import {
  IonTitle,
  IonSearchbar,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/react";
import useContract from "../../hooks/useContract";
import { globeOutline } from "ionicons/icons";
import { useTranslation } from "react-i18next";
import {
  
  Input,
} from "reactstrap";
interface HeaderHomeProps {
  handleSearch: (searchText: string) => void;
  handleOwnerPostsClick: () => void;
}
const HeaderHome: React.FC<HeaderHomeProps> = ({ handleSearch, handleOwnerPostsClick }) => {
  const { t } = useTranslation();
  const [searchText, setSearchText] = useState("");
  const { isDarkMode } = useContract();


  return (
    <IonCard
      style={{
        maxWidth: "600px",
        margin: "auto",
        top: "0px",
        backgroundColor: "transparent",
        width: "100%",
        color: isDarkMode ? "#fff" : "",
        boxShadow: "none",
        border: "none",
      }}
    >
      <IonCardContent>
        <IonGrid>
          <IonRow>
            <IonCol 
              size="12" 
              sizeMd="2"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5
              }}
            >
              <IonTitle>{t("TEXT_HOME")}</IonTitle>
            </IonCol>
            <IonCol 
              size="10"
              sizeMd="8"
              style={{
                display: "flex",
                alignItems: "center",
                width: "100%"
              }}
            >
              <Input
                value={searchText}                
                onChange={(e) => setSearchText(e.target.value || "")}
                placeholder={t("TEXT_SEARCH_CHANNEL")}
                style={{ width: "100%" }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch(searchText);
                    setSearchText("");
                  }
                }}
              />
            </IonCol>
            <IonCol 
              size="2" 
              sizeMd="2"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end"
              }}
            >
              <IonButton onClick={handleOwnerPostsClick} color="primary">
                <IonIcon icon={globeOutline} slot="icon-only" title="My" />
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonCardContent>
    </IonCard>
  );
};

export default HeaderHome;

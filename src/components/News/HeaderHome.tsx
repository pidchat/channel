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

const HeaderHome: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const { isDarkMode } = useContract();
  const handleSearchChange = (e: CustomEvent) => {
    setSearchText(e.detail.value);
  };

  const handleOwnerPostsClick = () => {
    // Implement the logic to filter posts by owner using searchText
    console.log("Filter posts by owner with search text:", searchText);
  };

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
              <IonTitle>Home</IonTitle>
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
              <IonSearchbar
                value={searchText}                
                onIonChange={handleSearchChange}
                placeholder="Search"
                style={{ width: "100%" }}
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

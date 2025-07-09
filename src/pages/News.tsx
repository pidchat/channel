import { IonContent, IonPage } from "@ionic/react";
import CardSendPost from "../components/News/CardSendPost";
import CardItemPost from "../components/News/CardItemPost";
import HeaderHome from "../components/News/HeaderHome";
const News: React.FC = () => {
  return (
    <IonPage>
      <IonContent>
        <div className="contentNews">
          <HeaderHome/>
          <CardSendPost />

          <div style={{ marginTop: "1rem" }}></div>

          <CardItemPost />
          <CardItemPost />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default News;

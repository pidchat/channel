import { IonContent, IonPage } from "@ionic/react";
import CardSendPost from "../components/News/CardSendPost";
import CardItemPost from "../components/News/CardItemPost";
const News: React.FC = () => {
  return (
    <IonPage>
      <IonContent>
        <div className="contentNews">
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

import { IonContent, IonPage } from "@ionic/react";
import SidebarIndex from "../components/Sidebars/index";
import Chat from "../components/Partials/Chat";
const Home: React.FC = () => {

  return (
    <IonPage>
      <IonContent>
        <div className="content">
          <SidebarIndex />
          <Chat />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;

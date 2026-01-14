import React from 'react';
import { 
  IonContent, 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonCard, 
  IonCardHeader, 
  IonCardTitle, 
  IonCardSubtitle, 
  IonCardContent, 
  IonFooter, 
  IonButtons, 
  IonButton, 
  IonIcon 
} from "@ionic/react";
import { chatbubbleOutline, alertCircleOutline, flagOutline } from 'ionicons/icons';

const Post: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Notícia</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding">
        <IonCard>
          <img alt="News Banner" src="https://ionicframework.com/docs/img/demos/card-media.png" />
          <IonCardHeader>
            <IonCardTitle>Título da Notícia Importante</IonCardTitle>
            <IonCardSubtitle>Categoria • 2 horas atrás</IonCardSubtitle>
          </IonCardHeader>

          <IonCardContent>
            <p className="ion-margin-bottom">
              Aqui ficará o corpo do texto da notícia. Este é um exemplo de como o conteúdo será visualizado.
              Utilizando componentes do Ionic, garantimos uma aparência nativa e responsiva em dispositivos móveis.
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
          </IonCardContent>
        </IonCard>
      </IonContent>

      <IonFooter>
        <IonToolbar>
          <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>
            <IonButton fill="clear" color="medium">
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <IonIcon icon={chatbubbleOutline} style={{ fontSize: '24px' }} />
                <span style={{ fontSize: '10px', marginTop: '4px' }}>Comentário</span>
              </div>
            </IonButton>
            
            <IonButton fill="clear" color="warning">
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <IonIcon icon={alertCircleOutline} style={{ fontSize: '24px' }} />
                <span style={{ fontSize: '10px', marginTop: '4px' }}>Alerta</span>
              </div>
            </IonButton>

            <IonButton fill="clear" color="danger">
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <IonIcon icon={flagOutline} style={{ fontSize: '24px' }} />
                <span style={{ fontSize: '10px', marginTop: '4px' }}>Denunciar</span>
              </div>
            </IonButton>
          </div>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default Post;

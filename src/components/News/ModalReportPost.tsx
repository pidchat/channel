import React from 'react';
import {
  IonToolbar,
  IonButton,
  IonButtons
} from '@ionic/react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";



interface ModalReportPostProps   {
  modal: boolean;
  modalToggle: () => void;
  onOpenReport: () => void;
}

const ModalReportPost: React.FC<ModalReportPostProps> = ({ modal, modalToggle, onOpenReport }) => {  
  const handleOpenReport = () => {
    onOpenReport();
  };
  return (
    <Modal
      className="modal-dialog-zoom"
      isOpen={modal}
      toggle={modalToggle}
      centered
    >
      <ModalHeader toggle={modalToggle}>{"Reportar Post"}</ModalHeader>
      <ModalBody>
          {"Sistema de governancia do PIDChat"}<br/>
          {"1. Para reportar um post, você deve ter no minimo 50 milhões de PID."}<br/>
          {"2. Deixar uma garantia de 100 Tokens PID"}<br/>          
          {"3. Quando aberto a denúncia, o post será votado."}<br/>     
          {"4. Se o post for votado como falsa Notícia, ele perdera os fundos de garantia e sua garantia será retornada."}

      </ModalBody>
      <ModalFooter>
        <IonToolbar>
          <IonButtons slot='end'>
            <IonButton onClick={modalToggle} color="medium">Cancelar</IonButton>
            <IonButton onClick={handleOpenReport} color="danger">Reportar</IonButton>            
          </IonButtons>
        </IonToolbar>
       </ModalFooter>
    </Modal>
  );
};

export default ModalReportPost;

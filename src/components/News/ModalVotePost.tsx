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



interface ModalVotePostProps   {
  modal: boolean;
  modalToggle: () => void;
  handleVote: (yesOuNo:boolean) => void;
}

const ModalVotePost: React.FC<ModalVotePostProps> = ({ modal, modalToggle, handleVote }) => {  

  const handleVotePost = (yesOuNo:boolean) => {
      handleVote(yesOuNo);
    
  };
  return (
    <Modal
      className="modal-dialog-zoom"
      isOpen={modal}
      toggle={modalToggle}
      centered
    >
      <ModalHeader toggle={modalToggle}>{"Votar Post"}</ModalHeader>
      <ModalBody>
          {"Sistema de governancia do PIDChat"}<br/>
          {"Esse post é verdadeiro?"}<br/>
      </ModalBody>
      <ModalFooter>
        <IonToolbar>
          <IonButtons slot='end'>
            <IonButton onClick={modalToggle} color="medium">Cancelar</IonButton>
            <IonButton onClick={() => handleVotePost(true)} color="success">Votar Sim</IonButton>            
            <IonButton onClick={() => handleVotePost(false)} color="danger">Votar Não</IonButton>            
          </IonButtons>
        </IonToolbar>
       </ModalFooter>
    </Modal>
  );
};

export default ModalVotePost;

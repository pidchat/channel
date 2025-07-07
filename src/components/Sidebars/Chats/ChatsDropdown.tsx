import React, {useState} from 'react'
import {Dropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap'
interface Props {
    contract:string;
}
import { useIonAlert  } from "@ionic/react";
import useContract from '../../../hooks/useContract';
import { useTranslation } from 'react-i18next';
const ChatsDropdown: React.FC<Props> = ({...props}) =>{
    const { t } = useTranslation();
    const [presentAlert] = useIonAlert();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { verifyContractAndRemove } = useContract();
    const toggle = () => setDropdownOpen(prevState => !prevState);
    const removeChannel = async () => {
      presentAlert({
        header: t("TEXT_REMOVE_CHANNEL"),
        message: t("TEXT_REMOVE_CHANNEL_ALERT"),
        buttons: [
          {
            text: t("TEXT_NO"),
            role: 'cancel',
            handler: () => {
              console.log('Confirm Cancel: blah');
            }
          }, {
            text: t("TEXT_YES"),
              handler: async () => {            
                await verifyContractAndRemove(props?.contract);
              }
            }
          ],
          
        })
        
      }
 

    return (
        <Dropdown isOpen={dropdownOpen} toggle={toggle}>
            <DropdownToggle tag="a">
                <i className="ti ti-more"></i>
            </DropdownToggle>
            <DropdownMenu>
                <DropdownItem onClick={()=>removeChannel()}>{t("TEXT_UNSUBSCRIBE")}</DropdownItem>
            </DropdownMenu>
        </Dropdown>
    )
};

export default ChatsDropdown

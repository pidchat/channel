import React, { useContext, useEffect, useRef, useState } from "react";

import "react-perfect-scrollbar/dist/css/styles.css";
import PerfectScrollbar from "react-perfect-scrollbar";

import { UseProviderContext } from "../../../contexts/UseProvider";
import { Tooltip } from "reactstrap";
import AddChannelModal from "../../Modals/AddChannelModal";
import NewChannelModal from "../../Modals/NewChannelModal";
import useContract from "../../../hooks/useContract";
import ChannelView from "./ChannelView";
import { useTranslation } from "react-i18next";

const Index: React.FC = () => {
  const { t } = useTranslation();
  const { listChannel, setInfoRouter, getChannels, searchChannelLocalName } =
    useContract();
  const [tooltipAddOpen, setTooltipAddOpen] = useState(false);
  const toggleAdd = () => setTooltipAddOpen(!tooltipAddOpen);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [modal, setModal] = useState(false);
  const modalToggle = () => {
    setModal(!modal);
    setInfoRouter("");
    getChannels();
  };
  const toggle = () => setTooltipOpen(!tooltipOpen);
  const [modalAdd, setModalAdd] = useState(false);
  const [filter, setFilter] = useState("");
  const modalAddToggle = () => {
    setModalAdd(!modalAdd);
    setInfoRouter("");
  };
  const { setMobileSidebar, setContractSelected, contractSelected } =
    useContext(UseProviderContext);

  useEffect(() => {
    inputRef?.current?.focus();
  },[]);
  useEffect(() => {
    doFilter();
  }, [filter]);

  const doFilter = async () => {
    await searchChannelLocalName(filter);
  };

  const inputRef: any = useRef();

  const mobileSidebarClose = (address: string = "") => {
    if (address) setContractSelected(address);
    setMobileSidebar(false);
  };

  return (
    <div className="sidebar active">
      <header>
        <span>{t("Channels")}</span>
        <ul className="list-inline">
          <li className="list-inline-item">
            <button
              onClick={() => setModal(true)}
              className="btn btn-light"
              id="Tooltip-New-Channel"
            >
              <i className="ti ti-plus"></i>
            </button>
            <Tooltip
              isOpen={tooltipAddOpen}
              target={"Tooltip-New-Channel"}
              toggle={toggleAdd}
            >
              {t("TEXT_NEW_CHANNEL")}
            </Tooltip>
          </li>
          <li className="list-inline-item">
            <button
              onClick={() => setModalAdd(true)}              
              className="btn btn-light"
              id="Tooltip-New-Chat"
            >
              <i className="ti ti-comment-alt"></i>
            </button>
            <Tooltip
              isOpen={tooltipOpen}
              target={"Tooltip-New-Chat"}
              toggle={toggle}
            >
              {t("TEXT_SUBSCRIBE")}
            </Tooltip>
          </li>
          <li className="list-inline-item d-xl-none d-inline">
            <button
              onClick={() => mobileSidebarClose()}
              className="btn btn-light"
            >
              <i className="ti ti-close"></i>
            </button>
          </li>
        </ul>
      </header>

      <form>
        <input
          type="text"
          className="form-control"
          placeholder={t("TEXT_SEARCH_CHANNEL")}
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
          }}
          ref={inputRef}
        />
      </form>
      <div className="sidebar-body">
        <PerfectScrollbar>
          <ul className="list-group">
            {listChannel?.map((chat, i) => (
              <ChannelView
                channel={chat}
                key={i}
                electedChat={contractSelected}
                chatSelectHandle={(address: string) =>
                  mobileSidebarClose(address)
                }
              />
            ))}
          </ul>
        </PerfectScrollbar>
      </div>
      <NewChannelModal modal={modal} modalToggle={modalToggle} />
      <AddChannelModal
        modal={modalAdd}
        modalToggle={modalAddToggle}
      />
    </div>
  );
};

export default Index;

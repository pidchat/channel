import React from "react";
import WomenAvatar5 from "../../assets/img/women_avatar5.jpg";

const Profile: React.FC = ({ ...props }) => {
  return (
    <div className={`sidebar-group`}>
      <div className={false ? "sidebar active" : "sidebar"}>
        <header>
          <span>About</span>
          <ul className="list-inline">
            <li className="list-inline-item">
              <a href="/#/" onClick={(e) => {}} className="btn btn-light">
                <i className="ti ti-close"></i>
              </a>
            </li>
          </ul>
        </header>
        <div className="sidebar-body">
          <div className="text-center">
            <figure className="avatar avatar-state-danger avatar-xl mb-4">
              <img src={WomenAvatar5} className="rounded-circle" alt="avatar" />
            </figure>
            <h5 className="text-primary mb-1">Frans Hanscombe</h5>
            <small className="text-muted">Last seen: Today</small>
          </div>
          <hr />
          <div style={{ paddingLeft: "15px", paddingRight: "15px" }}>
            <h6>About</h6>
            <p className="text-muted">
              I love reading, traveling and discovering new things. You need to
              be happy in life.
            </p>
          </div>
          <div style={{ paddingLeft: "15px", paddingRight: "15px" }}>
            <h6>Phone</h6>
            <p className="text-muted">(555) 555 55 55</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

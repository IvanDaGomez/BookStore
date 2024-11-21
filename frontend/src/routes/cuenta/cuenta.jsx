import { ToastContainer } from "react-toastify";
import Footer from "../../components/footer";
import Header from "../../components/header";
import SideInfo from "../../components/sideInfo";

export default function Cuenta(){
    return(<>
    <Header/>
    <div className="account-dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="team-info">
          <h2>Fillo Team</h2>
          <p>hello@fillo.com</p>
        </div>
        <ul className="menu">
          <li className="active">My Profile</li>
          <li>Security</li>
          <li>Teams</li>
          <li>Team Member</li>
          <li>Notifications</li>
          <li>Billing</li>
          <li>Data Export</li>
          <li className="delete">Delete Account</li>
        </ul>
        <div className="org-settings">
          <h3>ORGANIZATION</h3>
          <ul>
            <li>Apps & Perks</li>
            <li>Tax Forms</li>
            <li>Organization Settings</li>
          </ul>
        </div>
        <button className="create-contract">Create Contract +</button>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <h1>Account Settings</h1>
        <section className="profile">
          {/* Profile Header */}
          <div className="profile-header">
            <img
              src="https://via.placeholder.com/100"
              alt="Profile"
              className="profile-img"
            />
            <div>
              <h2>Rafiquar Rahman</h2>
              <p>Team Manager, Leeds, United Kingdom</p>
            </div>
          </div>

          {/* Personal Information Section */}
          <div className="profile-section">
            <h3>Personal Information</h3>
            <div className="info-row">
              <div>
                <p>First Name</p>
                <h4>Rafiquar</h4>
              </div>
              <div>
                <p>Last Name</p>
                <h4>Rahman</h4>
              </div>
              <div>
                <p>Email Address</p>
                <h4>rafiquarahman51@gmail.com</h4>
              </div>
              <div>
                <p>Phone</p>
                <h4>+09 345 346 46</h4>
              </div>
              <div>
                <p>Bio</p>
                <h4>Team Manager</h4>
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div className="profile-section">
            <h3>Address</h3>
            <div className="info-row">
              <div>
                <p>Country</p>
                <h4>United Kingdom</h4>
              </div>
              <div>
                <p>City/State</p>
                <h4>Leeds, East London</h4>
              </div>
              <div>
                <p>Postal Code</p>
                <h4>ERT 2354</h4>
              </div>
              <div>
                <p>Tax ID</p>
                <h4>AS45645756</h4>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
    <Footer/>
    <SideInfo/>
    <ToastContainer />
    </>)
}
import Breadcrumb from "../../assets/breadCrumb";

/* eslint-disable react/prop-types */
export default function Direcciones ({ user }) {
  return (
    <>
      <Breadcrumb pathsArr={window.location.pathname.split('/')} />
    </>
  )
}

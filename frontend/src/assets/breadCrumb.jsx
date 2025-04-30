/* eslint-disable react/prop-types */

import React from "react";
import { cambiarGuionesAEspacio } from "./agregarMas";
import titleCase from "./toTitleCase";

const Breadcrumb = ({ pathsArr }) => {
  const format = (str) => {
    return titleCase(cambiarGuionesAEspacio(str))
  }

  return (
    <div className='accountPath'>
      {pathsArr.map((element, index) => {
        const path = `${pathsArr.slice(0, index + 1).join('/')}`;
        return (
          <React.Fragment key={index}>
            <a href={path}>
              <span>{format(element)}</span>
            </a>
            {index !== 0 && index !== pathsArr.length - 1 && ' / '}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default Breadcrumb;
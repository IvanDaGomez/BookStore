/* eslint-disable react/prop-types */

import React from "react"

export default function UseStep ({ currentStep, titulos }) {
  const steps = titulos

  return (
    <div className='step-wizard'>
      <div className='stepsLabels'>
        {/* steps.map((step, index)=>(
              <span key={index} className={`step-label`}>
              {step}
            </span>

        )) */}
      </div>
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <div
             className={`step-item ${(currentStep >= index + 1) ? 'active' : ''}`}
          >
            {index + 1}
          </div>
          {index < steps.length - 1 && (
            <div className={`step-line ${currentStep > index + 1 ? 'active' : ''}`} />
          )}
        </React.Fragment>
      ))}
    </div>

  )
};

/* eslint-disable react/prop-types */

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
        <>
          <div
            key={index} className={`step-item ${
              (currentStep >= index + 1) ? 'active' : ''}`}
          >
            {index + 1}
          </div>
          {index < steps.length - 1 && (
            <div key={(index + 1 + steps.length)} className={`step-line ${currentStep > index + 1 ? 'active' : ''}`} />
          )}
        </>
      ))}
    </div>

  )
};

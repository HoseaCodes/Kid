import React, { useEffect, useState } from "react";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Confirm from "./Confirm";
import Overview from "./Overview";

const StepForm = ({ state }) => {
  const { newCourse, currentUser } = state;
  console.log("newCourse", currentUser);
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    courseName: "",
    classNum: "",
    courseDescription: "",
    courseContent: "",
    courseInstructor: "",
    subject: "",
    gradeLevel: "",
    imageUrl: "",
    userId: currentUser.id,
    price: "",
    categoryId: "",
    category: "",
    chapters: [],
    attachments: [],
    purchases: [],
    createdAt: "",
    updatedAt: "",
  });

  useEffect(() => {
    setFormData({ ...newCourse });
  }, []);

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleChange = (input) => (e) => {
    setFormData({ ...formData, [input]: e.target.value });
  };

  // Step indicator component
  const StepIndicator = () => {
    const steps = [
      { number: 1, title: "Overview" },
      { number: 2, title: "Course Info" },
      { number: 3, title: "Instructor" },
      { number: 4, title: "Details" },
      { number: 5, title: "Confirm" }
    ];

    return (
      <div className="mb-8">
        <div className="flex items-center justify-center">
          {steps.map((stepItem, index) => (
            <div key={stepItem.number} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 
                ${step >= stepItem.number 
                  ? 'bg-[#F38315] border-[#F38315] text-white' 
                  : 'bg-white border-gray-300 text-gray-500'
                }`}>
                <span className="text-sm font-medium">{stepItem.number}</span>
              </div>
              <div className="ml-2 mr-4">
                <div className={`text-sm font-medium 
                  ${step >= stepItem.number ? 'text-[#F38315]' : 'text-gray-500'}`}>
                  {stepItem.title}
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-12 h-0.5 mr-4 
                  ${step > stepItem.number ? 'bg-[#F38315]' : 'bg-gray-300'}`}></div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Overview
            nextStep={nextStep}
            handleChange={handleChange}
            values={formData}
          />
        );
      case 2:
        return (
          <Step1
            nextStep={nextStep}
            prevStep={prevStep}
            handleChange={handleChange}
            values={formData}
          />
        );
      case 3:
        return (
          <Step2
            nextStep={nextStep}
            prevStep={prevStep}
            handleChange={handleChange}
            values={formData}
          />
        );
      case 4:
        return (
          <Step3
            nextStep={nextStep}
            prevStep={prevStep}
            handleChange={handleChange}
            values={formData}
          />
        );
      case 5:
        return <Confirm state={state} prevStep={prevStep} values={formData} />;
      default:
        return (
          <div className="text-center py-12">
            <div className="text-green-600 text-xl font-semibold mb-4">
              🎉 Form submitted successfully!
            </div>
            <div className="text-gray-600">
              Your course has been created and will be reviewed shortly.
            </div>
          </div>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <StepIndicator />
      {renderStep()}
    </div>
  );
};

export default StepForm;
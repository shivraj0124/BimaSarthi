// utils/isInsuranceQuestion.js

const INSURANCE_TERMS = [
  // English
  "insurance",
  "policy",
  "premium",
  "coverage",
  "claim",
  "claim process",
  "cashless",
  "hospital",
  "health insurance",
  "life insurance",
  "crop insurance",
  "accident insurance",
  "beneficiary",
  "nominee",
  "renewal",
  "sum insured",
  "deductible",
  "eligibility",
  "policyholder",

  // Hindi
  "बीमा",
  "पॉलिसी",
  "प्रीमियम",
  "कवरेज",
  "दावा",
  "क्लेम",
  "अस्पताल",
  "स्वास्थ्य बीमा",
  "जीवन बीमा",
  "फसल बीमा",
  "नवीनीकरण",
  "पात्रता",

  // Marathi
  "विमा",
  "पॉलिसी",
  "प्रीमियम",
  "कव्हरेज",
  "दावा",
  "क्लेम",
  "रुग्णालय",
  "आरोग्य विमा",
  "जीवन विमा",
  "पीक विमा",
  "नूतनीकरण",
  "पात्रता",

  // Scheme names
  "ayushman",
  "pmjay",
  "pmjjby",
  "pmsby",
  "pmfby",
  "आयुष्मान",
  "आयुष्मान भारत",
  "प्रधानमंत्री",
  "प्रधान मंत्री",
  "प्रधानमंत्री जीवन ज्योति",
  "प्रधानमंत्री सुरक्षा",
  "प्रधानमंत्री फसल",
  "प्रधानमंत्री जन आरोग्य",
];

function isInsuranceQuestion(question) {
  const q = question.toLowerCase();

  return INSURANCE_TERMS.some((term) => q.includes(term));
}

module.exports = isInsuranceQuestion;

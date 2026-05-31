import Decimal from 'decimal.js';
import { calculateAllRiskTiers } from './src/lib/engine/risk-tiers';
import { UserInputs } from './src/lib/engine/types';

const scenarios = [
  {
    name: '1. The FHA First-Time Buyer',
    inputs: {
      yearlyGrossIncome: new Decimal(75000),
      coBorrowerIncome: new Decimal(0),
      borrowerDebts: [new Decimal(400), new Decimal(150)], // $550 total
      coBorrowerDebts: [],
      incomeTaxRate: new Decimal(20), // 20%
      downPaymentPercent: new Decimal(3.5),
      interestRate: new Decimal(6.250),
      mortgageTermYears: 30,
      mortgageInsuranceType: 'FHA' as const,
      yearlyHOA: new Decimal(0),
      propertyTaxRate: new Decimal(1.2), // 1.2%
      insuranceRate: new Decimal(0.42), // 0.42%
    }
  },
  {
    name: '2. The High-Income Conventional Buyer',
    inputs: {
      yearlyGrossIncome: new Decimal(250000),
      coBorrowerIncome: new Decimal(0),
      borrowerDebts: [], 
      coBorrowerDebts: [],
      incomeTaxRate: new Decimal(35), 
      downPaymentPercent: new Decimal(20),
      interestRate: new Decimal(5.875),
      mortgageTermYears: 30,
      mortgageInsuranceType: 'Conv - Good Credit' as const,
      yearlyHOA: new Decimal(3600), // $300/mo
      propertyTaxRate: new Decimal(1.5), 
      insuranceRate: new Decimal(0.5), 
    }
  },
  {
    name: '3. The Dual-Income DTI-Constrained Couple',
    inputs: {
      yearlyGrossIncome: new Decimal(120000),
      coBorrowerIncome: new Decimal(80000),
      borrowerDebts: [new Decimal(1200)], // Student loans
      coBorrowerDebts: [new Decimal(800)], // Auto
      incomeTaxRate: new Decimal(28), 
      downPaymentPercent: new Decimal(5),
      interestRate: new Decimal(6.750),
      mortgageTermYears: 30,
      mortgageInsuranceType: 'Conv - Fair Credit' as const,
      yearlyHOA: new Decimal(0),
      propertyTaxRate: new Decimal(1.1), 
      insuranceRate: new Decimal(0.4), 
    }
  },
  {
    name: '4. The Veteran (VA Loan)',
    inputs: {
      yearlyGrossIncome: new Decimal(90000),
      coBorrowerIncome: new Decimal(0),
      borrowerDebts: [new Decimal(200)], 
      coBorrowerDebts: [],
      incomeTaxRate: new Decimal(22), 
      downPaymentPercent: new Decimal(0),
      interestRate: new Decimal(5.990),
      mortgageTermYears: 30,
      mortgageInsuranceType: 'VA' as const,
      yearlyHOA: new Decimal(0),
      propertyTaxRate: new Decimal(1.0), 
      insuranceRate: new Decimal(0.35), 
    }
  },
  {
    name: '5. The Rural Buyer (USDA Loan)',
    inputs: {
      yearlyGrossIncome: new Decimal(65000),
      coBorrowerIncome: new Decimal(0),
      borrowerDebts: [new Decimal(100)], 
      coBorrowerDebts: [],
      incomeTaxRate: new Decimal(15), 
      downPaymentPercent: new Decimal(0),
      interestRate: new Decimal(6.125),
      mortgageTermYears: 30,
      mortgageInsuranceType: 'USDA' as const,
      yearlyHOA: new Decimal(0),
      propertyTaxRate: new Decimal(0.8), 
      insuranceRate: new Decimal(0.3), 
    }
  },
  {
    name: '6. The High-Tax State Buyer (e.g. TX/NJ)',
    inputs: {
      yearlyGrossIncome: new Decimal(140000),
      coBorrowerIncome: new Decimal(0),
      borrowerDebts: [new Decimal(600)], 
      coBorrowerDebts: [],
      incomeTaxRate: new Decimal(24), 
      downPaymentPercent: new Decimal(10),
      interestRate: new Decimal(6.500),
      mortgageTermYears: 20, // 20 year term
      mortgageInsuranceType: 'Conv - Good Credit' as const,
      yearlyHOA: new Decimal(1200), // $100/mo
      propertyTaxRate: new Decimal(2.75), // 2.75% Property Tax
      insuranceRate: new Decimal(0.45), 
    }
  }
];

async function run() {
  const results = [];
  for (const scenario of scenarios) {
    // The engine expects propertyTaxRate, insuranceRate in basis points (val * 100)
    // and incomeTaxRate, downPaymentPercent, interestRate in normal floats (0.20 for 20%)
    
    const engineInputs: UserInputs = {
      ...scenario.inputs,
      incomeTaxRate: scenario.inputs.incomeTaxRate.div(100),
      downPaymentPercent: scenario.inputs.downPaymentPercent.div(100),
      interestRate: scenario.inputs.interestRate.div(100),
      propertyTaxRate: scenario.inputs.propertyTaxRate.mul(100),
      insuranceRate: scenario.inputs.insuranceRate.mul(100),
    };

    const tiers = calculateAllRiskTiers(engineInputs);
    // Let's get the 'Moderate' tier result for cross-checking
    const moderate = tiers.find(t => t.tier === 'Moderate');
    
    results.push({
      scenario: scenario.name,
      inputs: {
        "Annual Gross Income": `$${scenario.inputs.yearlyGrossIncome.toNumber().toLocaleString()}`,
        "Co-Borrower Income": `$${scenario.inputs.coBorrowerIncome.toNumber().toLocaleString()}`,
        "Monthly Debts": `$${[...scenario.inputs.borrowerDebts, ...scenario.inputs.coBorrowerDebts].reduce((acc, d) => acc + d.toNumber(), 0).toLocaleString()}`,
        "Income Tax Rate": `${scenario.inputs.incomeTaxRate.toNumber()}%`,
        "Down Payment": `${scenario.inputs.downPaymentPercent.toNumber()}%`,
        "Interest Rate": `${scenario.inputs.interestRate.toNumber()}%`,
        "Mortgage Term": `${scenario.inputs.mortgageTermYears} Years`,
        "Loan Type": scenario.inputs.mortgageInsuranceType,
        "Annual HOA": `$${scenario.inputs.yearlyHOA.toNumber().toLocaleString()}`,
        "Property Tax": `${scenario.inputs.propertyTaxRate.toNumber()}%`,
        "Home Insurance": `${scenario.inputs.insuranceRate.toNumber()}%`,
      },
      moderateTierOutput: {
        "Max Purchase Price": `$${moderate?.maxPurchasePrice.toNumber().toLocaleString('en-US', {maximumFractionDigits: 0})}`,
        "Down Payment Amount": `$${moderate?.downPayment.toNumber().toLocaleString('en-US', {maximumFractionDigits: 0})}`,
        "Total Monthly Payment": `$${moderate?.monthlyPayment.total.toNumber().toLocaleString('en-US', {maximumFractionDigits: 0})}`,
        "P&I": `$${moderate?.monthlyPayment.principalAndInterest.toNumber().toLocaleString('en-US', {maximumFractionDigits: 0})}`,
        "Taxes": `$${moderate?.monthlyPayment.propertyTaxes.toNumber().toLocaleString('en-US', {maximumFractionDigits: 0})}`,
        "Insurance": `$${moderate?.monthlyPayment.homeownersInsurance.toNumber().toLocaleString('en-US', {maximumFractionDigits: 0})}`,
        "PMI": `$${moderate?.monthlyPayment.mortgageInsurance.toNumber().toLocaleString('en-US', {maximumFractionDigits: 0})}`,
        "HOA": `$${moderate?.monthlyPayment.hoa.toNumber().toLocaleString('en-US', {maximumFractionDigits: 0})}`,
      }
    });
  }
  
  console.log(JSON.stringify(results, null, 2));
}

run().catch(console.error);

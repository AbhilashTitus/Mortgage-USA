import Decimal from 'decimal.js';
import * as fs from 'fs';
import * as path from 'path';
import { calculateAllRiskTiers } from './src/lib/engine/risk-tiers';
import { calculateAffordabilityTheories } from './src/lib/engine/theories';
import { calculatePriceComparisons } from './src/lib/engine/price-comparison';
import { calculateOtherCosts } from './src/lib/engine/other-costs';
import { UserInputs, DashboardSettings } from './src/lib/engine/types';

const scenarios = [
  {
    name: '1. The FHA First-Time Buyer',
    inputs: {
      yearlyGrossIncome: new Decimal(75000),
      coBorrowerIncome: new Decimal(0),
      borrowerDebts: [new Decimal(400), new Decimal(150)],
      coBorrowerDebts: [],
      incomeTaxRate: new Decimal(20),
      downPaymentPercent: new Decimal(3.5),
      interestRate: new Decimal(6.250),
      mortgageTermYears: 30,
      mortgageInsuranceType: 'FHA' as const,
      yearlyHOA: new Decimal(0),
      propertyTaxRate: new Decimal(1.2),
      insuranceRate: new Decimal(0.42),
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
      yearlyHOA: new Decimal(3600),
      propertyTaxRate: new Decimal(1.5), 
      insuranceRate: new Decimal(0.5), 
    }
  },
  {
    name: '3. The Dual-Income DTI-Constrained Couple',
    inputs: {
      yearlyGrossIncome: new Decimal(120000),
      coBorrowerIncome: new Decimal(80000),
      borrowerDebts: [new Decimal(1200)],
      coBorrowerDebts: [new Decimal(800)],
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
      mortgageTermYears: 20,
      mortgageInsuranceType: 'Conv - Good Credit' as const,
      yearlyHOA: new Decimal(1200),
      propertyTaxRate: new Decimal(2.75),
      insuranceRate: new Decimal(0.45), 
    }
  }
];

function decimalToNumber(obj: any): any {
  if (obj instanceof Decimal) {
    return obj.toNumber();
  }
  if (Array.isArray(obj)) {
    return obj.map(decimalToNumber);
  }
  if (obj !== null && typeof obj === 'object') {
    const result: any = {};
    for (const key of Object.keys(obj)) {
      result[key] = decimalToNumber(obj[key]);
    }
    return result;
  }
  return obj;
}

async function run() {
  const results = [];
  
  for (const scenario of scenarios) {
    const engineInputs: UserInputs = {
      ...scenario.inputs,
      incomeTaxRate: scenario.inputs.incomeTaxRate.div(100),
      downPaymentPercent: scenario.inputs.downPaymentPercent.div(100),
      interestRate: scenario.inputs.interestRate.div(100),
      propertyTaxRate: scenario.inputs.propertyTaxRate.mul(100),
      insuranceRate: scenario.inputs.insuranceRate.mul(100),
    };

    const tiers = calculateAllRiskTiers(engineInputs);
    const theories = calculateAffordabilityTheories(engineInputs);
    
    const moderate = tiers.find(t => t.tier === 'Moderate');
    
    const defaultSettings: DashboardSettings = {
      selectedRiskTier: 'Moderate',
      estimatedSqFt: 2000,
      utilityLevel: 'Moderate',
      maintenanceLevel: 'Moderate',
      closingCostOption: '2.5% of Price (Typical)',
      customPrice: new Decimal(0),
    };

    const priceComparisons = calculatePriceComparisons(moderate!.maxPurchasePrice, moderate!.monthlyPayment.total, engineInputs, defaultSettings);
    const otherCosts = calculateOtherCosts(engineInputs, defaultSettings, moderate!.maxPurchasePrice, moderate!.monthlyPayment.total);

    results.push({
      scenario: scenario.name,
      inputs: decimalToNumber(scenario.inputs),
      outputs: {
        tiers: decimalToNumber(tiers),
        theories: decimalToNumber(theories),
        priceComparisons: decimalToNumber(priceComparisons),
        otherCosts: decimalToNumber(otherCosts)
      }
    });
  }
  
  const fixturePath = path.join(__dirname, 'src', '__tests__', 'fixtures', 'scenarios-full.json');
  fs.mkdirSync(path.dirname(fixturePath), { recursive: true });
  fs.writeFileSync(fixturePath, JSON.stringify(results, null, 2));
  
  console.log(`Successfully wrote full scenario fixture to ${fixturePath}`);
}

run().catch(console.error);

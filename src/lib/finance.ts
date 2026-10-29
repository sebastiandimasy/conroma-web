export interface Reference {
  label: string;
  value: string;
  source: string;
  date: string;
}

export const euriborReference: Reference = {
  label: 'Euríbor a 12 meses',
  value: '3,247 %',
  source: 'Banco de España, media mensual publicada en el BOE',
  date: 'septiembre de 2026',
};

export const itpBrackets: { upTo: number; rate: number }[] = [
  { upTo: 600000, rate: 0.1 },
  { upTo: 900000, rate: 0.11 },
  { upTo: 1500000, rate: 0.12 },
  { upTo: Infinity, rate: 0.13 },
];

export const reformRates = {
  basica: { label: 'Básica', perSquareMetre: 650 },
  media: { label: 'Media', perSquareMetre: 750 },
  alta: { label: 'Alta', perSquareMetre: 900 },
} as const;

export type ReformQuality = keyof typeof reformRates;

export const reformReference: Reference = {
  label: 'Reforma integral',
  value: '650 a 900 €/m², con media de 750 €/m²',
  source: 'Guía de precios de Habitissimo, media de España',
  date: 'consultada el 13 de octubre de 2026',
};

export function monthlyPayment(principal: number, annualRatePercent: number, years: number): number {
  const months = years * 12;
  if (principal <= 0 || months <= 0) return 0;
  const rate = annualRatePercent / 100 / 12;
  if (rate === 0) return principal / months;
  return (principal * rate) / (1 - Math.pow(1 + rate, -months));
}

export function transferTax(price: number): number {
  let previous = 0;
  let total = 0;
  for (const bracket of itpBrackets) {
    if (price <= previous) break;
    total += (Math.min(price, bracket.upTo) - previous) * bracket.rate;
    previous = bracket.upTo;
  }
  return total;
}

export interface MortgageResult {
  downPayment: number;
  loan: number;
  payment: number;
  tax: number;
  savingsNeeded: number;
  totalInterest: number;
}

export function simulateMortgage(price: number, downPaymentPercent: number, years: number, annualRatePercent: number): MortgageResult {
  const downPayment = (price * downPaymentPercent) / 100;
  const loan = price - downPayment;
  const payment = monthlyPayment(loan, annualRatePercent, years);
  const tax = transferTax(price);
  return {
    downPayment,
    loan,
    payment,
    tax,
    savingsNeeded: downPayment + tax,
    totalInterest: payment * years * 12 - loan,
  };
}

// Préstamo máximo que se puede pagar con una cuota dada (inverso de monthlyPayment).
export function maxLoanFromPayment(payment: number, annualRatePercent: number, years: number): number {
  const months = years * 12;
  if (payment <= 0 || months <= 0) return 0;
  const rate = annualRatePercent / 100 / 12;
  if (rate === 0) return payment * months;
  return (payment * (1 - Math.pow(1 + rate, -months))) / rate;
}

export const DTI_MAX = 0.4; // 40% de endeudamiento: límite que usa la banca.
export const MIN_SENIORITY_MONTHS = 6; // por debajo, no se autodeclara pre-aprobado: lo revisa un asesor.

export interface AffordabilityInput {
  price: number;
  hasSavings: boolean;
  savings: number;
  monthlySalary: number; // importe por paga
  payrolls: number; // nº de pagas (12 o 14)
  monthlyDebts: number;
  seniorityMonths: number;
  years?: number;
  ratePercent?: number;
}

export type AffordabilityStatus = 'apto' | 'no-apto' | 'revisar';

export interface AffordabilityResult {
  status: AffordabilityStatus;
  monthlyIncome: number;
  capacity: number;
  availableForMortgage: number;
  maxLoan: number;
  maxBudget: number;
  reachesPrice: boolean;
}

export function affordability(input: AffordabilityInput): AffordabilityResult {
  const years = input.years ?? 30;
  const rate = input.ratePercent ?? 3;
  const savings = input.hasSavings ? Math.max(0, input.savings) : 0;
  const monthlyIncome = (Math.max(0, input.monthlySalary) * Math.max(1, input.payrolls)) / 12;
  const capacity = DTI_MAX * monthlyIncome;
  const availableForMortgage = Math.max(0, capacity - Math.max(0, input.monthlyDebts));
  const maxLoan = maxLoanFromPayment(availableForMortgage, rate, years);
  const maxBudget = maxLoan + savings;

  let status: AffordabilityStatus;
  if (monthlyIncome <= 0 || availableForMortgage <= 0) status = 'no-apto';
  else if (input.seniorityMonths < MIN_SENIORITY_MONTHS) status = 'revisar';
  else status = 'apto';

  return {
    status,
    monthlyIncome,
    capacity,
    availableForMortgage,
    maxLoan,
    maxBudget,
    reachesPrice: input.price > 0 && input.price <= maxBudget,
  };
}

export interface ReformResult {
  estimate: number;
  low: number;
  high: number;
}

export function simulateReform(area: number, quality: ReformQuality): ReformResult {
  return {
    estimate: area * reformRates[quality].perSquareMetre,
    low: area * reformRates.basica.perSquareMetre,
    high: area * reformRates.alta.perSquareMetre,
  };
}

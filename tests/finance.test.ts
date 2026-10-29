import { describe, expect, it } from 'vitest';
import { affordability, monthlyPayment, simulateMortgage, simulateReform, transferTax } from '../src/lib/finance';

describe('finance', () => {
  it('computes a standard french-system payment', () => {
    expect(monthlyPayment(188000, 3, 30)).toBeCloseTo(792.61, 1);
  });

  it('handles a zero interest rate', () => {
    expect(monthlyPayment(120000, 0, 10)).toBe(1000);
  });

  it('returns zero for an empty loan', () => {
    expect(monthlyPayment(0, 3, 30)).toBe(0);
  });

  it('applies 10% transfer tax up to 600.000', () => {
    expect(transferTax(235000)).toBeCloseTo(23500, 5);
    expect(transferTax(600000)).toBeCloseTo(60000, 5);
  });

  it('applies the progressive brackets above 600.000', () => {
    expect(transferTax(700000)).toBeCloseTo(60000 + 11000, 5);
    expect(transferTax(1000000)).toBeCloseTo(60000 + 33000 + 12000, 5);
    expect(transferTax(2000000)).toBeCloseTo(60000 + 33000 + 72000 + 65000, 5);
  });

  it('adds down payment and tax into the savings needed', () => {
    const result = simulateMortgage(235000, 20, 30, 3);
    expect(result.loan).toBe(188000);
    expect(result.savingsNeeded).toBeCloseTo(47000 + 23500, 5);
    expect(result.totalInterest).toBeGreaterThan(0);
  });

  it('estimates a renovation inside its own range', () => {
    const result = simulateReform(80, 'media');
    expect(result.estimate).toBe(60000);
    expect(result.low).toBe(52000);
    expect(result.high).toBe(72000);
  });
});

describe('affordability (¿puedo comprar?)', () => {
  it('es apto cuando el DTI cabe en el 40% y hay antigüedad', () => {
    const r = affordability({ price: 200000, hasSavings: true, savings: 50000, monthlySalary: 2000, payrolls: 12, monthlyDebts: 0, seniorityMonths: 24 });
    expect(r.status).toBe('apto');
    expect(r.monthlyIncome).toBe(2000);
    expect(r.capacity).toBeCloseTo(800, 5);
    expect(r.availableForMortgage).toBeCloseTo(800, 5);
    // el préstamo máximo, servido como cuota, reproduce la cuota disponible (inverso consistente)
    expect(monthlyPayment(r.maxLoan, 3, 30)).toBeCloseTo(800, 0);
    expect(r.maxBudget).toBeCloseTo(r.maxLoan + 50000, 5);
    expect(r.reachesPrice).toBe(true);
  });

  it('normaliza el salario por el número de pagas', () => {
    const r = affordability({ price: 0, hasSavings: false, savings: 0, monthlySalary: 1500, payrolls: 14, monthlyDebts: 0, seniorityMonths: 24 });
    expect(r.monthlyIncome).toBeCloseTo(1750, 5);
    expect(r.capacity).toBeCloseTo(700, 5);
  });

  it('no es apto cuando las deudas ya superan el 40% del salario', () => {
    const r = affordability({ price: 150000, hasSavings: true, savings: 30000, monthlySalary: 1500, payrolls: 14, monthlyDebts: 750, seniorityMonths: 24 });
    expect(r.status).toBe('no-apto');
    expect(r.availableForMortgage).toBe(0);
    expect(r.maxBudget).toBe(30000);
  });

  it('marca revisar cuando el DTI cabe pero falta antigüedad', () => {
    const r = affordability({ price: 180000, hasSavings: true, savings: 40000, monthlySalary: 2500, payrolls: 12, monthlyDebts: 200, seniorityMonths: 3 });
    expect(r.status).toBe('revisar');
    expect(r.availableForMortgage).toBeCloseTo(800, 5);
  });

  it('no es apto sin ingresos', () => {
    const r = affordability({ price: 0, hasSavings: false, savings: 0, monthlySalary: 0, payrolls: 12, monthlyDebts: 0, seniorityMonths: 24 });
    expect(r.status).toBe('no-apto');
  });
});

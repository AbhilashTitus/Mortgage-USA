"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserInputSchema, UserInputState } from "@/lib/schemas";
import { useAppStore } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2, Banknote, Users, Home, Percent, Calculator } from "lucide-react";
import { useEffect } from "react";

export function YourInfoForm() {
  const { userInputs, updateUserInputs } = useAppStore();

  const form = useForm<UserInputState>({
    resolver: zodResolver(UserInputSchema as any),
    values: userInputs,
    mode: "onChange",
  });

  const { register, control, watch, formState: { errors } } = form;

  const incomeTaxRateWatch = watch("incomeTaxRate");

  // Sync valid form state to store automatically
  useEffect(() => {
    const subscription = watch((value) => {
      try {
        const parsed = UserInputSchema.parse(value);
        const currentStore = useAppStore.getState().userInputs;
        const isSame = Object.keys(parsed).every((key) => {
          const k = key as keyof UserInputState;
          if (Array.isArray(parsed[k]) && Array.isArray(currentStore[k])) {
            return JSON.stringify(parsed[k]) === JSON.stringify(currentStore[k]);
          }
          return parsed[k] === currentStore[k];
        });

        if (!isSame) {
          updateUserInputs(parsed);
        }
      } catch {
        // Ignore partial/invalid states while typing
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, updateUserInputs]);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 sm:space-y-10 pb-28 lg:pb-20 animate-in fade-in duration-700 slide-in-from-bottom-8">
      {/* Hero Header */}
      <div className="text-center space-y-3 sm:space-y-4 mb-8 sm:mb-12">
        <div className="inline-flex items-center justify-center w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-blue-50 mb-3 sm:mb-4 shadow-inner">
          <Calculator className="w-7 h-7 sm:w-10 sm:h-10 text-blue-600" />
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#003087]">
          Your Information
        </h1>
        <p className="text-base sm:text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed px-2">
          Enter your financial details below to generate your personalized affordability dashboard.
        </p>
      </div>

      <form className="space-y-8">
        
        {/* ── Income & Debts ── */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="relative bg-white/80 backdrop-blur-xl border border-slate-200/60 shadow-xl shadow-slate-200/20 rounded-[2rem] p-6 sm:p-8 md:p-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8 border-b border-slate-100 pb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white shrink-0">
                <Banknote className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Income & Debts</h2>
                <p className="text-sm text-slate-500 mt-1">Your primary financial foundation.</p>
              </div>
            </div>

            <div className="space-y-10">
              <Controller
                control={control}
                name="yearlyGrossIncome"
                render={({ field }) => (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-2">
                      <Label htmlFor="yearlyGrossIncome" className="text-base font-semibold text-slate-700">Annual Gross Income</Label>
                      <div className="relative w-full sm:w-48">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
                        <Input 
                          id="yearlyGrossIncome"
                          type="number" 
                          step="1000"
                          className="pl-8 pr-4 h-12 rounded-xl border-slate-200 bg-slate-50/50 hover:bg-slate-50 focus:bg-white text-lg font-bold text-slate-900 transition-all text-right shadow-sm"
                          value={field.value}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                    <Slider 
                      min={0} 
                      max={1000000} 
                      step={5000} 
                      value={[field.value || 0]} 
                      onValueChange={(vals) => field.onChange(Array.isArray(vals) ? vals[0] : vals)} 
                      className="py-2"
                    />
                  </div>
                )}
              />

              <div className="space-y-3">
                <Label htmlFor="incomeTaxRate" className="text-base font-semibold text-slate-700">Estimated Income Tax Rate</Label>
                <div className="relative w-full sm:w-1/3">
                  <Input 
                    id="incomeTaxRate" 
                    type="number" 
                    step="1"
                    className="pr-10 h-12 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white text-lg font-bold text-slate-900 shadow-sm"
                    {...register("incomeTaxRate", { valueAsNumber: true })} 
                    value={Number.isNaN(incomeTaxRateWatch) || incomeTaxRateWatch === undefined ? "" : incomeTaxRateWatch}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">%</span>
                </div>
                <p className="text-sm text-slate-500">Effective tax rate on your gross income.</p>
              </div>

              <div className="pt-6 border-t border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-1">Monthly Debts</h3>
                <p className="text-sm text-slate-500 mb-6">Minimum monthly payments for credit cards, auto loans, etc.</p>
                
                <div className="space-y-4">
                  {watch("borrowerDebts").map((debt, index) => (
                    <div key={index} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center bg-slate-50/50 p-2 pl-4 rounded-xl border border-slate-100 transition-all hover:bg-slate-50">
                      <div className="flex-1 w-full">
                        <Input 
                          type="text" 
                          placeholder="Debt Name (e.g. Car Loan)"
                          className="border-0 bg-transparent shadow-none focus-visible:ring-0 font-medium px-0 h-10 text-slate-700"
                          {...register(`borrowerDebts.${index}.name` as const)}
                        />
                      </div>
                      <div className="relative w-full sm:w-40 shrink-0">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
                        <Input 
                          type="number" 
                          className="pl-7 h-10 rounded-lg border-slate-200 bg-white font-bold"
                          placeholder="0"
                          {...register(`borrowerDebts.${index}.amount` as const, { valueAsNumber: true })}
                        />
                      </div>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon"
                        className="text-slate-400 hover:text-red-500 hover:bg-red-50 shrink-0 h-10 w-10 rounded-lg"
                        onClick={() => {
                          const current = [...watch("borrowerDebts")];
                          current.splice(index, 1);
                          form.setValue("borrowerDebts", current, { shouldValidate: true });
                        }}
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  ))}
                  
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full h-12 rounded-xl border-dashed border-2 border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-blue-300 hover:text-blue-600 transition-colors"
                    onClick={() => {
                      const current = [...watch("borrowerDebts")];
                      form.setValue("borrowerDebts", [...current, { name: "", amount: 0 }], { shouldValidate: true });
                    }}
                  >
                    <PlusCircle className="w-5 h-5 mr-2" /> Add Monthly Debt
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Co-Borrower ── */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="relative bg-white/80 backdrop-blur-xl border border-slate-200/60 shadow-xl shadow-slate-200/20 rounded-[2rem] p-6 sm:p-8 md:p-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8 border-b border-slate-100 pb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white shrink-0">
                <Users className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Co-Borrower</h2>
                <p className="text-sm text-slate-500 mt-1">Leave blank if applying alone.</p>
              </div>
            </div>

            <div className="space-y-10">
              <div className="space-y-3">
                <Label htmlFor="coBorrowerIncome" className="text-base font-semibold text-slate-700">Annual Gross Income</Label>
                <div className="relative w-full sm:w-1/2">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
                  <Input 
                    id="coBorrowerIncome" 
                    type="number" 
                    className="pl-8 h-12 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white text-lg font-bold text-slate-900 shadow-sm"
                    {...register("coBorrowerIncome", { valueAsNumber: true })} 
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-1">Monthly Debts</h3>
                <div className="space-y-4 mt-6">
                  {watch("coBorrowerDebts").map((debt, index) => (
                    <div key={index} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center bg-slate-50/50 p-2 pl-4 rounded-xl border border-slate-100 transition-all hover:bg-slate-50">
                      <div className="flex-1 w-full">
                        <Input 
                          type="text" 
                          placeholder="Debt Name"
                          className="border-0 bg-transparent shadow-none focus-visible:ring-0 font-medium px-0 h-10 text-slate-700"
                          {...register(`coBorrowerDebts.${index}.name` as const)}
                        />
                      </div>
                      <div className="relative w-full sm:w-40 shrink-0">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
                        <Input 
                          type="number" 
                          className="pl-7 h-10 rounded-lg border-slate-200 bg-white font-bold"
                          placeholder="0"
                          {...register(`coBorrowerDebts.${index}.amount` as const, { valueAsNumber: true })}
                        />
                      </div>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon"
                        className="text-slate-400 hover:text-red-500 hover:bg-red-50 shrink-0 h-10 w-10 rounded-lg"
                        onClick={() => {
                          const current = [...watch("coBorrowerDebts")];
                          current.splice(index, 1);
                          form.setValue("coBorrowerDebts", current, { shouldValidate: true });
                        }}
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  ))}
                  
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full h-12 rounded-xl border-dashed border-2 border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-emerald-300 hover:text-emerald-600 transition-colors"
                    onClick={() => {
                      const current = [...watch("coBorrowerDebts")];
                      form.setValue("coBorrowerDebts", [...current, { name: "", amount: 0 }], { shouldValidate: true });
                    }}
                  >
                    <PlusCircle className="w-5 h-5 mr-2" /> Add Monthly Debt
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Loan Scenario ── */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-indigo-500/5 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="relative bg-white/80 backdrop-blur-xl border border-slate-200/60 shadow-xl shadow-slate-200/20 rounded-[2rem] p-6 sm:p-8 md:p-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8 border-b border-slate-100 pb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-500/20 text-white shrink-0">
                <Percent className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Loan Scenario</h2>
                <p className="text-sm text-slate-500 mt-1">Configure your expected loan terms.</p>
              </div>
            </div>

            <div className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Controller
                  control={control}
                  name="interestRate"
                  render={({ field }) => (
                    <div className="space-y-4">
                      <div className="flex justify-between items-end gap-2">
                        <Label htmlFor="interestRate" className="text-base font-semibold text-slate-700">Interest Rate</Label>
                        <div className="relative w-24">
                          <Input 
                            id="interestRate"
                            type="number" 
                            step="0.125"
                            className="pr-8 h-12 rounded-xl border-slate-200 bg-slate-50/50 hover:bg-slate-50 focus:bg-white text-lg font-bold text-slate-900 transition-all text-right shadow-sm"
                            value={field.value}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">%</span>
                        </div>
                      </div>
                      <Slider 
                        min={1} 
                        max={15} 
                        step={0.125} 
                        value={[field.value || 0]} 
                        onValueChange={(vals) => field.onChange(Array.isArray(vals) ? vals[0] : vals)} 
                        className="py-2"
                      />
                      {errors.interestRate && <p className="text-destructive text-sm">{errors.interestRate.message}</p>}
                    </div>
                  )}
                />

                <Controller
                  control={control}
                  name="downPaymentPercent"
                  render={({ field }) => (
                    <div className="space-y-4">
                      <div className="flex justify-between items-end gap-2">
                        <Label htmlFor="downPaymentPercent" className="text-base font-semibold text-slate-700">Down Payment</Label>
                        <div className="relative w-24">
                          <Input 
                            id="downPaymentPercent"
                            type="number" 
                            step="1"
                            className="pr-8 h-12 rounded-xl border-slate-200 bg-slate-50/50 hover:bg-slate-50 focus:bg-white text-lg font-bold text-slate-900 transition-all text-right shadow-sm"
                            value={field.value}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">%</span>
                        </div>
                      </div>
                      <Slider 
                        min={0} 
                        max={100} 
                        step={1} 
                        value={[field.value || 0]} 
                        onValueChange={(vals) => field.onChange(Array.isArray(vals) ? vals[0] : vals)} 
                        className="py-2"
                      />
                    </div>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-slate-100">
                <div className="space-y-3">
                  <Label htmlFor="mortgageTermYears" className="text-base font-semibold text-slate-700">Mortgage Term</Label>
                  <Controller
                    control={control}
                    name="mortgageTermYears"
                    render={({ field }) => (
                      <Select value={field.value.toString()} onValueChange={(v) => field.onChange(parseInt(v || "0"))}>
                        <SelectTrigger id="mortgageTermYears" className="h-12 rounded-xl bg-slate-50/50 shadow-sm border-slate-200 text-base font-medium">
                          <SelectValue placeholder="Select term" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 Years</SelectItem>
                          <SelectItem value="20">20 Years</SelectItem>
                          <SelectItem value="25">25 Years</SelectItem>
                          <SelectItem value="30">30 Years</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="mortgageInsuranceType" className="text-base font-semibold text-slate-700">Loan Type (for PMI)</Label>
                  <Controller
                    control={control}
                    name="mortgageInsuranceType"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger id="mortgageInsuranceType" className="h-12 rounded-xl bg-slate-50/50 shadow-sm border-slate-200 text-base font-medium">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Conv - Good Credit">Conventional (Good Credit)</SelectItem>
                          <SelectItem value="Conv - Fair Credit">Conventional (Fair Credit)</SelectItem>
                          <SelectItem value="FHA">FHA</SelectItem>
                          <SelectItem value="USDA">USDA</SelectItem>
                          <SelectItem value="VA">VA</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Property Details ── */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-amber-500/5 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="relative bg-white/80 backdrop-blur-xl border border-slate-200/60 shadow-xl shadow-slate-200/20 rounded-[2rem] p-6 sm:p-8 md:p-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8 border-b border-slate-100 pb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/20 text-white shrink-0">
                <Home className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Property Details</h2>
                <p className="text-sm text-slate-500 mt-1">Taxes, insurance, and HOA dues.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-3">
                <Label htmlFor="propertyTaxRate" className="text-base font-semibold text-slate-700">Property Tax</Label>
                <Controller
                  control={control}
                  name="propertyTaxRate"
                  render={({ field }) => (
                    <div className="relative">
                      <Input 
                        id="propertyTaxRate" 
                        type="number" 
                        step="0.01"
                        className="pr-10 h-12 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white text-lg font-bold text-slate-900 shadow-sm"
                        value={field.value ? (field.value / 100).toString() : ""}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          field.onChange(isNaN(val) ? 0 : Math.round(val * 100));
                        }}
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">%</span>
                    </div>
                  )}
                />
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="insuranceRate" className="text-base font-semibold text-slate-700">Home Insurance</Label>
                <Controller
                  control={control}
                  name="insuranceRate"
                  render={({ field }) => (
                    <div className="relative">
                      <Input 
                        id="insuranceRate" 
                        type="number" 
                        step="0.01"
                        className="pr-10 h-12 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white text-lg font-bold text-slate-900 shadow-sm"
                        value={field.value ? (field.value / 100).toString() : ""}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          field.onChange(isNaN(val) ? 0 : Math.round(val * 100));
                        }}
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">%</span>
                    </div>
                  )}
                />
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="yearlyHOA" className="text-base font-semibold text-slate-700">Annual HOA</Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
                  <Input 
                    id="yearlyHOA" 
                    type="number" 
                    className="pl-8 h-12 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white text-lg font-bold text-slate-900 shadow-sm"
                    {...register("yearlyHOA", { valueAsNumber: true })} 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

      </form>
    </div>
  );
}

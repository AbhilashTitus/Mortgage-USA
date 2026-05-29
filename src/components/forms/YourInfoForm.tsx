/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";


import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserInputSchema, UserInputState } from "@/lib/schemas";
import { useAppStore } from "@/lib/store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2 } from "lucide-react";
import { useEffect } from "react";

export function YourInfoForm() {
  const { userInputs, updateUserInputs } = useAppStore();

  const form = useForm<UserInputState>({
    resolver: zodResolver(UserInputSchema as any),
    values: userInputs,
    mode: "onChange",
  });

  const { register, control, watch, formState: { errors }, reset } = form;

  const interestRateWatch = watch("interestRate");
  const downPaymentPercentWatch = watch("downPaymentPercent");
  const incomeTaxRateWatch = watch("incomeTaxRate");

  // Sync valid form state to store automatically
  useEffect(() => {
    const subscription = watch((value) => {
      try {
        // Only parse if it's a valid complete state
        const parsed = UserInputSchema.parse(value);
        
        // Deep-compare parsed value with current store state
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
    <Card className="w-full h-full shadow-xl rounded-2xl border-0 bg-white">
      <CardHeader>
        <CardTitle>Your Information</CardTitle>
        <CardDescription>Enter your financial details to calculate affordability.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="scenario" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="scenario">Scenario</TabsTrigger>
            <TabsTrigger value="income">Income & Debts</TabsTrigger>
            <TabsTrigger value="coborrower">Co-Borrower</TabsTrigger>
          </TabsList>

          <form className="space-y-6">
            <TabsContent value="scenario" className="space-y-4">
              <div className="space-y-8">
                <Controller
                  control={control}
                  name="interestRate"
                  render={({ field }) => (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="interestRate" className="text-base text-slate-700">Interest Rate (p.a)</Label>
                        <div className="flex items-center gap-1 bg-slate-100 rounded-md px-3 py-1">
                          <Input 
                            id="interestRate"
                            type="number" 
                            step="0.125"
                            className="border-0 shadow-none bg-transparent h-8 w-16 text-right p-0 focus-visible:ring-0 font-semibold text-primary"
                            value={field.value}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                          <span className="text-muted-foreground font-medium text-sm">%</span>
                        </div>
                      </div>
                      <Slider 
                        min={1} 
                        max={15} 
                        step={0.125} 
                        value={[field.value || 0]} 
                        onValueChange={(vals) => field.onChange(Array.isArray(vals) ? vals[0] : vals)} 
                      />
                      {errors.interestRate && <p className="text-destructive text-sm">{errors.interestRate.message}</p>}
                    </div>
                  )}
                />
                
                <div className="space-y-2">
                  <Label htmlFor="mortgageTermYears">Mortgage Term (Years)</Label>
                  <Controller
                    control={control}
                    name="mortgageTermYears"
                    render={({ field }) => (
                      <Select value={field.value.toString()} onValueChange={(v) => field.onChange(parseInt(v || "0"))}>
                        <SelectTrigger id="mortgageTermYears">
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
              </div>

              <div className="space-y-8 mt-6">
                <Controller
                  control={control}
                  name="downPaymentPercent"
                  render={({ field }) => (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="downPaymentPercent" className="text-base text-slate-700">Down Payment</Label>
                        <div className="flex items-center gap-1 bg-slate-100 rounded-md px-3 py-1">
                          <Input 
                            id="downPaymentPercent"
                            type="number" 
                            step="1"
                            className="border-0 shadow-none bg-transparent h-8 w-16 text-right p-0 focus-visible:ring-0 font-semibold text-primary"
                            value={field.value}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                          <span className="text-muted-foreground font-medium text-sm">%</span>
                        </div>
                      </div>
                      <Slider 
                        min={0} 
                        max={100} 
                        step={1} 
                        value={[field.value || 0]} 
                        onValueChange={(vals) => field.onChange(Array.isArray(vals) ? vals[0] : vals)} 
                      />
                    </div>
                  )}
                />
                
                <div className="space-y-2">
                  <Label htmlFor="mortgageInsuranceType">Mortgage insurance rate %</Label>
                  <Controller
                    control={control}
                    name="mortgageInsuranceType"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger id="mortgageInsuranceType">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Conv - Good Credit">Conv - Good Credit</SelectItem>
                          <SelectItem value="Conv - Fair Credit">Conv - Fair Credit</SelectItem>
                          <SelectItem value="FHA">FHA</SelectItem>
                          <SelectItem value="USDA">USDA</SelectItem>
                          <SelectItem value="VA">VA</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="propertyTaxRate">Property Tax Rate</Label>
                  <Controller
                    control={control}
                    name="propertyTaxRate"
                    render={({ field }) => (
                      <div className="relative">
                        <Input 
                          id="propertyTaxRate" 
                          type="number" 
                          step="0.01"
                          className="pr-12"
                          value={field.value ? (field.value / 100).toString() : ""}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            field.onChange(isNaN(val) ? 0 : Math.round(val * 100));
                          }}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">%</span>
                      </div>
                    )}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="insuranceRate">Home Insurance Rate</Label>
                  <Controller
                    control={control}
                    name="insuranceRate"
                    render={({ field }) => (
                      <div className="relative">
                        <Input 
                          id="insuranceRate" 
                          type="number" 
                          step="0.01"
                          className="pr-12"
                          value={field.value ? (field.value / 100).toString() : ""}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            field.onChange(isNaN(val) ? 0 : Math.round(val * 100));
                          }}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">%</span>
                      </div>
                    )}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="yearlyHOA">Annual HOA Dues</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                  <Input 
                    id="yearlyHOA" 
                    type="number" 
                    className="pl-7"
                    {...register("yearlyHOA", { valueAsNumber: true })} 
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="income" className="space-y-8 mt-4">
              <Controller
                control={control}
                name="yearlyGrossIncome"
                render={({ field }) => (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="yearlyGrossIncome" className="text-base text-slate-700">Your Annual Gross Income</Label>
                      <div className="flex items-center gap-1 bg-slate-100 rounded-md px-3 py-1">
                        <span className="text-muted-foreground font-medium text-sm">$</span>
                        <Input 
                          id="yearlyGrossIncome"
                          type="number" 
                          step="1000"
                          className="border-0 shadow-none bg-transparent h-8 w-24 text-right p-0 focus-visible:ring-0 font-semibold text-primary"
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
                    />
                  </div>
                )}
              />

              <div className="space-y-2">
                <Label htmlFor="incomeTaxRate">Estimated Income Tax Rate</Label>
                <div className="relative">
                  <Input 
                    id="incomeTaxRate" 
                    type="number" 
                    step="1"
                    className="pr-8"
                    {...register("incomeTaxRate", { valueAsNumber: true })} 
                    value={Number.isNaN(incomeTaxRateWatch) || incomeTaxRateWatch === undefined ? "" : incomeTaxRateWatch}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">%</span>
                </div>
              </div>

              <div className="pt-4 pb-2 border-b">
                <h3 className="font-semibold text-sm">Your Monthly Debts</h3>
                <p className="text-xs text-muted-foreground mb-4">Add your minimum monthly payments (credit cards, auto loans, student loans, etc.)</p>
                
                <div className="space-y-3">
                  {watch("borrowerDebts").map((debt, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <div className="flex-1">
                        <Input 
                          type="text" 
                          placeholder="Debt Name"
                          {...register(`borrowerDebts.${index}.name` as const)}
                        />
                      </div>
                      <div className="relative w-1/3">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                        <Input 
                          type="number" 
                          className="pl-7"
                          placeholder="Amount"
                          {...register(`borrowerDebts.${index}.amount` as const, { valueAsNumber: true })}
                        />
                      </div>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon"
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => {
                          const current = [...watch("borrowerDebts")];
                          current.splice(index, 1);
                          form.setValue("borrowerDebts", current, { shouldValidate: true });
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-2"
                    onClick={() => {
                      const current = [...watch("borrowerDebts")];
                      form.setValue("borrowerDebts", [...current, { name: "", amount: 0 }], { shouldValidate: true });
                    }}
                  >
                    <PlusCircle className="w-4 h-4 mr-2" /> Add Debt
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="coborrower" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="coBorrowerIncome">Co-Borrower Annual Gross Income</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                  <Input 
                    id="coBorrowerIncome" 
                    type="number" 
                    className="pl-7"
                    {...register("coBorrowerIncome", { valueAsNumber: true })} 
                  />
                </div>
              </div>

              <div className="pt-4 pb-2 border-b">
                <h3 className="font-semibold text-sm">Co-Borrower Monthly Debts</h3>
                <p className="text-xs text-muted-foreground mb-4">Add their minimum monthly payments</p>
                
                <div className="space-y-3">
                  {watch("coBorrowerDebts").map((debt, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <div className="flex-1">
                        <Input 
                          type="text" 
                          placeholder="Debt Name"
                          {...register(`coBorrowerDebts.${index}.name` as const)}
                        />
                      </div>
                      <div className="relative w-1/3">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                        <Input 
                          type="number" 
                          className="pl-7"
                          placeholder="Amount"
                          {...register(`coBorrowerDebts.${index}.amount` as const, { valueAsNumber: true })}
                        />
                      </div>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon"
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => {
                          const current = [...watch("coBorrowerDebts")];
                          current.splice(index, 1);
                          form.setValue("coBorrowerDebts", current, { shouldValidate: true });
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-2"
                    onClick={() => {
                      const current = [...watch("coBorrowerDebts")];
                      form.setValue("coBorrowerDebts", [...current, { name: "", amount: 0 }], { shouldValidate: true });
                    }}
                  >
                    <PlusCircle className="w-4 h-4 mr-2" /> Add Debt
                  </Button>
                </div>
              </div>
            </TabsContent>
          </form>
        </Tabs>
      </CardContent>
    </Card>
  );
}

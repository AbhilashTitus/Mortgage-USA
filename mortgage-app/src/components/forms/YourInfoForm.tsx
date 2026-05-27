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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2 } from "lucide-react";
import { useEffect } from "react";

export function YourInfoForm() {
  const { userInputs, updateUserInputs } = useAppStore();

  const form = useForm<UserInputState>({
    resolver: zodResolver(UserInputSchema),
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
    <Card className="w-full h-full shadow-sm">
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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="interestRate">Interest Rate (%)</Label>
                  <Input 
                    id="interestRate" 
                    type="number" 
                    step="0.125" 
                    {...register("interestRate", { valueAsNumber: true })} 
                    value={Number.isNaN(interestRateWatch) || interestRateWatch === undefined ? "" : interestRateWatch}
                  />
                  {errors.interestRate && <p className="text-destructive text-sm">{errors.interestRate.message}</p>}
                </div>
                
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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="downPaymentPercent">Down Payment (%)</Label>
                  <Input 
                    id="downPaymentPercent" 
                    type="number" 
                    step="1" 
                    {...register("downPaymentPercent", { valueAsNumber: true })} 
                    value={Number.isNaN(downPaymentPercentWatch) || downPaymentPercentWatch === undefined ? "" : downPaymentPercentWatch}
                  />
                </div>
                
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
                  <Label htmlFor="propertyTaxRate">Property Tax Rate (bps)</Label>
                  <Input 
                    id="propertyTaxRate" 
                    type="number" 
                    {...register("propertyTaxRate", { valueAsNumber: true })} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="insuranceRate">Home Insurance Rate (bps)</Label>
                  <Input 
                    id="insuranceRate" 
                    type="number" 
                    {...register("insuranceRate", { valueAsNumber: true })} 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="yearlyHOA">Annual HOA Dues ($)</Label>
                <Input 
                  id="yearlyHOA" 
                  type="number" 
                  {...register("yearlyHOA", { valueAsNumber: true })} 
                />
              </div>
            </TabsContent>

            <TabsContent value="income" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="yearlyGrossIncome">Your Annual Gross Income ($)</Label>
                <Input 
                  id="yearlyGrossIncome" 
                  type="number" 
                  {...register("yearlyGrossIncome", { valueAsNumber: true })} 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="incomeTaxRate">Estimated Income Tax Rate (%)</Label>
                <Input 
                  id="incomeTaxRate" 
                  type="number" 
                  step="1"
                  {...register("incomeTaxRate", { valueAsNumber: true })} 
                  value={Number.isNaN(incomeTaxRateWatch) || incomeTaxRateWatch === undefined ? "" : incomeTaxRateWatch}
                />
              </div>

              <div className="pt-4 pb-2 border-b">
                <h3 className="font-semibold text-sm">Your Monthly Debts</h3>
                <p className="text-xs text-muted-foreground mb-4">Add your minimum monthly payments (credit cards, auto loans, student loans, etc.)</p>
                
                <div className="space-y-3">
                  {watch("borrowerDebts").map((debt, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                        <Input 
                          type="number" 
                          className="pl-7"
                          {...register(`borrowerDebts.${index}` as const, { valueAsNumber: true })}
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
                      form.setValue("borrowerDebts", [...current, 0], { shouldValidate: true });
                    }}
                  >
                    <PlusCircle className="w-4 h-4 mr-2" /> Add Debt
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="coborrower" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="coBorrowerIncome">Co-Borrower Annual Gross Income ($)</Label>
                <Input 
                  id="coBorrowerIncome" 
                  type="number" 
                  {...register("coBorrowerIncome", { valueAsNumber: true })} 
                />
              </div>

              <div className="pt-4 pb-2 border-b">
                <h3 className="font-semibold text-sm">Co-Borrower Monthly Debts</h3>
                <p className="text-xs text-muted-foreground mb-4">Add their minimum monthly payments</p>
                
                <div className="space-y-3">
                  {watch("coBorrowerDebts").map((debt, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                        <Input 
                          type="number" 
                          className="pl-7"
                          {...register(`coBorrowerDebts.${index}` as const, { valueAsNumber: true })}
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
                      form.setValue("coBorrowerDebts", [...current, 0], { shouldValidate: true });
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

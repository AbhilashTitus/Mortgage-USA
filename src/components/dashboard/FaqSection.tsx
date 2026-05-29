"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function FaqSection() {
  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Frequently Asked Questions</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>What should I decide is my maximum purchase price?</AccordionTrigger>
            <AccordionContent>
              The best way to find your maximum purchase price is to look at your budget. We recommend using the Conservative risk as your maximum, but this calculator can only help you understand how lenders find your maximum purchase price and understanding a bit more about what a comfortable payment looks like according to different theories. Use a budget to find out what you&apos;re comfortable spending each month, only you can actually understand what works for you. Don&apos;t rely on someone&apos;s opinion of what you should spend if you&apos;re uncomfortable with the payment.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-2">
            <AccordionTrigger>What if there are no homes in my area below my max purchase price?</AccordionTrigger>
            <AccordionContent>
              That&apos;s always frustrating! There is no magic button that will make home prices come down. Sometimes we have to be brutally honest with ourself about what we can afford and what we will practically do about it. If you can&apos;t afford a home in the area you want, you either need to find a way to increase your income or add someone on the loan with you OR look into lower cost areas.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-3">
            <AccordionTrigger>What does being house poor mean?</AccordionTrigger>
            <AccordionContent>
              &quot;House poor&quot; is a phrase that doesn&apos;t have a technical definition. But rather it just means that your budget is a slave to your house payment... You can afford your mortgage payment but don&apos;t have money for much else. You don&apos;t want that. No one wants their life to revolve around a house payment. You can avoid becoming house poor by making sure you understand the costs of buying a home and refuse to go above a house payment that makes you uncomfortable. Remember, you know the mortgage payment before you buy a home. If the payment is too high, don&apos;t buy the home.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-4">
            <AccordionTrigger>What happens if I buy a home and eventually cannot make the monthly payment?</AccordionTrigger>
            <AccordionContent>
              The CFPB has great resources on understanding what to do if you cannot make your monthly payment. The worst thing you can do is to stop paying and not let anyone know. There are programs that help millions of people stay out of foreclosure.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}

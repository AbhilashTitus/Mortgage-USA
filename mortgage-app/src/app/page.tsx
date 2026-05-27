import { YourInfoForm } from "@/components/forms/YourInfoForm";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

export default function Home() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
        <div className="lg:col-span-4 h-full">
          <YourInfoForm />
        </div>
        
        <div className="lg:col-span-8">
          <DashboardLayout />
        </div>
      </div>
    </div>
  );
}

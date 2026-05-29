import { AuthContainer } from "@/components/auth/AuthContainer";

export const metadata = {
  title: "Login | Mortgage-USA",
  description: "Sign in to your Mortgage-USA account to access your affordability dashboard.",
};

export default function LoginPage() {
  return <AuthContainer />;
}

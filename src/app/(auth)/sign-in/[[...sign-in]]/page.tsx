import { SignIn } from "@clerk/nextjs";

export const dynamic = "force-dynamic";

export default function SignInPage() {
  return (
    <div className="h-screen w-full grid place-content-center">
      <SignIn />
    </div>
  );
}

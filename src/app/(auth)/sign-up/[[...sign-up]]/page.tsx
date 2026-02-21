import { SignUp } from "@clerk/nextjs";

export const dynamic = "force-dynamic";

export default function SignUpPage() {
  return (
    <div className="h-screen w-full grid place-content-center">
      <SignUp />
    </div>
  );
}

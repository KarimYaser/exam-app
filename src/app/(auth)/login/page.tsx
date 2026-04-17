import Link from "next/link";
import LoginForm from "./_components/login-form";

export default function LoginPage() {
  return (
    <div className="w-full max-w-sm">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Login</h2>

      <LoginForm />

      <p className="mt-6 text-center text-sm text-gray-500">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="font-medium text-blue-600 hover:text-blue-700 transition"
        >
          Create yours
        </Link>
      </p>
    </div>
  );
}

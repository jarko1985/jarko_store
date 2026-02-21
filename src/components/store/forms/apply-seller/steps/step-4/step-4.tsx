import Link from "next/link";
import AnimatedContainer from "../../animated-container";

export default function Step4() {
  return (
    <div className="h-full">
      <AnimatedContainer>
        <div className="h-full w-full bg-white rounded-lg p-10 flex items-center justify-center shadow-sm">
          <div>
            <svg
              className="mb-4 h-20 w-20 text-green-500 mx-auto"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <h2 className="text-2xl mb-4 text-gray-800 text-center font-bold">
              Your store has been created!
            </h2>
            <div className="text-gray-600 mb-8">
              Thank you for creating your store. It's currently under review and
              will be approved shortly. Stay tuned!
            </div>

            <Link href="/">
              <button className="w-40 block mx-auto focus:outline-none py-2 px-5 rounded-lg shadow-sm text-center text-gray-600 bg-white hover:bg-gray-100 font-medium border">
                Back to home
              </button>
            </Link>
          </div>
        </div>
      </AnimatedContainer>
    </div>
  );
}

import LandingForm from "@/components/landing/LandingForm";

export default function Landing() {
  return (
    <div className="w-full flex-1 flex-center flex-col @md:px-8 px-6 text-center">
      <h2 className="mb-4 font-bold text-3xl tracking-tight sm:text-4xl md:mb-6 md:text-5xl">
        Understand Website Terms {/*  */}
        <span className="mt-1 text-blue-500 sm:block">
          Without The Legal Jargon
        </span>
      </h2>
      <p className="mb-4 text-muted-foreground text-sm sm:text-lg md:mb-12 md:max-w-3xl md:text-xl">
        Paste any website&apos;s Terms of Service URL and get a clear,
        easy-to-understand summary with highlighted concerns.
      </p>
      <LandingForm />
    </div>
  );
}

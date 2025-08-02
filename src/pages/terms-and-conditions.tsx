import Navigation from "@/components/Navigation";

import Footer from "@/components/Footer";

const TermsAndConditions = () => {
  return (
    <>
      <Navigation />
      <Hero title="Terms and Conditions" />

      <div className="max-w-4xl mx-auto px-4 py-8 text-white-800">
        <h1 className="text-2xl font-bold mb-4">Terms and Conditions</h1>
        <p className="mb-4">
          These Terms and Conditions ("Terms") govern your use of the NeoStudio website and services ("Platform"). By accessing or using the Platform, you agree to be bound by these Terms.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">1. Use of the Platform</h2>
        <p className="mb-4">
          You agree to use the Platform only for lawful purposes and in a way that does not infringe the rights of, restrict, or inhibit anyone else's use and enjoyment of the Platform.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">2. Intellectual Property</h2>
        <p className="mb-4">
          All content on NeoStudio, including logos, text, graphics, and design, is the intellectual property of NeoStudio and is protected by applicable copyright laws.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">3. User Conduct</h2>
        <p className="mb-4">
          You must not misuse this platform by knowingly introducing viruses or other malicious material. You must not attempt unauthorized access to the website, the server on which it's stored, or any connected system.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">4. Limitation of Liability</h2>
        <p className="mb-4">
          NeoStudio will not be liable for any loss or damage caused by reliance on information obtained through the platform. It is your responsibility to evaluate the accuracy, completeness, or usefulness of any content.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">5. Modifications</h2>
        <p className="mb-4">
          We reserve the right to modify or replace these Terms at any time. Continued use of the Platform after any changes indicates your acceptance of the new Terms.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">6. Contact</h2>
        <p className="mb-4">
          If you have any questions about these Terms, please contact us at <a href="mailto:team.neostudio@gmail.com" className="text-blue-600 underline">info@neostudio.in</a>.
        </p>
      </div>

      <Footer />
    </>
  );
};

export default TermsAndConditions;

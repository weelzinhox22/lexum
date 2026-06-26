import Header from '../components/Header';
import Hero from '../components/Hero';
import CourseOverview from '../components/CourseOverview';
import ModulesGrid from '../components/ModulesGrid';
import HowItWorks from '../components/HowItWorks';
import CertificateValidation from '../components/CertificateValidation';
import BenefitsFAQ from '../components/BenefitsFAQ';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <CourseOverview />
      <ModulesGrid />
      <HowItWorks />
      <CertificateValidation />
      <BenefitsFAQ />
      <Footer />
    </>
  );
}

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Comparison from "@/components/Comparison";
import ProductPillars from "@/components/ProductPillars";
import Industries from "@/components/Industries";
import PocSimulator from "@/components/PocSimulator";
import Compliance from "@/components/Compliance";
import Consulting from "@/components/Consulting";
import CtaBand from "@/components/CtaBand";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-base-950">
      <Navbar />
      <Hero />
      <Comparison />
      <ProductPillars />
      <Industries />
      <PocSimulator />
      <Compliance />
      <Consulting />
      <CtaBand />
      <Footer />
    </main>
  );
}

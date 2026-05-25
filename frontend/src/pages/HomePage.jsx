import HeroSection from "../components/sections/HeroSection";
import DatasetContextSection from "../components/sections/DatasetContextSection";
import CleaningSection from "../components/sections/CleaningSection";
import DataQualitySection from "../components/sections/DataQualitySection";
import VariableSelectionSection from "../components/sections/VariableSelectionSection";
import SusceptibilityBehaviorSection from "../components/sections/SusceptibilityBehaviorSection";
import ConclusionSection from "../components/sections/ConclusionSection";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <DatasetContextSection />
      <CleaningSection />
      <DataQualitySection />
      <VariableSelectionSection />
      <SusceptibilityBehaviorSection />
      <ConclusionSection />
    </main>
  );
}


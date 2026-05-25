import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import HomePage from "./pages/HomePage";
import ModelsPage from "./pages/ModelsPage";
import { ThemeProvider } from "./hooks/useTheme";
import { LightboxProvider } from "./hooks/useLightbox";
import ImageLightbox from "./components/ui/ImageLightbox";

export default function App() {
  return (
    <ThemeProvider>
      <LightboxProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/modelos" element={<ModelsPage />} />
          </Routes>
          <Footer />
        </BrowserRouter>
        <ImageLightbox />
      </LightboxProvider>
    </ThemeProvider>
  );
}



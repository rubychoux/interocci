import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Nav from './components/Nav';
import LandingPage from './pages/LandingPage';
import ExplorePage from './pages/ExplorePage';
import GalleryPage from './pages/GalleryPage';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      {children}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout><LandingPage /></Layout>} />
        <Route path="/explore" element={<Layout><ExplorePage /></Layout>} />
        <Route path="/gallery/:id" element={<GalleryPage />} />
      </Routes>
    </BrowserRouter>
  );
}

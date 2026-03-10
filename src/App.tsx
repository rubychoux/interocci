import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Nav from './components/Nav';
import LandingPage from './pages/LandingPage';
import ExplorePage from './pages/ExplorePage';
import GalleryPage from './pages/GalleryPage';
import AboutPage from './pages/AboutPage';
import LikedPage from './pages/LikedPage';
import ArtistPage from './pages/ArtistPage';
import CreateGalleryPage from './pages/CreateGalleryPage';

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
        <Route path="/about" element={<Layout><AboutPage /></Layout>} />
        <Route path="/liked" element={<Layout><LikedPage /></Layout>} />
        <Route path="/artist/:id" element={<Layout><ArtistPage /></Layout>} />
        <Route path="/create" element={<Layout><CreateGalleryPage /></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}

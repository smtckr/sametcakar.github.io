import React, { useState, useEffect } from "react";
import {
  Compass,
  MapPin,
  Calendar,
  ShowerHead,
  Bed,
  ArrowRight,
  Star,
  Users,
  Search,
  CheckCircle,
  Briefcase,
  Mail,
  Phone,
  MessageSquare,
  ChevronRight,
  Trash2,
  Clock,
  Eye,
  Send,
  X,
} from "lucide-react";
import { Routes, Route, useNavigate, useLocation, useParams, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import BookingModal from "./components/BookingModal";
import AboutSection from "./components/AboutSection";
import ToursSection from "./components/ToursSection";
import HomePage from "./pages/HomePage";
import { useLanguage, Translate } from "./LanguageContext";
import { useCurrency } from "./CurrencyContext";
import SplashScreen from "./components/SplashScreen";

import { TOURS_DATA, TESTIMONIALS } from "./data";
import { Tour, Booking, ContactMessage } from "./types";

import ContactPage from "./pages/ContactPage";

import FAQPage from "./pages/FAQPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import RefundPolicyPage from "./pages/RefundPolicyPage";
import CookiePolicyPage from "./pages/CookiePolicyPage";

import AdminPage from "./pages/AdminPage";
import TourDetailsPage from "./pages/TourDetailsPage";

import { useCMS } from "./CMSContext";
import CMSAdminBar from "./components/CMSAdminBar";
import AdminLoginModal from "./components/AdminLoginModal";
import TourEditorModal from "./components/TourEditorModal";
import SiteConfigModal from "./components/SiteConfigModal";
import AdminBookingsModal from "./components/AdminBookingsModal";
import GlobalConfirmModal from "./components/GlobalConfirmModal";
import CookieConsent from "./components/CookieConsent";

function LanguageWrapper({ children }: { children: React.ReactNode }) {
  const { lang } = useParams<{ lang: string }>();
  const { i18n } = useTranslation();

  useEffect(() => {
    if (lang && ['tr', 'en'].includes(lang) && i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);

  // Handle invalid languages
  if (lang && !['tr', 'en'].includes(lang)) {
    return <Navigate to="/tr" replace />;
  }

  return <>{children}</>;
}

function AppContent() {
  const { t, currentLanguage } = useLanguage();
  const { formatPrice } = useCurrency();
  const { tours, bookings, addBooking } = useCMS();
  const navigate = useNavigate();
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  // Prevent right-click on images and logos
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'IMG' || target.tagName === 'svg' || target.closest('svg'))) {
        e.preventDefault();
      }
    };

    const handleDragStart = (e: DragEvent) => {
      const target = e.target as HTMLElement;
      if (target && target.tagName === 'IMG') {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('dragstart', handleDragStart);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('dragstart', handleDragStart);
    };
  }, []);

  const [toasts, setToasts] = useState<{ id: string; message: string; type: "success" | "info" | "error" }[]>([]);

  // Search/Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [tourFilter, setTourFilter] = useState("All");

  // Sync category filter from URL query param if present
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get("category");
    if (cat === "yurt-ici" || cat === "yurt-disi") {
      setTourFilter(cat);
    } else if (cat === "all") {
      setTourFilter("All");
    }
  }, [location.search]);

  // Active items for booking modal
  const [bookingItem, setBookingItem] = useState<Tour | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Helpers
  const uniqueDestinations = Array.from(
    new Set([
      ...tours.map((t) => t.location),
      ...tours.map((t) => t.title),
    ].filter(Boolean))
  );

  const addToast = (message: string, type: "success" | "info" | "error" = "success") => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const handleGlobalSearch = (filters: { type: "tour"; destination: string; checkIn?: string; checkOut?: string }) => {
    setSearchQuery(filters.destination || "");
    navigate("destination");
    setTourFilter("All");
    
    if (filters.checkIn) {
      sessionStorage.setItem("preselected_checkIn", filters.checkIn);
    } else {
      sessionStorage.removeItem("preselected_checkIn");
    }
    
    if (filters.checkOut) {
      sessionStorage.setItem("preselected_checkOut", filters.checkOut);
    } else {
      sessionStorage.removeItem("preselected_checkOut");
    }

    if (filters.destination) {
      addToast(currentLanguage === 'en' ? `Filtering results for "${filters.destination}"` : `"${filters.destination}" konumu için sonuçlar filtreleniyor`, "info");
    } else if (filters.checkIn || filters.checkOut) {
      addToast(t("Tarih kriterlerine göre turlar filtreleniyor"), "info");
    } else {
      addToast(t("Tüm turlar listeleniyor"), "info");
    }
  };

  const triggerBooking = (item: Tour) => {
    setBookingItem(item);
    setIsBookingModalOpen(true);
  };

  const handleBookingConfirm = async (details: {
    checkIn: string;
    checkOut: string;
    guests: number | string;
    name: string;
    email: string;
    phone: string;
    totalPrice: number;
  }) => {
    if (!bookingItem) return;

    const newBooking: Booking = {
      id: `booking-${Date.now()}`,
      type: "tour",
      itemId: bookingItem.id,
      itemTitle: bookingItem.title,
      image: bookingItem.image,
      checkIn: details.checkIn,
      checkOut: details.checkOut,
      price: details.totalPrice,
      guests: details.guests,
      name: details.name,
      email: details.email,
      phone: details.phone,
      createdAt: new Date().toISOString(),
      status: "Pending",
    };

    try {
      addBooking(newBooking);
      // Let BookingModal display the confirmation pop-up modal on screen
    } catch (error) {
      console.error("Error adding booking: ", error);
      addToast(t("Rezervasyon oluşturulurken bir hata oluştu."), "error");
    }
  };

  // Filtered lists
  const filteredTours = tours.filter((tour) => {
    const searchLower = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !searchLower ||
      tour.title.toLowerCase().includes(searchLower) ||
      (tour.title_en && tour.title_en.toLowerCase().includes(searchLower)) ||
      tour.location.toLowerCase().includes(searchLower) ||
      (tour.location_en && tour.location_en.toLowerCase().includes(searchLower));

    let matchesFilter = true;
    if (tourFilter === "All" || tourFilter === "Tümü") {
      matchesFilter = true;
    } else if (tourFilter === "yurt-ici") {
      matchesFilter =
        tour.category === "yurt-ici" ||
        (!tour.category &&
          !tour.location.toLowerCase().includes("balkan") &&
          !tour.location.toLowerCase().includes("makedonya") &&
          !tour.location.toLowerCase().includes("gürcistan") &&
          !tour.location.toLowerCase().includes("italya"));
    } else if (tourFilter === "yurt-disi") {
      matchesFilter =
        tour.category === "yurt-disi" ||
        (tour.location &&
          (tour.location.toLowerCase().includes("balkan") ||
            tour.location.toLowerCase().includes("makedonya") ||
            tour.location.toLowerCase().includes("gürcistan") ||
            tour.location.toLowerCase().includes("italya")));
    } else {
      matchesFilter = tour.tag === tourFilter;
    }

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col selection:bg-orange-500 selection:text-white">
      <SplashScreen />

      {/* Live Admin CMS Toolbar */}
      <CMSAdminBar onShowToast={addToast} />

      {/* Toast Notifications */}
      <div className="fixed top-24 right-6 z-[100] space-y-3 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`p-4 rounded-xl shadow-lg border text-sm font-semibold flex items-center space-x-3 pointer-events-auto animate-bounce-in bg-white max-w-sm ${
              toast.type === "success"
                ? "border-green-200 text-green-800 shadow-green-100/50"
                : "border-blue-200 text-blue-800 shadow-blue-100/50"
            }`}
          >
            <div className={`p-1.5 rounded-full ${toast.type === "success" ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"}`}>
              <CheckCircle className="h-4 w-4" />
            </div>
            <span>{toast.message}</span>
          </div>
        ))}
      </div>

      {/* Header & Navigation */}
      <Navbar bookingCount={bookings.length} />

      {/* Primary App Views */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage onSearch={handleGlobalSearch} setSearchQuery={setSearchQuery} setTourFilter={setTourFilter} destinations={uniqueDestinations} tours={tours} />} />
          <Route path="destination" element={
            <ToursSection
              filteredTours={filteredTours}
              tourFilter={tourFilter}
              setTourFilter={setTourFilter}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              destinations={uniqueDestinations}
              tours={tours}
              onSearch={handleGlobalSearch}
              onBook={triggerBooking}
              onSelect={(tour) => navigate(`/${location.pathname.split('/')[1] || 'tr'}/tour/${tour.id}`)}
            />
          } />
          <Route path="tour/:id" element={<TourDetailsPage tours={tours} onBook={triggerBooking} />} />
          <Route path="about" element={<AboutSection />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="admin" element={<AdminPage />} />
          <Route path="faq" element={<FAQPage />} />
          <Route path="terms" element={<TermsPage />} />
          <Route path="privacy" element={<PrivacyPage />} />
          <Route path="refund" element={<RefundPolicyPage />} />
          <Route path="cookie-policy" element={<CookiePolicyPage />} />
        </Routes>
      </main>

      {/* SECURE BOOKING MODAL */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => {
          setIsBookingModalOpen(false);
          setBookingItem(null);
        }}
        item={bookingItem}
        type="tour"
        onConfirm={handleBookingConfirm}
      />

      {/* CMS Live Interactive Modals */}
      <AdminLoginModal />
      <TourEditorModal />
      <SiteConfigModal />
      <AdminBookingsModal />
      <GlobalConfirmModal />

      {/* Cookie Consent Banner */}
      <CookieConsent />

      {/* Floating Social Buttons */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-3">
        <a
          href="https://www.instagram.com/cesurakguntravelagency/"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 text-white p-3.5 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center"
          title="Instagram"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
          </svg>
        </a>
        <a
          href="https://wa.me/905449508485"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-500 text-white p-3.5 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center"
          title="WhatsApp"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
          </svg>
        </a>
      </div>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route
        path="/:lang/*"
        element={
          <LanguageWrapper>
            <AppContent />
          </LanguageWrapper>
        }
      />
      <Route path="*" element={<Navigate to="/tr" replace />} />
    </Routes>
  );
}

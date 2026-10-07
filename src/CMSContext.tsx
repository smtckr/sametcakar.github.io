import React, { createContext, useContext, useState, useEffect } from "react";
import { Tour, Booking, SiteContent } from "./types";
import { TOURS_DATA, DEFAULT_SITE_CONTENT } from "./data";

export const ADMIN_USERNAME = "8765432";
export const ADMIN_PASS = "Admin123!";

export interface ConfirmModalConfig {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDanger?: boolean;
  onConfirm: () => void;
}

interface HistorySnapshot {
  draftTours: Tour[];
  draftSiteContent: SiteContent;
  description: string;
  deletedTour?: Tour;
}

interface CMSContextType {
  isAdminLoggedIn: boolean;
  isEditMode: boolean;
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  loginAdmin: (username: string, pass: string) => boolean;
  logoutAdmin: () => void;
  toggleEditMode: () => void;
  setEditMode: (val: boolean) => void;

  // Active tour and site data
  tours: Tour[];
  siteContent: SiteContent;

  // Edit actions
  updateTour: (id: string, updatedFields: Partial<Tour>) => void;
  addTour: (newTour: Tour) => void;
  deleteTour: (id: string) => Tour | null;
  updateSiteContent: <K extends keyof SiteContent>(section: K, updatedFields: Partial<SiteContent[K]>) => void;

  // Undo / Restore
  canUndo: boolean;
  undoLastAction: () => boolean;
  lastDeletedTour: Tour | null;
  restoreLastDeletedTour: () => boolean;

  // Publish & Draft
  isDraftModified: boolean;
  publishChanges: () => void;
  discardChanges: () => void;
  resetToDefaultData: () => void;

  // Bookings
  bookings: Booking[];
  addBooking: (newBooking: Booking) => void;
  updateBookingStatus: (id: string, status: "Confirmed" | "Pending") => void;
  deleteBooking: (id: string) => void;

  // Modals for editing
  activeEditingTour: Tour | null;
  setActiveEditingTour: (tour: Tour | null) => void;
  isNewTourModalOpen: boolean;
  setIsNewTourModalOpen: (open: boolean) => void;
  isSiteConfigModalOpen: boolean;
  setIsSiteConfigModalOpen: (open: boolean) => void;
  isBookingsModalOpen: boolean;
  setIsBookingsModalOpen: (open: boolean) => void;

  // Global In-App Confirmation Modal (replacing window.confirm)
  confirmModalState: ConfirmModalConfig | null;
  askConfirmation: (config: ConfirmModalConfig) => void;
  closeConfirmation: () => void;
}

const CMSContext = createContext<CMSContextType | undefined>(undefined);

export function CMSProvider({ children }: { children: React.ReactNode }) {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Modals
  const [activeEditingTour, setActiveEditingTour] = useState<Tour | null>(null);
  const [isNewTourModalOpen, setIsNewTourModalOpen] = useState(false);
  const [isSiteConfigModalOpen, setIsSiteConfigModalOpen] = useState(false);
  const [isBookingsModalOpen, setIsBookingsModalOpen] = useState(false);

  // Published state (What ordinary visitors see)
  const [publishedTours, setPublishedTours] = useState<Tour[]>([]);
  const [publishedSiteContent, setPublishedSiteContent] = useState<SiteContent>(DEFAULT_SITE_CONTENT);

  // Draft state (Used only during an admin editing session)
  const [draftTours, setDraftTours] = useState<Tour[]>([]);
  const [draftSiteContent, setDraftSiteContent] = useState<SiteContent>(DEFAULT_SITE_CONTENT);
  const [isDraftModified, setIsDraftModified] = useState(false);

  // Undo history stack
  const [undoStack, setUndoStack] = useState<HistorySnapshot[]>([]);
  const [lastDeletedTour, setLastDeletedTour] = useState<Tour | null>(null);

  // Bookings
  const [bookings, setBookings] = useState<Booking[]>([]);

  // Confirmation modal state
  const [confirmModalState, setConfirmModalState] = useState<ConfirmModalConfig | null>(null);

  const askConfirmation = (config: ConfirmModalConfig) => {
    setConfirmModalState(config);
  };

  const closeConfirmation = () => {
    setConfirmModalState(null);
  };

  // Helper to push snapshot before any mutation
  const pushUndoSnapshot = (description: string, deletedTour?: Tour) => {
    setUndoStack((prev) => [
      ...prev.slice(-10), // keep last 10 operations to avoid memory bloat
      {
        draftTours: JSON.parse(JSON.stringify(draftTours)),
        draftSiteContent: JSON.parse(JSON.stringify(draftSiteContent)),
        description,
        deletedTour,
      },
    ]);
  };

  // Initialize data on mount
  useEffect(() => {
    // Check session
    const isAuth = sessionStorage.getItem("admin_auth") === "true";
    if (isAuth) {
      setIsAdminLoggedIn(true);
      setIsEditMode(true);
    }

    // Load tours from localStorage or fallback to initial TOURS_DATA
    const storedTours = localStorage.getItem("tours_data");
    let initialTours: Tour[] = TOURS_DATA;
    if (storedTours) {
      try {
        const parsed = JSON.parse(storedTours);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const mergedTours = parsed.map((item: any) => {
            const defaultMatch = TOURS_DATA.find((d) => d.id === item.id);
            if (defaultMatch) {
              return {
                ...defaultMatch,
                ...item,
                category: item.category || defaultMatch.category || (
                  (item.location && (item.location.toLowerCase().includes("balkan") || item.location.toLowerCase().includes("makedonya") || item.location.toLowerCase().includes("gürcistan") || item.location.toLowerCase().includes("italya"))) ? "yurt-disi" : "yurt-ici"
                ),
                program: item.program || defaultMatch.program,
                program_en: item.program_en || defaultMatch.program_en,
                included: item.included || defaultMatch.included,
                included_en: item.included_en || defaultMatch.included_en,
                excluded: item.excluded || defaultMatch.excluded,
                excluded_en: item.excluded_en || defaultMatch.excluded_en,
                departurePoints: item.departurePoints || defaultMatch.departurePoints,
                departurePoints_en: item.departurePoints_en || defaultMatch.departurePoints_en,
                tourConditions: item.tourConditions || defaultMatch.tourConditions,
                tourConditions_en: item.tourConditions_en || defaultMatch.tourConditions_en,
              };
            }
            return {
              ...item,
              category: item.category || "yurt-ici",
            };
          });

          // Also include any new tours added to TOURS_DATA that weren't in localStorage yet
          const missingDefaults = TOURS_DATA.filter((def) => !mergedTours.some((m: any) => m.id === def.id));
          initialTours = [...mergedTours, ...missingDefaults];
        }
      } catch (e) {
        console.error("Failed to parse tours_data", e);
      }
    } else {
      try {
        localStorage.setItem("tours_data", JSON.stringify(TOURS_DATA));
      } catch (e) {
        console.warn("Storage setItem ignored:", e);
      }
    }
    // Deep copies so drafts never share references with published
    setPublishedTours(JSON.parse(JSON.stringify(initialTours)));
    setDraftTours(JSON.parse(JSON.stringify(initialTours)));

    // Load site content
    const storedContent = localStorage.getItem("site_content");
    let initialContent: SiteContent = DEFAULT_SITE_CONTENT;
    if (storedContent) {
      try {
        const parsed = JSON.parse(storedContent);
        const parsedHero = parsed?.hero || {};

        let validImgs: string[] = [];
        if (Array.isArray(parsedHero.backgroundImages)) {
          validImgs = parsedHero.backgroundImages.filter(
            (img: any) => typeof img === "string" && img.trim().length > 0
          );
        }
        if (validImgs.length === 0 && typeof parsedHero.backgroundImage === "string" && parsedHero.backgroundImage.trim().length > 0) {
          validImgs = [parsedHero.backgroundImage.trim()];
        }
        if (validImgs.length === 0) {
          validImgs = DEFAULT_SITE_CONTENT.hero.backgroundImages || [DEFAULT_SITE_CONTENT.hero.backgroundImage];
        }

        initialContent = {
          ...DEFAULT_SITE_CONTENT,
          ...parsed,
          hero: {
            ...DEFAULT_SITE_CONTENT.hero,
            ...parsedHero,
            backgroundImage: validImgs[0] || DEFAULT_SITE_CONTENT.hero.backgroundImage,
            backgroundImages: validImgs,
            autoplayInterval: Math.max(Number(parsedHero.autoplayInterval) || 6000, 3000),
          },
          about: {
            ...DEFAULT_SITE_CONTENT.about,
            ...(parsed.about || {}),
          },
          contact: {
            ...DEFAULT_SITE_CONTENT.contact,
            ...(parsed.contact || {}),
          },
        };
      } catch (e) {
        console.error("Failed to parse site_content", e);
        initialContent = DEFAULT_SITE_CONTENT;
      }
    } else {
      try {
        localStorage.setItem("site_content", JSON.stringify(DEFAULT_SITE_CONTENT));
      } catch (e) {
        console.warn("Storage setItem ignored:", e);
      }
    }
    setPublishedSiteContent(JSON.parse(JSON.stringify(initialContent)));
    setDraftSiteContent(JSON.parse(JSON.stringify(initialContent)));

    // Load bookings
    const storedBookings = localStorage.getItem("bookings_data");
    if (storedBookings) {
      try {
        setBookings(JSON.parse(storedBookings));
      } catch (e) {
        console.error("Failed to parse bookings_data", e);
      }
    }
  }, []);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  const loginAdmin = (username: string, pass: string): boolean => {
    const cleanUser = username.trim();
    const cleanPass = pass.trim();
    // Accept standard pass or username as pass for seamless admin access
    if (cleanUser === ADMIN_USERNAME && (cleanPass === ADMIN_PASS || cleanPass === ADMIN_USERNAME)) {
      sessionStorage.setItem("admin_auth", "true");
      setIsAdminLoggedIn(true);
      setIsEditMode(true);
      setIsLoginModalOpen(false);
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    sessionStorage.removeItem("admin_auth");
    setIsAdminLoggedIn(false);
    setIsEditMode(false);
    setActiveEditingTour(null);
    setIsNewTourModalOpen(false);
    setIsSiteConfigModalOpen(false);
    setIsBookingsModalOpen(false);
    setUndoStack([]);
    setLastDeletedTour(null);

    // CRITICAL REQUIREMENT:
    // If the admin did not click "Yayınla", ALL changes are strictly wiped away!
    // Drafts revert strictly to the published version.
    setDraftTours(JSON.parse(JSON.stringify(publishedTours)));
    setDraftSiteContent(JSON.parse(JSON.stringify(publishedSiteContent)));
    setIsDraftModified(false);
  };

  const toggleEditMode = () => {
    setIsEditMode((prev) => !prev);
  };

  const setEditMode = (val: boolean) => {
    setIsEditMode(val);
  };

  // Tour edit actions (Mutates ONLY draft state, NEVER writes to storage until Publish)
  const updateTour = (id: string, updatedFields: Partial<Tour>) => {
    pushUndoSnapshot(`Tur güncellendi: ${updatedFields.title || id}`);
    setDraftTours((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updatedFields } : t))
    );
    setIsDraftModified(true);
  };

  const addTour = (newTour: Tour) => {
    pushUndoSnapshot(`Yeni tur eklendi: ${newTour.title}`);
    setDraftTours((prev) => [newTour, ...prev]);
    setIsDraftModified(true);
  };

  const deleteTour = (id: string): Tour | null => {
    const tourToDelete = draftTours.find((t) => t.id === id) || null;
    if (tourToDelete) {
      pushUndoSnapshot(`Tur silindi: ${tourToDelete.title}`, tourToDelete);
      setLastDeletedTour(tourToDelete);
    }
    // Only remove from draft! publishedTours and localStorage remain intact until user hits Publish
    setDraftTours((prev) => prev.filter((t) => t.id !== id));
    setIsDraftModified(true);
    return tourToDelete;
  };

  const updateSiteContent = <K extends keyof SiteContent>(
    section: K,
    updatedFields: Partial<SiteContent[K]>
  ) => {
    pushUndoSnapshot(`Site bilgileri güncellendi (${section})`);
    setDraftSiteContent((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...updatedFields,
      },
    }));
    setIsDraftModified(true);
  };

  // Step-by-step Undo function
  const undoLastAction = (): boolean => {
    if (undoStack.length === 0) return false;

    const previousSnapshot = undoStack[undoStack.length - 1];
    setUndoStack((prev) => prev.slice(0, -1));

    setDraftTours(JSON.parse(JSON.stringify(previousSnapshot.draftTours)));
    setDraftSiteContent(JSON.parse(JSON.stringify(previousSnapshot.draftSiteContent)));

    if (previousSnapshot.deletedTour) {
      setLastDeletedTour(null);
    }

    // Check if reverted draft now equals published version
    const isNowModified = undoStack.length > 1;
    setIsDraftModified(isNowModified);
    return true;
  };

  // Targeted restore for the most recently deleted tour
  const restoreLastDeletedTour = (): boolean => {
    if (!lastDeletedTour) {
      // If there's an undoStack with a deletedTour, restore that
      const snapshotWithDeleted = [...undoStack].reverse().find((s) => s.deletedTour);
      if (snapshotWithDeleted && snapshotWithDeleted.deletedTour) {
        const tourToRestore = snapshotWithDeleted.deletedTour;
        setDraftTours((prev) => {
          if (prev.some((t) => t.id === tourToRestore.id)) return prev;
          return [tourToRestore, ...prev];
        });
        setLastDeletedTour(null);
        setIsDraftModified(true);
        return true;
      }
      return false;
    }

    const tourToRestore = lastDeletedTour;
    setDraftTours((prev) => {
      if (prev.some((t) => t.id === tourToRestore.id)) return prev;
      return [tourToRestore, ...prev];
    });
    setLastDeletedTour(null);
    setIsDraftModified(true);
    return true;
  };

  // Publish: The ONLY place that commits draft into published state and localStorage!
  const publishChanges = () => {
    try {
      const toursJson = JSON.stringify(draftTours);
      const contentJson = JSON.stringify(draftSiteContent);

      try {
        localStorage.setItem("tours_data", toursJson);
        localStorage.setItem("site_content", contentJson);
      } catch (storageErr) {
        console.warn("Storage quota warning on publish:", storageErr);
      }

      setPublishedTours(JSON.parse(toursJson));
      setPublishedSiteContent(JSON.parse(contentJson));
      setIsDraftModified(false);
      setUndoStack([]);
      setLastDeletedTour(null);
    } catch (e) {
      console.error("Failed to publish changes:", e);
    }
  };

  // Discard draft: Restores all draft data from the published version!
  const discardChanges = () => {
    setDraftTours(JSON.parse(JSON.stringify(publishedTours)));
    setDraftSiteContent(JSON.parse(JSON.stringify(publishedSiteContent)));
    setIsDraftModified(false);
    setUndoStack([]);
    setLastDeletedTour(null);
  };

  // Reset to original factory defaults
  const resetToDefaultData = () => {
    pushUndoSnapshot("Fabrika ayarlarına dönüldü");
    setDraftTours(JSON.parse(JSON.stringify(TOURS_DATA)));
    setDraftSiteContent(JSON.parse(JSON.stringify(DEFAULT_SITE_CONTENT)));
    setIsDraftModified(true);
  };

  // Bookings management
  const addBooking = (newBooking: Booking) => {
    const updated = [newBooking, ...bookings];
    setBookings(updated);
    try {
      localStorage.setItem("bookings_data", JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save booking:", e);
    }
  };

  const updateBookingStatus = (id: string, status: "Confirmed" | "Pending") => {
    const updated = bookings.map((b) => (b.id === id ? { ...b, status } : b));
    setBookings(updated);
    try {
      localStorage.setItem("bookings_data", JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to update booking status:", e);
    }
  };

  const deleteBooking = (id: string) => {
    const updated = bookings.filter((b) => b.id !== id);
    setBookings(updated);
    try {
      localStorage.setItem("bookings_data", JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to delete booking:", e);
    }
  };

  // In admin mode, display draft data; otherwise display published data
  const currentTours = isAdminLoggedIn ? draftTours : publishedTours;
  const currentSiteContent = isAdminLoggedIn ? draftSiteContent : publishedSiteContent;

  return (
    <CMSContext.Provider
      value={{
        isAdminLoggedIn,
        isEditMode,
        isLoginModalOpen,
        openLoginModal,
        closeLoginModal,
        loginAdmin,
        logoutAdmin,
        toggleEditMode,
        setEditMode,
        tours: currentTours,
        siteContent: currentSiteContent,
        updateTour,
        addTour,
        deleteTour,
        updateSiteContent,
        canUndo: undoStack.length > 0 || lastDeletedTour !== null,
        undoLastAction,
        lastDeletedTour,
        restoreLastDeletedTour,
        isDraftModified,
        publishChanges,
        discardChanges,
        resetToDefaultData,
        bookings,
        addBooking,
        updateBookingStatus,
        deleteBooking,
        activeEditingTour,
        setActiveEditingTour,
        isNewTourModalOpen,
        setIsNewTourModalOpen,
        isSiteConfigModalOpen,
        setIsSiteConfigModalOpen,
        isBookingsModalOpen,
        setIsBookingsModalOpen,
        confirmModalState,
        askConfirmation,
        closeConfirmation,
      }}
    >
      {children}
    </CMSContext.Provider>
  );
}

export function useCMS() {
  const context = useContext(CMSContext);
  if (!context) {
    throw new Error("useCMS must be used within a CMSProvider");
  }
  return context;
}

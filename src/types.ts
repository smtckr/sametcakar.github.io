export interface Tour {
  id: string;
  title: string;
  title_en?: string;
  image: string;
  images?: string[];
  price: number;
  duration: string;
  duration_en?: string;
  location: string;
  location_en?: string;
  category?: "yurt-ici" | "yurt-disi";
  tag: string;
  tag_en?: string;
  description: string;
  description_en?: string;

  // Tabbed sections (TR & EN):
  program?: string; // Tur Programı
  program_en?: string;
  included?: string; // Dahil Olanlar
  included_en?: string;
  excluded?: string; // Hariç Olanlar
  excluded_en?: string;
  departurePoints?: string; // Kalkış Noktaları
  departurePoints_en?: string;
  tourConditions?: string; // Tur Koşulları
  tourConditions_en?: string;
}

export interface Hotel {
  id: string;
  title: string;
  image: string;
  price: number;
  location: string;
  stars: number;
  showers: number;
  beds: number;
  tag: string;
  description: string;
}

export interface Comment {
  id: string;
  name: string;
  email: string;
  date: string;
  content: string;
}

export interface BlogPost {
  id: string;
  title: string;
  image: string;
  date: string;
  author: string;
  content: string;
  summary: string;
  category: string;
  comments: Comment[];
}

export interface Booking {
  id: string;
  type: "tour" | "hotel";
  itemId: string;
  itemTitle: string;
  image: string;
  checkIn: string;
  checkOut: string;
  price: number;
  guests: number | string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  status: "Confirmed" | "Pending";
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
}

export interface SiteContent {
  hero: {
    badge: string;
    badge_en?: string;
    title: string;
    title_en?: string;
    subtitle: string;
    subtitle_en?: string;
    backgroundImage: string;
    backgroundImages?: string[];
    autoplayInterval?: number;
  };
  about: {
    badge: string;
    badge_en?: string;
    title: string;
    title_en?: string;
    paragraph1: string;
    paragraph1_en?: string;
    paragraph2: string;
    paragraph2_en?: string;
    happyTravelers: string;
    experienceYears: string;
    image: string;
  };
  contact: {
    address: string;
    address_en?: string;
    phone1: string;
    phone2: string;
    phone3: string;
    email: string;
    tursabNo: string;
    companyName: string;
  };
}

//  export interface Hotel {
//   id: string;
//   slug: string;
//   title: string;
//   description: string;
//   guestCount: number;
//   bedroomCount: number;
//   bathroomCount: number;
//   amenities: string[];
//   hostInfo: string;
//   address: string;
//   latitude: number;
//   longitude: number;
//   images: string[];
//   rooms: Room[];
// }

//  export interface Room {
//   hotelSlug: string;
//   roomSlug: string;
//   roomImage: string;
//   roomTitle: string;
//   bedroomCount: number;
// }

// models/hotel.ts

export interface Hotel {
  id: string;
  slug: string;
  title: string;
  description: string;
  guestCount: number;
  bedroomCount: number;
  bathroomCount: number;
  amenities: string[];
  hostInfo: string;
  address: string;
  latitude: number;
  longitude: number;
  images: string[];  // File paths of the uploaded images (strings)
  rooms: Room[];  // Array of Room objects inside the Hotel interface
}


  export interface Room {
    hotelSlug: string;
    roomSlug: string;
    roomImage: string;  // File path of the uploaded room image (string)
    roomTitle: string;
    bedroomCount: number;
  }


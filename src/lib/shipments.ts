export type ShipmentStatus =
  | "created"
  | "picked_up"
  | "in_transit"
  | "at_facility"
  | "out_for_delivery"
  | "delivered"
  | "delayed";

export type TrackingEvent = {
  title: string;
  location: string;
  date: string;
  time?: string;
  completed: boolean;
  current?: boolean;
};

export type Shipment = {
  trackingNumber: string;
  status: ShipmentStatus;
  statusLabel: string;
  shipmentType: string;
  weight: string;
  origin: string;
  destination: string;
  currentLocation: string;
  estimatedDelivery: string;
  progress: number;
  events: TrackingEvent[];
};

export const shipments: Shipment[] = [
  {
    trackingNumber: "VH-8492-0183",
    status: "in_transit",
    statusLabel: "IN TRANSIT",
    shipmentType: "Secure Cargo",
    weight: "42.5 kg",
    origin: "New York, NY",
    destination: "Los Angeles, CA",
    currentLocation: "En route to Los Angeles, CA",
    estimatedDelivery: "Aug 18, 2026",
    progress: 64,

    events: [
      {
        title: "Shipment created",
        location: "New York, NY",
        date: "Aug 14, 2026",
        time: "09:42 AM",
        completed: true,
      },
      {
        title: "Shipment picked up",
        location: "New York, NY",
        date: "Aug 14, 2026",
        time: "02:18 PM",
        completed: true,
      },
      {
        title: "In transit",
        location: "En route to Los Angeles, CA",
        date: "Aug 15, 2026",
        time: "08:35 AM",
        completed: true,
        current: true,
      },
      {
        title: "Out for delivery",
        location: "Los Angeles, CA",
        date: "Estimated Aug 18",
        completed: false,
      },
      {
        title: "Delivered",
        location: "Los Angeles, CA",
        date: "Estimated Aug 18",
        completed: false,
      },
    ],
  },

  {
    trackingNumber: "VH-5721-4409",
    status: "delivered",
    statusLabel: "DELIVERED",
    shipmentType: "Secure Cargo",
    weight: "18.2 kg",
    origin: "Chicago, IL",
    destination: "Dallas, TX",
    currentLocation: "Dallas, TX",
    estimatedDelivery: "Aug 13, 2026",
    progress: 100,

    events: [
      {
        title: "Shipment created",
        location: "Chicago, IL",
        date: "Aug 10, 2026",
        time: "08:15 AM",
        completed: true,
      },
      {
        title: "Shipment picked up",
        location: "Chicago, IL",
        date: "Aug 10, 2026",
        time: "11:40 AM",
        completed: true,
      },
      {
        title: "In transit",
        location: "En route to Dallas, TX",
        date: "Aug 11, 2026",
        time: "06:20 AM",
        completed: true,
      },
      {
        title: "Out for delivery",
        location: "Dallas, TX",
        date: "Aug 13, 2026",
        time: "07:35 AM",
        completed: true,
      },
      {
        title: "Delivered",
        location: "Dallas, TX",
        date: "Aug 13, 2026",
        time: "02:16 PM",
        completed: true,
        current: true,
      },
    ],
  },

  {
    trackingNumber: "VH-3168-7724",
    status: "out_for_delivery",
    statusLabel: "OUT FOR DELIVERY",
    shipmentType: "Priority Cargo",
    weight: "27.8 kg",
    origin: "Miami, FL",
    destination: "Atlanta, GA",
    currentLocation: "Atlanta, GA",
    estimatedDelivery: "Aug 14, 2026",
    progress: 88,

    events: [
      {
        title: "Shipment created",
        location: "Miami, FL",
        date: "Aug 11, 2026",
        time: "10:05 AM",
        completed: true,
      },
      {
        title: "Shipment picked up",
        location: "Miami, FL",
        date: "Aug 11, 2026",
        time: "03:42 PM",
        completed: true,
      },
      {
        title: "In transit",
        location: "En route to Atlanta, GA",
        date: "Aug 12, 2026",
        time: "08:10 AM",
        completed: true,
      },
      {
        title: "Out for delivery",
        location: "Atlanta, GA",
        date: "Aug 14, 2026",
        time: "07:20 AM",
        completed: true,
        current: true,
      },
      {
        title: "Delivered",
        location: "Atlanta, GA",
        date: "Estimated Aug 14",
        completed: false,
      },
    ],
  },

  {
    trackingNumber: "VH-9045-2316",
    status: "at_facility",
    statusLabel: "AT FACILITY",
    shipmentType: "Secure Cargo",
    weight: "63.4 kg",
    origin: "Denver, CO",
    destination: "Phoenix, AZ",
    currentLocation: "Phoenix Distribution Facility",
    estimatedDelivery: "Aug 17, 2026",
    progress: 72,

    events: [
      {
        title: "Shipment created",
        location: "Denver, CO",
        date: "Aug 13, 2026",
        time: "09:10 AM",
        completed: true,
      },
      {
        title: "Shipment picked up",
        location: "Denver, CO",
        date: "Aug 13, 2026",
        time: "01:25 PM",
        completed: true,
      },
      {
        title: "In transit",
        location: "En route to Phoenix, AZ",
        date: "Aug 14, 2026",
        time: "06:45 AM",
        completed: true,
      },
      {
        title: "Arrived at facility",
        location: "Phoenix Distribution Facility",
        date: "Aug 14, 2026",
        time: "05:30 PM",
        completed: true,
        current: true,
      },
      {
        title: "Out for delivery",
        location: "Phoenix, AZ",
        date: "Estimated Aug 17",
        completed: false,
      },
      {
        title: "Delivered",
        location: "Phoenix, AZ",
        date: "Estimated Aug 17",
        completed: false,
      },
    ],
  },

  {
    trackingNumber: "VH-6813-5092",
    status: "delayed",
    statusLabel: "DELAYED",
    shipmentType: "Secure Cargo",
    weight: "35.7 kg",
    origin: "Seattle, WA",
    destination: "San Francisco, CA",
    currentLocation: "Oakland Regional Facility",
    estimatedDelivery: "Aug 19, 2026",
    progress: 58,

    events: [
      {
        title: "Shipment created",
        location: "Seattle, WA",
        date: "Aug 12, 2026",
        time: "08:30 AM",
        completed: true,
      },
      {
        title: "Shipment picked up",
        location: "Seattle, WA",
        date: "Aug 12, 2026",
        time: "12:15 PM",
        completed: true,
      },
      {
        title: "In transit",
        location: "En route to San Francisco, CA",
        date: "Aug 13, 2026",
        time: "07:05 AM",
        completed: true,
      },
      {
        title: "Shipment delayed",
        location: "Oakland Regional Facility",
        date: "Aug 14, 2026",
        time: "03:18 PM",
        completed: true,
        current: true,
      },
      {
        title: "Out for delivery",
        location: "San Francisco, CA",
        date: "Estimated Aug 19",
        completed: false,
      },
      {
        title: "Delivered",
        location: "San Francisco, CA",
        date: "Estimated Aug 19",
        completed: false,
      },
    ],
  },
];
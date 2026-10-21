export interface EventItem {
  id: string;
  name: string;
  time: string;
}

export interface DayItinerary {
  id: string;
  day: string;
  date: string;
  title: string;
  events: EventItem[];
}
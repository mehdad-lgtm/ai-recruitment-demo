import { ClientContainer } from "@/calendar/components/client-container";
import { CalendarProvider } from "@/calendar/contexts/calendar-context";
import type { IEvent, IUser, TEventColor } from "@/calendar/types";

const dummyUsers: IUser[] = [
  { id: "1", name: "Leonardo Ramos", picturePath: null },
  { id: "2", name: "Michael Doe", picturePath: null },
  { id: "3", name: "Alice Johnson", picturePath: null },
  { id: "4", name: "Robert Smith", picturePath: null },
];

// Generate more realistic demo events
function generateDemoEvents(): IEvent[] {
  const now = new Date();
  const colors: TEventColor[] = ["blue", "green", "red", "purple", "orange", "pink", "teal"];
  const eventTitles = [
    "Interview: John Doe",
    "Technical Screening",
    "HR Interview",
    "Team Meeting",
    "Available Slot",
    "Onboarding Session",
    "Performance Review",
    "Training Workshop",
    "Client Presentation",
    "Candidate Assessment",
  ];

  const events: IEvent[] = [];
  let eventId = 1;

  // Generate events for the current month
  for (let day = 1; day <= 28; day++) {
    const eventsForDay = Math.random() > 0.5 ? Math.floor(Math.random() * 3) + 1 : 0;
    
    for (let e = 0; e < eventsForDay; e++) {
      const startHour = Math.floor(Math.random() * 8) + 9; // 9 AM to 5 PM
      const duration = Math.floor(Math.random() * 2) + 1; // 1-2 hours
      const user = dummyUsers[Math.floor(Math.random() * dummyUsers.length)];
      const title = eventTitles[Math.floor(Math.random() * eventTitles.length)];
      const color = colors[Math.floor(Math.random() * colors.length)];

      const startDate = new Date(now.getFullYear(), now.getMonth(), day, startHour, 0);
      const endDate = new Date(now.getFullYear(), now.getMonth(), day, startHour + duration, 0);

      events.push({
        id: eventId++,
        title,
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        color,
        user,
      });
    }
  }

  // Add some events for today specifically
  const today = now.getDate();
  events.push(
    {
      id: eventId++,
      title: "Interview: Sarah Williams",
      description: "Technical interview for Senior Developer position",
      startDate: new Date(now.getFullYear(), now.getMonth(), today, 14, 0).toISOString(),
      endDate: new Date(now.getFullYear(), now.getMonth(), today, 15, 30).toISOString(),
      color: "blue",
      user: dummyUsers[0],
    },
    {
      id: eventId++,
      title: "Team Sync",
      description: "Weekly team synchronization meeting",
      startDate: new Date(now.getFullYear(), now.getMonth(), today, 16, 0).toISOString(),
      endDate: new Date(now.getFullYear(), now.getMonth(), today, 17, 0).toISOString(),
      color: "green",
      user: dummyUsers[1],
    },
    {
      id: eventId++,
      title: "Candidate Review",
      description: "Review applications for the Marketing Manager role",
      startDate: new Date(now.getFullYear(), now.getMonth(), today, 10, 0).toISOString(),
      endDate: new Date(now.getFullYear(), now.getMonth(), today, 11, 0).toISOString(),
      color: "purple",
      user: dummyUsers[2],
    }
  );

  return events;
}

const dummyEvents = generateDemoEvents();

export default function CalendarPage() {
  return (
    <CalendarProvider 
      events={dummyEvents} 
      users={dummyUsers}
      initialView="month"
    >
      <ClientContainer />
    </CalendarProvider>
  );
}

export const sampleEvents = [
  { id: 1, name: "React Conference 2025", description: "The biggest React conference in the world. Join us for 3 days of talks, workshops, and networking.", banner: "https://placehold.co/600x300/1a202c/718096?text=React+Conf", status: "Upcoming" },
  { id: 2, name: "Tailwind CSS Workshop", description: "A deep dive into Tailwind CSS. Learn how to build beautiful, custom designs without leaving your HTML.", banner: "https://placehold.co/600x300/2d3748/a0aec0?text=Tailwind+Workshop", status: "Upcoming" },
  { id: 3, name: "State of JS 2024", description: "A look back at the trends and technologies that shaped the JavaScript ecosystem in 2024.", banner: "https://placehold.co/600x300/4a5568/e2e8f0?text=State+of+JS", status: "Expired" },
];

export const sampleAttendees = {
  1: Array.from({ length: 15 }, (_, i) => ({
    id: i + 1,
    name: ['Sam Culver', 'Will Reese', 'Elma Maldonado', 'John Downey', 'Angela Stevens', 'Jessica Lee', 'Ralph Foster', 'Clara Tucker', 'Larry Olson', 'Jane Doe', 'Peter Jones', 'Mary Smith', 'Kevin White', 'Sarah Green', 'Tom Brown'][i % 15],
    email: ['guest@urs...', 'willreese', 'elma.shor...', 'john.swney', 'angela.ste...', 'jessica.lee', 'ralph.toster', 'clara.tucker', 'larry.olson', 'jane.doe', 'peter.jones', 'mary.smith', 'kevin.white', 'sarah.green', 'tom.brown'][i % 15] + '@example.com',
    registered: Math.random() > 0.2,
    cancelled: i % 5 === 0,
    checkedIn: Math.random() > 0.5 && i % 5 !== 0,
    level: ['Beginner', 'Beginner', 'Beginner', 'Advanced', 'Beginner', 'Beginner', 'Beginner', 'Beginner', 'Advanced', 'Intermediate', 'Beginner', 'Intermediate', 'Advanced', 'Beginner', 'Intermediate'][i % 15],
    interests: ['Business', 'Design', 'Intermediate', 'Lewel', 'Development', 'Design', 'Development', 'Development', 'Lewel', 'UI/UX', 'Performance', 'Design', 'Tooling', 'Business', 'State Management'][i % 15],
  })),
  2: Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    name: `Bob ${i + 1}`,
    email: `bob${i+1}@example.com`,
    registered: Math.random() > 0.1,
    cancelled: i % 4 === 0,
    checkedIn: Math.random() > 0.6 && i % 4 !== 0,
    level: ['Beginner', 'Intermediate', 'Advanced'][i % 3],
    interests: ['Design Systems', 'Utility-First', 'JIT Compilation'][i % 3],
  })),
  3: Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    name: `Charlie ${i + 1}`,
    email: `charlie${i+1}@example.com`,
    registered: true,
    cancelled: i % 6 === 0,
    checkedIn: true,
    level: ['Intermediate', 'Advanced', 'Beginner'][i % 3],
    interests: ['Ecosystem', 'Frameworks', 'Tooling'][i % 3],
  })),
};
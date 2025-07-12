import { Question, User } from '@/types';

export const mockUsers: User[] = [
  {
    id: '1',
    username: 'alice_dev',
    email: 'alice@example.com',
    role: 'user',
    reputation: 1250,
    joinedAt: new Date('2023-01-15'),
  },
  {
    id: '2',
    username: 'bob_coder',
    email: 'bob@example.com',
    role: 'user',
    reputation: 890,
    joinedAt: new Date('2023-03-20'),
  },
  {
    id: '3',
    username: 'charlie_admin',
    email: 'charlie@example.com',
    role: 'admin',
    reputation: 3450,
    joinedAt: new Date('2022-11-10'),
  },
];

export const mockQuestions: Question[] = [
  {
    id: '1',
    title: 'How to handle async/await in React components properly?',
    description: `<p>I'm having trouble understanding the best practices for handling asynchronous operations in React components. Specifically, I want to know:</p>
    <ul>
      <li>How to properly use async/await with useEffect</li>
      <li>Error handling strategies</li>
      <li>Cleanup procedures</li>
    </ul>
    <p>Here's what I've tried so far...</p>`,
    tags: ['React', 'JavaScript', 'Async'],
    authorId: '1',
    author: mockUsers[0],
    createdAt: new Date('2024-01-10T10:30:00Z'),
    votes: 15,
    answers: [
      {
        id: 'a1',
        content: `<p>Great question! Here's the proper way to handle async operations in React:</p>
        <ol>
          <li><strong>Never make useEffect async directly</strong></li>
          <li>Create an async function inside useEffect</li>
          <li>Handle cleanup with AbortController</li>
        </ol>
        <p>Here's an example...</p>`,
        authorId: '2',
        author: mockUsers[1],
        questionId: '1',
        createdAt: new Date('2024-01-10T11:15:00Z'),
        votes: 8,
        isAccepted: true,
      },
    ],
    acceptedAnswerId: 'a1',
  },
  {
    id: '2',
    title: 'TypeScript interface vs type alias - when to use which?',
    description: `<p>I'm confused about when to use <code>interface</code> vs <code>type</code> in TypeScript. They seem to do similar things but I've heard there are important differences.</p>
    <p>Can someone explain:</p>
    <ul>
      <li>Performance implications</li>
      <li>Extensibility differences</li>
      <li>Best practices</li>
    </ul>`,
    tags: ['TypeScript', 'JavaScript'],
    authorId: '2',
    author: mockUsers[1],
    createdAt: new Date('2024-01-09T14:20:00Z'),
    votes: 23,
    answers: [],
  },
  {
    id: '3',
    title: 'Next.js App Router vs Pages Router - migration guide?',
    description: `<p>I have a large Next.js application using the Pages Router and I'm considering migrating to the App Router. What are the main benefits and challenges?</p>
    <p><strong>Current setup:</strong></p>
    <ul>
      <li>Next.js 12 with Pages Router</li>
      <li>API routes for backend</li>
      <li>Dynamic routing</li>
      <li>SSR and SSG pages</li>
    </ul>
    <p>Is it worth the migration effort? 🤔</p>`,
    tags: ['Next.js', 'React', 'Migration'],
    authorId: '3',
    author: mockUsers[2],
    createdAt: new Date('2024-01-08T09:45:00Z'),
    votes: 7,
    answers: [
      {
        id: 'a2',
        content: `<p>The App Router brings several advantages:</p>
        <ul>
          <li>Better TypeScript support</li>
          <li>Improved performance with React Server Components</li>
          <li>More intuitive file-based routing</li>
        </ul>
        <p>However, migration can be complex. I'd recommend doing it incrementally.</p>`,
        authorId: '1',
        author: mockUsers[0],
        questionId: '3',
        createdAt: new Date('2024-01-08T10:30:00Z'),
        votes: 5,
        isAccepted: false,
      },
    ],
  },
  {
    id: '4',
    title: 'Best practices for CSS-in-JS vs Tailwind CSS?',
    description: `<p>I'm starting a new project and trying to decide between CSS-in-JS solutions (like styled-components or emotion) vs utility-first CSS (like Tailwind CSS).</p>
    <p><strong>Requirements:</strong></p>
    <ul>
      <li>Large team collaboration</li>
      <li>Design system consistency</li>
      <li>Performance optimization</li>
      <li>Developer experience</li>
    </ul>
    <p>What are your experiences with these approaches? Any performance benchmarks?</p>`,
    tags: ['CSS', 'Tailwind', 'JavaScript', 'Performance'],
    authorId: '1',
    author: mockUsers[0],
    createdAt: new Date('2024-01-07T16:00:00Z'),
    votes: 12,
    answers: [],
  },
  {
    id: '5',
    title: 'How to implement real-time notifications in a React app?',
    description: `<p>I need to implement a real-time notification system similar to what we see on social media platforms. Users should receive instant notifications when:</p>
    <ul>
      <li>Someone comments on their posts</li>
      <li>They receive a direct message</li>
      <li>Someone mentions them</li>
    </ul>
    <p>I'm considering WebSockets vs Server-Sent Events vs polling. What's the best approach for a React frontend with a Node.js backend?</p>
    <p>Also looking for tips on:</p>
    <ul>
      <li>Handling connection drops</li>
      <li>Scaling to multiple users</li>
      <li>Browser notification API integration</li>
    </ul>`,
    tags: ['React', 'WebSocket', 'Node.js', 'Real-time'],
    authorId: '2',
    author: mockUsers[1],
    createdAt: new Date('2024-01-06T13:30:00Z'),
    votes: 19,
    answers: [
      {
        id: 'a3',
        content: `<p>For real-time notifications, I'd recommend WebSockets with Socket.io. Here's why:</p>
        <ol>
          <li><strong>Bi-directional communication</strong> - Better than SSE for interactive features</li>
          <li><strong>Automatic fallbacks</strong> - Socket.io handles connection issues gracefully</li>
          <li><strong>Room-based messaging</strong> - Easy to implement user-specific notifications</li>
        </ol>
        <p>Here's a basic implementation example...</p>`,
        authorId: '3',
        author: mockUsers[2],
        questionId: '5',
        createdAt: new Date('2024-01-06T14:15:00Z'),
        votes: 12,
        isAccepted: false,
      },
    ],
  },
];
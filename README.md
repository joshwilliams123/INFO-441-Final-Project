# Project Description
## Who is our target audience?
Our application is designed for fans of professional sports and enjoy the challenge of assembling and managing their own team of sports players. We want to create an application where individuals can roleplay as a sports manager, and have a chance to win a championship on their own. These users can range from dedicated players who follow statistics and matches closely  to casual fans who want to compete with friends and family. Ultimately, we hope to create a community where different sports fans can engage with each other to share their love for sports. We hope to deepen their engagement with sports and organize a platform where memories can be created.

## Why does our audience want to use our application?
Our audience involves sports fans who enjoy immersing themselves in the world of sports beyond just watching games. They want to analyze player performance and make strategic decisions, and overall have control over a team that can bring home a championship. This platform is not only suited for fun, but it's also a way to put your sports intuition to the test. Users can build teams with their favorite players, and earn points when players perform well in real life. Our platform also offers a competitive edge, where players can compete with other users to see who will come out on top. Overall, not only offer a chance to enhance the sports experience, but also potential to play along with your favorite players.

## Why do we as developers want to build this application?
As developers, we are both sports fans and avid participants in fantasy leagues. We've experienced firsthand how fantasy sports can turn a casual interest into a passionate, engaging hobby. However, we also noticed how fragmented and outdated many existing fantasy platforms feel. With modern technologies and user expectations, there’s a huge opportunity to reimagine the fantasy sports experience with a real time, interactive platform. We want to create something that not only functions well but provides the opportunity for new experiences amongst both new and returning fantasy players. This project combines our love for sports with our passion for building engaging, data driven applications that connect users through shared experiences.

# Technical Description
## Architecture Diagram
<img width="606" alt="Screenshot 2025-05-09 at 10 11 15 PM" src="https://github.com/user-attachments/assets/523de6f5-3031-4bcc-a9b1-299e78abe1f9" />

## Data Flow
<img width="835" alt="Screenshot 2025-05-09 at 10 11 41 PM" src="https://github.com/user-attachments/assets/bdc3adc5-02b0-4528-b2eb-d2eb760e0ffb" />

Our application communicates primarily through a <b>REST API</b>. The client makes HTTP requests (e.g., GET, POST) to the Express.js server to handle user authentication, team management, and leaderboard retrieval. Since real-time updates are not a core requirement at this stage, we do not use WebSockets, though they could be added in the future for live score updates or chat functionality.

## Summary Table
| Priority | User | Description                                      | Technical Implementation                                                                 |
|----------|------|--------------------------------------------------|-------------------------------------------------------------------------------------------|
| P0       | User | I want to create an account and log in securely. | Use Express.js with bcrypt for password hashing and JWT for session handling.            |
| P0       | User | I want to draft and manage my team roster.       | POST endpoints /team/add and /team/drop will update PostgreSQL tables accordingly.       |
| P0       | User | I want to view my team stats and progress.       | GET /team/{userId} pulls from joined tables (players + team + scores).                   |
| P1       | User | I want to see a live leaderboard.                | GET /leaderboard will aggregate user scores and return a sorted list.                    |
| P1       | User | I want to browse all available players and their stats. | GET /players pulls from players table with live stat updates (manually or via cron). |
| P2       | User | I want to customize my team name and profile.    | PATCH request to /user/profile updates user metadata in database.                        |
| P2       | User | I want to chat or comment on a league discussion board. | Implement with websockets or polling to allow message threads to be stored/retrieved. |

## API Endpoints
| Method | Endpoint         | Purpose                                                    |
|--------|------------------|------------------------------------------------------------|
| POST   | /login           | Authenticate user and return session token                 |
| POST   | /signup          | Register new user                                          |
| GET    | /players         | Fetch list of available players with stats                 |
| POST   | /team/add        | Add a player to a team                                     |
| POST   | /team/drop       | Drop a player from a team                                  |
| GET    | /team/{userId}   | Receive user’s team (score, players, available space, etc) |
| POST   | /leaderboard     | Retrieve leaderboard with team scores                      |

## Database Schemas
- **Users**
  - User id (number)
  - Username (string)
  - Profile description (string)

- **Players**
  - Player id (number)
  - Name (string)
  - Position (string)
  - Team (string)
  - Recent game point totals (array of numbers)
  - Stats (array of numbers)

- **Teams**
  - Team id (number)
  - Leaderboard rank (number)
  - Name (string)
  - Players (array of strings)
  - Created_date (date)

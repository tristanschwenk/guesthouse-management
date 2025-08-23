# Guesthouse Management App

A web application for managing guesthouse rooms and bookings. This application allows property owners to manage room availability and allows clients to book rooms.

## Features

- Room configuration page for property owners
- Calendar page for each room to manage availability
- Booking page for clients
- Four date statuses: OPEN, CLOSE, OPEN_CLOSE, CLOSE_OPEN

## Technologies Used

- [Nuxt.js](https://nuxt.com/) - Vue.js framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [v-calendar](https://vcalendar.io/) - Calendar component for Vue.js

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/tristanschwenk/guesthouse-management.git
cd guesthouse-management
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Run the development server
```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:3000`

## Project Structure

- `assets/` - Static assets like CSS and images
- `components/` - Vue components
- `composables/` - Composable functions
- `layouts/` - Layout components
- `pages/` - Application pages
- `plugins/` - Vue plugins
- `server/` - Server-side code
- `types/` - TypeScript type definitions

## Date Status Explanation

- **OPEN**: Available date
- **CLOSE**: Booked date
- **OPEN_CLOSE**: Start of reservation (morning available, afternoon booked)
- **CLOSE_OPEN**: End of reservation (morning booked, afternoon available)

## License

This project is licensed under the MIT License.


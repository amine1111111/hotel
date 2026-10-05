backend/
├── .env
├── .gitignore
├── package.json
├── server.js
│
├── prisma/
│   ├── schema.prisma
│   ├── seed.js
│   ├── create-admin.js
│   └── migrations/
│
└── src/
    ├── app.js
    ├── config/
    │   └── env.js
    ├── controllers/
    │   ├── auth.controller.js
    │   ├── availability.controller.js
    │   ├── health.controller.js
    │   ├── reservations.controllers.js
    │   └── rooms.controller.js
    ├── db/
    │   └── prisma.js
    ├── middleware/
    │   ├── auth.middleware.js
    │   └── error.middleware.js
    ├── routes/
    │   ├── auth.routes.js
    │   ├── health.routes.js
    │   ├── reservations.routes.js
    │   └── rooms.routes.js
    ├── services/
    │   ├── email.services.js
    │   └── reservationCleanup.service.js
    ├── socket.js
    └── utils/
        └── dates.js
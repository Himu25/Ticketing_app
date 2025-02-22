# Ticketing Microservices Application

## Overview

This is a microservices-based ticketing platform where users can create and sell tickets, place orders, and process payments. The system includes authentication, ticket management, order management, expiration handling, and payment services. The architecture is built using Docker, Kubernetes, and NATS Streaming for event-driven communication between services.

## Tech Stack

- **Frontend:** Next.js (Client Service)
- **Backend:** Node.js, Express, MongoDB
- **Event Bus:** NATS Streaming
- **Containerization & Orchestration:** Docker, Kubernetes
- **Authentication:** JWT
- **Queue Handling:** Bull (Redis-based queue for expiration service)
- **Payments:** Stripe API

## Services Overview

### 1. Authentication Service

- Handles user registration, login, and authentication using JWT.
- Provides authentication middleware for other services.

### 2. Ticket Service

- Allows users to create and manage tickets.
- Listens for order-related events to update ticket availability.
- Publishes events when tickets are created or updated.

#### Ticket Schema:

```json
{
    "title": { "type": "String", "required": true },
    "price": { "type": "String", "required": true },
    "userID": { "type": "String", "required": true },
    "orderID": { "type": "String" }
}
```

### 3. Order Service

- Manages ticket orders, ensuring that a ticket can only be purchased once.
- Publishes order creation and cancellation events.
- Listens for ticket updates and payment confirmation.

#### Order Schema:

```json
{
    "userID": { "type": "String", "required": true },
    "status": { "type": "String", "required": true },
    "expiresAt": { "type": "Date" },
    "ticket": { "type": "mongoose.Schema.Types.ObjectId", "ref": "Ticket" }
}
```

### 4. Expiration Service

- Listens for order creation events and starts a countdown timer (5 minutes) for payment.
- Publishes an event when an order expires.

### 5. Payment Service

- Processes payments using Stripe.
- Listens for order expiration and order creation events.
- Publishes payment confirmation events.

#### Payment Schema:

```json
{
    "orderId": { "type": "String", "required": true },
    "stripeId": { "type": "String", "required": true }
}
```

## Event Flow

1. **Ticket Creation:** A user creates a ticket. The Ticket Service publishes a `ticket:created` event.
2. **Order Placement:** A user places an order. The Order Service publishes an `order:created` event.
3. **Order Expiration Countdown:** The Expiration Service listens for `order:created` events and starts a 5-minute countdown. It publishes an `expiration:completed` event upon timeout.
4. **Payment Handling:**
   - If a payment is made before expiration, the Payment Service publishes a `payment:created` event, and the Order Service marks the order as completed.
   - If no payment is made, the Order Service listens for `expiration:completed` and cancels the order, allowing the ticket to be resold.

## Running the Project

### Prerequisites

- Node.js
- Docker
- Kubernetes
- NATS Streaming Server
- Redis (for expiration queue)
- Stripe API Keys

### Steps

1. Clone the repository:
   ```sh
   git clone https://github.com/Himu25/ticketing-app.git
   cd ticketing-app
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start services using Docker:
   ```sh
   docker-compose up --build
   ```
4. Deploy to Kubernetes:
   ```sh
   kubectl apply -f infra/k8s/
   ```
5. Set environment variables:
   ```sh
   export JWT_KEY="your-secret"
   export STRIPE_KEY="your-stripe-secret"
   ```

## API Endpoints

### Authentication Service

- `POST /api/users/signup` – User signup
- `POST /api/users/signin` – User login

### Ticket Service

- `POST /api/tickets` – Create a ticket
- `GET /api/tickets/:id` – Get a ticket
- `PUT /api/tickets/:id` – Update a ticket

### Order Service

- `POST /api/orders` – Create an order
- `GET /api/orders/:id` – Get an order
- `DELETE /api/orders/:id` – Cancel an order

### Payment Service

- `POST /api/payments` – Process a payment

## License

This project is licensed under the MIT License.

## Author

Himanshu Singh 


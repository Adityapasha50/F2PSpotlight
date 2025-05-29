const request = require("supertest");
const { describe, it, expect, beforeEach, afterEach } = require("@jest/globals");
const app = require("../../app");
const { sequelize, User, Game, Favorite, Transaction } = require("../../models");
const { generateToken } = require("../../helpers/jwt");
const { queryInterface } = sequelize;

// Mock Midtrans
jest.mock("../../helpers/midtrans", () => require("../mocks/midtrans"));

let access_token_user;
let gameId;

beforeEach(async () => {
  // Seed users data
  const users = [
    {
      email: "test@example.com",
      password: "$2a$10$3qSIi7BiTknraN3A9tZUWeUn5tQnvlNe2x9KqKdgmfDsNV3Yvl0re", // password123
      username: "testuser",
      profilePicture: "https://ui-avatars.com/api/?name=testuser",
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  // Seed games data
  const games = [
    {
      id: 1,
      title: "Test Game",
      thumbnail: "https://example.com/thumbnail.jpg",
      short_description: "A test game",
      game_url: "https://example.com/game",
      genre: "Testing",
      platform: "Web Browser",
      publisher: "Test Publisher",
      developer: "Test Developer",
      release_date: "2023-01-01",
      freetogame_profile_url: "https://example.com/profile",
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  await queryInterface.bulkInsert("Users", users);
  await queryInterface.bulkInsert("Games", games);

  const user = await User.findOne({ where: { email: "test@example.com" } });
  gameId = 1;

  access_token_user = generateToken({
    id: user.id,
    email: user.email,
    username: user.username
  });
});

afterEach(async () => {
  await queryInterface.bulkDelete("Transactions", null, {
    truncate: true,
    restartIdentity: true,
    cascade: true,
  });

  await queryInterface.bulkDelete("Favorites", null, {
    truncate: true,
    restartIdentity: true,
    cascade: true,
  });

  await queryInterface.bulkDelete("Games", null, {
    truncate: true,
    restartIdentity: true,
    cascade: true,
  });

  await queryInterface.bulkDelete("Users", null, {
    truncate: true,
    restartIdentity: true,
    cascade: true,
  });
});

describe("Router Testing", () => {
  // Test User Routes
  describe("User Routes", () => {
    // Test Register Route
    describe("POST /users/register", () => {
      it("should register a new user successfully", async () => {
        const response = await request(app)
          .post("/users/register")
          .send({
            email: "newuser@example.com",
            password: "password123",
            username: "newuser"
          });
        
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
        expect(response.body).toHaveProperty("email", "newuser@example.com");
        expect(response.body).toHaveProperty("username", "newuser");
      });

      it("should return 400 if email already exists", async () => {
        const response = await request(app)
          .post("/users/register")
          .send({
            email: "test@example.com", // existing email
            password: "password123",
            username: "anotheruser"
          });
        
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message");
      });
    });

    // Test Login Route
    describe("POST /users/login", () => {
      it("should login successfully and return access token", async () => {
        const response = await request(app)
          .post("/users/login")
          .send({
            email: "test@example.com",
            password: "password123"
          });
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("access_token");
        expect(response.body).toHaveProperty("user");
        expect(response.body.user).toHaveProperty("email", "test@example.com");
      });

      it("should return 401 if credentials are invalid", async () => {
        const response = await request(app)
          .post("/users/login")
          .send({
            email: "test@example.com",
            password: "wrongpassword"
          });
        
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("message", "Invalid email or password");
      });
    });

    // Test Profile Routes
    describe("GET /users/profile", () => {
      it("should return user profile when authenticated", async () => {
        const response = await request(app)
          .get("/users/profile")
          .set("Authorization", `Bearer ${access_token_user}`);
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("id");
        expect(response.body).toHaveProperty("email", "test@example.com");
        expect(response.body).toHaveProperty("username", "testuser");
      });

      it("should return 401 when not authenticated", async () => {
        const response = await request(app)
          .get("/users/profile");
        
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("message", "Token required");
      });
    });

    describe("PUT /users/profile", () => {
      it("should update user profile when authenticated", async () => {
        const response = await request(app)
          .put("/users/profile")
          .set("Authorization", `Bearer ${access_token_user}`)
          .send({
            username: "updateduser",
            profilePicture: "https://example.com/updated.jpg"
          });
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("message", "Profile updated successfully");
      });

      it("should return 401 when not authenticated", async () => {
        const response = await request(app)
          .put("/users/profile")
          .send({
            username: "updateduser"
          });
        
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("message", "Token required");
      });
    });
  });

  // Test Game Routes
  describe("Game Routes", () => {
    describe("GET /games", () => {
      it("should return list of games", async () => {
        const response = await request(app)
          .get("/games");
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("games");
        expect(Array.isArray(response.body.games)).toBe(true);
      });

      it("should support pagination", async () => {
        const response = await request(app)
          .get("/games?page=1&limit=5");
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("games");
        expect(response.body).toHaveProperty("pagination");
        expect(response.body.pagination).toHaveProperty("currentPage", 1);
      });
    });

    describe("GET /games/:id", () => {
      it("should return a specific game by id", async () => {
        const response = await request(app)
          .get(`/games/${gameId}`);
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("id", gameId);
        expect(response.body).toHaveProperty("title", "Test Game");
      });

      it("should return 404 if game not found", async () => {
        const response = await request(app)
          .get("/games/9999"); // Non-existent ID
        
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty("message", "Game not found");
      });
    });

    describe("GET /games/category/:category", () => {
      it("should return games by category", async () => {
        const response = await request(app)
          .get("/games/category/Testing");
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("games");
        expect(Array.isArray(response.body.games)).toBe(true);
      });
    });

    describe("GET /games/recommendation", () => {
      it("should return game recommendations when authenticated", async () => {
        const response = await request(app)
          .get("/games/recommendation")
          .set("Authorization", `Bearer ${access_token_user}`);
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("recommendations");
      });

      it("should return 401 when not authenticated", async () => {
        const response = await request(app)
          .get("/games/recommendation");
        
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("message", "Token required");
      });
    });
  });

  // Test Favorite Routes
  describe("Favorite Routes", () => {
    describe("GET /favorites", () => {
      it("should return user's favorites when authenticated", async () => {
        const response = await request(app)
          .get("/favorites")
          .set("Authorization", `Bearer ${access_token_user}`);
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("games");
        expect(Array.isArray(response.body.games)).toBe(true);
      });

      it("should return 401 when not authenticated", async () => {
        const response = await request(app)
          .get("/favorites");
        
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("message", "Token required");
      });
    });

    describe("POST /favorites/:gameId", () => {
      it("should add game to favorites when authenticated", async () => {
        const response = await request(app)
          .post(`/favorites/${gameId}`)
          .set("Authorization", `Bearer ${access_token_user}`);
        
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("message", "Game added to favorites");
      });

      it("should return 401 when not authenticated", async () => {
        const response = await request(app)
          .post(`/favorites/${gameId}`);
        
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("message", "Token required");
      });
    });

    describe("DELETE /favorites/:gameId", () => {
      beforeEach(async () => {
        // Add a favorite first
        await Favorite.create({
          UserId: (await User.findOne({ where: { email: "test@example.com" } })).id,
          GameId: gameId
        });
      });

      it("should remove game from favorites when authenticated", async () => {
        const response = await request(app)
          .delete(`/favorites/${gameId}`)
          .set("Authorization", `Bearer ${access_token_user}`);
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("message", "Game removed from favorites");
      });

      it("should return 401 when not authenticated", async () => {
        const response = await request(app)
          .delete(`/favorites/${gameId}`);
        
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("message", "Token required");
      });
    });
  });

  // Test Transaction Routes
  describe("Transaction Routes", () => {
    describe("POST /transactions", () => {
      it("should create a transaction when authenticated", async () => {
        const response = await request(app)
          .post("/transactions")
          .set("Authorization", `Bearer ${access_token_user}`)
          .send({
            amount: 100000,
            gameId: gameId
          });
        
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("transaction");
        expect(response.body.transaction).toHaveProperty("id");
        expect(response.body.transaction).toHaveProperty("snapToken");
      });

      it("should return 401 when not authenticated", async () => {
        const response = await request(app)
          .post("/transactions")
          .send({
            amount: 100000,
            gameId: gameId
          });
        
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("message", "Token required");
      });
    });

    describe("GET /transactions", () => {
      it("should return user's transactions when authenticated", async () => {
        const response = await request(app)
          .get("/transactions")
          .set("Authorization", `Bearer ${access_token_user}`);
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("transactions");
        expect(Array.isArray(response.body.transactions)).toBe(true);
      });

      it("should return 401 when not authenticated", async () => {
        const response = await request(app)
          .get("/transactions");
        
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("message", "Token required");
      });
    });

    describe("GET /transactions/:id", () => {
      let transactionId;

      beforeEach(async () => {
        // Create a transaction first
        const transaction = await Transaction.create({
          userId: (await User.findOne({ where: { email: "test@example.com" } })).id,
          amount: 100000,
          gameId: gameId,
          status: "pending",
          orderId: "order-" + Date.now(),
          snapToken: "fake-token"
        });
        transactionId = transaction.id;
      });

      it("should return transaction status when authenticated", async () => {
        const response = await request(app)
          .get(`/transactions/${transactionId}`)
          .set("Authorization", `Bearer ${access_token_user}`);
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("transaction");
        expect(response.body.transaction).toHaveProperty("id", transactionId);
      });

      it("should return 401 when not authenticated", async () => {
        const response = await request(app)
          .get(`/transactions/${transactionId}`);
        
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("message", "Token required");
      });
    });

    describe("POST /transactions/notification", () => {
      let orderId;

      beforeEach(async () => {
        // Create a transaction first
        orderId = "order-" + Date.now();
        await Transaction.create({
          userId: (await User.findOne({ where: { email: "test@example.com" } })).id,
          amount: 100000,
          gameId: gameId,
          status: "pending",
          orderId: orderId,
          snapToken: "fake-token"
        });
      });

      it("should handle Midtrans notification", async () => {
        const response = await request(app)
          .post("/transactions/notification")
          .send({
            order_id: orderId,
            transaction_status: "settlement"
          });
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("message", "Notification received");

        // Verify transaction status was updated
        const transaction = await Transaction.findOne({ where: { orderId } });
        expect(transaction.status).toBe("success");
      });
    });
  });
});
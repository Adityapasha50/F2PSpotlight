const request = require("supertest");
const { describe, it, expect, beforeAll, afterAll } = require("@jest/globals");
const app = require("../../app");
const { hashPassword } = require("../../helpers/bcrypt");
const { sequelize, User, Game } = require("../../models");
const { generateToken } = require("../../helpers/jwt");
const { queryInterface } = sequelize;

let access_token_user;

beforeEach(async () => {
  const users = [
    {
      email: "user@example.com",
      password: hashPassword("password123"),
      username: "testuser",
      profilePicture: "https://example.com/profile.jpg",
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  const games = [
    {
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

  const user = await User.findOne({ where: { email: "user@example.com" } });

  access_token_user = generateToken({
    id: user.id,
    email: user.email,
    username: user.username
  });
});

afterEach(async () => {
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

describe("POST /users/register", function () {
  it("Berhasil mendaftarkan user baru", async function () {
    const response = await request(app)
      .post("/users/register")
      .send({
        email: "newuser@example.com",
        password: "password123",
        username: "newuser"
      });
    
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id", expect.any(Number));
    expect(response.body).toHaveProperty("email", "newuser@example.com");
    expect(response.body).toHaveProperty("username", "newuser");
    expect(response.body).toHaveProperty("profilePicture");
  });

  it("Email sudah terdaftar", async function () {
    const response = await request(app)
      .post("/users/register")
      .send({
        email: "user@example.com",
        password: "password123",
        username: "existinguser"
      });
    
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });

  it("Email tidak valid", async function () {
    const response = await request(app)
      .post("/users/register")
      .send({
        email: "invalid-email",
        password: "password123",
        username: "invaliduser"
      });
    
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });

  it("Password terlalu pendek", async function () {
    const response = await request(app)
      .post("/users/register")
      .send({
        email: "shortpass@example.com",
        password: "12345",
        username: "shortpassuser"
      });
    
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });
});

describe("POST /users/login", function () {
  it("Berhasil login dan mengirim akses token", async function () {
    const response = await request(app)
      .post("/users/login")
      .send({
        email: "user@example.com",
        password: "password123"
      });
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("access_token", expect.any(String));
    expect(response.body).toHaveProperty("user");
    expect(response.body.user).toHaveProperty("id", expect.any(Number));
    expect(response.body.user).toHaveProperty("email", "user@example.com");
  });

  it("Email tidak diberikan", async function () {
    const response = await request(app)
      .post("/users/login")
      .send({
        email: "",
        password: "password123"
      });
    
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });

  it("Password tidak diberikan", async function () {
    const response = await request(app)
      .post("/users/login")
      .send({
        email: "user@example.com",
        password: ""
      });
    
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });

  it("Email belum terdaftar", async function () {
    const response = await request(app)
      .post("/users/login")
      .send({
        email: "notregistered@example.com",
        password: "password123"
      });
    
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
  });

  it("Password yang dimasukan salah", async function () {
    const response = await request(app)
      .post("/users/login")
      .send({
        email: "user@example.com",
        password: "wrongpassword"
      });
    
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
  });
});

describe("GET /users/profile", function () {
  it("Berhasil mendapatkan profil user", async function () {
    const response = await request(app)
      .get("/users/profile")
      .set("Authorization", `Bearer ${access_token_user}`);
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id", expect.any(Number));
    expect(response.body).toHaveProperty("email", "user@example.com");
    expect(response.body).toHaveProperty("username", "testuser");
    expect(response.body).not.toHaveProperty("password");
  });

  it("Token tidak diberikan", async function () {
    const response = await request(app)
      .get("/users/profile");
    
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
  });

  it("Token tidak valid", async function () {
    const response = await request(app)
      .get("/users/profile")
      .set("Authorization", `Bearer invalid-token`);
    
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
  });
});

describe("PUT /users/profile", function () {
  it("Berhasil mengupdate profil user", async function () {
    const response = await request(app)
      .put("/users/profile")
      .set("Authorization", `Bearer ${access_token_user}`)
      .send({
        username: "updateduser",
        profilePicture: "https://example.com/updated-profile.jpg"
      });
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", expect.any(String));
    
    // Verifikasi perubahan
    const profileResponse = await request(app)
      .get("/users/profile")
      .set("Authorization", `Bearer ${access_token_user}`);
    
    expect(profileResponse.body).toHaveProperty("username", "updateduser");
    expect(profileResponse.body).toHaveProperty("profilePicture", "https://example.com/updated-profile.jpg");
  });

  it("Token tidak diberikan", async function () {
    const response = await request(app)
      .put("/users/profile")
      .send({
        username: "updateduser",
        profilePicture: "https://example.com/updated-profile.jpg"
      });
    
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
  });
});
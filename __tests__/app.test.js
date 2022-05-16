process.env.NODE_ENV = "test";
const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed")
const request = require("supertest")
const app = require("../app")


beforeEach(() => seed(testData));
afterAll(() => db.end());



describe("test to handle the bad route error", () => {
  test("status:404, responds with the correct error message when passed a valid but non-existant endpoint", () => {
    return request(app)
      .get("/api/apple/")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Route is not found");
      });
  });
});

describe("getCategories() GET /api/categories", () => {
  test("getCategories responds with status 200 and returns an object of arrays of categories", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.categories)).toBe(true);
        expect(body.categories.length).toBe(4);
      });
  });
  test("getCategories returns correct object keys and values", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then(({ body }) => {
        expect(body.categories[0].description).toBe(
          "Abstact games that involve little luck"
        );
        expect(body.categories[0].slug).toBe("euro game");
        body.categories.forEach((category) => {
          expect(category).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });
});

describe("GET /api/reviews/:review_id", () => {
  test("getReviewsByID returns a 200 status and a review object", () => {
    return request(app)
      .get("/api/reviews/2")
      .expect(200)
      .then(({ body }) => {
        expect(typeof body).toBe("object");
      });
  });
  test("getReviewsByID returns correct object keys and values, including comment_count key", () => {
    return request(app)
      .get("/api/reviews/3")
      .expect(200)
      .then(({ body }) => {
        expect(body.review).toEqual(
          expect.objectContaining({
            title: expect.any(String),
            review_body: expect.any(String),
            designer: expect.any(String),
            review_img_url: expect.any(String),
            votes: expect.any(Number),
            category: expect.any(String),
            owner: expect.any(String),
            created_at: expect.any(String),
            comment_count: expect.any(Number),
          })
        );
        expect(body.review.title).toBe("Ultimate Werewolf");
        expect(body.review.designer).toBe("Akihisa Okui");
        expect(body.review.owner).toBe("bainesface");
        expect(body.review.votes).toBe(5);
        expect(body.review.comment_count).toBe(3);
      });
  });
  test("returns a 404 status and error message when review_id doesn't exist", () => {
    return request(app)
      .get("/api/reviews/100")
      .expect(404)
      .then(({ text }) => {
        expect(text).toBe("No review found with review_id: 100");
      });
  });
  test("returns a 400 status and error message when review_id is invalid", () => {
    return request(app)
      .get("/api/reviews/not-id")
      .expect(400)
      .then(({ text }) => {
        expect(text).toBe("Invalid request input!");
      });
  });
});






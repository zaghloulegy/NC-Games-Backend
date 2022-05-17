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
  test("getReviewsByID returns correct object keys and values,review object", () => {
    const review_id = 3
    return request(app)
      .get(`/api/reviews/${review_id}`)
      .expect(200)
      .then(({ body }) => {
        expect(typeof body).toBe("object");
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

describe("patchReviewVotes() PATCH /api/reviews/:review_id", () => {
  test("patchReviewVotes returns a 200 status with the review item", () => {
    return request(app)
      .patch("/api/reviews/2")
      .send({ inc_votes: 9 })
      .expect(200)
      .then(({ body }) => {
        expect(typeof body).toBe("object");
      });
  });
  test("patchReviewVotes returns a 200 status with the review item updated", () => {
    return request(app)
      .patch("/api/reviews/1")
      .send({ inc_votes: -20 })
      .expect(200)
      .then(({ body }) => {
        expect(body.review.votes).toBe(-19);
      });
  });
  test("patchReviewVotes ERROR returns a 404 status and error message when review_id doesn't exist", () => {
    return request(app)
      .patch("/api/reviews/50")
      .send({ inc_votes: 1 })
      .expect(404)
      .then(({ text }) => {
        expect(text).toBe("No review found with the review_id: 50");
      });
  });
  test("patchReviewVotes ERROR returns a 400 status and error message when review_id is invalid", () => {
    return request(app)
      .patch("/api/reviews/not-id")
      .send({ inc_votes: 1 })
      .expect(400)
      .then(({ text }) => {
        expect(text).toBe("Invalid request input!");
      });
  });
  test("patchReviewVotes ERROR returns a 400 status and error message when inc_votes isn't valid", () => {
    return request(app)
      .patch("/api/reviews/2")
      .send({ inc_votes: "pies" })
      .expect(400)
      .then(({ text }) => {
        expect(text).toBe("The inc_votes value: 'pies' is not a valid input!");
      });
  });
  test("patchReviewVotes returns a 200 status with the review item unchanged when the inc_votes key is blank.", () => {
    return request(app)
      .patch("/api/reviews/1")
      .send({})
      .expect(200)
      .then(({ body }) => {
        expect(typeof body).toBe("object");
        expect(body.review.votes).toBe(1);
      });
  });
});

describe.only("getUsers GET /api/users", () => {
  test("getUsers returns an array of objects, each object will have a username key value pair only", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(typeof body).toBe("object");
        expect(Array.isArray(body.users)).toBe(true);
        expect(body.users.length).toBe(4);
        expect(body.users[1]).toEqual(
          expect.objectContaining({
            username: expect.any(String)
          })
        );
      });
  });
});



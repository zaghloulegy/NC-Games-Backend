process.env.NODE_ENV = "test";
const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed")
const request = require("supertest")
const app = require("../app")


beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("getCategories() GET /api/categories", () => {
  test("getCategories responds with status 200 and returns an object of arrays of categories", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.categories)).toBe(true);
        // console.log(body.categories)
        expect(body.categories.length).toBe(4);
        body.categories.forEach((category)=>{
          expect(category).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String)
            })
          );
        })
      });
  });
})
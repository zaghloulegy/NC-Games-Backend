const PORT = process.env.PORT || 9090;

const app = require("./app");

app.listen(PORT, (err) => {
  if (err) throw err;
  else {
    console.log(`Listening on port ${PORT}...`);
  }
});
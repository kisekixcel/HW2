const express = require('express')
const path = require('path');
const ApiRouter = require('./routers/api');
const database = require('./database/database');
const cors = require('cors')


// Create Express app
const app = express()
app.use(cors())
// To handle body
app.use(express.json());

// A default route
app.use(express.static(path.join(__dirname, 'public')));


// APIs
app.use('/api', ApiRouter);

app.listen(process.env.PORT || 3001, () => {
  console.log('Server running on http://localhost:3001')

  const connectionString = 'postgres://sjdyjsst:N7oOwXQNiNdYsMAzGVx-cQ9F0_9fcEfe@fanny.db.elephantsql.com/sjdyjsst'
  database.connect(connectionString).then(function () {
    console.log("Database connected")
    return database.query(
      `
          CREATE TABLE IF NOT EXISTS ats_codes (
            id SERIAL primary key,
            ats_code INT unique not null
          );
        `,
      [],
      function (error, result) {
        if (error) {
          console.log(error)
        }
      },
    );
  });
})

// //Handle 404 errors
// app.use((req, res, next) => {
//   next(createHttpErrors(404, `Unknown Resource ${req.method} ${req.originalUrl}`));
// });

// // Error Handler
// app.use((error, req, res, next) => {
//   console.error(error);
//   return res.status(error.status || 500).json({
//     error: error.message || `Unknown Error!`,
//   });
// });

// Start the Express server

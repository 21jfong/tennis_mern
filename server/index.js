import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv'

import userRoutes from "./routes/users.js"
import teamsRoutes from "./routes/teams.js"

dotenv.config();
const app = express();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

// goes to localhost:5000/posts
// app.use('/posts', postRoutes);
app.use('/user', userRoutes);
app.use('/my-teams', teamsRoutes);

app.get('/', (req, res) => {
  res.send("hello to tennis api");
})

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.CONNECTION_URL, {})
  .then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
  .catch((error) => console.log(error.message));

import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv'

import userRoutes from "./routes/users.js"
import teamsRoutes from "./routes/teams.js"
import matchesRoutes from "./routes/matches.js"

dotenv.config();
const app = express();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

const corsOptions = {
  origin: process.env.ORIGIN,  // Allow requests only from your frontend
  methods: "GET,POST,PATCH,DELETE",
  credentials: true,
};
app.use(cors(corsOptions));

// goes to localhost:5000/posts
app.use('/user', userRoutes);
app.use('/my-teams', teamsRoutes);
app.use('/matches', matchesRoutes);

app.get('/', (req, res) => {
  res.send("hello to tennis api");
})

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.CONNECTION_URL, {})
  .then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
  .catch((error) => console.log(error.message));

import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 4000;
const MONGO_URI = process.env.MONGO_URI;

app.use(cors());
app.use(bodyParser.json());

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ Mongo error:", err));

const ResumeSectionSchema = new mongoose.Schema({
  title: String,
  type: String,
  technologies: [String],
});
const ResumeSection = mongoose.model("ResumeSection", ResumeSectionSchema);

app.get("/sections", (req, res) => {
  res.json(sections);
});

app.post("/sections", (req, res) => {
  const newSection = { id: Date.now().toString(), ...req.body };
  sections.push(newSection);
  res.status(201).json(newSection);
});

app.get("/sections/:id", async (req, res) => {
  try {
    const section = await ResumeSection.findById(req.params.id);
    res.json(section);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/sections/:id", (req, res) => {
  const { id } = req.params;
  sections = sections.map((s) => (s.id === id ? { ...s, ...req.body } : s));
  res.json({ success: true });
});

app.delete("/sections/:id", (req, res) => {
  const { id } = req.params;
  sections = sections.filter((s) => s.id !== id);
  res.json({ success: true });
});

app.patch("/sections/:id/technologies", async (req, res) => {
  try {
    const { technologies } = req.body;
    const section = await ResumeSection.findByIdAndUpdate(
      req.params.id,
      { technologies },
      { new: true }
    );
    res.json(section);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/sections/:id/technologies", async (req, res) => {
  try {
    const { tech } = req.body;
    const section = await ResumeSection.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { technologies: tech } },
      { new: true }
    );
    res.json(section);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/sections/:id/technologies/:tech", async (req, res) => {
  try {
    const section = await ResumeSection.findByIdAndUpdate(
      req.params.id,
      { $pull: { technologies: req.params.tech } },
      { new: true }
    );
    res.json(section);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

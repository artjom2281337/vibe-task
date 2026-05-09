const express = require("express");
const {Note, saveNote, updateNote, deleteNote} = require("../models/note")
const noteRouter = express.Router();

// Get all notes for a single application
noteRouter.get("/:applicationID/notes", async (req, res) => {
    const id = req.params.applicationID;
    let notes = await Note.find({applicationID: id});
    if (notes.length > 0) {
        res.status(200).json(notes);
    } else {
        res.status(204).send();
    }
})


// Create a new note for application
noteRouter.post("/:applicationID/notes", async (req, res) => {
    const id = req.params.applicationID;
    const body = req.body;
    const url = req.originalUrl.replace("/api", "").replace("/notes", "");
    const note = await saveNote(id, body.authorID, body.text, Number.parseInt(body.rating));
    if (note) {
        if (url.includes("/applications/")) {
            res.redirect(url);
        } else {
            res.status(200).json(note);
        }
    } else {
        res.status(500).json({msg: "Server error"});
    }
})


// Update a note for application
noteRouter.put("/:applicationID/notes/:authorID", async (req, res) => {
    const applicationID = req.params.applicationID;
    const authorID = req.params.authorID;
    const body = req.body;
    const url = req.originalUrl.replace("/api", "").split("/notes")[0];
    const result = await updateNote(applicationID, authorID, body.text, Number.parseInt(body.rating));
    if (result.acknowledged) {
        res.status(204).send();
    } else {
        res.status(500).json({msg: "Server error"});
    }
})


// Delete a note for application
noteRouter.delete("/:applicationID/notes/:authorID", async (req, res) => {
    const applicationID = req.params.applicationID;
    const authorID = req.params.authorID;
    const result = await deleteNote(applicationID, authorID);
    if (result.acknowledged) {
        res.status(200).send();
    } else {
        res.status(500).json({msg: "Server error"})
    }
})

module.exports = noteRouter;
const mongoose = require("mongoose");


// Schema
const noteSchema = new mongoose.Schema({
    applicationID: String,
    authorID: String,
    text: String,
    rating: Number,
    createdAt: Date,
    updatedAt: Date
})


// Model
const note = mongoose.model("Note", noteSchema);


// Export model and functions
module.exports = {
    Note: note,
    saveNote: async (applicationID, authorID, text, rating) => {
        return await new note({
            applicationID,
            authorID,
            text,
            rating,
            createdAt: new Date(),
            updatedAt: new Date()
        }).save();
    },
    updateNote: async (applicationID, authorID, text, rating) => {
        return await note.findOneAndUpdate(
            {applicationID, authorID}, 
            {text, rating, updatedAt: new Date()}
        )
    },
    deleteNote: async (applicationID, authorID) => {
        return await note.deleteOne({applicationID, authorID});
    },
    getNotesWithTemplate: async (hbs, applicationID, user) => {
        let notes = await note.find({applicationID}).lean().sort({});
        let userNoteIndex = 0;
        for (let index in notes) {
            notes[index].template = await hbs.renderView(`views/note.handlebars`, {
                layout: false,
                note: notes[index],
                user
            })
            if (notes[index].userID == user.id) {
                userNoteIndex = index;
            }
        }
        
        let userNote = notes.splice(userNoteIndex - 1, 1)[0];
        if (userNote) notes.unshift(userNote);
        return notes;
    }
}
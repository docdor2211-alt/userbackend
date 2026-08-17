const express =
  require("express");

const router =
  express.Router();

const {

  getStories,

  getSingleStory,

} = require(
  "../controllers/userStoryController"
);

  

// ======================================================
// GET ALL STORIES
// ======================================================

router.get(

  "/all",

  getStories

);



// ======================================================
// GET SINGLE STORY
// ======================================================

router.get(

  "/:id",

  getSingleStory

);



// ======================================================
// EXPORT
// ======================================================

module.exports =
  router;
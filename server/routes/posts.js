import express from "express";
// import jwt from 'jsonwebtoken';
// import config from 'config';
import expressValidator from 'express-validator';
import Post from "../models/Post.js";
import auth from '../middleware/auth.js';
import User from "../models/User.js";

const { check, validationResult } = expressValidator;
const router = express.Router();

// @route   GET /posts
// @desc    Gets a list of all content
// @access  Public
router.get('/', async(req, res) => {
    let posts = await Post.find()

    return res.json(posts)
})

// @route   POST /posts/:id
// @desc    Gets a specific post via id
// @access  Private
router.get('/:id', auth, async(req, res) => {
    try {
        let postId = req.params.id

        let post = await Post.findById(postId)

        return res.json({
            postId: postId,
            post: post
        })
    } catch (error) {
        console.error(error.message)
        res.status(500).send('Server error')
    }
})

// @route   POST /posts
// @desc    Adds a new post
// @access  Private
router.post('/', [
    check('title', 'Title is required').not().isEmpty(),
    check('content', 'Content is required').not().isEmpty(),
], auth, async(req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { title, content } = req.body

        let user = await User.findById(req.user.id)

        let post = Post({
            user,
            title,
            content
        })

        await post.save()

        return res.json({
            msg: 'Content saved successfully'
        })
    } catch (error) {
        console.error(error.message)
        res.status(500).send('Server error')
    }
})

router.put('/:id', auth, async(req, res) => {
    try {
        let postId = req.params.id
        const { title, content } = req.body

        let updatedContent = await Post.findByIdAndUpdate(postId, { title: title, content: content }, { new: true })

        return res.json({
            msg: 'Content updated successfully',
            content: updatedContent
        })
    } catch (error) {
        console.error(error.message)
        res.status(500).send('Server error')
    }
})

router.delete('/:id', auth, async(req, res) => {
    try {
        let postId = req.params.id
        
        let content = await Post.findByIdAndDelete(postId)
        return res.json({
            msg: 'Content deleted successfully',
        })
    } catch (error) {
        console.error(error.message)
        res.status(500).send('Server error')
    }
})

export default router;
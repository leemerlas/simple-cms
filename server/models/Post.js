import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true,
    },
}, { timestamps: true })


const Post = mongoose.model('post', PostSchema);
export default Post;
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    default: ''
  },
  college: {
    type: String,
    default:''
  },
  branch: {
    type: String,
    default:''
  },
  country: {
    type: String,
    default:''
  },
  graduationYear: {
    type: String,
    default:''
  },
  platforms: {
    leetcode: { type: String, default: '' },
    codeforces: { type: String, default: '' },
    geeksforgeeks: { type: String, default: '' },
    codestudio: { type: String, default: '' },
    codechef: { type: String, default: '' },
    hackerrank: { type: String, default: '' },
    atcoder: { type: String, default: '' }
  },
  socials:{
    linkedin: { type: String, default: '' },
    instagram: { type: String, default: '' },
    twitter: { type: String, default: '' },
    portfolio: { type: String, default: '' },
  }
  
});

export default mongoose.model('User', userSchema);

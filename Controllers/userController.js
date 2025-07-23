import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import axios from 'axios'

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

export const signup = async (req, res) => {
  try {
    const { email, password, username } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      email,
      password: hashedPassword,
      username
    });
    await user.save();

    const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({
      message: 'User registered successfully',
      token
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      message: 'Login successful',
      token
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const updatePlatforms = async (req, res) => {
  const { email } = req.params;
  const { leetcode, codeforces, geeksforgeeks, codestudio, codechef, hackerrank, atcoder } = req.body;

  if (req.user.email !== email) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  try {
    const user = await User.findOneAndUpdate(
      { email },
      {
        $set: {
          platforms: {
            leetcode,
            codeforces,
            geeksforgeeks,
            codestudio,
            codechef,
            hackerrank,
            atcoder
          }
        }
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'Usernames updated successfully', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const editPersonalInfo = async (req, res) => {
  const { email } = req.params;
  const { bio, country, college, branch, graduationYear } = req.body;

  if (req.user.email !== email) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  try {
    const user = await User.findOneAndUpdate(
      { email },
      {
        $set: {
          bio,
          country,
          college,
          branch,
          graduationYear
        }
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'Personal Information updated successfully', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUserInfo = async (req, res) => {
  try {
    const { email } = req.params;

    if (req.user.email !== email) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const {
      username,
      bio,
      college,
      country,
      platforms,
      socials
    } = user;

    res.status(200).json({
      username,
      bio,
      college,
      country,
      platforms,
      socials
    });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getPersonalInfo = async (req, res) => {
  try {
    const { email } = req.params;

    if (req.user.email !== email) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      bio: user.bio,
      country: user.country,
      college: user.college,
      branch: user.branch,
      graduationYear: user.graduationYear
    });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getPlatformInfo = async (req, res) => {
  try {
    const { email } = req.params;

    if (req.user.email !== email) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user.platforms);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getSocialInfo = async (req, res) => {
  try {
    const { email } = req.params;

    if (req.user.email !== email) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user.socials);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};


export const getLeetcodeInfo = async (req, res) => {
  try {
    const { email } = req.params;

    if (req.user.email !== email) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const usernames = {
      leetcode: user.platforms?.leetcode || '',
    };
    let totalQuestions = 0;
    let dsaQuestions = 0;
    if (usernames.leetcode) {
      try {
        const response = await axios.get(`https://leetcode-stats-api.herokuapp.com/${usernames.leetcode}`);
        totalQuestions += response.data.totalSolved || 0;
        dsaQuestions += response.data.totalSolved || 0;
      } catch (err) {
        return res.status(500).json({ error: 'Failed to fetch LeetCode data' });
      }
    }
    res.json({
      totalQuestions,
      dsaQuestions,
    });
  } catch (err) {
    console.error('Platform Stats Error:', err.message);
    res.status(500).json({ error: 'Failed to fetch leetcodestats' });
  }
};


export const getCodeforcesInfo = async (req, res) => {
  try {
    const { email } = req.params;

    if (req.user.email !== email) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const usernames = {
      codeforces: user.platforms?.codeforces || '',
    };
    let totalQuestions = 0;
    if (usernames.codeforces) {
      try {
        const response = await axios.get(`https://codeforces.com/api/user.status?handle=${usernames.codeforces}`);
        //console.log(response.data)
        response.data.result.forEach(sub => {
          if (sub.verdict === "OK") {
            totalQuestions++;
          }
        });
      } catch (err) {
        return res.status(500).json({ error: 'Failed to fetch CodeForces data' });
      }
    }
    res.json({
      totalQuestions,
    });
  } catch (err) {
    console.error('Platform Stats Error:', err.message);
    res.status(500).json({ error: 'Failed to fetch CodeForces' });
  }
};

export const getgfgInfo = async (req, res) => {
  try {
    const { email } = req.params;

    if (req.user.email !== email) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const usernames = {
      geeksforgeeks: user.platforms?.geeksforgeeks || '',
    };
    let totalQuestions = 0;
    if (usernames.geeksforgeeks) {
      try {
        const response = await axios.get(`https://geeks-for-geeks-api.vercel.app/${usernames.geeksforgeeks}`);
        totalQuestions+=response.data.info.totalProblemsSolved
      } catch (err) {
        return res.status(500).json({ error: 'Failed to fetch GFG data' });
      }
    }
    res.json({
      totalQuestions,
    });
  } catch (err) {
    console.error('Platform Stats Error:', err.message);
    res.status(500).json({ error: 'Failed to fetch GFG stats' });
  }
};

export const getatcoderInfo = async (req, res) => {
  try {
    const { email } = req.params;

    if (req.user.email !== email) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const usernames = {
      atcoder: user.platforms?.atcoder || '',
    };
    let totalQuestions = 0;
    if (usernames.atcoder) {
      try {
        const response = await axios.get(`https://kenkoooo.com/atcoder/atcoder-api/v3/user/submissions?user=${usernames.atcoder}&from_second=0`);
        response.data.forEach((problem) => {
          if (problem.result === "AC") {
            totalQuestions++;
          }
        })
      } catch (err) {
        return res.status(500).json({ error: 'Failed to fetch GFG data' });
      }
    }
    res.json({
      totalQuestions,
    });
  } catch (err) {
    console.error('Platform Stats Error:', err.message);
    res.status(500).json({ error: 'Failed to fetch GFG stats' });
  }
};
export const getLeetcodeRating = async (req, res) => {
  try {
    const { email } = req.params;

    if (req.user.email !== email) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const usernames = {
      leetcode: user.platforms?.leetcode || '',
    };

    let rating = 0;
    let maxRating = 0;
    let contestRating = [];

    if (usernames.leetcode) {
      try {
        const response = await axios.get(`https://leetcode-api-pied.vercel.app/user/${usernames.leetcode}/contests`);
        
        rating = response.data.userContestRanking.rating;

        // Calculate maxRating from attended contests
        response.data.userContestRankingHistory.forEach((contest) => {
          if (contest.attended) {
            maxRating = Math.max(maxRating, contest.rating);
          }
        });

        // Assign attended ratings to contestRating
        const history = response.data.userContestRankingHistory;
        contestRating = history
          .filter(contest => contest.attended === true)
          .map(contest => contest.rating);

      } catch (err) {
        return res.status(500).json({ error: 'Failed to fetch Leetcode Rating' });
      }
    }

    res.json({
      rating,
      maxRating,
      contestRating,
    });

  } catch (err) {
    console.error('Platform Stats Error:', err.message);
    res.status(500).json({ error: 'Failed to fetch Leetcode rating' });
  }
};

export const getCodeforcesRating= async (req, res) => {
  try {
    const { email } = req.params;

    if (req.user.email !== email) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const usernames = {
      codeforces: user.platforms?.codeforces || '',
    };
    let rating = 0
    let maxRating = 0
    let contestRating=[]
    if (usernames.codeforces) {
      try {
        const response = await axios.get(`https://codeforces.com/api/user.rating?handle=${usernames.codeforces}`);
        //console.log(response.data)
        let data = response.data.result
        rating=data[data.length-1].newRating
        data.forEach((contest) => maxRating = Math.max(maxRating, contest.newRating))
        contestRating=data
      } catch (err) {
        return res.status(500).json({ error: 'Failed to fetch CodeForces Rating' });
      }
    }
    res.json({
      rating,
      maxRating,
      contestRating
    });
  } catch (err) {
    console.error('Platform Stats Error:', err.message);
    res.status(500).json({ error: 'Failed to fetch CodeForces rating' });
  }
};
export const getCodechefRating= async (req, res) => {
  try {
    const { email } = req.params;

    if (req.user.email !== email) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const usernames = {
      codechef: user.platforms?.codechef || '',
    };
    let rating = 0
    let maxRating = 0
    let contestRating=[]
    if (usernames.codechef) {
      try {
        const response = await axios.get(`https://codechef-api.vercel.app/handle/${usernames.codechef}`);
        //console.log(response.data)
        rating = response.data.currentRating;
        maxRating = response.data.highestRating;
        contestRating=response.data.ratingData
      } catch (err) {
        return res.status(500).json({ error: 'Failed to fetch CodeChef Rating' });
      }
    }
    res.json({
      rating,
      maxRating,
      contestRating
    });
  } catch (err) {
    console.error('Platform Stats Error:', err.message);
    res.status(500).json({ error: 'Failed to fetch CodeChef rating' });
  }
};

export const getAtcoderRating= async (req, res) => {
  try {
    const { email } = req.params;

    if (req.user.email !== email) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const usernames = {
      atcoder: user.platforms?.atcoder|| '',
    };
    let rating = 0
    let maxRating = 0
    let contestRating=[]
    if (usernames.atcoder) {
      try {
        const response = await axios.get(`https://atcoder.jp/users/${usernames.atcoder}/history/json`);
        const data = response.data;
        rating = data[data.length - 1].NewRating;
        data.forEach((contest) => maxRating = Math.max(maxRating, contest.NewRating))
        contestRating=data
      } catch (err) {
        return res.status(500).json({ error: 'Failed to fetch Atcoder Rating' });
      }
    }
    res.json({
      rating,
      maxRating,
      contestRating
    });
  } catch (err) {
    console.error('Platform Stats Error:', err.message);
    res.status(500).json({ error: 'Failed to fetch Atcoder rating' });
  }
};

export const updatePersonalInfo = async (req, res) => {
  const { email } = req.params;
  const { bio, country, college, branch, graduationYear } = req.body;

  if (req.user.email !== email) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  try {
    const user = await User.findOneAndUpdate(
      { email },
      {
        $set: {
          bio,
          country,
          college,
          branch,
          graduationYear
        }
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'Personal Information updated successfully', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const editSocialInfo = async (req, res) => {
  const { email } = req.params;
  const { linkedin, instagram, twitter, portfolio } = req.body;

  if (req.user.email !== email) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  try {
    const user = await User.findOneAndUpdate(
      { email },
      {
        $set: {
          socials: {
            linkedin,
            instagram,
            twitter,
            portfolio
          }
        }
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'Social Accounts updated successfully', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
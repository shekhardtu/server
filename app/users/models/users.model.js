const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    firstName: String,
    lastName: String,

    email: {
      type: String,
      trim: true,
      index: true,
      unique: true,
      sparse: true,
    },
    mobileNumber: {
      trim: true,
      index: true,
      unique: true,
      type: Number,
    },
    otp: String,
    password: String,
    permissionLevel: Number,
    verified: {
      mobileNumber: Boolean,
      email: Boolean,
    },
    profileCompleted: Boolean,
  },
  {
    timestamps: true,
    setDefaultsOnInsert: true,
  }
);

const User = mongoose.model('Users', userSchema);

// userSchema.index({ email: 1 }, { unique: true, sparse: true });
// userSchema.virtual('fullName').get(function() {
//   return this.firstName + ' ' + this.lastName;
// });

userSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
userSchema.set('toJSON', {
  virtuals: true,
});

userSchema.findById = function(cb) {
  return this.model('Users').find({ id: this.id }, cb);
};

let findByEmail = (exports.findByEmail = email => {
  return User.findOne({ email: email });
});

exports.confirmOtp = userData => {
  var otpMarked = User.findByIdAndUpdate(
    userData.id,
    {
      $set: {
        otp: null,
        verified: {
          mobileNumber: true,
        },
      },
    },
    { new: true }
  );
  return otpMarked;
};

let findById = (exports.findById = id => {
  return User.findById(id).then(result => {
    result = result.toJSON();
    delete result._id;
    delete result.__v;
    return result;
  });
});

exports.createUser = userData => {
  const user = new User(userData);
  return user.save();
};

// exports.createUser = userData => {
//   return new Promise((resolve, reject) => {
//     findByEmail(userData.email).then(email => {
//       if (email !== null) {
//         reject(email);
//       } else {
//         const user = new User(userData);
//         let result = user.save();
//         resolve(result);
//       }
//     });
//   });
// };

exports.list = (perPage, page) => {
  return new Promise((resolve, reject) => {
    User.find()
      .limit(perPage)
      .skip(perPage * page)
      .exec(function(err, users) {
        if (err) {
          reject(err);
        } else {
          resolve(users);
        }
      });
  });
};

exports.patchUser = (id, userData) => {
  return new Promise((resolve, reject) => {
    User.findById(id, function(err, user) {
      if (err) reject(err);
      for (let i in userData) {
        user[i] = userData[i];
      }
      user.save(function(err, updatedUser) {
        if (err) return reject(err);
        resolve(updatedUser);
      });
    });
  });
};

exports.removeById = userId => {
  return new Promise((resolve, reject) => {
    User.remove({ _id: userId }, err => {
      if (err) {
        reject(err);
      } else {
        resolve(err);
      }
    });
  });
};

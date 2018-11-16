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
      type: String,
    },
    address: [
      {
        flatNumber: String,
        Landmark: String,
        area: String,
        pincode: Number,
      },
    ],
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

// userSchema.virtual('fullName').get(function() {
//   return this.firstName + ' ' + this.lastName;
// });

// userSchema.virtual('fullName').set(function(name) {
//   let str = name.split(' ')

//   this.firstName = str[0]
//   this.lastName = str[1]
// })

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

function generateOTP() {
  // Declare a digits variable
  // which stores all digits
  var digits = '0123456789';
  let OTP = '';
  for (let i = 0; i < 4; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
}

exports.generateOtpForExistingMobileNumber = mobileNumber => {
  let otp = generateOTP();
  return User.findOneAndUpdate(
    { mobileNumber: mobileNumber },
    {
      $set: {
        otp,
      },
    },
    { new: true }
  );
};

let findByMobileNumber = (exports.findByMobileNumber = mobileNumber => {
  return User.findOne({ mobileNumber: mobileNumber });
});

exports.confirmOtp = userData => {
  return User.findOneAndUpdate(
    { $and: [{ otp: userData.otp }, { _id: userData.id }] },
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
};

let findById = (exports.findById = id => {
  return User.findById(id).then(result => {
    result = result.toJSON();
    delete result._id;
    delete result.__v;
    return result;
  });
});

// TODO: If user is entering first time then normal flow
// else first check the number id and generate the otp send him back.
exports.createUser = (id, userData) => {
  console.log(id, userData);
  return User.findByIdAndUpdate(id, userData, { new: true });
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

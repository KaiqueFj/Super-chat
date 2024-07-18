const User = require('../Models/userModel');
const sharp = require('sharp');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const multer = require('multer');
const Contact = require('../Models/contactModel');
const Group = require('../Models/groupModel');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images', 400), false);
  }
};

function createGroupRoomID() {
  return 'group_' + Math.random().toString(36).substring(2, 11);
}

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.single('photo');

exports.uploadUserWallpaper = upload.single('wallpaper');

exports.uploadGroupPhoto = upload.single('groupPhoto');

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(550, 550)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/images/user/profile-pic/${req.file.filename}`);

  next();
});

exports.resizeUserWallpaper = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `wallpaper-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(1920, 1080) // Assuming you want a full HD resolution for the wallpaper
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/images/user/chat-background/${req.file.filename}`);

  next();
});

exports.resizeGroupPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `wallpaper-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(550, 550)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/images/group/${req.file.filename}`);

  next();
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.updateMe = catchAsync(async (req, res, next) => {
  //1 - Create error if user Posts password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password update. Please use /updateMyPasswword',
        400
      )
    );
  }
  //2- Filtered out unwanted field names
  const filteredBody = filterObj(
    req.body,
    'name',
    'email',
    'phoneNumber',
    'biography'
  );

  if (req.file) {
    if (req.file.fieldname === 'photo') {
      filteredBody.photo = req.file.filename;
    } else if (req.file.fieldname === 'wallpaper') {
      filteredBody.wallpaper = req.file.filename;
    }
  }

  //2- update user data
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.getMe = catchAsync(async (req, res, next) => {
  req.params.id = req.user.id;
  next();
});

exports.createGroup = catchAsync(async (req, res, next) => {
  const { customName, members } = req.body;
  const groupRoom = createGroupRoomID();

  const groupData = {
    name: groupRoom,
    customName: customName,
    members: members,
    createdBy: req.user.id,
  };

  if (req.file) {
    groupData.groupPhoto = req.file.filename;
  }

  const group = await Group.create(groupData);

  // Update the current user's groups
  await User.findByIdAndUpdate(
    req.user.id,
    { $push: { groups: group._id } },
    { new: true }
  );

  // Update each member's groups
  await Promise.all(
    members.map(async (memberId) => {
      await User.findByIdAndUpdate(
        memberId,
        { $push: { groups: group._id } },
        { new: true }
      );
    })
  );

  res.status(201).json({
    status: 'success',
    data: {
      group,
    },
  });
});

exports.createContact = catchAsync(async (req, res, next) => {
  const contact = await Contact.create({
    user: req.user.id,
    phoneNumber: req.body.phoneNumber,
    nickname: req.body.nickname,
    contactUser: req.body.contactUser,
  });

  // Update the user who is adding the contact
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    { $push: { contacts: contact._id } },
    { new: true, runValidators: true }
  );

  // Respond with the updated user and contact information
  res.status(201).json({
    status: 'success',
    data: {
      user: updatedUser,
      contact,
    },
  });
});

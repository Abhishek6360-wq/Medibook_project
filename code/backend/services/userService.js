import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User, Doctor, Appointment } from '../models/index.js';

export const registerUser = async (data) => {
  const { name, email, password, phone, dob, age, gender } = data;
  if (!name || !email || !password || !phone) {
    throw new Error("missing details");
  }
  if (!validator.isEmail(email)) {
    throw new Error("invalid email");
  }
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new Error("User Already exists, go to login");
  }
  if (password.length < 8 || password.length > 16) {
    throw new Error("password must have atleast 8 and not more than 16 character");
  }
  if (!validator.isMobilePhone(phone, 'any', { strictMode: false })) {
    throw new Error("invalid phone number");
  }

  const salt = await bcrypt.genSalt(10);
  const encryptedPassword = await bcrypt.hash(password, salt);

  const newUser = await User.create({
    name,
    email,
    password: encryptedPassword,
    phno: phone,
    dob,
    age,
    gender
  });

  const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET);
  return { token };
};

export const loginUser = async (email, password) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error("user does not exist");
  
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("invalid password");

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
  return { token };
};

export const getProfile = async (userId) => {
  const user = await User.findByPk(userId, { attributes: { exclude: ['password'] } });
  return user;
};

export const updateProfile = async (userId, data, imageUrl) => {
  const updateData = { ...data };
  if (imageUrl) {
    updateData.image = imageUrl;
  }
  await User.update(updateData, { where: { id: userId } });
  return await User.findByPk(userId, { attributes: { exclude: ['password'] } });
};

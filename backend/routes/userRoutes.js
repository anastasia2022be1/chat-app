import express from "express";
import bcrypt from "bcrypt";
import crypto from "node:crypto";
import jwt from "jsonwebtoken"
import User from '../models/User.js'

const router = express.Router();
import express from 'express';
import { veryfyToken } from '../utils/verifyUser.js';
import { createListing } from '../controllers/listing.controller.js';
 
const route = express.Router();

route.post('/create',veryfyToken, createListing)

export default route
const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const { GetAdminStates, GetProfileStates } = require('../controllers/stateController');

const Route = express.Router();

Route.get('/admin',protect,authorize('admin'),GetAdminStates);
Route.get('/profile',protect,GetProfileStates);

module.exports = Route;
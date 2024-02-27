/* eslint-disable no-undef */
const express = require('express')
const router = express.Router()
const eventControllers = require('../controllers/event-controllers')

router.get('/', eventControllers.getSearchedEvent)
router.get('/images', eventControllers.getImages)
router.get('/:id', eventControllers.getEventById)
router.post('/', eventControllers.postEvent)
router.put('/:id', eventControllers.updateEvent)
router.delete('/:id', eventControllers.deleteEventById)


module.exports = router;
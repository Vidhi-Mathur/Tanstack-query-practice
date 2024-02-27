/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const { json } = require('body-parser')
const fs = require('fs/promises')

const getSearchedEvent = async(req, res, next) => {
    //Extract query
    const { max, toSearch } = req.query
    //Read events.json
    let fileContent = await fs.readFile('./data/events.json')
    //Parse file
    let events = await JSON.parse(fileContent)
    //Search
    if(toSearch){
        events = events.filter(e => {
            const seachableText = `${e.title} ${e.description} ${e.location}`
            return seachableText.toLowerCase().includes(toSearch.toLowerCase())
        })
    }
    //Get event
    if(max){
        events = events.slice(events.length - max, events.length)
    }
    //Response
    res.json({
        events: events.map(e => ({
            id: e.id,
            title: e.title,
            image: e.image,
            date: e.date,
            location: e.location
        }))
    })
}

const getImages = async(req, res, next) => {
    //Read images.json
    const fileContent = await fs.readFile('./data/images.json')
    //Parse
    const images = await JSON.parse(fileContent)
    //Return image
    return res.json({images})
}

const getEventById = async(req, res, next) => {
    //Extract id
    const { id } = req.params
    //Read events.json
    const fileContent = await fs.readFile('./data/events.json')
    //Parse
    const events = await JSON.parse(fileContent)
    //Find event in file
    const requiredEvent = events.find(e => e.id ===  id)
    //Not present
    if(!requiredEvent) return res.status(404).json({message: `No event found for ${id}`})
    //Timeout
    setTimeout(() => { res.json({ event: requiredEvent })}, 1000);
}

const postEvent = async(req, res, next) => {
    //Extract
    const { event } = req.body
    if(!event) return res.status(400).json({message: 'Enter an event'})
    if(!event.title?.trim() || !event.description?.trim() || !event.date?.trim() || !event.time?.trim() || !event.image?.trim() || !event.location?.trim()) return res.status(400).json({message: 'Information missing'})
    //Read file
    const fileContent = await fs.readFile('./data/events.json')
    //Parse
    const events = await JSON.parse(fileContent)
    //Append
    const newEvent = {
        id: Math.round(Math.random()*10000).toString(),
        ...event
    }
    events.push(newEvent)
    //Write file
    await fs.writeFile('./data/events.json', JSON.stringify(events))
    //Response
    res.json({event: newEvent})
}

const updateEvent = async(req, res, next) => {   
    //Extract
    const { id } = req.params
    const { event } = req.body
    if(!event) return res.status(400).json({message: 'Enter an event'})
    if(!event.title?.trim() || !event.description?.trim() || !event.date?.trim() || !event.time?.trim() || !event.image?.trim() || !event.location?.trim()) return res.status(400).json({message: 'Information missing'})
    //Read file
    const fileContent = await fs.readFile('./data/events.json')
    //Parse
    const events = await JSON.parse(fileContent)
    //Find event
    const requiredIdx = events.findIndex(e => e.id === id)
    if(requiredIdx == -1) return res.status(404).json({ message: 'Event not found' });
    //Update
    event[requiredIdx] = {
        id,
        ...event
    }
    //Write back
    await fs.writeFile('./data/events.json', JSON.stringify(event))
    //Timeout
    setTimeout(() => { res.json({ event: event[requiredIdx] })}, 1000);

}

const deleteEventById = async(req, res, next) => {
    //Extract
    const { id } = req.params
    //Read file
    const fileContent = await fs.readFile('./data/events.json')
    //Parse
    const events = await JSON.parse(fileContent)
    //Find event
    const requiredIdx = events.findIndex(e => e.id === id)
    if(requiredIdx == -1) return res.status(404).json({ message: 'Event not found' });
    //Delete
    events.splice(requiredIdx, 1)
    //Write back
    await fs.writeFile('./data/events.json', JSON.stringify(events))
    //Timeout
    setTimeout(() => { res.json({ message: 'Event deleted' }) }, 1000);
}


exports.getSearchedEvent = getSearchedEvent
exports.getImages = getImages
exports.getEventById = getEventById
exports.postEvent = postEvent
exports.updateEvent = updateEvent
exports.deleteEventById = deleteEventById

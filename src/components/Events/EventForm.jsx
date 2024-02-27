import { useState } from "react";
import ImagePicker from "../../ImagePicker";
import { useQuery } from "@tanstack/react-query";
import { fetchImages } from "../../util/http";
import ErrorBlock from "../UI/ErrorBlock";

/* eslint-disable no-unused-vars */
export default function EventForm({inputData, children, onSubmit}){
    const [selectedImage, setSeletedImage] = useState(inputData?.image)

    const { data, isLoading, error, isError} = useQuery({
        queryKey: ['events-images'],
        queryFn: fetchImages
    })
    
    function selectImageHandler(image){
        setSeletedImage(image)
    }
    
    function submitHandler(event){
        event.preventDefault()
        const formContent = new FormData(event.target)
        const data = Object.fromEntries(formContent)
        onSubmit({...data, image: selectedImage})
    }
    
    //Title, Description, Date, Time, Location
    return <form id='event-form' onSubmit={submitHandler}>
        <p className="control">
            <label htmlFor="title">Title</label>
            <input type="text" id="title" name="title" defaultValue={inputData?.title ?? ''}/>
        </p>
        {isLoading && <p>Loading images...</p>}
        {isError && <ErrorBlock title="Failed to load images" message="Please try again later"/>}
        {data && (<div className="control">
            <ImagePicker images={data} onSelect={selectImageHandler} selectedImage={selectedImage}/>
        </div>)}
        <p className="control">
            <label htmlFor="description">Description</label>
            <textarea name="description" id="description" defaultValue={inputData?.description ?? ''}></textarea>
        </p>
        <div className="controls-row">
            <p className="control">
                <label htmlFor="date">Date</label>
                <input type="date" id="date" name="date" defaultValue={inputData?.date ?? ''}/>
            </p>
            <p className="control"> 
                <label htmlFor="time">Time</label>
                <input type="time" id="time" name="time" defaultValue={inputData?.time ?? ''} />
            </p>
        </div>
            <p className="control">
                <label htmlFor="location">Location</label>
                <input type="text" id="location" name="location" defaultValue={inputData?.location ?? ''}/>
            </p>
        <p className="form-actions">{children}</p>
    </form>
}
import { Link, useNavigate, useParams } from "react-router-dom";
import Modal from "../UI/Modal";
import EventForm from "./EventForm";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchEvent, queryClient, updateEvent } from "../../util/http";
import LoadingIndicator from "../UI/LoadingIndicator";
import ErrorBlock from "../UI/ErrorBlock";

export default function EditEvent(){
    const navigate = useNavigate()
    const { id } = useParams()

    const {data, isLoading, isError, error} = useQuery({
        queryKey: ['events', id],
        queryFn: ({signal}) => fetchEvent({signal, id})
    })

    const { mutate } = useMutation({
        mutationFn: updateEvent,
        //Update UI instantly rather than showing a spinner if done using onSuccess() and then navigate(), without waiting for backend
        onMutate: async (data) => {
            //Accessing what we send through mutate() has event and id key
            const newData = data.event
            //Cancel any outgoing queries for this key to avoid clashing response data 
            await queryClient.cancelQueries(['events', id])
            const previousEvent = queryClient.getQueryData(['events', id])
            //Manipulate already stored data without waiting for response
            queryClient.setQueryData(['events', id], newData)
            //Let onError() access it
            return { previousEvent }
        },
        onError: (error, data, context) => {
            queryClient.setQueryData(['events', id], context.previousEvent)
        },
        onSettled: () => {
            queryClient.invalidateQueries(['events', id]);
        }
    })

    function submitHandler(formData){
        mutate({id, event: formData})
        navigate('../')
    }

    function closeHandler(){
        navigate('../')
    }

    let content
    if(isLoading){
        content = <div className="center"><LoadingIndicator /></div> 
    }
    if(isError){
        content = (
            <>
            <ErrorBlock title="An error occured" message={error?.info?.message || "Failed to update events"} />
            <div className="form-actions">
            <Link to="../" className="button">Okay</Link>
            </div>
            </>
        )
    }

    if(data){
        content = (
            <EventForm inputData={data} onSubmit={submitHandler}>
                <Link to="../">Close</Link>
                <button type="Submit">Update</button>
            </EventForm>
        )
    }

    return(
        <Modal onClose={closeHandler}>{content}</Modal>
    )
}
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import Modal from "../UI/Modal";
import EventForm from "./EventForm";
import { createNewEvent } from "../../util/http";
import { queryClient } from "../../util/http";
import ErrorBlock from "../UI/ErrorBlock";

export default function NewEvent(){
    //useMutation for post request while useQuery for get request (preferably)
    const navigate = useNavigate()
    //Doens't send request automatically unlike useQuery when component is rendered, but only when told to do so
    const { mutate, isLoading, isError, error } = useMutation({
        mutationFn: createNewEvent,
        onSuccess: () => {
     //Not updating till we switch to a diff. page or refresh, as it triggers React query to refetch data behind the scenes. But 
     //data changed as we added a new event, want react query to immediately refetch data. Invalidate data exactly with 'events' key
            queryClient.invalidateQueries({queryKey: ['events'], exact: true})
            submitHandler()
        }
    })
    function submitHandler(form){
        mutate({event: form})
        navigate('/events')
    }
    return (
        <Modal onClose={() => navigate('../')}>
            <EventForm onSubmit={submitHandler}>
                {isLoading && 'Submitting....'}
                {!isLoading && (
                <>
                <Link to='../' className="button-text">Cancel</Link>
                <button type='submit' className='button'>Create</button>
                </>
                )}
            </EventForm>
                {isError && (
                    <ErrorBlock title="Failed to create event" message={error.info?.message || 'Failed to create event. Please check inputs and try again later'}/>
                )}
        </Modal>
    )
}
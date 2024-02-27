import { Link, Outlet, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import Header from "../../Header";
import { deleteEvent, fetchEvent, queryClient } from "../../util/http";
import LoadingIndicator from "../UI/LoadingIndicator";
import ErrorBlock from "../UI/ErrorBlock";
import Modal from "../UI/Modal";
import { useState } from "react";

export default function EventDetail(){
    const { id } = useParams()
    const navigate  = useNavigate()
    const [deletion, setDeletion] = useState(false)

    //Extract event-details
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['events', id],
        queryFn: ({signal}) => fetchEvent({signal, id})
    }) 

    const { mutate, isPending, isError: isDeletionError, error: deleteError } = useMutation({
        mutationFn: deleteEvent,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['events', id],
                //Data refetch for a particular query
                refetchType: 'none'
            })
            navigate('/events')
        }
    })

    function deleteHandler(){
        mutate({id})
    }

    function startDeletionHandler(){
        setDeletion(true)
    }

    function stopDeletionHandler(){
        setDeletion(false)
    }

    let content
    if(isLoading){
        content = <div id="event-details-content" className="center"><LoadingIndicator /></div> 
    }
    if(isError){
        content = <div id="event-details-content" className="center"><ErrorBlock title="An error occured" message={deleteError.info?.message || "Failed to delete events"} /></div>
    }
    if(data){
        const formattedDate = new Date(data.date).toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        })
        content = (
        <>
        <header>
                <h1>{data.title}</h1>
                <nav>
                    <button onClick={startDeletionHandler}>Delete</button>
                    <Link to='edit'>Edit</Link>
                </nav>
        </header>
        <div id='event-details-content'>
        <img src={`http://localhost:3000/${data.image}`} alt={data.title} /> 
        <div id="event-details-info">
            <div>
                <p id="event-details-location">{data.location}</p>
                <time dateTime={`Todo-DateT$Todo-Time`}>{formattedDate} @ {data.time}</time>
            </div>
            <p id="event-details-description">{data.description}</p>
        </div>
    </div>
    </>
        )
    }
    return (
        <>
        {deletion && (<Modal onClose={stopDeletionHandler}>
            <h2>Are you sure?</h2>
            <p>Do you really want to delete this event?</p>
            <div className="form-actions">
                {isPending && <p>Deleting, please wait...</p>}
                {!isPending && (
                <>
                <button className="button-text" onClick={stopDeletionHandler}>Cancel</button>
                <button className="button" onClick={deleteHandler}>Delete</button>
                </>
                )}
            </div>
            {isDeletionError && <ErrorBlock title="An error occured" message={error.info?.message || "Failed to delete events"} />}
        </Modal>
        )}
        <Outlet />
        <Header>
            <Link to='/events' className="nav-item">View all items</Link>
        </Header>
        <article id="event-details">{content}</article>
        </>
    )
}
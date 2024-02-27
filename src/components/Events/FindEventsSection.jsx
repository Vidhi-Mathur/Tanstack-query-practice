import { useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";
import fetchEvents from "../../util/http";
import LoadingIndicator from "../UI/LoadingIndicator";
import ErrorBlock from "../UI/ErrorBlock";
import EventItem from "./EventItem";

export default function FindEventsSection(){
    //Search element connected using ref
    const searchElement = useRef()
    const [searchTerm, setSearchTerm] = useState()

    const { data, isLoading, isError, error } = useQuery({
        //Constructing query key dynamically, can cache and reuse diff. data for diff. keys based on same query
        queryKey: ['events', { searchTerm: searchTerm }],
        //Some default data is passed as object to queryFn, like queryKey and signal, which is required for aborting request if we navigate away from page before request was finished
        queryFn: ({ signal, queryKey }) => fetchEvents({ signal, ...queryKey[1] }),
        //Sending 2 request to events, one from every section. Whenever a query is disabled, React query treats it as pending as we don't have any data and waiting for it to arrive, which can be done once query is enabled. Use isLoading instead of isPending here 
        enabled: searchTerm !== undefined
    })

    //Submit handler
    function submitHandler(e){
        e.preventDefault()
        setSearchTerm(searchElement.current.value)
    }

    let content = <p>Please enter a search term to find events</p>
    if(isLoading){
        content = <LoadingIndicator />
    }
    if(isError){
         content = <ErrorBlock title="An error occured" message={error.info?.message || "Failed to fetch events"} />
    }
    if(data){
        content = (
            <ul className="events-list">
                {data.map(e => (
                    <li key={e.id}><EventItem event={e}/></li>
                ))}
            </ul>
        )
    }
    return (
        <>
        <section className="content-section" id="all-events-section">
            <header>
                <h2>Find your next event!</h2>
                <form id="search-form" onSubmit={submitHandler}>
                    <input type="search" ref={searchElement} placeholder="Search Term"/>
                    <button>Search</button>
                </form>
            </header>
            {content}
        </section>
        </>
    )
}
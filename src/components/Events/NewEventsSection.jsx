import { useQuery } from "@tanstack/react-query";
import LoadingIndicator from "../UI/LoadingIndicator";
import ErrorBlock from "../UI/ErrorBlock";
import EventItem from "./EventItem";
import fetchEvents from "../../util/http";

export default function NewEventsSection(){
//Behind the scenes send http request to get events, info. about loading state and potential errors. Tanstack query doesn't send http requests. We have to write code that sends actual http request, we have to write code to do so, the it is managed by tanstack query. isLoading = isFetching && isPending
    const { data, isPending, isError, error } = useQuery({
        //Manages query caching based on query keys
        queryKey: ['events', {max: 3}],
        //Used to request data
        queryFn: ({ signal, queryKey }) => fetchEvents({signal, ...queryKey[1]})
    })
    
    let content
    if(isPending){
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
        <section id="new-events-section" className="content-section">
            <header>
            <h2>Recently added events</h2>
            </header>
            {content}
        </section>
    )
}
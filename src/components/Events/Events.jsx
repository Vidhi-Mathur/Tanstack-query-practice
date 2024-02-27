import { Outlet, Link } from "react-router-dom";
import Header from "../../Header";
import EventsIntroSection from "./EventsIntroSection";
import FindEventsSection from "./FindEventsSection";
import NewEventsSection from "./NewEventsSection";

export default function Events(){
    return (
        <>
        <Outlet />
        <Header>
            <Link to='/events/new' className="button">New</Link>
        </Header>
        <main>
            <EventsIntroSection />
            <NewEventsSection />
            <FindEventsSection />
        </main>
        </>
    )
}
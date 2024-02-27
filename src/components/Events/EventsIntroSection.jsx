import { Link } from 'react-router-dom'
import meetupImg from '../../assets/meetup.jpg'
export default function EventsIntroSection(){
    return (
        <>
        <section id="overview-section" className="content-section" style={{ backgroundImage: `url(${meetupImg})` }}>
            <h2>Connect with amazing people <br /> or <strong>Find a new passion</strong></h2>
            <p>Anyone can join or organise events on React Events</p>
            <p><Link className="button" to="/events/new">Create your first event</Link></p>
        </section>
        </>
    )
}
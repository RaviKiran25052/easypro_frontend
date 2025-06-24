import NavBar from "../components/NavBar"
import EssayProJourney from "../components/Home/EssayProJourney"
import Hero from "../components/Home/Hero"
import EssayWritersServices from "../components/Home/EssayWritersServices"

const Home = () => {
	return (
		<>
			<NavBar />
			<Hero />
			<EssayProJourney />
			<EssayWritersServices />
		</>
	)
}

export default Home
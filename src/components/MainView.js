import React from 'react';
import PlantForm from './PlantForm';
import h2growWhite from '../assets/h2growWhite.svg'

class MainView extends React.Component {
    render() {
        return (
            <React.Fragment>
                <header className="header">
                    <img src={h2growWhite} alt="logo for app 'H20Grow'" className="header__title"/>
                    <p className="header__introduction">Keep better track of watering your plants with H2Grow, an automatic countdown that tells you when they need water!</p>
                </header>
                <main>
                    <PlantForm/>
                </main>
            </React.Fragment>
        )
    }
}

export default MainView;
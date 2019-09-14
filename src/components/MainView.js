import React from 'react';
import PlantForm from './PlantForm';

class MainView extends React.Component {
    render() {
        return (
            <div className='app'>
                <header>
                    <img src="../dev/assets/h2growWhite.svg" />
                    <p className="instruction">Keep better track of watering your plants with H2Grow, an automatic countdown that tells you when they need water!</p>
                </header>
                <main>
                    <PlantForm/>
                </main>
            </div>
        )
    }
}

export default MainView;